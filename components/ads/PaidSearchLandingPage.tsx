import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { Suspense } from 'react'
import { ArrowRight, Check, MessageCircle, ShieldCheck } from 'lucide-react'
import TallyAttributionIframe from '@/components/TallyAttributionIframe'

const TALLY_FORM = 'https://tally.so/embed/NppZoQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1'

export type PaidSearchPageConfig = {
  eyebrow: string
  title: string
  summary: string
  heroImage: string
  heroAlt: string
  problemTitle: string
  problems: string[]
  approachTitle: string
  approach: Array<{ title: string; copy: string }>
  pricing: string
  proof: string[]
  faq: Array<{ question: string; answer: string }>
}

export default function PaidSearchLandingPage({ config }: { config: PaidSearchPageConfig }) {
  return (
    <div className="page-wrap page-stack gap-10 md:gap-14">
      <section className="home-shell overflow-hidden rounded-[32px] p-0">
        <div className="grid lg:grid-cols-[1.02fr_.98fr] lg:items-stretch">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <span className="soft-pill w-fit">{config.eyebrow}</span>
            <h1 className="mt-6 mb-0 max-w-[13ch] text-[clamp(42px,6vw,76px)] font-medium leading-[.96] tracking-[-.045em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {config.title}
            </h1>
            <p className="mt-6 mb-0 max-w-[54ch] text-[17px] leading-8 text-[var(--color-gray-100)]">{config.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#consultation" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-orange)] px-6 text-sm font-bold text-black no-underline">
                Get a room recommendation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="https://wa.me/6589301905" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 px-6 text-sm font-bold text-black no-underline">
                <MessageCircle className="h-4 w-4" /> WhatsApp photos
              </Link>
            </div>
            <p className="mt-5 mb-0 text-xs font-semibold uppercase tracking-[.12em] text-black/45">Singapore · Supply, design and installation</p>
          </div>
          <div className="relative min-h-[360px] lg:min-h-[650px]">
            <Image src={config.heroImage} alt={config.heroAlt} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <div className="home-shell p-7 sm:p-10">
          <span className="soft-pill w-fit">What is happening</span>
          <h2 className="page-card-title mt-6 max-w-[16ch]">{config.problemTitle}</h2>
          <p className="mt-5 mb-0 text-base leading-7 text-[var(--color-gray-100)]">
            Acoustic treatment reduces reflections inside a room. It does not block sound travelling through walls, doors or ceilings.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.problems.map((problem) => (
            <div className="glass-card flex items-start gap-4 p-6" key={problem}>
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-700"><Check className="h-4 w-4" /></span>
              <p className="m-0 text-sm leading-6 text-black/70">{problem}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-shell p-7 sm:p-10 lg:p-12">
        <div className="max-w-2xl">
          <span className="soft-pill w-fit">Treatment approach</span>
          <h2 className="page-title mt-6 text-[clamp(30px,4vw,50px)]">{config.approachTitle}</h2>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {config.approach.map((item, index) => (
            <article className="border-t border-black/10 pt-6" key={item.title}>
              <span className="text-xs font-bold text-[var(--color-brand-orange)]">0{index + 1}</span>
              <h3 className="mt-3 mb-0 text-xl font-semibold text-black">{item.title}</h3>
              <p className="mt-3 mb-0 text-sm leading-6 text-black/60">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] bg-black p-8 text-white sm:p-10">
          <ShieldCheck className="h-8 w-8 text-[var(--color-brand-orange)]" />
          <h2 className="mt-6 mb-0 text-[clamp(30px,4vw,48px)] font-medium leading-none" style={{ fontFamily: 'var(--font-heading)' }}>Practical scope and transparent pricing.</h2>
          <p className="mt-5 mb-0 text-lg leading-8 text-white/70">{config.pricing}</p>
          <ul className="mt-8 grid gap-3 p-0">
            {config.proof.map((item) => <li className="flex gap-3 text-sm text-white/80" key={item}><Check className="h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" />{item}</li>)}
          </ul>
        </div>
        <div id="consultation" className="home-shell overflow-hidden p-3 sm:p-6">
          <Suspense fallback={<div className="min-h-[640px]" />}>
            <TallyAttributionIframe baseUrl={TALLY_FORM} title={`${config.eyebrow} consultation`} className="min-h-[640px]" />
          </Suspense>
        </div>
      </section>

      <section className="home-shell p-7 sm:p-10 lg:p-12">
        <span className="soft-pill w-fit">Common questions</span>
        <div className="mt-8 divide-y divide-black/10">
          {config.faq.map((item) => (
            <details className="group py-6" key={item.question}>
              <summary className="cursor-pointer list-none text-lg font-semibold text-black">{item.question}</summary>
              <p className="mt-4 mb-0 max-w-3xl text-sm leading-7 text-black/60">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </div>
  )
}

