'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartContext'
import InstallationEnquiry from '@/components/cart/InstallationEnquiry'
import { ORDER_FOLLOW_UP, ORDER_LEAD_TIME, PAYNOW_INSTRUCTIONS, PAYNOW_QR_URL, PAYNOW_VPA, JUST_ACOUSTICS_WHATSAPP_URL } from '@/lib/paymentCopy'
import { formatSgd } from '@/lib/shopPricing'
import type { publicOrder } from '@/lib/orders/store'
type PublicOrder=ReturnType<typeof publicOrder>
export default function OrderStatus({token}:{token:string}) {
  const [order,setOrder]=useState<PublicOrder|null>(null),[error,setError]=useState(''),[copied,setCopied]=useState('');
  const {items,clearCart}=useCart();
  useEffect(()=>{let stopped=false; const controller=new AbortController();
    async function refresh(){try{const response=await fetch(`/api/orders/${token}`,{cache:'no-store',signal:controller.signal});const data=await response.json();if(!response.ok)throw new Error(data.error);if(!stopped){setOrder(data);setError('');}}catch(e){if(!stopped)setError(e instanceof Error?e.message:'Unable to check status. Please try again.');}}
    void refresh();const timer=setInterval(()=>{if(document.visibilityState==='visible')void refresh();},15000);
    return()=>{stopped=true;controller.abort();clearInterval(timer);};
  },[token]);
  useEffect(()=>{if(order?.status!=='paid')return;try{const saved=JSON.parse(sessionStorage.getItem('ja-order-cart')||'null');if(saved?.reference===token){if(saved.snapshot===JSON.stringify(items))clearCart();sessionStorage.removeItem('ja-order-cart');sessionStorage.removeItem('just-acoustics-checkout-draft');sessionStorage.removeItem('just-acoustics-checkout-request');}}catch{}},[order?.status,token,items,clearCart]);
  async function copy(value:string){try{await navigator.clipboard.writeText(value);setCopied(value);}catch{setCopied('Copy unavailable — select the text below.');}}
  const paid=order?.status==='paid';
  return <div className="page-wrap page-stack"><section style={{opacity:1,transform:"none"}} className="home-shell page-hero-shell max-w-3xl mx-auto">
    <p className="page-kicker">Just Acoustics · Your order</p><h1 className="mt-3 text-4xl sm:text-5xl font-medium">{paid?'Thank you. Your order is confirmed.':order?'Your order is saved.':'Loading your order…'}</h1>
    {error&&<p role="alert" className="mt-4 p-4 rounded-xl bg-amber-50">{error} If you have already paid, do not pay again. <a href={JUST_ACOUSTICS_WHATSAPP_URL} className="underline">Contact our team</a>.</p>}
    {order&&<><div className="mt-6 rounded-3xl bg-white p-5 sm:p-8 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><strong>{order.reference}</strong><span role="status" className="rounded-full bg-[#edf6f5] px-4 py-2 text-sm text-[#137e89]">{paid?'Payment received':'Awaiting payment confirmation'}</span></div><p className="mt-4 leading-7">{paid?ORDER_FOLLOW_UP:'Pay the exact amount below and include your order reference. We’ll email your confirmation once your payment is matched. This page updates automatically.'}</p><p className="mt-3 font-medium leading-7">{ORDER_LEAD_TIME}</p>
    <div className="mt-5 divide-y">{order.items.map((i,n)=><div key={n} className="py-3"><div className="flex justify-between gap-4"><strong>{i.quantity} × {i.title}</strong><span>{formatSgd(i.lineCents/100)}</span></div><p className="mt-1 text-sm text-[#52616b]">{i.options.map(o=>`${o.label}: ${o.value}`).join(' · ')}</p></div>)}</div>
    <dl className="mt-4 grid grid-cols-[1fr_auto] gap-3"><dt>Products</dt><dd>{formatSgd(order.subtotal)}</dd><dt>Islandwide delivery</dt><dd>{formatSgd(order.delivery)}</dd><dt className="text-xl font-semibold">{paid?'Total paid':'Total payable'}</dt><dd className="text-xl font-semibold">{formatSgd(order.total)}</dd></dl>
    {!paid&&<div className="mt-6 border-t pt-6"><h2 className="text-2xl font-semibold">PayNow with your banking app</h2><p className="mt-3 text-sm leading-6">Recipient: THE ROMANUS PTE. LTD. (Just Acoustics). Check the recipient and amount before approving your payment.</p><div className="mt-5 grid gap-5 sm:grid-cols-[200px_1fr]"><div><img src={PAYNOW_QR_URL} alt="Just Acoustics PayNow QR" width={200} height={200} className="w-full max-w-[240px] mx-auto"/><a href={PAYNOW_QR_URL} download="just-acoustics-paynow.png" className="mt-3 block text-center underline text-sm">Download QR image</a></div><div><p className="text-sm leading-6">{PAYNOW_INSTRUCTIONS}</p>{[['Amount',formatSgd(order.total)],['Order reference',order.reference],['PayNow VPA',PAYNOW_VPA]].map(([label,value])=><div key={label} className="mt-3 rounded-xl bg-gray-50 p-3"><span className="text-xs text-[#52616b]">{label}</span><div className="flex items-center gap-2 justify-between"><strong className="break-all text-sm">{value}</strong><button type="button" onClick={()=>copy(label==='Amount'?order.total.toFixed(2):value)} className="p-2 text-sm underline">Copy</button></div></div>)}<p role="status" className="text-xs mt-2">{copied?copied.startsWith('Copy unavailable')?copied:'Copied to clipboard':''}</p></div></div><p className="mt-5 rounded-xl bg-[#edf6f5] p-4 text-sm leading-6">Already paid? Keep this page or use your email’s order link to check confirmation. Please don’t pay again while we match your transfer. If confirmation is delayed, send us your order reference.</p></div>}
    <a href={`${JUST_ACOUSTICS_WHATSAPP_URL}?text=${encodeURIComponent(`Hi, I have a question about order ${order.reference}.`)}`} target="_blank" rel="noreferrer" className="mt-5 inline-block underline">Ask our team about this order</a>
    <InstallationEnquiry reference={order.reference} summary={order.items.map(i=>`${i.quantity} × ${i.title}\n${i.options.map(o=>`${o.label}: ${o.value}`).join(' · ')}`).join('\n\n')}/></div><p className="mt-4 text-xs text-[#52616b]">Keep your order link private. It lets you view this order without signing in.</p><Link href="/shop" className="mt-5 inline-block underline">Continue shopping</Link></>}
  </section></div>
}
