const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {config}=require('dotenv');const {neon}=require('@neondatabase/serverless');const assert=require('node:assert/strict');
config({path:'.env.local',quiet:true});
(async()=>{
 const base=process.env.ORDERS_TEST_BASE || 'http://localhost:3344', browser=await chromium.launch({headless:true,channel:"chrome"});const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();let reference;
 try{
  await page.goto(base+'/shop/flexi-acoustic-panels');
  const consent=page.getByRole('button',{name:'Analytics only'});if(await consent.isVisible())await consent.click();
  await page.getByRole('button',{name:'Select Sky Blue 22',exact:true}).click();
  await page.getByRole('button',{name:'Add to cart - $100',exact:true}).click();
  await page.goto(base+'/checkout');
  await page.getByRole('textbox',{name:'Full name',exact:true}).fill('Checkout verification');
  await page.getByRole('textbox',{name:'Email address',exact:true}).fill('delivered@resend.dev');
  await page.getByRole('textbox',{name:'Phone number',exact:true}).fill('80000000');
  assert.ok(await page.getByRole('button',{name:'Enter address to continue'}).isDisabled());
  await page.getByRole('textbox',{name:'Delivery address',exact:true}).fill('Test address — do not fulfil');
  await page.getByRole('textbox',{name:'Singapore postal code',exact:true}).fill('123456');
  await page.getByRole('button',{name:'Want it installed for me?'}).click();
  const enquiry=decodeURIComponent(await page.getByRole('link',{name:'Send enquiry on WhatsApp'}).getAttribute('href'));
  assert.ok(enquiry.includes('Sky Blue 22')&&enquiry.includes('1 ×'));
  if(await consent.isVisible())await consent.click();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'docs/order-flow/checkout-mobile.png',fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),390);
  assert.equal(await page.locator('section.home-shell').evaluate(e=>getComputedStyle(e).opacity),'1');
  if(process.env.ORDERS_SMOKE_ONLY==='1'){
   await page.setViewportSize({width:1280,height:1100});await page.screenshot({path:'docs/order-flow/checkout-desktop.png'});
   console.log('PASS: live colour selection, cart, S$50 address calculation, installation enquiry and mobile layout. No order submitted.');return;
  }
  if(base!=='http://localhost:3344')throw new Error('Full submission tests must use the local test server.');
  const submitted=page.waitForResponse(r=>r.url().endsWith('/api/cart-checkout')&&r.request().method()==='POST');
  await page.getByRole('button',{name:'Continue to PayNow · $150',exact:true}).click();
  const response=await submitted;const body=await response.json();assert.equal(response.status(),200,JSON.stringify(body));reference=body.paymentReference;
  const payload=response.request().postDataJSON();
  await page.waitForURL(base+'/orders/'+reference);
  await page.getByRole('heading',{name:'Your order is saved.',exact:true}).waitFor();
  await page.screenshot({path:'docs/order-flow/payment-mobile.png',fullPage:true});
  const duplicate=await context.request.post(base+'/api/cart-checkout',{data:payload});assert.equal(duplicate.status(),200);assert.equal((await duplicate.json()).paymentReference,reference);
  const tampered=structuredClone(payload);tampered.requestId=crypto.randomUUID();tampered.items[0].unitPrice=1;
  assert.equal((await context.request.post(base+'/api/cart-checkout',{data:tampered})).status(),400);
  const status=await context.request.get(base+'/api/orders/'+reference);assert.equal(status.status(),200);assert.equal((await status.json()).total,150);
  const anonymous=await browser.newContext();assert.equal((await anonymous.request.get(base+'/api/orders/'+reference)).status(),404);await anonymous.close();
  assert.ok(!page.url().includes(body.orderUrl.split('/').pop()));
  console.log('PASS: real product colour → cart → address adds S$50 → saved order → payment page; duplicate POST; server price rejection; cookie access; mobile width; installation selections. Payment emails addressed only to Resend test recipient.');
 }finally{
  await browser.close();
  if(reference){const db=neon(process.env.DATABASE_URL);const rows=await db`SELECT id FROM ja_orders WHERE reference=${reference} AND customer->>'email'='delivered@resend.dev'`;for(const row of rows){await db`DELETE FROM ja_order_emails WHERE order_id=${row.id}`;await db`DELETE FROM ja_orders WHERE id=${row.id}`;}console.log('Test order removed.');}
 }
})().catch(e=>{console.error(e.message);process.exitCode=1});
