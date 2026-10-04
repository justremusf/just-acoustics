import { config } from 'dotenv'
import { sql, queueEmails, type Order } from '../lib/orders/store'
import { fetchPayments } from '../lib/orders/aspire'
import { flushEmails } from '../lib/orders/emails'
config({path:'.env.local',quiet:true})
async function main(){
 const [action,reference,transactionId]=process.argv.slice(2),db=sql()
 if(action==='status'){
  console.table(await db`SELECT reference,status,total_cents/100.0 AS total_sgd,created_at FROM ja_orders ORDER BY created_at DESC LIMIT 50`)
  console.table(await db`SELECT * FROM ja_payment_reviews ORDER BY updated_at DESC LIMIT 50`)
  console.table(await db`SELECT kind,audience,attempts,last_error FROM ja_order_emails WHERE sent_at IS NULL`)
  console.table(await db`SELECT name,last_success_at,last_error FROM ja_order_jobs`);return
 }
 if(action==='verify-aspire'){
  const result=await fetchPayments(new Date(Date.now()-7*86400000).toISOString())
  console.log(JSON.stringify({eligibleSettledCredits:result.payments.length,excludedRows:result.rejected}));return
 }
 if(action!=='confirm'||!reference||!transactionId)throw new Error('Usage: npx tsx scripts/orders-admin.ts status | verify-aspire | confirm ORDER_REFERENCE ASPIRE_TRANSACTION_ID')
 const [order]=await db`SELECT * FROM ja_orders WHERE reference=${reference}`
 if(!order)throw new Error('Order not found')
 if(order.status==='paid')throw new Error('Order is already paid')
 const {payments}=await fetchPayments(new Date(order.created_at).toISOString())
 const payment=payments.find(p=>p.id===transactionId)
 if(!payment||payment.amountCents!==order.total_cents||Date.parse(payment.receivedAt)<Date.parse(order.created_at))throw new Error('Transaction must be an eligible settled credit for the exact amount, received after this order')
 const rows=await db`UPDATE ja_orders SET status='paid',paid_at=${payment.receivedAt}::timestamptz,aspire_transaction_id=${payment.id} WHERE id=${order.id} AND status='awaiting_payment' AND NOT EXISTS (SELECT 1 FROM ja_orders WHERE aspire_transaction_id=${payment.id}) RETURNING *`
 if(!rows.length)throw new Error('Payment already assigned or order changed')
 await db`DELETE FROM ja_payment_reviews WHERE transaction_id=${payment.id}`
 await queueEmails(rows[0] as Order)
 console.log({confirmed:reference,email:await flushEmails(order.id)})
}
main().catch(e=>{console.error(e instanceof Error?e.message:'Order operation failed');process.exitCode=1})
