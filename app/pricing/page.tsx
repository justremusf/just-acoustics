import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, MessageSquare, Ruler, Wrench, Search, MapPin, LayoutDashboard, Box, Package, Hammer } from 'lucide-react'
import FAQ from '@/components/sections/FAQ'
import ContactCTA from '@/components/sections/ContactCTA'
import FadeUp from '@/components/ui/FadeUp'
import PricingRangeAccordion, { type PricingRange } from './PricingRangeAccordion'
import { getAllShopItems } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { ShopItem } from '@/lib/types'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Pricing - Acoustic Treatment Costs in Singapore',
  description:
    'Transparent acoustic treatment pricing ranges for offices, home studios, churches, schools, and restaurants in Singapore.',
  alternates: { canonical: canonicalPath('/pricing') },
}

const PRICING_RANGES: PricingRange[] = [
  {
    space: 'Office',
    range: 'S$1,000 - S$3,000',
    detail: 'For regular office rooms, meeting rooms, call rooms, and smaller collaboration spaces.',
    note: 'Best for clearer meetings, less echo, and better speech clarity.',
    image: '/assets/pricing/office.jpg'
  },
  {
    space: 'Home studio',
    range: 'S$1,000 - S$3,000',
    detail: 'For HDB rooms, condo rooms, bedrooms, listening rooms, and creator setups.',
    note: 'Can include acoustic panels, bass traps, and self-install options when useful.',
    image: '/assets/pricing/home-studio.jpg'
  },
  {
    space: 'Church',
    range: 'From S$1,500',
    detail: 'Smaller rooms start around S$1,500. Many hall projects range from S$4,000 - S$6,000+.',
    note: 'Scoped around speech intelligibility, music clarity, ceiling height, and install access.',
    image: '/assets/pricing/church.jpg'
  },
  {
    space: 'School',
    range: 'From S$1,000',
    detail: 'For classrooms, tuition rooms, learning spaces, and multipurpose education areas.',
    note: 'Larger rooms or multi-room rollouts are quoted based on room count and treatment scope.',
    image: '/assets/pricing/school.jpg'
  },
  {
    space: 'Restaurant',
    range: 'S$2,000 - S$6,000',
    detail: 'For cafes, restaurants, bars, and hospitality spaces where conversation comfort matters.',
    note: 'Can include ceiling panels, colour-matched wall panels, or custom printed finishes.',
    image: '/assets/pricing/restaurant.jpg'
  },
  {
    space: 'Other',
    range: 'Custom Quote',
    detail: 'If your space is not listed, don\'t worry, we can still treat it.',
    note: 'Just contact us for a quote, and we can get that done for you.',
    image: '/assets/webflow/6963a1ddcb30aae76c452853_Image from TinyPNG.webp'
  }
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
  { text: 'Review of your photos, videos, floor plan, or room dimensions', icon: Search },
  { text: 'Site visit where needed for accurate scope', icon: MapPin },
  { text: 'Treatment recommendation matched to your space type', icon: LayoutDashboard },
  { text: '3D visualisation or layout guidance where useful', icon: Box },
  { text: 'Supply of acoustic panels and treatment materials', icon: Package },
  { text: 'Licensed installation team for fitted projects', icon: Hammer },
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

export default async function PricingPage() {
  const shopItems = await getAllShopItems().catch(() => [])

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
          <section className="home-shell page-hero-shell p-[clamp(26px,4vw,42px)]">
            <div className="mb-10 flex max-w-[760px] flex-col gap-5">
              <span className="soft-pill w-fit">Cost factors</span>
              <h2 className="page-title text-[clamp(26px,3.2vw,38px)]">
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
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,165,0,0.12)] text-[var(--color-brand-orange)] transition-colors duration-300 group-hover:bg-[var(--color-brand-orange)] group-hover:text-white md:h-40 md:w-40 md:rounded-[42px]">
                      <Icon className="h-6 w-6 md:h-24 md:w-24" aria-hidden="true" />
                    </span>
                    <div>
                      <h3
                        className="m-0 max-w-[12ch] text-[clamp(22px,2.2vw,30px)] font-medium leading-[1.02] text-[var(--color-dark-100)] transition-colors duration-300 group-hover:text-[var(--color-brand-orange)]"
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
          <section className="home-shell page-hero-shell p-[clamp(26px,4vw,42px)]">
            <div className="mb-10 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="soft-pill w-fit">A La Carte Options</span>
                <h2 className="page-title text-[clamp(28px,3.5vw,40px)]">
                  Shop Acoustic Panels
                </h2>
                <p className="page-subtitle text-base">
                  Looking for individual panels? Here are some of our standard products to give you an idea of unit rates.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {shopItems.slice(0, 4).map((product: ShopItem) => (
                <Link
                  href={`/shop/${product.slug.current}`}
                  key={product._id}
                  className="group flex flex-col gap-4 no-underline"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[var(--color-white-200)]">
                    {product.mainImage?.asset._ref ? (
                      <Image
                        src={urlFor(product.mainImage).width(500).height(500).url()}
                        alt={product.mainImage.alt || product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="m-0 text-[16px] font-bold text-[var(--color-dark-100)]">{product.title}</h3>
                    <p className="m-0 mt-1 text-sm text-[var(--color-gray-100)]">From S${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeUp>

        <FadeUp>
          <section className="home-shell overflow-hidden rounded-[32px] p-0">
            <div
              className="grid gap-12 bg-cover bg-center p-[clamp(26px,4vw,42px)]"
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
              <div className="glass-card flex flex-col justify-between gap-12 bg-white/92 p-[clamp(26px,4vw,42px)]">
                <div>
                  <p className="page-kicker text-[var(--color-brand-orange)]">Every project includes</p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {INCLUDED.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div 
                          key={index} 
                          className="group flex flex-col gap-4 rounded-2xl border border-black/5 bg-white/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,165,0,0.1)] text-[var(--color-brand-orange)] transition-colors duration-300 group-hover:bg-[var(--color-brand-orange)] group-hover:text-white">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-[15px] font-medium leading-relaxed text-[var(--color-dark-100)]">
                            {item.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <Link href="/contact" className="page-cta mx-auto w-fit">
                  Get Free Consultation
                </Link>
              </div>
            </div>
          </section>
        </FadeUp>

      </div>

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
