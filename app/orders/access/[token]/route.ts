import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/orders/store'
export async function GET(req:NextRequest,{params}:{params:Promise<{token:string}>}) {
  const {token}=await params
  const order=await getOrder(token)
  if(!order)return new NextResponse('Order link not found. Please use the link in your order email.',{status:404})
  const response=NextResponse.redirect(new URL(`/orders/${order.reference}`,req.url))
  response.cookies.set(`ja-order-${order.reference}`,token,{httpOnly:true,secure:req.nextUrl.protocol==='https:',sameSite:'lax',path:'/',maxAge:30*86400})
  response.headers.set('Cache-Control','no-store');response.headers.set('Referrer-Policy','no-referrer');response.headers.set('X-Robots-Tag','noindex')
  return response
}
