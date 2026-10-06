import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Check, MessageCircle, TriangleAlert } from 'lucide-react'
import TallyAttributionIframe from '@/components/TallyAttributionIframe'
import WhatsAppLink from '@/components/analytics/WhatsAppLink'
import FAQ, { type FaqItem } from '@/components/sections/FAQ'
import BrandScroller from '@/components/sections/BrandScroller'
import { TALLY_CONSULTATION_FORM_URL } from '@/lib/tally'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'
import type { LandingTestimonial } from '@/lib/paidSearchData'
import type { Project, SanityImage } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

export type PaidSearchPageConfig = {
  eyebrow: string
  /** Hero headline: name the pain and the outcome. */
  title: string
  /** One-line hero subhead. */
  summary: string
  /** Sanity project `category` used for the hero photo and the project strip, e.g. 'office-spaces'. */
  projectCategory: string
  /** Short plural label for the space type, used in headings, e.g. 'office'. */
  spaceLabel: string
  /** WhatsApp message in the server HTML; after load the session-aware message from lib/whatsappContext replaces it. */
  whatsappText: string
  /** Real local photo used when Sanity has no project photo for this space type. */
  heroImage: string
  heroAlt: string
  problemTitle: string
  problems: string[]
  approachTitle: string
  approach: Array<{ title: string; copy: string }>
  /** Price sentence. Only figures already published on the site. */
  pricing: string
  proof: string[]
  faq: FaqItem[]
}

type Props = {
  config: PaidSearchPageConfig
  projects?: Project[]
  testimonials?: LandingTestimonial[]
  brandLogos?: SanityImage[]
  /** Optional price estimator, rendered just above the price guide card. */
  estimator?: ReactNode
}

function CtaButtons({ whatsappText, dark = false }: { whatsappText: string; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href="#consultation"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-orange)] px-6 text-sm font-bold text-black no-underline"
      >
        Get a free consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      {/* The server HTML keeps the page's own message; the client swaps in the session-aware one. */}
      <WhatsAppLink
        source={dark ? 'lander_footer' : 'lander_hero'}
        fallbackText={whatsappText}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-bold no-underline ${
          dark ? 'border-white/25 text-white' : 'border-black/15 text-black'
        }`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
      </WhatsAppLink>
    </div>
  )
}

function TrustLine({ dark = false }: { dark?: boolean }) {
  return <p className={`m-0 text-sm ${dark ? 'text-white/60' : 'text-[var(--color-gray-100)]'}`}>Free consultation. We reply within 1 hour.</p>
}

export default function PaidSearchLandingPage({ config, projects = [], testimonials = [], brandLogos, estimator }: Props) {
  const withImage = projects.filter((project) => project?.mainImage?.asset && project.slug?.current)
  const matching = withImage.filter((project) => project.category === config.projectCategory)
  const others = withImage.filter((project) => project.category !== config.projectCategory)

  // Hero: a real project photo of this space type, otherwise a real local photo.
  const heroProject = matching[0]
  const heroSrc = heroProject?.mainImage ? urlFor(heroProject.mainImage).width(1400).height(1050).url() : config.heroImage
  const heroAlt = heroProject
    ? heroProject.mainImage?.alt || `${heroProject.title}${heroProject.location ? `, ${heroProject.location}` : ''}`
    : config.heroAlt

  // Proof strip: this space type first, topped up with other recent work.
  const strip = [...matching, ...others].slice(0, 3)
  const stripAllMatching = strip.length > 0 && strip.every((project) => project.category === config.projectCategory)

  return (
    <>
      <div className="page-wrap page-stack !pb-6">
        {/* Hero */}
        <section className="home-shell overflow-hidden p-0">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] lg:items-stretch">
            <div className="flex flex-col justify-center gap-4 p-5 sm:gap-5 sm:p-10 lg:p-12">
              <span className="soft-pill w-fit">{config.eyebrow}</span>
              <h1 className="page-title !text-[clamp(34px,4.6vw,60px)] max-w-[18ch]">{config.title}</h1>
              <p className="page-subtitle !text-[16px] sm:!text-[17px]">{config.summary}</p>
              <CtaButtons whatsappText={config.whatsappText} />
              <TrustLine />
            </div>
            <div className="relative h-[190px] sm:h-[320px] lg:h-auto lg:min-h-[520px]">
              <Image
                src={heroSrc}
                alt={heroAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>
          </div>
        </section>

        {/* Form first on mobile; sticky right column on desktop. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
          <aside
            id="consultation"
            className="home-shell scroll-mt-28 overflow-hidden rounded-[28px] p-4 sm:p-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
          >
            <p className="page-kicker">Free consultation</p>
            <h2 className="page-card-title mt-2">Tell us about your {config.spaceLabel}</h2>
            <p className="page-card-copy mt-2 !text-sm">Takes about two minutes. We reply within 1 hour.</p>
            <div className="mt-4">
              <TallyAttributionIframe
                baseUrl={TALLY_CONSULTATION_FORM_URL}
                title={`${config.eyebrow} consultation`}
                style={{ overflow: 'hidden', display: 'block' }}
              />
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
            {/* Problems */}
            <section className="home-shell page-hero-shell">
              <span className="soft-pill w-fit">Sound familiar?</span>
              <h2 className="page-card-title mt-5 max-w-[24ch]">{config.problemTitle}</h2>
              <ul className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
                {config.problems.map((problem) => (
                  <li className="flex items-start gap-3 rounded-[18px] border border-black/8 bg-white/70 p-4" key={problem}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
                      <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-6 text-black/70">{problem}</span>
                  </li>
                ))}
              </ul>
              <p className="page-card-copy mt-5 !text-sm">
                Acoustic panels reduce echo inside the room. They do not stop sound passing through walls, doors or ceilings.
              </p>
            </section>

            {/* How we fix it */}
            <section className="home-shell page-hero-shell">
              <span className="soft-pill w-fit">How we fix it</span>
              <h2 className="page-card-title mt-5 max-w-[26ch]">{config.approachTitle}</h2>
              <ol className="m-0 mt-6 grid list-none gap-5 p-0 md:grid-cols-3">
                {config.approach.map((item, index) => (
                  <li className="border-t border-black/10 pt-5" key={item.title}>
                    <span className="text-xs font-bold text-[var(--color-brand-orange)]">Step {index + 1}</span>
                    <h3 className="mt-2 mb-0 text-lg font-semibold text-[var(--color-dark-100)]">{item.title}</h3>
                    <p className="mt-2 mb-0 text-sm leading-6 text-[var(--color-gray-100)]">{item.copy}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Proof: real projects */}
            {strip.length > 0 ? (
              <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end justify-between gap-3 px-1">
                  <h2 className="page-card-title">{stripAllMatching ? `Recent ${config.spaceLabel} projects` : 'Recent projects'}</h2>
                  <Link href="/projects" className="page-link">
                    See all projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {strip.map((project) => (
                    <Link
                      key={project._id}
                      href={`/projects/${project.slug.current}`}
                      className="glass-card group overflow-hidden no-underline"
                    >
                      <span className="relative block aspect-[4/3] bg-black/5">
                        <Image
                          src={urlFor(project.mainImage!).width(640).height(480).url()}
                          alt={project.mainImage?.alt || project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 30vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          className="object-cover"
                        />
                      </span>
                      <span className="flex flex-col gap-1 p-4">
                        <span className="text-[17px] font-medium leading-tight text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {project.title}
                        </span>
                        {project.location ? <span className="text-xs text-[var(--color-gray-200)]">{project.location}</span> : null}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Proof: testimonials */}
            {testimonials.length > 0 ? (
              <section className="flex flex-col gap-4">
                <h2 className="page-card-title px-1">What clients say</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {testimonials.slice(0, 3).map((item) => (
                    <figure key={`${item.authorName}-${item.company ?? ''}`} className="glass-card m-0 flex flex-col gap-3 p-5">
                      <span className="text-sm text-[var(--color-brand-orange)]" aria-label={`${item.rating ?? 5} out of 5 stars`}>
                        {'★'.repeat(Math.min(5, Math.max(1, item.rating ?? 5)))}
                      </span>
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

            {estimator ? <div>{estimator}</div> : null}

            {/* Price guide */}
            <section className="rounded-[28px] bg-[var(--color-dark-100)] p-6 text-white sm:p-8">
              <p className="page-kicker !text-white/50">Price guide</p>
              <h2 className="mt-3 mb-0 text-[clamp(24px,2.4vw,32px)] font-medium leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                What it usually costs
              </h2>
              <p className="mt-4 mb-0 max-w-[60ch] text-base leading-7 text-white/75">{config.pricing}</p>
              <ul className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
                {[...config.proof, 'Installs usually take 1–2 days', '1-year warranty on panels'].map((item) => (
                  <li className="flex gap-3 text-sm text-white/80" key={item}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 mb-0 text-sm text-white/55">Your exact price comes after a free consultation. No obligation.</p>
            </section>
          </div>
        </div>
      </div>

      <BrandScroller logos={brandLogos} />

      <div className="page-wrap page-stack !pt-6">
        <FAQ items={config.faq} title="Common questions" subtitle="Quick answers before you get in touch." flush />

        {/* Final CTA */}
        <section className="rounded-[28px] bg-[var(--color-dark-100)] p-6 text-white sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="m-0 text-[clamp(26px,3vw,40px)] font-medium leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Ready to fix the echo?
              </h2>
              <p className="m-0 max-w-[52ch] text-base leading-7 text-white/70">
                Send us a few details or photos of your {config.spaceLabel}. We will recommend what it needs and what it will cost.
              </p>
              <TrustLine dark />
            </div>
            <div className="shrink-0">
              <CtaButtons whatsappText={config.whatsappText} dark />
            </div>
          </div>
        </section>
      </div>

      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </>
  )
}
