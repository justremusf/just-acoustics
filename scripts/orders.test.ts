import { test } from 'node:test'
import assert from 'node:assert/strict'
import { eligiblePayment, matchPayments, type IncomingPayment } from '../lib/orders/matching'
import { priceOrderItem } from '../lib/orders/validation'
import { getConfigurableItem } from '../lib/shopCatalogue'
import { getDefaultSelection } from '../lib/shopPricing'
import type { ShopItem } from '../lib/types'
const order={id:'one',reference:'JA-260915-12345678',totalCents:15000,createdAt:'2026-09-15T00:00:00Z'}
const payment:IncomingPayment={id:'txn1',accountId:'account',amountCents:15000,receivedAt:'2026-09-15T00:05:00Z',reference:''}
test('unique exact amount matches',()=>assert.equal(matchPayments([order],[payment]).matches.length,1))
test('same total orders are held',()=>assert.equal(matchPayments([order,{...order,id:'two',reference:'JA-260915-87654321'}],[payment]).matches.length,0))
test('reference resolves equal totals',()=>assert.equal(matchPayments([order,{...order,id:'two',reference:'JA-260915-87654321'}],[{...payment,reference:order.reference}]).matches[0].orderId,'one'))
test('two transfers for one order are held',()=>assert.equal(matchPayments([order],[payment,{...payment,id:'txn2'}]).matches.length,0))
test('unknown reference never falls back to amount',()=>assert.equal(matchPayments([order],[{...payment,reference:'JA-260915-AAAAAAAA'}]).matches.length,0))
test('underpayment and overpayment are held',()=>{for(const amountCents of [14999,15001])assert.equal(matchPayments([order],[{...payment,amountCents,reference:order.reference}]).matches.length,0)})
test('old and pre-order payments cannot amount-match',()=>{for(const receivedAt of ['2026-09-14T23:59:00Z','2026-09-18T00:00:00Z'])assert.equal(matchPayments([order],[{...payment,receivedAt}]).matches.length,0)})
test('only settled SGD bank credits in the configured account qualify',()=>{
 const raw={id:'1',type:'credit',status:'settled',channel:'banktransfer',currency_code:'SGD',account_id:'account',is_fx_transfer:false,amount:15000,datetime:payment.receivedAt}
 assert.ok(eligiblePayment(raw,'account'))
 for(const patch of [{status:'posted'},{status:'refunded'},{type:'debit'},{channel:'card'},{account_id:'other'},{currency_code:'USD'},{is_fx_transfer:true},{amount:-15000},{amount:150.1},{datetime:'2026-09-15 00:05:00'}])assert.equal(eligiblePayment({...raw,...patch},'account'),null)
})
const source={title:'Flexi Acoustic Panels',slug:{current:'flexi-acoustic-panels'},productLine:'flexi-panel',price:100} as ShopItem
const configured=getConfigurableItem(source), selection=getDefaultSelection(configured)
const item={slug:source.slug.current,quantity:2,unitPrice:100,selection:{...selection,quantity:2}}
test('server catalogue price and selected colour survive',()=>{const result=priceOrderItem(source,item);assert.equal(result.lineCents,20000);assert.ok(result.options.some(o=>o.label==='Colour / fabric'&&o.value==='Beige White 01'))})
test('browser price manipulation is rejected',()=>assert.throws(()=>priceOrderItem(source,{...item,unitPrice:1}),/price has changed/))
test('unknown colour is rejected',()=>assert.throws(()=>priceOrderItem(source,{...item,selection:{...item.selection,colourId:'fake'}}),/option/))
test('installation is never silently billed',()=>assert.throws(()=>priceOrderItem(source,{...item,selection:{...item.selection,installationId:'professional-install'}}),/separate enquiry/))
test('server computes size adjustment',()=>assert.equal(priceOrderItem(source,{...item,unitPrice:55,selection:{...item.selection,sizeId:'600x600'}}).lineCents,11000))
