import { config } from 'dotenv'
import { randomUUID } from 'node:crypto'
import assert from 'node:assert/strict'
import { saveOrder, requestHash, queueEmails, sql, getOrder } from '../lib/orders/store'
import { flushEmails, orderEmail } from '../lib/orders/emails'
import { reconcileOrders } from '../lib/orders/aspire'
import { writeFileSync, mkdirSync } from 'node:fs'
config({path:'.env.local',quiet:true})
async function main(){
 const customer={fullName:'Checkout Test',email:'delivered@resend.dev',phone:'80000000',company:'',addressLine1:'Test delivery address',addressLine2:'',postalCode:'123456',deliveryNotes:''}
 const items=[{slug:'flexi-acoustic-panels',title:'Flexi Acoustic Panels',quantity:2,unitCents:10000,lineCents:20000,options:[{label:'Colour / fabric',value:'Sky Blue 22'},{label:'Size',value:'60 x 120cm'}]}]
 const key=randomUUID(),hash=requestHash({customer,items}),db=sql()
 const order=await saveOrder(key,hash,customer,items)
 const originalFetch=globalThis.fetch
 const sends:string[]=[]
 process.env.ASPIRE_ORDER_ACCOUNT_ID='integration-account'
 process.env.ASPIRE_CLIENT_ID='integration-client'
 process.env.ASPIRE_CLIENT_SECRET='integration-secret' 
 globalThis.fetch=async(input,init)=>{
  const url=typeof input==='string'?input:input instanceof URL?input.href:input.url
  if(url.startsWith('https://api.aspireapp.com/')){
   const data=url.includes('/login')?{access_token:'test'}:{data:[{id:'integration-'+key,type:'credit',status:'settled',channel:'banktransfer',currency_code:'SGD',account_id:'integration-account',is_fx_transfer:false,amount:25000,datetime:new Date().toISOString(),reference:order.reference}],metadata:{next_page_url:null}}
   return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}})
  }
  if(url.startsWith('https://api.resend.com/')){sends.push(JSON.stringify(init?.body));return new Response(JSON.stringify({id:randomUUID()}),{status:200,headers:{'Content-Type':'application/json'}})}
  return originalFetch(input,init)
 }
 try{
  assert.equal(order.total_cents,25000)
  const repeated=await saveOrder(key,hash,customer,items);assert.equal(repeated.id,order.id)
  await assert.rejects(()=>saveOrder(key,'changed',customer,items))
  assert.equal((await getOrder(order.token))?.reference,order.reference)
  await queueEmails(order);await queueEmails(order)
  await flushEmails(order.id);await flushEmails(order.id);assert.equal(sends.length,2)
  const result=await reconcileOrders();assert.ok('matched' in result && result.matched===1)
  const [paid]=await db`SELECT * FROM ja_orders WHERE id=${order.id}`;assert.equal(paid.status,'paid')
  await queueEmails(paid as typeof order);await flushEmails(order.id);assert.equal(sends.length,4)
  mkdirSync('docs/order-flow',{recursive:true})
  const preview={...order,token:'PREVIEW-ONLY',reference:'JA-EXAMPLE',customer:{...customer,fullName:'Alex'}}
  writeFileSync('docs/order-flow/order-received-preview.html',orderEmail(preview,'instructions','customer').html)
  writeFileSync('docs/order-flow/order-confirmed-preview.html',orderEmail({...preview,status:'paid'},'confirmation','customer').html)
  console.log('PASS: durable order, S$50 delivery, duplicate checkout, mismatched retry, private lookup, automatic reconciliation, 4 email jobs exactly once, confirmation templates. Email transport mocked; no messages sent.')
 }finally{
  globalThis.fetch=originalFetch
  await db`DELETE FROM ja_order_emails WHERE order_id=${order.id}`
  await db`DELETE FROM ja_orders WHERE id=${order.id}`
 }
}
main().catch(e=>{console.error(e instanceof Error?e.message:'Integration test failed');process.exitCode=1})
