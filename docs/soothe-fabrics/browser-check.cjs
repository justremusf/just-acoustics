const {chromium}=require('/Users/remusfung/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1440,height:1100}});
const base=process.env.TEST_URL||'http://localhost:3333';
await p.goto(base+'/shop/soothe-gobos');
const consent=p.getByRole('button',{name:'Analytics only',exact:true});await consent.waitFor({timeout:3000}).catch(()=>{});if(await consent.isVisible())await consent.click();
await p.getByRole('button',{name:'Show 46 more fabrics'}).filter({visible:true}).click();
for(const name of ['Blue Lagoon 8080-05','Ash 8080-28','Rust 8080-20','Royal 2020-28','Baltic 2020-30']){
 const btn=p.getByRole('button',{name:'Select '+name,exact:true});await btn.click();
 const style=await btn.locator('span[style]').getAttribute('style');assert(style.includes('weave-'+name.split(' ')[name.split(' ').length-1].split('-')[0]));
}
await p.getByRole('button',{name:'Select Aqua 8080-03',exact:true}).click();
await p.waitForTimeout(1200);
await p.evaluate(async()=>{await Promise.all(Array.from(document.images).filter(i=>i.complete).map(i=>i.decode().catch(()=>{})))});
await p.getByText('Soothe fabric collection',{exact:true}).scrollIntoViewIfNeeded();
await p.screenshot({path:'docs/soothe-fabrics/selector-desktop.png'});
const html=await p.content();assert(!html.includes('f8970a27c3a4340cdf28d44b96beed76a0d7565a'));assert(!html.includes('ab5b0e0f446f3fb8f6c88903f736da9f2c96c98c'));
console.log('Desktop: chart switching, gap-mapped fabrics and removal of old generated gallery charts passed.');
console.log('Add buttons:',await p.getByRole('button',{name:/Add to cart/}).count());
await p.setViewportSize({width:390,height:844});await p.reload();await p.getByRole('button',{name:'Show 46 more fabrics'}).filter({visible:true}).click();
await p.getByRole('button',{name:'Select Baltic 2020-30',exact:true}).click();
assert(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await p.screenshot({path:'docs/soothe-fabrics/selector-mobile.png'});console.log('Mobile: selection and overflow checks passed.');
await b.close();
})().catch(e=>{console.error(e);process.exit(1)})
