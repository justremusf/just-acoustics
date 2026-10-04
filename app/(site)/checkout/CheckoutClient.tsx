"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartContext';
import CartOptionDetails from '@/components/cart/CartOptionDetails';
import InstallationEnquiry from '@/components/cart/InstallationEnquiry';
import { DELIVERY_FEE, DELIVERY_DISCLOSURE, ORDER_LEAD_TIME, ORDER_FOLLOW_UP, JUST_ACOUSTICS_WHATSAPP_URL } from '@/lib/paymentCopy';
import { formatSgd } from '@/lib/shopPricing';
import { trackEvent } from '@/components/analytics/trackEvent';
const initial = {fullName:'',email:'',phone:'',company:'',addressLine1:'',addressLine2:'',postalCode:'',deliveryNotes:''};
const fieldsList = [
  ['fullName','Full name','text','name',true],['email','Email address','email','email',true],
  ['phone','Phone number','tel','tel',true],['company','Company (optional)','text','organization',false],
  ['addressLine1','Delivery address','text','address-line1',true],['addressLine2','Unit / address line 2 (optional)','text','address-line2',false],
  ['postalCode','Singapore postal code','text','postal-code',true],
] as const;
export default function CheckoutClient() {
  const {items,subtotal,updateQuantity,removeItem} = useCart();
  const [fields,setFields]=useState(initial), [ready,setReady]=useState(false), [submitting,setSubmitting]=useState(false), [error,setError]=useState('');
  const request=useRef<{snapshot:string;id:string}|null>(null), tracked=useRef(false);
  useEffect(()=>{
    try {const saved=JSON.parse(sessionStorage.getItem('ja-checkout-draft') || 'null'); if(saved?.fields)setFields({...initial,...saved.fields});if(saved?.request)request.current=saved.request;}catch{}
    setReady(true);
  },[]);
  useEffect(()=>{if(ready)try{sessionStorage.setItem('ja-checkout-draft',JSON.stringify({fields,request:request.current}));}catch{}},[fields,ready]);
  useEffect(()=>{if(items.length&&!tracked.current){tracked.current=true;trackEvent('begin_checkout',{value:subtotal,currency:'SGD'});}},[items.length,subtotal]);
  const addressReady=fields.addressLine1.trim().length>=5 && /^\d{6}$/.test(fields.postalCode);
  const total=subtotal+(addressReady ? DELIVERY_FEE : 0);
  async function submit(event:FormEvent) {
    event.preventDefault();setError('');setSubmitting(true);
    try {
      if(items.some(i=>!i.selection))throw new Error('This cart was created before our checkout update. Please remove and add the products again.');
      const payload={customer:fields,items:items.map(i=>({slug:i.slug,quantity:i.quantity,unitPrice:i.unitPrice,selection:{...i.selection!,quantity:i.quantity}}))};
      const snapshot=JSON.stringify(payload);
      if(request.current?.snapshot!==snapshot)request.current={snapshot,id:crypto.randomUUID()};
      try {sessionStorage.setItem('ja-checkout-draft',JSON.stringify({fields,request:request.current}));}catch{}
      const response=await fetch('/api/cart-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,requestId:request.current.id})});
      const body=await response.json();
      if(!response.ok)throw new Error(body.error||'Unable to save order. Please try again.');
      sessionStorage.setItem('ja-order-cart',JSON.stringify({reference:body.paymentReference,snapshot:JSON.stringify(items)}));
      window.location.assign(body.orderUrl);
    }catch(e){setError(e instanceof Error?e.message:'Unable to save order. Please try again.');setSubmitting(false);}
  }
  if(!ready)return <div className="page-wrap page-stack"><p>Loading your checkout…</p></div>;
  if(!items.length)return <div className="page-wrap page-stack"><h1>Your cart is empty</h1><Link href="/shop">Browse acoustic panels</Link></div>;
  return <div className="page-wrap page-stack"><section style={{opacity:1,transform:"none"}} className="home-shell page-hero-shell">
    <p className="page-kicker">Your space, made quieter</p><h1 className="mt-3 text-4xl sm:text-6xl font-medium tracking-tight">Complete your order</h1>
    <p className="mt-4 max-w-2xl text-base leading-7">{ORDER_LEAD_TIME}</p>
    <ol className="mt-6 flex flex-wrap gap-3 text-sm" aria-label="Checkout progress"><li className="rounded-full bg-[#137e89] text-white px-4 py-2">1 · Delivery details</li><li className="rounded-full bg-white px-4 py-2">2 · Pay with your bank app</li><li className="rounded-full bg-white px-4 py-2">3 · Email confirmation</li></ol>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px] items-start">
      <form onSubmit={submit} className="rounded-3xl bg-white p-5 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Where should we deliver?</h2><p className="mt-2 text-sm leading-6">{DELIVERY_DISCLOSURE}</p>
        <fieldset disabled={submitting} className="mt-6 grid gap-4 sm:grid-cols-2">
          {fieldsList.map(([name,label,type,autoComplete,required])=><label key={name} className={`grid gap-2 text-sm font-medium ${name.startsWith('address')?'sm:col-span-2':''}`}>{label}<input name={name} autoComplete={autoComplete} required={required} type={type} maxLength={name==='postalCode'?6:254} pattern={name==='postalCode'?'[0-9]{6}':undefined} minLength={name==='addressLine1'?5:name==='phone'?8:undefined} inputMode={name==='postalCode'?'numeric':undefined} value={fields[name]} onChange={e=>setFields({...fields,[name]:e.target.value})} className="h-12 rounded-xl border border-black/15 px-4 bg-white" /></label>)}
          <label className="grid gap-2 text-sm font-medium sm:col-span-2">Delivery notes (optional)<textarea maxLength={2000} value={fields.deliveryNotes} onChange={e=>setFields({...fields,deliveryNotes:e.target.value})} className="min-h-24 rounded-xl border border-black/15 p-4" placeholder="Access instructions or anything we should know" /></label>
        </fieldset>
        <p className="mt-5 text-sm leading-6">{ORDER_FOLLOW_UP}</p>
        {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
        <button disabled={submitting||!addressReady} className="page-cta mt-6 min-h-14 w-full justify-center disabled:opacity-50" type="submit">{submitting?'Saving your order…':addressReady?`Continue to PayNow · ${formatSgd(total)}`:'Enter address to continue'}</button>
        <p className="mt-3 text-xs leading-5 text-[#52616b]">Your order is saved before payment. Pay securely in your own banking app. We never ask for your banking password. <Link href="/privacy-policy" className="underline">Privacy policy</Link></p>
        <a className="mt-3 inline-block text-sm underline" href={JUST_ACOUSTICS_WHATSAPP_URL} target="_blank" rel="noreferrer">Questions? Ask our sales team</a>
      </form>
      <aside className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm lg:sticky lg:top-28"><h2 className="text-2xl font-semibold">Your panels</h2>
        <fieldset disabled={submitting}>{items.map(i=><div key={i.id} className="border-b border-black/10 py-5"><Link href={`/shop/${i.slug}`} className="font-semibold">{i.title}</Link><CartOptionDetails itemId={i.id} options={i.options} compact/><div className="mt-3 flex items-center justify-between gap-3"><div className="flex items-center border rounded-full"><button type="button" aria-label={`Decrease ${i.title} quantity`} className="w-11 h-11" onClick={()=>updateQuantity(i.id,i.quantity-1)}>−</button><span className="min-w-8 text-center">{i.quantity}</span><button type="button" aria-label={`Increase ${i.title} quantity`} className="w-11 h-11" onClick={()=>updateQuantity(i.id,i.quantity+1)}>+</button></div><span>{formatSgd(i.quantity*i.unitPrice)}</span><button type="button" onClick={()=>removeItem(i.id)} className="text-sm underline">Remove</button></div></div>)}</fieldset>
        <dl className="mt-5 grid grid-cols-[1fr_auto] gap-y-3 text-sm"><dt>Products</dt><dd>{formatSgd(subtotal)}</dd><dt>Islandwide delivery</dt><dd aria-live="polite">{addressReady?formatSgd(DELIVERY_FEE):'S$50 after address'}</dd><dt className="text-lg font-semibold">{addressReady?'Total payable':'Product subtotal'}</dt><dd className="text-lg font-semibold" aria-live="polite">{formatSgd(total)}</dd></dl>
        <p className="mt-4 text-sm text-[#52616b]">Supply and delivery. Installation is arranged separately.</p>
        <InstallationEnquiry reference={undefined}/>
      </aside>
    </div></section></div>;
}
