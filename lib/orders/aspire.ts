import { randomUUID } from 'node:crypto'
import { sql, queueEmails, type Order } from './store'
import { eligiblePayment, matchPayments, type IncomingPayment } from './matching'
import { flushEmails } from './emails'
async function aspire(path: string, token?: string, body?: object) {
  const response = await fetch(`https://api.aspireapp.com/public/v1${path}`, {method:body ? 'POST' : 'GET', cache:'no-store', signal:AbortSignal.timeout(20000), headers:{'Content-Type':'application/json', ...(token ? {Authorization:`Bearer ${token}`, Cookie:'Path=/'} : {})}, ...(body ? {body:JSON.stringify(body)} : {})})
  if (!response.ok) throw new Error(`Aspire request failed (${response.status})`)
  return response.json()
}
export async function fetchPayments(since: string) {
  const accountId = process.env.ASPIRE_ORDER_ACCOUNT_ID
  if (!accountId || !process.env.ASPIRE_CLIENT_ID || !process.env.ASPIRE_CLIENT_SECRET) throw new Error('Aspire order matching is not configured')
  const auth = await aspire('/login', undefined, {grant_type:'client_credentials',client_id:process.env.ASPIRE_CLIENT_ID,client_secret:process.env.ASPIRE_CLIENT_SECRET})
  if (!auth.access_token) throw new Error('Aspire authentication did not return a token')
  const payments = new Map<string, IncomingPayment>()
  let rejected = 0
  for (let page=1; page<=100; page++) {
    const params = new URLSearchParams({start_date:new Date(since).toISOString().replace(/\.\d{3}Z$/, 'Z'),type:'credit',currency_code:'SGD',account_id:accountId,page:String(page)})
    const response = await aspire(`/transactions?${params}`, auth.access_token)
    if (!Array.isArray(response.data) || !response.metadata || !('next_page_url' in response.metadata)) throw new Error('Incomplete Aspire transaction response')
    for (const raw of response.data) {const p = eligiblePayment(raw,accountId); if(p) payments.set(p.id,p); else rejected++}
    if (!response.metadata.next_page_url) return {payments:[...payments.values()],rejected}
  }
  throw new Error('Aspire pagination limit reached; no payments matched')
}
export async function reconcileOrders() {
  const db = sql(), owner = randomUUID()
  const lock = await db`INSERT INTO ja_order_jobs (name,locked_until,owner) VALUES ('aspire',NOW()+INTERVAL '5 minutes',${owner})
    ON CONFLICT (name) DO UPDATE SET locked_until=EXCLUDED.locked_until,owner=EXCLUDED.owner WHERE ja_order_jobs.locked_until < NOW() RETURNING owner`
  if (!lock.length) return {busy:true}
  try {
    await db`DELETE FROM ja_order_rate_limits WHERE created_at<NOW()-INTERVAL '2 days'`
    // Recover a crash between saving the order/payment and creating its email jobs.
    const needingEmails = await db`SELECT * FROM ja_orders o WHERE NOT EXISTS (SELECT 1 FROM ja_order_emails e WHERE e.order_id=o.id AND e.kind=CASE WHEN o.status='paid' THEN 'confirmation' ELSE 'instructions' END AND e.audience='customer') OR NOT EXISTS (SELECT 1 FROM ja_order_emails e WHERE e.order_id=o.id AND e.kind=CASE WHEN o.status='paid' THEN 'confirmation' ELSE 'instructions' END AND e.audience='team') LIMIT 50`
    for(const order of needingEmails) await queueEmails(order as Order)
    // Email retries must still run when Aspire is temporarily unavailable.
    const earlierEmail = await flushEmails().catch(()=>({processed:0,failed:1,manualReview:0}))
    const orders = await db`SELECT * FROM ja_orders WHERE status='awaiting_payment' ORDER BY created_at`
    let matched=0, reviews=0, fetched=0, rejected=0
    if (orders.length) {
      const since = new Date(Math.max(Date.parse(orders[0].created_at),Date.now()-30*86400000)).toISOString()
      const result = await fetchPayments(since)
      fetched=result.payments.length; rejected=result.rejected
      const used = await db`SELECT aspire_transaction_id FROM ja_orders WHERE aspire_transaction_id IS NOT NULL`
      const usedIds = new Set(used.map(o=>o.aspire_transaction_id))
      const plan = matchPayments(orders.map(o=>({id:o.id,reference:o.reference,totalCents:o.total_cents,createdAt:o.created_at})), result.payments.filter(p=>!usedIds.has(p.id)))
      for (const review of plan.reviews) await db`INSERT INTO ja_payment_reviews (transaction_id,reason) VALUES (${review.transactionId},${review.reason}) ON CONFLICT (transaction_id) DO UPDATE SET reason=EXCLUDED.reason,updated_at=NOW()`
      reviews=plan.reviews.length
      // All pages are read before matching. Unique transaction IDs plus the job lease prevent reuse.
      for (const match of plan.matches) {
        const changed = await db`UPDATE ja_orders SET status='paid',paid_at=${match.receivedAt}::timestamptz,aspire_transaction_id=${match.transactionId}
          WHERE id=${match.orderId} AND status='awaiting_payment'
          AND EXISTS (SELECT 1 FROM ja_order_jobs WHERE name='aspire' AND owner=${owner} AND locked_until>NOW())
          AND NOT EXISTS (SELECT 1 FROM ja_orders WHERE aspire_transaction_id=${match.transactionId}) RETURNING *`
        if (changed.length) {matched++; await queueEmails(changed[0] as Order)}
      }
    }
    const email = await flushEmails()
    email.processed += earlierEmail.processed
    email.failed += earlierEmail.failed
    email.manualReview = Math.max(email.manualReview, earlierEmail.manualReview)
    if(email.failed || email.manualReview) throw new Error('Order emails need retry or manual review')
    await db`UPDATE ja_order_jobs SET last_success_at=NOW(),last_error=NULL WHERE name='aspire' AND owner=${owner}`
    return {fetched,rejected,matched,reviews,email}
  } catch(error) {
    await db`UPDATE ja_order_jobs SET last_error='Reconciliation failed. Inspect job logs.' WHERE name='aspire' AND owner=${owner}`
    throw error
  } finally {await db`UPDATE ja_order_jobs SET locked_until=NOW()+INTERVAL '1 minute' WHERE name='aspire' AND owner=${owner}`}
}
