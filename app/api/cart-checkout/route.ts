import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/sanity/lib/serverClient'
import { checkoutSchema, priceOrderItem } from '@/lib/orders/validation'
import { findRequest, saveOrder, requestHash, queueEmails, sql } from '@/lib/orders/store'
import { flushEmails } from '@/lib/orders/emails'
import type { ShopItem } from '@/lib/types'
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (origin && origin !== req.nextUrl.origin && origin !== process.env.ORDER_SITE_URL) return NextResponse.json({error:'Invalid request origin.'},{status:403})
  if (Number(req.headers.get('content-length') || 0) > 64000) return NextResponse.json({error:'Order too large.'},{status:413})
  const parsed = checkoutSchema.safeParse(await req.json().catch(()=>null))
  if (!parsed.success) return NextResponse.json({error:'Please check your details and six-digit postal code. If this is an older cart, remove and add the products again.'},{status:400})
  try {
    const input = parsed.data, hash = requestHash(input)
    let order = await findRequest(input.requestId)
    if (order && order.request_hash !== hash) return NextResponse.json({error:'Checkout details changed. Please reload and try again.'},{status:409})
    if (!order) {
      const bucket = requestHash({ip:req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',hour:Math.floor(Date.now()/3600000)})
      const [limit] = await sql()`INSERT INTO ja_order_rate_limits (bucket) VALUES (${bucket}) ON CONFLICT (bucket) DO UPDATE SET attempts=ja_order_rate_limits.attempts+1 RETURNING attempts`
      if(limit.attempts>10) return NextResponse.json({error:'Too many checkout attempts. Please try again later or contact our team.'},{status:429})
      const catalogue = await serverClient.fetch<ShopItem[]>('*[_type == "shopItem" && slug.current in $slugs && !(_id in path("drafts.**"))]', {slugs: input.items.map(i=>i.slug)})
      const items = input.items.map(i => {
        const product = catalogue.find(p => p.slug.current === i.slug)
        if (!product) throw new Error('A product is unavailable. Please check your cart.')
        return priceOrderItem(product, i)
      })
      order = await saveOrder(input.requestId, hash, input.customer, items)
    }
    await queueEmails(order)
    let emailStatus = 'pending'
    try { const result = await flushEmails(order.id); emailStatus = result.failed ? 'pending' : 'sent' } catch { /* Saved order is durable; scheduled job retries. */ }
    return NextResponse.json({orderUrl:`/orders/access/${order.token}`, paymentReference:order.reference, emailStatus}, {headers:{'Cache-Control':'no-store'}})
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const customerError = /quote|configuration|Installation|quantity|option|price has changed|unavailable|checkout has changed/.test(message)
    if (!customerError) console.error('Order checkout failed; check storage and catalogue connectivity.')
    return NextResponse.json({error: customerError ? message : 'We could not save your order. Please try again or contact our team. Do not pay until your order is saved.'},{status:customerError ? 400 : 503})
  }
}
