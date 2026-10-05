export type IncomingPayment = {id: string; accountId: string; amountCents: number; reference: string; receivedAt: string}
export type MatchableOrder = {id: string; reference: string; totalCents: number; createdAt: string}
export function eligiblePayment(raw: Record<string, unknown>, accountId: string): IncomingPayment | null {
  if (raw.type !== 'credit' || raw.status !== 'settled' || raw.currency_code !== 'SGD' || raw.channel !== 'banktransfer' || raw.account_id !== accountId || raw.is_fx_transfer !== false) return null
  if (typeof raw.id !== 'string' || !Number.isSafeInteger(raw.amount) || Number(raw.amount) <= 0 || typeof raw.datetime !== 'string') return null
  // Aspire timestamps without an offset are not safe to compare to an order's UTC timestamp.
  if (!/(Z|[+-]\d{2}:?\d{2})$/.test(raw.datetime) || !Number.isFinite(Date.parse(raw.datetime))) return null
  const extra = raw.additional_info as Record<string, unknown> | undefined
  return {id: raw.id, accountId, amountCents: Number(raw.amount), receivedAt: raw.datetime, reference: [raw.reference, extra?.customer_reference].filter(v=>typeof v === 'string').join(' ').toUpperCase()}
}
export function matchPayments(orders: MatchableOrder[], payments: IncomingPayment[]) {
  const candidates = payments.map(payment => {
    const refs: string[] = payment.reference.match(/JA-\d{6}-[A-Z0-9]+/g) || []
    const possible = orders.filter(order => {
      const age = Date.parse(payment.receivedAt) - Date.parse(order.createdAt)
      if (payment.amountCents !== order.totalCents || age < 0) return false
      if (refs.length) return refs.includes(order.reference) && age <= 30 * 86400000
      return age <= 48 * 3600000
    })
    return {payment, possible}
  })
  const matches: {orderId: string; transactionId: string; receivedAt: string}[] = []
  const reviews: {transactionId: string; reason: string}[] = []
  for (const {payment, possible} of candidates) {
    if (possible.length === 1 && candidates.filter(c=>c.possible.some(o=>o.id === possible[0].id)).length === 1) {
      matches.push({orderId:possible[0].id,transactionId:payment.id,receivedAt:payment.receivedAt})
    } else if (possible.length || /JA-\d{6}-/.test(payment.reference)) {
      reviews.push({transactionId:payment.id,reason:possible.length ? 'Ambiguous order or multiple payments; manual review required' : 'Order reference found but amount or timing does not match'})
    }
  }
  return {matches,reviews}
}
