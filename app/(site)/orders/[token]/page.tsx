import type { Metadata } from 'next'
import OrderStatus from './OrderStatus'
export const metadata: Metadata = {title:'Your order',robots:{index:false,follow:false},referrer:'no-referrer'}
export default async function OrderPage({params}:{params:Promise<{token:string}>}) {const {token}=await params;return <OrderStatus token={token}/>}
