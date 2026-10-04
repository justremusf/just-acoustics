import { Resend } from 'resend'
import { ORDER_LEAD_TIME, ORDER_FOLLOW_UP, PAYNOW_VPA, PAYNOW_INSTRUCTIONS } from '../paymentCopy'
import { formatSgd } from '../shopPricing'
import { sql, type Order } from './store'
import { escapeHtml } from '../escapeHtml'
export function orderEmail(order: Order, kind: string, audience: string) {
  const paid = kind === 'confirmation', team = audience === 'team'
  const origin = process.env.ORDER_SITE_URL || 'https://www.justacoustics.co'
  const url = `${origin}/orders/access/${order.token}`
  const subject = `${paid ? 'Order confirmed — payment received' : 'Order received — awaiting payment'} | ${order.reference}`
  const summary = order.items.map(i => `${i.quantity} × ${i.title} (${i.options.map(o=>`${o.label}: ${o.value}`).join(', ')}) — ${formatSgd(i.lineCents/100)}`).join('\n')
  const address = [order.customer.fullName, order.customer.addressLine1, order.customer.addressLine2, `Singapore ${order.customer.postalCode}`].filter(Boolean).join('\n')
  const text = `${team ? 'Customer order' : `Hello ${order.customer.fullName}`},\n\n${subject}\n\n${paid ? 'Thank you. Your payment has been received and your order is confirmed.' : 'Your order is saved. Please pay the exact total using PayNow and include your order reference. This email is not a payment receipt.'}\n\n${summary}\n\nProducts: ${formatSgd(order.subtotal_cents/100)}\nIslandwide delivery: ${formatSgd(order.delivery_cents/100)}\n${paid ? 'Total paid' : 'Total payable'}: ${formatSgd(order.total_cents/100)}\n\nDelivery address:\n${address}\n${order.customer.deliveryNotes ? `Delivery notes: ${order.customer.deliveryNotes}\n` : ''}\n${ORDER_LEAD_TIME}\n${ORDER_FOLLOW_UP}\n\n${paid ? '' : `PayNow VPA: ${PAYNOW_VPA}\nReference: ${order.reference}\n${PAYNOW_INSTRUCTIONS}\n\n`}View your order${paid ? '' : ' and payment QR'}: ${url}\n\nWant it installed for you? Reply to this email with your order reference and our team will help. Installation is arranged separately.\n\nJust Acoustics · THE ROMANUS PTE. LTD.\ninfo@justacoustics.co · +65 8930 1905${team ? `\nCustomer: ${order.customer.email} · ${order.customer.phone}\nCompany: ${order.customer.company || '—'}` : ''}`
  return {subject, text, html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:32px;color:#182c30"><h2 style="color:#137e89">JUST ACOUSTICS</h2><h1 style="font-size:25px">${paid ? 'Thank you. Your order is confirmed.' : 'Your order is saved.'}</h1><p style="padding:14px;background:#edf6f5;border-radius:8px"><strong>${escapeHtml(order.reference)} · ${paid ? 'Payment received' : 'Awaiting payment'}</strong></p><div style="white-space:pre-line;line-height:1.65">${escapeHtml(text)}</div><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#137e89;color:white;padding:14px 24px;border-radius:24px;text-decoration:none">${paid ? 'View your order' : 'View order & pay securely by bank app'}</a></p></div>`}
}
export async function flushEmails(orderId?: string) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) throw new Error('Order email is not configured')
  const db = sql()
  const rows = await db`UPDATE ja_order_emails SET locked_until = NOW() + INTERVAL '2 minutes', attempts = attempts + 1, first_attempt_at = COALESCE(first_attempt_at,NOW())
    WHERE id IN (SELECT id FROM ja_order_emails WHERE sent_at IS NULL AND (locked_until IS NULL OR locked_until < NOW())
      AND (first_attempt_at IS NULL OR first_attempt_at > NOW() - INTERVAL '23 hours')
      AND (${orderId || null}::uuid IS NULL OR order_id = ${orderId || null}::uuid)
      ORDER BY created_at LIMIT 20 FOR UPDATE SKIP LOCKED) RETURNING *`
  let failed = 0
  for (const row of rows) {
    try {
      const [order] = await db`SELECT * FROM ja_orders WHERE id = ${row.order_id}`
      // Suppress outdated payment requests once money has arrived.
      if (row.kind === 'instructions' && order.status === 'paid') {
        await db`UPDATE ja_order_emails SET sent_at = NOW(), last_error = 'Superseded by paid confirmation' WHERE id = ${row.id}`
        continue
      }
      const content = orderEmail(order as Order, row.kind, row.audience)
      const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: row.audience === 'team' ? (process.env.ORDER_TEAM_EMAIL || 'info@justacoustics.co') : order.customer.email,
        replyTo: row.audience === 'team' ? order.customer.email : 'info@justacoustics.co', ...content,
      }, {idempotencyKey: row.id})
      if (result.error) throw new Error(result.error.name || 'Email provider rejected message')
      await db`UPDATE ja_order_emails SET sent_at = NOW(), locked_until = NULL, last_error = NULL WHERE id = ${row.id}`
    } catch {
      failed++
      await db`UPDATE ja_order_emails SET locked_until = NOW() + INTERVAL '5 minutes', last_error = 'Delivery attempt failed; check provider logs' WHERE id = ${row.id}`
    }
  }
  const [held] = await db`SELECT count(*)::int AS count FROM ja_order_emails WHERE sent_at IS NULL AND first_attempt_at <= NOW() - INTERVAL '23 hours'`
  return {processed: rows.length, failed, manualReview: held.count as number}
}
