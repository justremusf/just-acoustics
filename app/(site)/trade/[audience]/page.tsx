import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Download } from 'lucide-react'
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import FAQ, { type FaqItem } from '@/components/sections/FAQ'
import TallyAttributionIframe from '@/components/TallyAttributionIframe'
import { TALLY_TRADE_FORM_URL } from '@/lib/tally'
import pack from '@/lib/tradePack.json'
import { AUDIENCES, TRADE_FAQ, tradeServiceExtras } from '../tradeContent'

// One page per trade audience, so each can answer its own searches. Everything else lives on /trade.
export const revalidate = 86400
export const dynamicParams = false

const IMG = '/trade/img/'

type AudiencePage = {
  audience: string
  title: string
  description: string
  h1: string
  answer: string
  image: string
  imageAlt: string
  sections: { title: string; copy: string }[]
  faqPick: string[]
  faqExtra: FaqItem[]
  showCerts?: boolean
  showRt60?: boolean
  showLead?: boolean
}

const PAGES: Record<string, AudiencePage> = {
  'interior-designers': {
    audience: 'Interior designers',
    title: 'Acoustic Panels for Interior Designers in Singapore',
    description: 'Acoustic panel layouts, renders and trade quotes for Singapore interior designers. 39 fabric colours, custom sizes and print, supplied and installed.',
    h1: 'Acoustic panels for interior designers in Singapore',
    answer: 'Just Acoustics supplies and installs acoustic panels for Singapore interior design practices. Send a plan or site photos and we send back a panel layout, a render in your colours, a spec sheet and a trade quote made out to your company.',
    image: 'cat-meeting.webp',
    imageAlt: 'Pale blue Flexi acoustic panels fitted wall to wall in a corporate boardroom',
    sections: [
      { title: 'It looks like part of the design', copy: 'Fabric wrapped panels in 39 colours, bevel or straight edged, cut to your layout up to 2400 × 1200 mm. A paintable white face matches a paint colour, and custom print puts your artwork on the panel.' },
      { title: 'You can present it straight away', copy: 'We place the panels on your plan or elevation and render them in your chosen colours. The proposal can carry your logo, and it shows the RT60 before and after, so your client sees what the treatment does.' },
      { title: 'It stays your project', copy: 'We quote and invoice your company at trade rates, and you set your own mark-up. We supply and install, so you have one party responsible from drawing to handover.' },
    ],
    faqPick: ['What sizes and colours are available?', 'Can I get a physical swatch card or sample?', 'Can you design the panel layout from my drawings?', 'Can you quote through my company instead of my client?', 'How do I get your trade prices?', 'Fabric wrapped panels or PET felt panels?'],
    faqExtra: [
      { q: 'Which acoustic panels look best in a residential or hospitality interior?', a: 'Fabric wrapped panels suit most interiors because the fabric reads as upholstery rather than equipment. Choose a colour close to the wall for a quiet result, or a contrast colour and a regular rhythm to make the panels a feature. Where a client wants no visible panel at all, a paintable face or a printed face is the usual answer.' },
    ],
  },
  architects: {
    audience: 'Architects',
    title: 'Acoustic Panel Specifications for Architects, Singapore',
    description: 'NRC, fire and emissions data, RT60 targets, spec sheets and DXF blocks for fabric acoustic panels in Singapore, with supply and installation.',
    h1: 'Acoustic panel specifications for architects in Singapore',
    answer: 'Flexi™ is a fabric wrapped glass fibre acoustic panel with NRC 1.00 at 50 mm and a core rated Class A1 to EN 13501-1. Just Acoustics supplies and installs it in Singapore and provides spec sheets, DXF blocks and the RT60 before and after treatment for each room.',
    image: 'cat-office-director.webp',
    imageAlt: "Tall Flexi acoustic panels in warm grey along a directors' office wall",
    sections: [
      { title: 'What to write in the specification', copy: 'Fabric wrapped acoustic panel, 96 kg/m³ glass fibre core with resin-hardened edges, 25 or 50 mm, NRC 0.80 or 1.00 to ASTM C423 mounting A, core Class A1 to EN 13501-1. Each product has a one-page spec sheet to attach.' },
      { title: 'Keeping it in the drawings', copy: 'DXF and SVG blocks cover the standard Flexi™ sizes in 25, 50 and 100 mm. Send your RCP and elevations and we coordinate the layout around lights, diffusers and sprinklers.' },
    ],
    faqPick: ['Are Flexi™ panels fire rated for Singapore projects?', 'What is the NRC of your acoustic panels?', 'Do you have CAD blocks and spec sheets?', 'Do your panels help with Green Mark or Green Label?', 'Is a glass fibre core safe in an occupied space?', 'How are the panels fixed?', 'Do I need an acoustic consultant?', 'Do acoustic panels soundproof a room?'],
    faqExtra: [
      { q: 'What RT60 should a meeting room or classroom target?', a: 'As a typical target, 0.4 to 0.5 seconds for a meeting room and 0.4 to 0.6 seconds for a classroom or training room. A restaurant usually targets 0.5 to 0.7 seconds and a church or hall 0.8 to 1.2 seconds. Where a consultant has set a figure, that figure governs.' },
    ],
    showCerts: true,
    showRt60: true,
  },
  'main-contractors': {
    audience: 'Main contractors',
    title: 'Acoustic Panel Subcontractor for Main Contractors, Singapore',
    description: 'Acoustic panel supply and install subcontractor for Singapore main contractors. About 4 to 6 weeks to installed, after-hours work, data sheets and test reports.',
    h1: 'Acoustic panel subcontractor for main contractors in Singapore',
    answer: 'Just Acoustics supplies and installs acoustic panels as a single subcontract for Singapore main contractors. Allow about 4 to 6 weeks from deposit to installed. We work after hours and on weekends where the site needs it, and we provide data sheets and the test reports we hold.',
    image: 'render-meeting.jpg',
    imageAlt: 'Render of a meeting room with Flexi acoustic panels placed from the plan',
    sections: [
      { title: 'One package, supply and install', copy: 'Send the drawings and the scope. We return a panel layout and a quote for supply and installation, so measurement, fixing and finish sit with one party.' },
      { title: 'Planned around your programme', copy: 'Tell us your programme date when you send the plan and we confirm an install date in writing. Most installs take a few hours to two days on site, including after hours and weekends to suit landlord fit-out rules, at an additional cost agreed in the quote.' },
    ],
    faqPick: ['How long from order to installation?', 'Can you prepare documents for a main contractor submittal?', 'Can you work at night or on weekends in a mall or office building?', 'Do you supply only, or supply and install?', 'How are the panels fixed?', 'Are Flexi™ panels fire rated for Singapore projects?', 'What warranty do you give, and how are the panels cleaned?'],
    faqExtra: [
      { q: 'What do you need from a main contractor to quote?', a: 'A floor plan, RCP or elevation, the ceiling height, the wall and ceiling finishes, which walls are glass or partitions, and the date you need the install done. Site photos help. Panels fix to solid walls and ceilings only.' },
    ],
    showLead: true,
  },
}

export function generateStaticParams() {
  return Object.keys(PAGES).map((audience) => ({ audience }))
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }): Promise<Metadata> {
  const { audience } = await params
  const page = PAGES[audience]
  if (!page) return {}
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/trade/${audience}`,
    image: `${IMG}${page.image}`,
    imageAlt: page.imageAlt,
  })
}

const btnPrimary = 'inline-flex min-h-12 whitespace-nowrap items-center justify-center gap-2 rounded-full bg-[var(--color-brand-orange)] px-6 text-sm font-bold text-black no-underline transition hover:-translate-y-px'
const h3 = 'm-0 font-[family-name:var(--font-heading)] text-[19px] font-medium leading-tight text-[var(--color-dark-100)]'

export default async function TradeAudiencePage({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params
  const page = PAGES[audience]
  const card = AUDIENCES.find((a) => a.slug === audience)
  if (!page || !card) notFound()

  const faq = [...page.faqExtra, ...page.faqPick.map((q) => TRADE_FAQ.find((f) => f.q === q)).filter((f): f is FaqItem => Boolean(f))]
  const others = AUDIENCES.filter((a) => a.slug !== audience)
  const path = `/trade/${audience}`
  const jsonLd = [
    {
      ...serviceJsonLd({ name: page.h1, description: page.answer, path, serviceType: 'Acoustic panel supply and installation' }),
      ...tradeServiceExtras([page.audience]),
    },
    breadcrumbJsonLd([{ name: 'Trade desk', path: '/trade' }, { name: page.audience, path }]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
      <div className="page-wrap page-stack">
        <section className="home-shell overflow-hidden p-0">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
            <div className="flex flex-col justify-center gap-4 p-5 sm:gap-5 sm:p-[40px] lg:p-[48px]">
              <Link href="/trade" className="m-0 text-[14px] font-semibold text-[var(--color-brand-orange)] no-underline">Trade desk</Link>
              <h1 className="page-title !text-[clamp(32px,4.2vw,54px)] max-w-[18ch]">{page.h1}</h1>
              <p className="page-subtitle !text-[16px] sm:!text-[17px]">{page.answer}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#request" className={btnPrimary}>{card.cta.href === '#send-a-plan' ? 'Send a plan for a quote' : 'Request the trade price list'}</a>
                <Link href="/trade#downloads" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 px-6 text-sm font-bold text-black no-underline transition hover:-translate-y-px"><Download className="h-4 w-4" aria-hidden="true" /> Spec sheets and CAD</Link>
              </div>
            </div>
            <div className="relative h-[220px] sm:h-[340px] lg:h-auto lg:min-h-[480px]">
              <img src={`${IMG}${page.image}`} alt={page.imageAlt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
          <aside id="request" className="home-shell scroll-mt-28 rounded-[28px] p-5 sm:p-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <h2 className="page-card-title">Prices or a project quote</h2>
            <p className="page-card-copy mt-2 mb-5 !text-sm">Get the trade price list by email, or send a plan for a layout, render and quote. Rather chat? WhatsApp {pack.CONTACT.whatsapp}.</p>
            <TallyAttributionIframe baseUrl={TALLY_TRADE_FORM_URL} title={`Trade desk request, ${page.audience}`} thankYouPath="/thank-you/trade" style={{ overflow: 'hidden', display: 'block' }} />
          </aside>

          <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
            <section className="home-shell page-hero-shell">
              <h2 className="page-card-title max-w-[26ch]">{card.line}</h2>
              <ul className="m-0 mt-6 grid list-none gap-x-6 gap-y-3 p-0 sm:grid-cols-2">
                {card.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm leading-6 text-black/75">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col">
                {page.sections.map((s) => (
                  <div key={s.title} className="border-t border-black/8 py-5 last:pb-0">
                    <h3 className={h3}>{s.title}</h3>
                    <p className="mt-2 mb-0 text-[15px] leading-7 text-[var(--color-gray-100)]">{s.copy}</p>
                  </div>
                ))}
              </div>
            </section>

            {page.showCerts ? (
              <section className="home-shell page-hero-shell">
                <h2 className="page-card-title">Fire, health and acoustic data</h2>
                <p className="mt-2 mb-4 text-sm text-[var(--color-gray-100)]">{pack.CERT_NOTE}</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left text-[14.5px]">
                    <thead><tr className="text-[var(--color-dark-100)]"><th className="py-2 pr-3">Test</th><th className="py-2 pr-3">Result</th><th className="py-2">Source</th></tr></thead>
                    <tbody>{pack.CERTS.map(([a, b, c]) => <tr key={a} className="border-t border-black/5 align-top"><td className="py-2.5 pr-3">{a}</td><td className="py-2.5 pr-3 font-semibold text-[var(--color-dark-100)]">{b}</td><td className="py-2.5 text-[var(--color-gray-100)]">{c}</td></tr>)}</tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {page.showRt60 ? (
              <section className="home-shell page-hero-shell">
                <h2 className="page-card-title">Typical RT60 targets by space</h2>
                <table className="mt-4 w-full border-collapse text-left text-[14.5px]">
                  <thead><tr className="text-[var(--color-dark-100)]"><th className="py-2 pr-3">Space</th><th className="py-2 text-right">RT60</th></tr></thead>
                  <tbody>{pack.SPACES.map((s) => <tr key={s.space} className="border-t border-black/5"><td className="py-2 pr-3">{s.space}</td><td className="py-2 text-right font-semibold text-[var(--color-dark-100)]">{s.target}</td></tr>)}</tbody>
                </table>
              </section>
            ) : null}

            {page.showLead ? (
              <section className="home-shell page-hero-shell">
                <h2 className="page-card-title">Lead times</h2>
                <dl className="m-0 mt-4 grid gap-3 text-[14.5px] sm:grid-cols-[140px_minmax(0,1fr)]">
                  {pack.LEAD_TIMES.map(([a, b]) => <div key={a} className="contents"><dt className="font-semibold text-[var(--color-dark-100)]">{a}</dt><dd className="m-0">{b}</dd></div>)}
                </dl>
              </section>
            ) : null}

            <nav aria-label="Also on the trade desk" className="flex flex-wrap gap-x-6 gap-y-2 px-1">
              <Link href="/trade" className="page-link">The full trade desk <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              {others.map((a) => <Link key={a.slug} href={`/trade/${a.slug}`} className="page-link">For {a.who.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>)}
            </nav>
          </div>
        </div>

        <FAQ items={faq} title={`Questions from ${page.audience.toLowerCase()}`} showLabel={false} flush />
      </div>
    </>
  )
}
