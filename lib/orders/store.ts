import { neon } from '@neondatabase/serverless'
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import type { Customer, OrderItem } from './validation'
export type Order = {id: string; request_id: string; request_hash: string; reference: string; token: string; customer: Customer; items: OrderItem[]; subtotal_cents: number; delivery_cents: number; total_cents: number; status: 'awaiting_payment' | 'paid'; created_at: string; paid_at: string | null; aspire_transaction_id: string | null}
export function sql() {
  if (!process.env.DATABASE_URL) throw new Error('Order storage is not configured')
  return neon(process.env.DATABASE_URL)
}
export function requestHash(input: unknown) { return createHash('sha256').update(JSON.stringify(input)).digest('hex') }
export async function findRequest(requestId: string) {
  const rows = await sql()`SELECT * FROM ja_orders WHERE request_id = ${requestId}`
  return rows[0] as Order | undefined
}
export async function saveOrder(requestId: string, hash: string, customer: Customer, items: OrderItem[]) {
  const subtotal = items.reduce((s, i) => s + i.lineCents, 0)
  const id = randomUUID(), token = randomBytes(32).toString('hex')
  const reference = `JA-${new Date().toISOString().slice(2,10).replaceAll('-','')}-${randomBytes(4).toString('hex').toUpperCase()}`
  await sql()`INSERT INTO ja_orders (id,request_id,request_hash,reference,token,customer,items,subtotal_cents,delivery_cents,total_cents)
    VALUES (${id},${requestId},${hash},${reference},${token},${JSON.stringify(customer)}::jsonb,${JSON.stringify(items)}::jsonb,${subtotal},5000,${subtotal+5000}) ON CONFLICT (request_id) DO NOTHING`
  const order = (await findRequest(requestId))!
  if (order.request_hash !== hash) throw new Error('This checkout has changed. Please reload and try again.')
  return order
}
export async function getOrder(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return null
  const rows = await sql()`SELECT * FROM ja_orders WHERE token = ${token}`
  return rows[0] as Order | undefined
}
export function publicOrder(order: Order) {
  return {reference: order.reference, status: order.status, total: order.total_cents / 100, subtotal: order.subtotal_cents / 100, delivery: order.delivery_cents / 100, items: order.items, createdAt: order.created_at, paidAt: order.paid_at}
}
export async function queueEmails(order: Order) {
  const kind = order.status === 'paid' ? 'confirmation' : 'instructions'
  for (const audience of ['customer', 'team']) {
    const id = `${order.id}-${kind}-${audience}`
    await sql()`INSERT INTO ja_order_emails (id,order_id,kind,audience) VALUES (${id},${order.id},${kind},${audience}) ON CONFLICT DO NOTHING`
  }
}
