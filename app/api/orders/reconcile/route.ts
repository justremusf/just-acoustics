import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { reconcileOrders } from '@/lib/orders/aspire'
export const maxDuration = 300
export async function GET(req: NextRequest) {
  const expected = `Bearer ${process.env.CRON_SECRET || ''}`, actual = req.headers.get('authorization') || ''
  if(!process.env.CRON_SECRET || actual.length !== expected.length || !timingSafeEqual(Buffer.from(actual),Buffer.from(expected))) return NextResponse.json({error:'Unauthorised'},{status:401})
  try {return NextResponse.json(await reconcileOrders(),{headers:{'Cache-Control':'no-store'}})}
  catch {console.error('Order reconciliation failed. Check Aspire connectivity and order email jobs.');return NextResponse.json({error:'Order reconciliation failed; retry required.'},{status:503})}
}
