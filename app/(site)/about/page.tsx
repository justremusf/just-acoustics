import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowRight, ArrowUpRight, Hammer, Home, Music2 } from 'lucide-react'
import BrandScroller from '@/components/sections/BrandScroller'
import ContactCTA from '@/components/sections/ContactCTA'
import CountUp from '@/components/about/CountUp'
import BeforeAfterSlider from '@/components/about/BeforeAfterSlider'
import { getAllProjects, getAllShopItems, getFeaturedTestimonials, getSiteSettings } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project, ShopItem } from '@/lib/types'
import { canonicalPath } from '@/lib/seo'

const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About Just Acoustics | Acoustic Treatment Singapore',
  description:
    "Meet Just Acoustics: a Singapore team with roots in music, renovation and carpentry, designing, making and installing acoustic treatment for offices, worship spaces, restaurants, schools, studios and homes.",
  alternates: { canonical: canonicalPath('/about') },
}

const FOUNDED = 2022
const SPACE_TYPES = ['Offices', 'Worship spaces', 'Restaurants', 'Schools', 'Studios', 'Homes']
const PRODUCT_LINES = new Set(['flexi-panel', 'bass-trap', 'gobo', 'pet-panel', 'custom-print-panels'])

// Used only to fill the hero stack when Sanity has fewer than three project photos.
const FALLBACK_HERO_PHOTOS = [
  { src: '/assets/studio-lander/hero-studio.jpg', alt: 'Studio treated with acoustic panels' },
  { src: '/assets/studio-lander/process-install.jpg', alt: 'Installing acoustic panels' },
  { src: '/assets/studio-lander/solution-condo.jpg', alt: 'Living room with acoustic panels' },
]

const ROOTS = [
  {
    icon: Music2,
    trade: 'Music',
    title: 'We know what good sound feels like.',
    copy: 'Our roots are in music, so we hear the problems most people only feel: the harsh echo, the muddy bass, the meeting where nobody can follow.',
    image: { src: '/assets/studio-lander/hero-studio.jpg', alt: 'A treated music studio' },
  },
  {
    icon: Home,
    trade: 'Renovation',
    title: 'We know how real spaces get built.',
    copy: 'Glass, concrete, tile. Singapore rooms look great and sound terrible. Renovation taught us to fix that without fighting the design or the timeline.',
    image: { src: '/assets/studio-lander/process-recce.jpg', alt: 'Site visit in a room before treatment' },
  },
  {
    icon: Hammer,
    trade: 'Carpentry',
    title: 'We build it ourselves.',
    copy: 'We design our own panels and installation methods. Cutting out the middle steps is how we make professional treatment cost less and go up faster.',
    image: { src: '/assets/studio-lander/process-install.jpg', alt: 'Acoustic panels being installed' },
  },
]

const BELIEFS = [
  { title: 'Sound changes how a room feels.', copy: 'How people work, gather and rest depends on what they hear. Fix the sound and the whole room gets easier to be in.' },
  { title: 'It has to look right, too.', copy: 'Treatment should fit the space visually as well as acoustically. If it looks bolted on, we have not finished the job.' },
  { title: 'Pro results, without the pro hassle.', copy: 'Our own products and methods keep treatment straightforward and cost-effective, from the first site visit to the last panel.' },
]

function projectPhotos(projects: Project[]) {
  return projects
    .filter((project) => project.mainImage?.asset && project.slug?.current)
    .map((project) => ({
      src: urlFor(project.mainImage!).width(900).height(675).url(),
      alt: project.mainImage?.alt || project.title,
      title: project.title,
      location: project.location || 'Singapore',
      href: `/projects/${project.slug.current}`,
    }))
}

function EqualiserBars({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-end gap-[3px] ${className}`}>
      {Array.from({ length: 48 }).map((_, index) => (
        <span
          key={index}
          className="about-eq-bar w-full rounded-full bg-[var(--color-brand-orange)]"
          style={{ '--eq-delay': `${(index * 137) % 1100}ms`, '--eq-peak': `${30 + ((index * 53) % 70)}%` } as CSSProperties}
        />
      ))}
    </div>
  )
}

export default async function AboutPage() {
  const [projects, products, testimonials, settings]: [Project[], ShopItem[], Awaited<ReturnType<typeof getFeaturedTestimonials>>, Awaited<ReturnType<typeof getSiteSettings>>] =
    await Promise.all([
      getAllProjects().catch(() => []),
      getAllShopItems().catch(() => []),
      getFeaturedTestimonials().catch(() => []),
      getSiteSettings().catch(() => null),
    ])

  const photos = projectPhotos(projects)
  const heroPhotos = [...photos, ...FALLBACK_HERO_PHOTOS].slice(0, 3)
  // Two marquee rows only look right with enough real photos to fill them.
  const showWall = photos.length >= 6
  const wallTop = photos.slice(0, Math.ceil(photos.length / 2))
  const wallBottom = photos.slice(Math.ceil(photos.length / 2))
  const productCards = products.filter((item) => item.productLine && PRODUCT_LINES.has(item.productLine) && item.mainImage?.asset).slice(0, 4)
  const projectCount = projects.length

  const stats = [
    { value: FOUNDED, label: 'Founded', plain: true },
    ...(projectCount >= 10 ? [{ value: projectCount, suffix: '+', label: 'Projects completed' }] : []),
    { value: SPACE_TYPES.length, label: 'Types of space we treat' },
    { value: 3, label: 'In-house brands' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-4 pb-6 pt-8 md:px-5 md:pt-10">
        <div className="relative mx-auto max-w-[1580px] overflow-hidden rounded-[30px] bg-[var(--color-dark-100)] text-white shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,165,0,0.22),transparent_65%)]" />
          <div className="relative z-10 grid gap-10 px-6 pb-24 pt-12 md:px-12 md:pb-32 md:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
            <div className="max-w-[640px]">
              <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                About Just Acoustics
              </span>
              <h1
                className="mb-0 mt-6 text-[clamp(42px,6.4vw,88px)] font-medium leading-[0.95] tracking-[-2.5px] text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                We make rooms <span className="text-[var(--color-brand-orange)]">easier</span> to be in.
              </h1>
              <p className="mb-0 mt-6 max-w-[52ch] text-[17px] leading-7 text-white/75">
                Since {FOUNDED}, we have drawn on our roots in music, renovation and carpentry to design, make and install acoustic treatment across Singapore. Clearer speech, calmer rooms, and panels that actually look good.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-brand-orange)] px-7 text-sm font-semibold text-[var(--color-dark-100)] no-underline transition-transform duration-200 hover:-translate-y-0.5"
                >
                  See our work <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white no-underline transition-colors duration-200 hover:bg-white/10"
                >
                  Free consultation
                </Link>
              </div>
            </div>

            {/* Fanned photo stack */}
            <div className="group relative mx-auto h-[290px] w-full max-w-[520px] sm:h-[420px]">
              {heroPhotos.map((photo, index) => {
                const transforms = [
                  'left-0 top-10 -rotate-[8deg] group-hover:-translate-x-6 group-hover:-rotate-[12deg]',
                  'right-0 top-0 rotate-[7deg] group-hover:translate-x-6 group-hover:rotate-[11deg]',
                  'left-1/2 top-16 -translate-x-1/2 rotate-[-1deg] group-hover:-translate-y-3 group-hover:rotate-0',
                ]
                return (
                  <div
                    key={photo.src}
                    className={`absolute aspect-[4/5] w-[56%] overflow-hidden rounded-[22px] border-[6px] border-white/95 shadow-[0_30px_60px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${transforms[index]}`}
                    style={{ zIndex: index === 2 ? 3 : index + 1 }}
                  >
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 26vw, 56vw" priority className="object-cover" />
                  </div>
                )
              })}
            </div>
          </div>

          <EqualiserBars className="absolute inset-x-6 bottom-0 h-14 opacity-80 md:inset-x-12 md:h-20" />
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-6 md:px-5">
        <div className={`mx-auto grid max-w-[1580px] gap-3 md:gap-4 ${stats.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card flex flex-col gap-1 p-4 md:p-7">
              <span className="text-[clamp(28px,4.4vw,60px)] font-medium leading-none tracking-[-2px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {'plain' in stat ? stat.value : <CountUp value={stat.value} suffix={'suffix' in stat ? stat.suffix : ''} />}
              </span>
              <span className="text-xs leading-snug text-[var(--color-gray-100)] md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Roots */}
      <section className="px-4 py-10 md:px-5 md:py-14">
        <div className="mx-auto max-w-[1580px]">
          <div className="mb-8 grid gap-4 md:mb-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
            <div>
              <span className="soft-pill">Our story</span>
              <h2 className="home-heading mt-4 max-w-[14ch] text-[var(--color-dark-100)]">Three trades. One problem.</h2>
            </div>
            <p className="home-copy m-0 max-w-[52ch] md:justify-self-end">
              Most rooms are built for how they look, not how they sound. We came at that problem from three directions, and everything we make and install still draws on all three.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {ROOTS.map((root, index) => {
              const Icon = root.icon
              return (
                <article key={root.trade} className="group flex flex-col overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={root.image.src}
                      alt={root.image.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-4 left-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-[var(--color-dark-100)]">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      0{index + 1} · {root.trade}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 p-6">
                    <h3 className="m-0 text-[clamp(22px,1.9vw,28px)] font-medium leading-[1.05] tracking-[-0.6px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {root.title}
                    </h3>
                    <p className="page-card-copy m-0">{root.copy}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className="px-4 py-10 md:px-5 md:py-14">
        <div className="mx-auto grid max-w-[1580px] gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <span className="soft-pill">What we do</span>
            <h2 className="home-heading mt-4 max-w-[12ch] text-[var(--color-dark-100)]">Same room. Different feeling.</h2>
            <p className="home-copy mb-0 mt-4 max-w-[44ch]">
              Drag the slider. Bare walls bounce sound around until everything blurs together. The right panels in the right places soak it up, so voices are clear and the room feels calm.
            </p>
          </div>
          <BeforeAfterSlider
            before={{ src: '/assets/studio-lander/before-room.jpg', alt: 'Room before acoustic treatment, with bare walls' }}
            after={{ src: '/assets/studio-lander/after-room.jpg', alt: 'The same room after acoustic panels were installed' }}
          />
        </div>
      </section>

      {/* Beliefs */}
      <section className="px-4 py-10 md:px-5 md:py-14">
        <div className="relative mx-auto max-w-[1580px] overflow-hidden rounded-[30px] bg-[var(--color-dark-100)] px-6 py-12 text-white md:px-12 md:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(255,165,0,0.25),transparent_65%)]" />
          <p className="page-kicker relative !text-[var(--color-brand-orange)]">What we believe</p>
          <div className="relative mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
            {BELIEFS.map((belief, index) => (
              <div key={belief.title} className="flex flex-col gap-3 border-t border-white/15 pt-6">
                <span className="text-[56px] font-medium leading-none tracking-[-2px] text-white/20" style={{ fontFamily: 'var(--font-heading)' }}>
                  0{index + 1}
                </span>
                <h3 className="m-0 text-[clamp(24px,2.2vw,32px)] font-medium leading-[1.05] tracking-[-0.8px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {belief.title}
                </h3>
                <p className="m-0 text-[15px] leading-7 text-white/70">{belief.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      {productCards.length > 0 && (
        <section className="px-4 py-10 md:px-5 md:py-14">
          <div className="mx-auto max-w-[1580px]">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="soft-pill">Made by us</span>
                <h2 className="home-heading mt-4 max-w-[16ch] text-[var(--color-dark-100)]">We design our own panels.</h2>
              </div>
              <Link href="/shop" className="page-link">
                Browse the shop <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {productCards.map((item) => (
                <Link key={item._id} href={`/shop/${item.slug.current}`} className="group flex flex-col gap-3 no-underline">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[var(--color-white-200)] shadow-[0_18px_44px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(0,0,0,0.12)]">
                    <Image
                      src={urlFor(item.mainImage!).width(700).height(875).url()}
                      alt={item.mainImage?.alt || item.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="flex items-center justify-between gap-2 px-1 text-[17px] font-medium tracking-[-0.3px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                    <ArrowUpRight size={16} aria-hidden="true" className="shrink-0" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project wall */}
      {showWall && (
      <section className="py-10 md:py-14">
        <div className="mx-auto mb-8 flex max-w-[1580px] flex-col gap-4 px-4 md:flex-row md:items-end md:justify-between md:px-5">
          <div>
            <span className="soft-pill">Our work</span>
            <h2 className="home-heading mt-4 max-w-[16ch] text-[var(--color-dark-100)]">Rooms we have fixed.</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {SPACE_TYPES.map((space) => (
                <span key={space} className="page-filter !py-1.5 !text-[13px]">
                  {space}
                </span>
              ))}
            </div>
          </div>
          <Link href="/projects" className="page-link">
            See every project <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="about-wall flex flex-col gap-4">
          {[wallTop, wallBottom].map((row, rowIndex) =>
            row.length > 0 ? (
              <div key={rowIndex} className="brand-scroll-wrap">
                <div className={`about-wall-track flex w-max gap-4 ${rowIndex === 1 ? 'about-wall-reverse' : ''}`}>
                  {[...row, ...row].map((photo, index) => (
                    <Link
                      key={`${photo.src}-${index}`}
                      href={photo.href}
                      aria-hidden={index >= row.length}
                      tabIndex={index >= row.length ? -1 : undefined}
                      className="group relative block aspect-[4/3] w-[260px] shrink-0 overflow-hidden rounded-[22px] no-underline sm:w-[360px]"
                    >
                      <Image src={photo.src} alt={photo.alt} fill sizes="360px" className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                      <div className="absolute inset-x-4 bottom-4 text-white">
                        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{photo.location}</p>
                        <p className="m-0 mt-1 text-[18px] font-medium leading-tight tracking-[-0.3px]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {photo.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>
      )}

      {/* Clients */}
      <section className="px-4 pt-6 md:px-5">
        <p className="page-kicker mx-auto max-w-[1580px] px-1 text-center">Trusted by teams across Singapore</p>
      </section>
      <BrandScroller logos={settings?.brandLogos} />

      <Testimonials testimonials={testimonials} />

      <ContactCTA />
    </div>
  )
}
