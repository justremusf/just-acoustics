import { cookies } from 'next/headers'
import { NextResponse, after } from 'next/server'
import { reconcileOrders } from '@/lib/orders/aspire'
export const maxDuration = 300
import { getOrder, publicOrder } from '@/lib/orders/store'
export async function GET(_req: Request, context: {params:Promise<{token:string}>}) {
  try {
    const {token:reference}=await context.params
    if(!/^JA-\d{6}-[A-Z0-9]{8}$/.test(reference)) return NextResponse.json({error:"Order not found"},{status:404})
    const access=(await cookies()).get(`ja-order-${reference}`)?.value
    const candidate=access ? await getOrder(access) : null
    const order=candidate?.reference===reference ? candidate : null
    if(order?.status==='awaiting_payment' && process.env.ASPIRE_ORDER_ACCOUNT_ID) after(async()=>{try{await reconcileOrders()}catch{console.error('Order page payment check failed; scheduled retry will follow.')}})
    return NextResponse.json(order ? publicOrder(order) : {error:'Order not found'}, {status:order ? 200 : 404,headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex'}})
  } catch {return NextResponse.json({error:'Order status temporarily unavailable.'},{status:503})}
}
