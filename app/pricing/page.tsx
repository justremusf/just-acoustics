import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, MessageSquare, Ruler, Wrench } from 'lucide-react'
import FAQ from '@/components/sections/FAQ'
import ContactCTA from '@/components/sections/ContactCTA'
import FadeUp from '@/components/ui/FadeUp'
import PricingRangeAccordion, { type PricingRange } from './PricingRangeAccordion'
import { landingVslConfig } from '@/data/vslConfig'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Pricing - Acoustic Treatment Costs in Singapore',
  description:
    'Transparent acoustic treatment pricing ranges for offices, home studios, churches, schools, and restaurants in Singapore.',
  alternates: { canonical: canonicalPath('/pricing') },
}

const INTRO_IMAGE = '/assets/webflow/696a459f805f921445e4427e_9.avif'

const InteractiveVSL = dynamic(() => import('@/components/InteractiveVSL'), {
  loading: () => <div className="py-7 md:py-9" aria-hidden="true" />,
})

const PRICING_RANGES: PricingRange[] = [
  {
    space: 'Office',
    range: 'S$1,000 - S$3,000',
    detail: 'For regular office rooms, meeting rooms, call rooms, and smaller collaboration spaces.',
    note: 'Best for clearer meetings, less echo, and better speech clarity.',
  },
  {
    space: 'Home studio',
    range: 'S$1,000 - S$3,000',
    detail: 'For HDB rooms, condo rooms, bedrooms, listening rooms, and creator setups.',
    note: 'Can include acoustic panels, bass traps, and self-install options when useful.',
  },
  {
    space: 'Church',
    range: 'From S$1,500',
    detail: 'Smaller rooms start around S$1,500. Many hall projects range from S$4,000 - S$6,000+.',
    note: 'Scoped around speech intelligibility, music clarity, ceiling height, and install access.',
  },
  {
    space: 'School',
    range: 'From S$1,000',
    detail: 'For classrooms, tuition rooms, learning spaces, and multipurpose education areas.',
    note: 'Larger rooms or multi-room rollouts are quoted based on room count and treatment scope.',
  },
  {
    space: 'Restaurant',
    range: 'S$2,000 - S$6,000',
    detail: 'For cafes, restaurants, bars, and hospitality spaces where conversation comfort matters.',
    note: 'Can include ceiling panels, colour-matched wall panels, or custom printed finishes.',
  },
]

const COST_FACTORS = [
  {
    title: 'Room size and ceiling height',
    body: 'Bigger rooms and taller ceilings usually need more absorption area to reduce echo properly.',
    icon: Ruler,
  },
  {
    title: 'Wall and ceiling surfaces',
    body: 'Glass, concrete, tile, and bare plaster reflect more sound, so the treatment layout needs to work harder.',
    icon: FileText,
  },
  {
    title: 'Panel type and finish',
    body: 'Standard fabric panels are the simplest. Custom prints, colour matching, bass traps, and ceiling systems add cost.',
    icon: Wrench,
  },
  {
    title: 'Install access and schedule',
    body: 'After-hours work, occupied spaces, high ceilings, and complex mounting conditions affect labour and timing.',
    icon: MessageSquare,
  },
]

const INCLUDED = [
  'Review of your photos, videos, floor plan, or room dimensions',
  'Site visit where needed for accurate scope',
  'Treatment recommendation matched to your space type',
  '3D visualisation or layout guidance where useful',
  'Supply of acoustic panels and treatment materials',
  'Licensed installation team for fitted projects',
]

const PRICING_FAQS = [
  {
    q: 'Can you give me a price before a site visit?',
    a: 'Yes. Send photos, videos, dimensions, and the type of space you have. We can usually give an indicative range first, then confirm the final quote after checking the details.',
  },
  {
    q: 'Why are the ranges not fixed packages?',
    a: 'Acoustic treatment depends on room size, ceiling height, reflective surfaces, treatment type, and installation access. A fixed package can be useful for small rooms, but most spaces need a quote matched to the room.',
  },
  {
    q: 'Do custom colours or printed panels cost more?',
    a: 'Usually, yes. Standard fabric finishes are the most cost-effective. Colour matching, custom printed panels, non-standard sizes, and specialised ceiling treatments add production cost.',
  },
  {
    q: 'What if my space is not an office, studio, church, school, or restaurant?',
    a: 'That is fine. Other spaces are quoted as custom projects. Smaller spaces usually start from around S$1,000+, with larger or more complex spaces priced after review.',
  },
  {
    q: 'Is this soundproofing?',
    a: 'No. We specialise in acoustic treatment, which improves how a room sounds inside by reducing echo and reflections. Soundproofing is about blocking sound between spaces.',
  },
  {
    q: 'How do I get a more accurate quote?',
    a: 'Send us the room dimensions, a few photos or videos, the space type, and what feels wrong with the sound. We will recommend the next step and give you a clearer range.',
  },
]

export default function PricingPage() {
  return (
    <>
      <div className="page-wrap page-stack gap-10 md:gap-14">
        <section className="home-shell page-hero-shell flex flex-col gap-7 p-[clamp(30px,4.6vw,52px)]">
          <span className="soft-pill">Acoustic Treatment Pricing</span>
          <h1 className="page-title max-w-[17ch]">
            How Much Will Acoustic Treatment Cost?
          </h1>
          <p className="page-subtitle max-w-[64ch]">
            Let us make the numbers clearer. Your price depends on the room, the treatment type, and how the space is used.
          </p>
        </section>

        <FadeUp>
          <section className="home-shell page-hero-shell grid gap-12 p-[clamp(26px,4vw,42px)] lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
            <div className="relative min-h-[280px] overflow-hidden rounded-[24px] bg-[var(--color-white-200)] sm:min-h-[360px] lg:max-w-[520px]">
              <Image
                src={INTRO_IMAGE}
                alt="Finished acoustic treatment in an interior space"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-5">
              <span className="soft-pill w-fit">Transparent ranges</span>
              <h2 className="page-title text-[clamp(30px,3.8vw,48px)]">
                Pick your space type
              </h2>
              <p className="page-subtitle">
                Acoustic treatment is not priced like a shelf product because every room reflects sound differently. A small office, a restaurant, and a church hall can all need very different amounts of treatment.
              </p>
              <p className="page-subtitle">
                The ranges below give you a practical starting point before you request a quote, so you know what to expect before committing.
              </p>
            </div>
          </section>
        </FadeUp>

        <FadeUp>
          <section className="home-shell page-hero-shell p-[clamp(26px,4vw,42px)]">
            <div className="mb-10 flex max-w-[760px] flex-col gap-5">
              <span className="soft-pill w-fit">Cost factors</span>
              <h2 className="page-title text-[clamp(30px,3.8vw,48px)]">
                Factors that influence cost
              </h2>
              <p className="page-subtitle">
                The final quote is driven by four practical factors. These decide how much treatment you need and how complex the installation will be.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {COST_FACTORS.map((factor) => {
                const Icon = factor.icon

                return (
                  <div
                    key={factor.title}
                    className="glass-card group relative flex min-h-[260px] flex-col items-start justify-center gap-6 overflow-hidden p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset] md:p-9 lg:min-h-[290px]"
                  >
                    <span className="flex h-32 w-32 items-center justify-center rounded-[34px] bg-[rgba(255,165,0,0.12)] text-[var(--color-brand-orange)] transition-colors duration-300 group-hover:bg-[var(--color-brand-orange)] group-hover:text-white md:h-40 md:w-40 md:rounded-[42px]">
                      <Icon className="h-20 w-20 md:h-24 md:w-24" aria-hidden="true" />
                    </span>
                    <div>
                      <h3
                        className="m-0 max-w-[12ch] text-[clamp(28px,2.8vw,40px)] font-medium leading-[1.02] text-[var(--color-dark-100)] transition-colors duration-300 group-hover:text-[var(--color-brand-orange)]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {factor.title}
                      </h3>
                      <p className="mt-4 mb-0 max-w-[42ch] text-lg leading-8 text-[var(--color-gray-100)]">{factor.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </FadeUp>

        <FadeUp>
          <section id="pricing-ranges" className="home-shell page-hero-shell p-[clamp(26px,4vw,42px)]">
            <div className="mb-8">
              <p className="page-kicker text-[var(--color-brand-orange)]">Typical pricing</p>
              <h2 className="page-card-title">Price ranges by space type</h2>
            </div>

            <PricingRangeAccordion items={PRICING_RANGES} />
          </section>
        </FadeUp>

        <FadeUp>
          <section className="home-shell overflow-hidden rounded-[32px] p-0">
            <div
              className="grid gap-12 bg-cover bg-center p-8 md:p-14 lg:p-16"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, rgba(1,1,1,0.82), rgba(1,1,1,0.58)), url('/assets/webflow/696a4efbb798931f99abbc38_1.avif')",
              }}
            >
              <div className="flex max-w-[760px] flex-col justify-center">
                <p className="page-kicker text-[var(--color-brand-orange)]">Quote clarity</p>
                <h2 className="mt-4 mb-0 max-w-[14ch] text-white" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(38px,5vw,64px)', lineHeight: '0.98', fontWeight: 500, letterSpacing: '-1.4px' }}>
                  Contact us for an accurate quote
                </h2>
                <p className="mt-6 mb-0 max-w-[58ch] text-base leading-8 text-white/78">
                  Send your room dimensions, photos, or floor plan. We will review the space and tell you what range makes sense before you move forward.
                </p>
              </div>
              <div className="glass-card flex flex-col justify-between gap-12 bg-white/92 p-9 md:p-12 lg:p-14">
                <div>
                  <p className="page-kicker text-[var(--color-brand-orange)]">Every project includes</p>
                  <div className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2">
                    {INCLUDED.map((item) => (
                      <div key={item} className="flex gap-4 text-base leading-7 text-[var(--color-dark-100)] md:text-lg md:leading-8">
                        <span className="mt-0.5 text-lg font-bold text-[var(--color-brand-orange)] md:text-xl">+</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/contact" className="page-cta w-fit">
                  Get Free Consultation
                </Link>
              </div>
            </div>
          </section>
        </FadeUp>

      </div>

      <FadeUp>
        <InteractiveVSL config={landingVslConfig} pageLocation="/pricing" />
      </FadeUp>

      <FadeUp>
        <FAQ
          items={PRICING_FAQS}
          title="Pricing Questions, Answered"
          subtitle=""
        />
      </FadeUp>

      <FadeUp>
        <ContactCTA />
      </FadeUp>
    </>
  )
}
