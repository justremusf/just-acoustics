import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, AudioLines, Check, Download, FileText, Flame, HardHat, Layers, Leaf, Mail, PencilRuler, Plus, Ruler } from 'lucide-react'
import Script from 'next/script'
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { getPaidSearchData } from '@/lib/paidSearchData'
import BrandScroller from '@/components/sections/BrandScroller'
import FAQ from '@/components/sections/FAQ'
import TallyAttributionIframe from '@/components/TallyAttributionIframe'
import { TALLY_TRADE_FORM_URL } from '@/lib/tally'
import pack from '@/lib/tradePack.json'
import { AUDIENCES, TRADE_FAQ, tradeServiceExtras } from './tradeContent'

// Trade desk landing page for interior designers, architects and main contractors. Product content comes
// from the ID pack build (JA Assistant/out/id-pack/pack_data.py -> trade-pack.json -> lib/tradePack.json);
// the look follows the Flexi™ catalogue. Prices are never shown here: visitors request the price list.
export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: 'Acoustic Panel Supplier & Installer Singapore: Trade Desk',
  description: 'Acoustic panel supplier and installer for Singapore interior designers, architects and contractors. Spec sheets, CAD blocks, fire data and trade quotes.',
  path: '/trade',
  image: '/trade/img/cat-office-director.webp',
  imageAlt: "Tall Flexi acoustic panels in warm grey along a directors' office wall",
})

const IMG = '/trade/img/'

type Spec = [string, string, [string, string][]]
type Feature = { image: string; client: string; space: string; work: string }

const SPEC_FILES: Record<string, string> = {
  'flexi-wall': 'JA-spec-flexi-wall.pdf',
  'flexi-ceiling': 'JA-spec-flexi-ceiling.pdf',
  'flexi-bass': 'JA-spec-flexi-bass.pdf',
  'fabric-system': 'JA-spec-fabric-system.pdf',
  'melamine-ceiling': 'JA-spec-melamine-ceiling.pdf',
  'custom-print': 'JA-spec-custom-print.pdf',
}

const SPEC_ICONS: Record<string, ReactNode> = {
  flame: <Flame className="h-5 w-5" aria-hidden="true" />,
  leaf: <Leaf className="h-5 w-5" aria-hidden="true" />,
  audio: <AudioLines className="h-5 w-5" aria-hidden="true" />,
  ruler: <Ruler className="h-5 w-5" aria-hidden="true" />,
  layers: <Layers className="h-5 w-5" aria-hidden="true" />,
}

const DELIVERABLES = [
  'Panel layout on your plan or elevation',
  'Render in your chosen colours',
  'One-page spec sheet per product',
  'RT60 before and after treatment',
  'Trade quote, supply and install',
]

const h2 = 'page-card-title max-w-[26ch]'
const h3 = 'm-0 font-[family-name:var(--font-heading)] text-[19px] font-medium leading-tight text-[var(--color-dark-100)]'
const kicker = 'm-0 text-[14px] font-semibold text-[var(--color-brand-orange)]'
const cream = 'rounded-[28px] border-2 border-white bg-[#f8f6ef] shadow-[0_18px_50px_rgba(80,70,40,0.06)]'
const btnPrimary = 'inline-flex min-h-12 whitespace-nowrap items-center justify-center gap-2 rounded-full bg-[var(--color-brand-orange)] px-6 text-sm font-bold text-black no-underline transition hover:-translate-y-px'
const btnGhost = 'inline-flex min-h-12 whitespace-nowrap items-center justify-center gap-2 rounded-full border border-black/15 px-6 text-sm font-bold text-black no-underline transition hover:-translate-y-px'

const STATS = [
  ['NRC 1.00', 'at 50 mm, ASTM C423'],
  ['Class A1', 'core, EN 13501-1'],
  ['39 colours', 'bevel or straight edged'],
  ['4 to 6 weeks', 'deposit to installed'],
]

const AUDIENCE_ICONS = [PencilRuler, FileText, HardHat]

/** Collapsible technical section, styled like the site's FAQ rows. */
function Detail({ title, note, children, open = false }: { title: string; note: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group glass-card overflow-hidden [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 md:px-7 md:py-6">
        <span className="flex flex-col gap-1">
          <span className="font-[family-name:var(--font-heading)] text-[clamp(19px,1.8vw,24px)] font-medium leading-tight text-[var(--color-dark-100)]">{title}</span>
          <span className="text-sm text-[var(--color-gray-100)]">{note}</span>
        </span>
        <Plus className="h-5 w-5 shrink-0 transition group-open:rotate-45" aria-hidden="true" />
      </summary>
      <div className="border-t border-black/5 p-5 text-[14.5px] leading-relaxed md:px-7 md:pb-7">{children}</div>
    </details>
  )
}

export default async function TradePage() {
  const { brandLogos, testimonials } = await getPaidSearchData()
  const jsonLd = [
    {
      ...serviceJsonLd({
        name: 'Acoustic panel supply and installation for the trade',
        description: 'Fabric acoustic panels supplied and installed for interior designers, architects and main contractors in Singapore, with panel layouts, renders, spec sheets and trade quotes from your plan.',
        path: '/trade',
        serviceType: 'Acoustic panel supply and installation',
      }),
      ...tradeServiceExtras(['Interior designers', 'Architects', 'Main contractors']),
    },
    breadcrumbJsonLd([{ name: 'Trade desk', path: '/trade' }]),
  ]
  const spec = pack.FLEXI_SPEC as unknown as Spec[]
  const features = pack.FEATURES as Feature[]
  const cases = pack.CASES.slice(0, 3)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
      <div className="page-wrap page-stack !pb-6">
        {/* Hero: same frame as the paid search landers */}
        <section className="home-shell overflow-hidden p-0">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
            <div className="flex flex-col justify-center gap-4 p-5 sm:gap-5 sm:p-[40px] lg:p-[48px]">
              <p className={kicker}>Trade desk · designers, architects, contractors</p>
              <h1 className="page-title !text-[clamp(34px,4.6vw,60px)] max-w-[16ch]">Specify acoustic panels without the back and forth.</h1>
              <p className="page-subtitle !text-[16px] sm:!text-[17px]">
                Just Acoustics supplies and installs acoustic panels for Singapore interior designers, architects and main contractors. Send a plan and we send back a panel layout, a render in your colours, a spec sheet and a trade quote with the RT60 before and after.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#price-list" className={btnPrimary}><Mail className="h-4 w-4" aria-hidden="true" /> Request the trade price list</a>
                <a href="#send-a-plan" className={btnGhost}>Send a plan for a quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              </div>
              <p className="m-0 text-sm text-[var(--color-gray-100)]">Prices on request.</p>
            </div>
            <div className="relative h-[220px] sm:h-[340px] lg:h-auto lg:min-h-[520px]">
              <img src={`${IMG}cat-office-director.webp`} alt="Tall Flexi panels in warm grey along a directors' office wall" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* Key numbers */}
        <section className="home-shell grid grid-cols-2 gap-y-5 p-5 sm:p-7 lg:grid-cols-4" aria-label="Flexi panel at a glance">
          {STATS.map(([big, small]) => (
            <div key={big} className="flex flex-col gap-1 border-black/8 px-2 lg:border-l lg:px-6 lg:first:border-l-0">
              <span className="font-[family-name:var(--font-heading)] text-[clamp(24px,2.6vw,34px)] font-medium leading-none text-[var(--color-dark-100)]">{big}</span>
              <span className="text-sm text-[var(--color-gray-100)]">{small}</span>
            </div>
          ))}
        </section>

        {/* Form first on mobile; sticky right column on desktop, as on the landers. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
          <aside
            id="request"
            className="home-shell relative scroll-mt-28 rounded-[28px] p-5 sm:p-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
          >
            <span id="price-list" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
            <span id="send-a-plan" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
            <h2 className="page-card-title">Prices or a project quote</h2>
            <p className="page-card-copy mt-2 mb-5 !text-sm">Get the trade price list by email, or send a plan for a layout, render and quote. Rather chat? WhatsApp {pack.CONTACT.whatsapp}.</p>
            <TallyAttributionIframe baseUrl={TALLY_TRADE_FORM_URL} title="Trade desk request" thankYouPath="/thank-you/trade" style={{ overflow: 'hidden', display: 'block' }} />
          </aside>

          <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
            {/* Who it is for */}
            <section className="home-shell page-hero-shell">
              <h2 className={h2}>Built for how you work.</h2>
              <div className="mt-6 flex flex-col">
                {AUDIENCES.map((a, i) => {
                  const Icon = AUDIENCE_ICONS[i]
                  return (
                    <article key={a.who} className="grid gap-4 border-t border-black/8 py-6 first:border-0 first:pt-0 last:pb-0 md:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="flex flex-col gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#fff1dc] text-[#b86a00]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                        <h3 className={h3}>{a.who}</h3>
                        <p className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">{a.line}</p>
                        <Link href={`/trade/${a.slug}`} className="page-link">More for {a.who.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                      </div>
                      <ul className="m-0 grid list-none content-start gap-y-3 p-0">
                        {a.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 text-sm leading-6 text-black/75">
                            <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  )
                })}
              </div>
            </section>

            {/* How it works */}
            <section className="home-shell page-hero-shell">
              <h2 className={h2}>One upload. A finished scheme back.</h2>
              <ol className="m-0 mt-6 grid list-none gap-5 p-0 sm:grid-cols-2">
                {pack.TRADE_STEPS.map(([t, c], i) => (
                  <li className="border-t border-black/10 pt-5" key={t}>
                    <span className="text-xs font-bold text-[var(--color-brand-orange)]">Step {i + 1}</span>
                    <h3 className={`${h3} mt-2`}>{t}</h3>
                    <p className="mt-2 mb-0 text-sm leading-6 text-[var(--color-gray-100)]">{c}</p>
                  </li>
                ))}
              </ol>
              <div className="relative mt-6 sm:overflow-hidden sm:rounded-[22px]">
                <img src={`${IMG}render-meeting.jpg`} alt="Render of a meeting room with Flexi panels placed from the plan" loading="lazy" className="aspect-[16/9] w-full rounded-[22px] object-cover sm:rounded-none" />
                <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0 sm:absolute sm:inset-x-3 sm:bottom-3 sm:mt-0">
                  {DELIVERABLES.map((d) => (
                    <li key={d} className="rounded-full border border-white/80 bg-[var(--color-dark-100)] px-3 sm:bg-[rgba(40,36,30,0.45)] py-1.5 text-[13px] font-medium text-white backdrop-blur-md">{d}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Projects */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-wrap items-end justify-between gap-3 px-1">
                <h2 className="page-card-title">Recent commercial projects</h2>
                <Link href="/projects" className="page-link">See all projects <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {cases.map((c) => (
                  <article key={c.title} className="glass-card overflow-hidden">
                    <img src={`${IMG}${c.image}`} alt={c.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <div className="flex flex-col gap-1 p-4">
                      <span className="text-[17px] font-medium leading-tight text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>{c.client}</span>
                      <span className="text-xs text-[var(--color-gray-200)]">{c.title}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 ? (
              <section className="flex flex-col gap-4">
                <h2 className="page-card-title px-1">What clients say</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {testimonials.slice(0, 3).map((item) => (
                    <figure key={`${item.authorName}-${item.company ?? ''}`} className="glass-card m-0 flex flex-col gap-3 p-5">
                      <span className="text-sm text-[var(--color-brand-orange)]" aria-label={`${item.rating ?? 5} out of 5 stars`}>{'★'.repeat(Math.min(5, Math.max(1, item.rating ?? 5)))}</span>
                      <blockquote className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">“{item.review}”</blockquote>
                      <figcaption className="mt-auto text-sm">
                        <span className="font-semibold text-[var(--color-dark-100)]">{item.authorName}</span>
                        {item.company ? <span className="text-[var(--color-gray-200)]"> · {item.company}</span> : null}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Trade pricing */}
            <section className="rounded-[28px] bg-[var(--color-dark-100)] p-6 text-white sm:p-8">
              <p className="m-0 text-sm font-semibold text-white/50">Trade pricing</p>
              <h2 className="mt-3 mb-0 text-[clamp(24px,2.4vw,32px)] font-medium leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Trade rates, sent on request</h2>
              <p className="mt-4 mb-0 max-w-[60ch] text-base leading-7 text-white/75">Design and architecture practices get trade rates, confirmed on each project&rsquo;s quote. We quote and invoice your company, and you set your own mark-up.</p>
              <ul className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
                {['Supply and installation included', 'Per panel rates, any of the 39 colours', 'Proposals with your logo if you want', '50% deposit, 50% on completion', 'After hours and weekend installs', '1-year warranty on panels'].map((item) => (
                  <li className="flex gap-3 text-sm text-white/80" key={item}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#price-list" className={`${btnPrimary} mt-7`}>Request the trade price list</a>
            </section>
          </div>
        </div>
      </div>

      <BrandScroller logos={brandLogos} />

      <div className="page-wrap page-stack !pt-6">
        {/* Flexi, catalogue style */}
        <section className={`${cream} relative overflow-hidden p-6 md:p-[40px]`}>
          <img src={`${IMG}cat-panel.webp`} alt="" aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 hidden w-[340px] lg:block" />
          <div className="flex max-w-[640px] flex-col gap-4">
            <h2 className="m-0 font-[family-name:var(--font-heading)] text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.02] tracking-[-1px] text-[#4b504c]">Flexi™<span className="block font-light">Acoustic Panels</span></h2>
            <p className="m-0 text-[17px] leading-relaxed">A 96 kg/m³ glass fibre core with resin-hardened edges, wrapped in acoustically transparent fabric. Broadband absorption across the speech range, in any size your layout needs.</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-4 rounded-[24px] border-2 border-white bg-white/50 p-5">
              <img src={`${IMG}cat-cutaway.webp`} alt="Cutaway of a Flexi panel showing the core, face, tissue layer and edge" loading="lazy" className="w-full" />
              <ol className="m-0 flex list-none flex-col gap-3 p-0">
                {(pack.CUTAWAY as unknown as [string, number][]).map(([t], i) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#4b504c] text-[11px] font-bold text-white">{i + 1}</span>{t}
                  </li>
                ))}
              </ol>
            </div>
            <div className="grid gap-x-8 gap-y-6 rounded-[24px] border-2 border-white bg-white/50 p-6 sm:grid-cols-2">
              {spec.slice(0, 4).map(([ic, title, rows]) => (
                <div key={title}>
                  <h3 className="m-0 flex items-center gap-2 font-[family-name:var(--font-heading)] text-[20px] font-medium text-[#4b504c]">{SPEC_ICONS[ic]} {title}</h3>
                  <dl className="m-0 mt-3 flex flex-col gap-1 text-[13.5px] leading-snug">
                    {rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-b border-black/5 pb-1"><dt className="font-semibold text-[var(--color-dark-100)]">{k}</dt><dd className="m-0 text-right">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3 px-1">
            <h2 className="page-card-title">The range</h2>
            <p className="m-0 text-sm text-[var(--color-gray-100)]">Every product has a one-page spec sheet. Prices on request.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pack.PRODUCTS.map((p) => (
              <article key={p.id} className="glass-card flex flex-col overflow-hidden">
                <img src={`${IMG}${p.image}`} alt={p.name} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className={h3}>{p.name}</h3>
                  <p className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">{p.short}</p>
                  <p className="m-0 text-[13px] leading-5 text-black/70">{p.thickness} · {p.sizes.filter((s) => !s.startsWith('Custom')).map((s) => s.replace(/ \(.*\)/, '')).join(', ')}</p>
                  <a href={`/trade/spec-sheets/${SPEC_FILES[p.id]}`} className="page-link mt-auto pt-2"><Download className="h-4 w-4" aria-hidden="true" /> Spec sheet</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Colours and custom print */}
        <section className={`${cream} grid gap-8 p-6 md:p-[40px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]`}>
          <div className="flex flex-col gap-4">
            <h2 className="m-0 font-[family-name:var(--font-heading)] text-[clamp(28px,3vw,40px)] font-semibold leading-tight text-[#4b504c]">{pack.COLOURS.count} colours<span className="font-light">, two edges</span></h2>
            <img src={`${IMG}colour-swatches.webp`} alt="Flexi fabric colour chart, 39 standard colours" loading="lazy" className="w-full rounded-2xl" />
            <p className="m-0 text-[13.5px] leading-relaxed text-[var(--color-gray-100)]">{pack.COLOURS.note}</p>
          </div>
          <div className="flex flex-col gap-5">
            {pack.EDGES.map(([t, c]) => <p key={t} className="m-0 text-[15px] leading-relaxed"><b className="text-[var(--color-dark-100)]">{t}.</b> {c}</p>)}
            <div className="mt-2 rounded-[24px] border-2 border-white bg-white/50 p-5">
              <h3 className="m-0 font-[family-name:var(--font-heading)] text-[22px] font-medium text-[#4b504c]">Or print anything</h3>
              <p className="mt-2 mb-4 text-sm leading-6">Your artwork, logo or photo printed on the panel face.</p>
              <div className="grid grid-cols-2 gap-3">
                <img src={`${IMG}cat-print-wall.webp`} alt="Custom printed acoustic panels on a showroom wall" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
                <img src={`${IMG}cat-print-stack.webp`} alt="Printed acoustic panels ready for installation" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature project */}
        <section className="relative overflow-hidden rounded-[28px]">
          <img src={`${IMG}${features[1].image.replace(/\.(jpg|png)$/, '.webp')}`} alt={`${features[1].space}, ${features[1].client}`} loading="lazy" className="h-[380px] w-full object-cover sm:h-[520px]" />
          <div className="absolute inset-x-4 bottom-4 max-w-[520px] rounded-[24px] border-2 border-white/85 bg-[rgba(40,36,30,0.38)] p-5 text-white backdrop-blur-md sm:inset-x-auto sm:bottom-8 sm:left-8 sm:p-7">
            <p className="m-0 font-[family-name:var(--font-heading)] text-[24px] font-semibold leading-tight sm:text-[30px]">{features[1].client}</p>
            <p className="mt-2 mb-0 text-[15px] leading-relaxed text-white/90">{features[1].space}. {features[1].work}.</p>
          </div>
        </section>

        {/* Technical detail, folded so the page stays short */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 px-1">
            <h2 className="page-card-title">For your specification and submittal</h2>
            <p className="m-0 text-sm text-[var(--color-gray-100)]">Test results, fixing, lead times and RT60 targets. Tell us where the panels go and we send the reports we hold that apply. Data reviewed November 2026.</p>
          </div>
          <Detail title="Fire, health and acoustic tests" note="EN 13501-1, BS 476, ASTM E136, BS 5852, ASTM C423">
            <p className="mt-0 mb-4 text-[var(--color-gray-100)]">{pack.CERT_NOTE}</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead><tr className="text-[var(--color-dark-100)]"><th className="py-2 pr-3">Test</th><th className="py-2 pr-3">Result</th><th className="py-2">Source</th></tr></thead>
                <tbody>{pack.CERTS.map(([a, b, c]) => <tr key={a} className="border-t border-black/5 align-top"><td className="py-2.5 pr-3">{a}</td><td className="py-2.5 pr-3 font-semibold text-[var(--color-dark-100)]">{b}</td><td className="py-2.5 text-[var(--color-gray-100)]">{c}</td></tr>)}</tbody>
              </table>
            </div>
          </Detail>
          <Detail title="Fixing methods" note="Clips and adhesive, mechanical, flush ceiling, suspended cloud, track">
            <div className="grid gap-3 md:grid-cols-2">
              {pack.FIXING.map(([t, c]) => <p key={t} className="m-0"><b className="text-[var(--color-dark-100)]">{t}.</b> {c}</p>)}
            </div>
            <ul className="mt-4 mb-0 flex list-disc flex-col gap-1 pl-5 text-[var(--color-gray-100)]">{pack.FIXING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
          </Detail>
          <Detail title="Lead times" note="About 4 to 6 weeks from deposit to installed">
            <dl className="m-0 grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
              {pack.LEAD_TIMES.map(([a, b]) => <div key={a} className="contents"><dt className="font-semibold text-[var(--color-dark-100)]">{a}</dt><dd className="m-0">{b}</dd></div>)}
            </dl>
          </Detail>
          <Detail title="RT60 targets by space" note="Typical targets by space, and before and after results from our room models">
            <div className="grid gap-6 md:grid-cols-2">
              <table className="w-full border-collapse text-left">
                <tbody>{pack.SPACES.map((s) => <tr key={s.space} className="border-t border-black/5 first:border-0"><td className="py-2 pr-3">{s.space}</td><td className="py-2 text-right font-semibold text-[var(--color-dark-100)]">{s.target}</td></tr>)}</tbody>
              </table>
              <div className="flex flex-col gap-3">
                {pack.RT60_EXAMPLES.map(([name, scope, before, after]) => (
                  <div key={String(name)} className="text-[13.5px]">
                    <div className="flex justify-between gap-3"><span className="font-semibold text-[var(--color-dark-100)]">{name}</span><span className="text-right text-[var(--color-gray-100)]">{scope}</span></div>
                    <div className="mt-1 grid grid-cols-[86px_1fr] items-center gap-x-2 gap-y-1">
                      <span>before {Number(before).toFixed(2)} s</span><span className="h-2 rounded-full bg-[#d6d1c3]" style={{ width: `${Math.min(Number(before) / 2.2, 1) * 100}%` }} />
                      <span>after {Number(after).toFixed(2)} s</span><span className="h-2 rounded-full bg-[var(--color-brand-orange)]" style={{ width: `${(Number(after) / 2.2) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Detail>
        </section>

        {/* Downloads */}
        <section id="downloads" className="grid scroll-mt-24 gap-4 md:grid-cols-3">
          {[
            ['/trade/Just-Acoustics-ID-pack.pdf', 'Trade pack', 'Products, specs, colours and projects. PDF, 15 pages'],
            ['/trade/cad/JA-cad-blocks.zip', 'CAD blocks', 'Standard Flexi™ sizes in 25, 50 and 100 mm. DXF and SVG'],
            ['/assets/shop/standard-flexi/colour-chart-2026-09.png', 'Colour chart', 'All 39 standard Flexi™ fabric colours'],
          ].map(([href, t, c]) => (
            <a key={t} href={href} className="glass-card flex items-center gap-4 p-5 no-underline transition hover:-translate-y-0.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff1dc] text-[#b86a00]"><Download className="h-5 w-5" aria-hidden="true" /></span>
              <span className="flex flex-col"><span className={h3}>{t}</span><span className="text-[13px] text-[var(--color-gray-100)]">{c}</span></span>
            </a>
          ))}
        </section>

        <FAQ items={TRADE_FAQ} title="Questions from the trade" subtitle="Fire ratings, NRC, lead times, submittals and how we work with you." showLabel={false} flush />

        {/* Final CTA, as on the landers */}
        <section className="rounded-[28px] bg-[var(--color-dark-100)] p-6 text-white sm:p-[40px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="m-0 text-[clamp(26px,3vw,40px)] font-medium leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Send us your next plan.</h2>
              <p className="m-0 max-w-[52ch] text-base leading-7 text-white/70">A layout, a render, a spec sheet and a trade quote, ready to present.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href="#price-list" className={btnPrimary}>Request the trade price list</a>
              <a href="#send-a-plan" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-bold text-white no-underline">Send a plan <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
