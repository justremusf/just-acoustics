import type { Metadata } from 'next'
import { Download, MessageCircle, Mail } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import pack from '@/lib/tradePack.json'
import TradeIntakeForm from './TradeIntakeForm'

// Trade desk for interior designers and architects. Content comes from the ID pack build
// (JA Assistant/out/id-pack/pack_data.py -> trade-pack.json -> lib/tradePack.json).
// Draft: noindex and not linked from the navigation until Remus approves it.
export const metadata: Metadata = pageMetadata({
  title: 'Trade Desk for Interior Designers & Architects',
  description: 'Send a plan and get a spec sheet, render and trade quote for acoustic panels, usually within the hour. Spec sheets and CAD blocks to download.',
  path: '/trade',
  noindex: true,
})

const IMG = '/trade/img/'

// Highlights "[check]" markers so the owner can see unconfirmed data on the preview.
function Checked({ text }: { text: string }) {
  const parts = text.split(/(\[check[^\]]*\])/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('[check') ? <span key={i} className="rounded bg-[#fff4e0] px-1 font-semibold text-[#b45309]">{p}</span> : <span key={i}>{p}</span>,
      )}
    </>
  )
}

const SPEC_FILES: Record<string, string> = {
  'flexi-wall': 'JA-spec-flexi-wall.pdf',
  'flexi-ceiling': 'JA-spec-flexi-ceiling.pdf',
  'flexi-bass': 'JA-spec-flexi-bass.pdf',
  'fabric-system': 'JA-spec-fabric-system.pdf',
  'melamine-ceiling': 'JA-spec-melamine-ceiling.pdf',
  'custom-print': 'JA-spec-custom-print.pdf',
}

const h2 = 'font-[family-name:var(--font-heading)] text-[clamp(30px,4vw,48px)] font-semibold leading-[1.04] tracking-[-1px] text-[#010101]'
const h3 = 'font-[family-name:var(--font-heading)] text-[20px] font-semibold leading-tight text-[#010101]'

export default function TradePage() {
  return (
    <div className="page-wrap page-stack">
      {/* Hero */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
        <div className="flex flex-col gap-5">
          <p className="m-0 text-[15px] font-semibold text-[#6a6a6a]">For interior designers and architects</p>
          <h1 className="page-title !text-[clamp(36px,5vw,64px)]">{pack.INTRO.title}.</h1>
          <p className="page-subtitle m-0">{pack.INTRO.lede}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#send-a-plan" className="inline-flex min-h-[52px] items-center rounded-full bg-[#010101] px-7 text-[15px] font-semibold text-white transition hover:-translate-y-px hover:shadow-[0_0_24px_6px_rgba(255,165,0,0.4)]">Send a plan</a>
            <a href="/trade/Just-Acoustics-ID-pack.pdf" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#010101] hover:text-[#ffa500]"><Download size={16} /> Download the trade pack (PDF)</a>
          </div>
        </div>
        <img src={`${IMG}case-home.jpg`} alt="Grand piano living room with flush white ceiling panels and wall panels" className="aspect-[4/3] w-full rounded-[24px] object-cover" />
      </section>

      {/* What we do for designers */}
      <section className="flex flex-col gap-6">
        <h2 className={h2}>What we do for designers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pack.INTRO.for_designers.map(([t, c]) => (
            <div key={t} className="glass-card p-6"><h3 className={h3}>{t}</h3><p className="mt-2 text-[15px] leading-relaxed">{c}</p></div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {pack.INTRO.who.map((p) => <p key={p} className="m-0 text-[16px] leading-relaxed">{p}</p>)}
        </div>
      </section>

      {/* How the trade desk works */}
      <section className="flex flex-col gap-6">
        <h2 className={h2}>How the trade desk works</h2>
        <ol className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {pack.TRADE_STEPS.map(([t, c], i) => (
            <li key={t} className="glass-card p-6">
              <span className="text-[34px] font-semibold leading-none text-[#ffa500]">{i + 1}</span>
              <h3 className={`${h3} mt-3`}>{t}</h3><p className="mt-2 text-[15px] leading-relaxed">{c}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Products */}
      <section className="flex flex-col gap-6">
        <h2 className={h2}>Product range</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pack.PRODUCTS.map((p) => (
            <div key={p.id} className="glass-card grid gap-4 p-5 sm:grid-cols-[160px_minmax(0,1fr)]">
              <img src={`${IMG}${p.image}`} alt={p.name} loading="lazy" className="aspect-square w-full rounded-2xl object-cover sm:w-[160px]" />
              <div className="flex flex-col gap-2 text-[14.5px] leading-relaxed">
                <h3 className={h3}>{p.name}</h3>
                <p className="m-0 text-[#6a6a6a]">{p.short}</p>
                <p className="m-0"><b className="text-[#010101]">Sizes</b> {p.sizes.join(' · ')}</p>
                <p className="m-0"><b className="text-[#010101]">Thickness</b> {p.thickness}</p>
                <p className="m-0"><b className="text-[#010101]">Acoustic</b> <Checked text={p.acoustic} /></p>
                <a href={`/trade/spec-sheets/${SPEC_FILES[p.id]}`} className="inline-flex items-center gap-2 font-semibold text-[#010101] hover:text-[#ffa500]"><Download size={15} /> Spec sheet</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Materials and safety */}
      <section className="flex flex-col gap-6">
        <h2 className={h2}>Materials and safety</h2>
        <p className="page-subtitle m-0">{pack.PRODUCTS[0].core}. {pack.CERT_NOTE}</p>
        <div className="glass-card overflow-x-auto p-2 md:p-4">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14.5px]">
            <thead><tr className="text-[#010101]"><th className="p-3">Test</th><th className="p-3">Result</th><th className="p-3">Source</th></tr></thead>
            <tbody>
              {pack.CERTS.map(([a, b, c]) => (
                <tr key={a} className="border-t border-black/5 align-top"><td className="p-3">{a}</td><td className="p-3 font-semibold text-[#010101]"><Checked text={b} /></td><td className="p-3 text-[#6a6a6a]"><Checked text={c} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Colours, edges, fixing, lead times */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className={h2}>Colours and edges</h2>
          <p className="m-0 text-[16px] leading-relaxed">{pack.COLOURS.count} standard Flexi™ fabric colours. {pack.COLOURS.note}</p>
          <img src="/assets/shop/standard-flexi/colour-chart-2026-09.png" alt="Flexi fabric colour chart, 39 colours" loading="lazy" className="w-full max-w-[520px] rounded-2xl border border-black/5" />
          {pack.EDGES.map(([t, c]) => <p key={t} className="m-0 text-[15px] leading-relaxed"><b className="text-[#010101]">{t}.</b> {c}</p>)}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className={h2}>Fixing and lead times</h2>
          {pack.FIXING.map(([t, c]) => <p key={t} className="m-0 text-[15px] leading-relaxed"><b className="text-[#010101]">{t}.</b> {c}</p>)}
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-[14.5px]">{pack.FIXING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
          <div className="glass-card mt-2 p-2 md:p-4">
            <table className="w-full border-collapse text-left text-[14.5px]">
              <tbody>{pack.LEAD_TIMES.map(([a, b]) => <tr key={a} className="border-t border-black/5 first:border-0 align-top"><td className="w-[130px] p-3 font-semibold text-[#010101]">{a}</td><td className="p-3">{b}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Design guidance */}
      <section className="flex flex-col gap-6">
        <h2 className={h2}>Design guidance by space</h2>
        <p className="page-subtitle m-0">RT60 is the time a sound takes to fade by 60 dB. Every proposal we send states it before and after treatment.</p>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          <div className="glass-card p-2 md:p-4">
            <table className="w-full border-collapse text-left text-[14.5px]">
              <thead><tr className="text-[#010101]"><th className="p-3">Space</th><th className="p-3">Target RT60</th></tr></thead>
              <tbody>{pack.SPACES.map((s) => <tr key={s.space} className="border-t border-black/5"><td className="p-3">{s.space}</td><td className="p-3 font-semibold text-[#010101]"><Checked text={s.target} /></td></tr>)}</tbody>
            </table>
          </div>
          <div className="glass-card flex flex-col gap-4 p-5 md:p-6">
            <h3 className={h3}>Before and after, from our room models</h3>
            {pack.RT60_EXAMPLES.map(([name, scope, before, after]) => (
              <div key={String(name)} className="text-[14px]">
                <div className="flex justify-between gap-3"><span className="font-semibold text-[#010101]">{name}</span><span className="text-[#6a6a6a]">{scope}</span></div>
                <div className="mt-1 grid grid-cols-[96px_1fr] items-center gap-2">
                  <span>before {Number(before).toFixed(2)} s</span><span className="h-2.5 rounded-full bg-[#d4d4d4]" style={{ width: `${Math.min(Number(before) / 2.2, 1) * 100}%` }} />
                  <span>after {Number(after).toFixed(2)} s</span><span className="h-2.5 rounded-full bg-[#ffa500]" style={{ width: `${(Number(after) / 2.2) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="m-0 text-[13px] text-[#6a6a6a]">Estimates from our room calculator on each room's 3D model, normal furnishings. Phase 1 jobs stop short of target by budget.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pack.SPACE_TIPS.map(([t, c]) => <p key={t} className="m-0 text-[14.5px] leading-relaxed"><b className="text-[#010101]">{t}.</b> {c}</p>)}
        </div>
      </section>

      {/* Case studies */}
      <section className="flex flex-col gap-6">
        <h2 className={h2}>Selected projects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pack.CASES.map((c) => (
            <article key={c.title} className="glass-card flex flex-col overflow-hidden">
              <img src={`${IMG}${c.image}`} alt={c.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-col gap-2 p-5 text-[14.5px] leading-relaxed">
                <h3 className={h3}>{c.title}</h3>
                <p className="m-0 text-[#6a6a6a]">{c.client}</p>
                <p className="m-0">{c.brief}</p>
                <p className="m-0"><b className="text-[#010101]">What we did.</b> {c.work}</p>
                <p className="m-0"><b className="text-[#010101]">RT60 before → after:</b> <Checked text={c.rt60} /></p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Downloads */}
      <section className="flex flex-col gap-6">
        <h2 className={h2}>Downloads</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <a href="/trade/Just-Acoustics-ID-pack.pdf" className="glass-card flex flex-col gap-2 p-6 hover:-translate-y-0.5"><span className={h3}>Trade pack</span><span className="text-[14.5px]">11 pages, PDF</span></a>
          <a href="/trade/cad/JA-cad-blocks.zip" className="glass-card flex flex-col gap-2 p-6 hover:-translate-y-0.5"><span className={h3}>CAD blocks</span><span className="text-[14.5px]">Standard Flexi™ sizes, 25, 50 and 100 mm, DXF and SVG in mm (zip)</span></a>
          <a href="/assets/shop/standard-flexi/colour-chart-2026-09.png" className="glass-card flex flex-col gap-2 p-6 hover:-translate-y-0.5"><span className={h3}>Colour chart</span><span className="text-[14.5px]">39 standard Flexi™ fabric colours</span></a>
        </div>
      </section>

      {/* Intake */}
      <section id="send-a-plan" className="flex scroll-mt-24 flex-col gap-6">
        <h2 className={h2}>Send a plan</h2>
        <p className="page-subtitle m-0">Upload a floor plan, RCP, elevation or a few photos. We reply with a spec sheet, a render and a trade quote.</p>
        <TradeIntakeForm />
        <div className="flex flex-wrap gap-6 text-[15px]">
          <a href={pack.CONTACT.whatsapp_url} className="inline-flex items-center gap-2 font-semibold text-[#010101] hover:text-[#ffa500]"><MessageCircle size={16} /> WhatsApp {pack.CONTACT.whatsapp}</a>
          <a href={`mailto:${pack.CONTACT.email}`} className="inline-flex items-center gap-2 font-semibold text-[#010101] hover:text-[#ffa500]"><Mail size={16} /> {pack.CONTACT.email}</a>
        </div>
      </section>
    </div>
  )
}
