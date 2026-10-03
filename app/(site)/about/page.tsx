import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
import BrandScroller from '@/components/sections/BrandScroller'
import ContactCTA from '@/components/sections/ContactCTA'
import { getAllProjects, getFeaturedTestimonials, getSiteSettings } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/lib/types'
import { canonicalPath } from '@/lib/seo'

const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About Just Acoustics | Acoustic Treatment Singapore',
  description:
    'Our story: a Singapore team with roots in music, renovation and carpentry, making acoustic treatment clearer, simpler and more affordable for offices, worship spaces, restaurants, schools, studios and homes.',
  alternates: { canonical: canonicalPath('/about') },
}

// Real photos from our own jobs only. No renders or stock.
const PHOTOS = {
  hero: { src: '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp', alt: 'Café with ceiling acoustic panels installed by Just Acoustics' },
  install: { src: '/assets/process/installation.webp', alt: 'Our team installing acoustic panels in a church hall' },
  siteVisit: { src: '/assets/process/site-visit.webp', alt: 'Measuring a restaurant during a site visit' },
}

const SPACES = ['Offices', 'Worship spaces', 'Restaurants & cafés', 'Schools', 'Studios', 'Homes']

const BELIEFS = [
  {
    title: 'Sound changes how a room feels.',
    copy: 'How people work, gather and rest depends on what they hear. Fix the sound and the whole room gets easier to be in.',
  },
  {
    title: 'It has to look right, too.',
    copy: 'Treatment should fit a space visually as well as acoustically. If it looks bolted on, the job is not finished.',
  },
  {
    title: 'Good acoustics should not be complicated.',
    copy: 'Clear advice, honest pricing and a tidy install. Professional results without the professional runaround.',
  },
]

function StoryRow({
  kicker,
  title,
  children,
  image,
  reverse = false,
}: {
  kicker: string
  title: string
  children: React.ReactNode
  image: { src: string; alt: string }
  reverse?: boolean
}) {
  return (
    <section className="home-shell page-hero-shell grid gap-6 md:grid-cols-2 md:items-center md:gap-10 md:!p-8">
      <div className={`flex flex-col gap-4 ${reverse ? 'md:order-2' : ''}`}>
        <span className="soft-pill self-start">{kicker}</span>
        <h2 className="page-title !text-[clamp(28px,3.2vw,44px)]">{title}</h2>
        <div className="flex max-w-[56ch] flex-col gap-4">{children}</div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[var(--color-white-200)]">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
      </div>
    </section>
  )
}

export default async function AboutPage() {
  const [projects, testimonials, settings]: [Project[], Awaited<ReturnType<typeof getFeaturedTestimonials>>, Awaited<ReturnType<typeof getSiteSettings>>] =
    await Promise.all([
      getAllProjects().catch(() => []),
      getFeaturedTestimonials().catch(() => []),
      getSiteSettings().catch(() => null),
    ])

  const projectCards = projects.filter((project) => project.mainImage?.asset && project.slug?.current).slice(0, 6)

  return (
    <>
      <div className="page-wrap page-stack">
        {/* Intro */}
        <section className="home-shell page-hero-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:!p-10">
          <div className="flex flex-col gap-5">
            <span className="soft-pill self-start">About us</span>
            <h1 className="page-title">Every space deserves to be heard.</h1>
            <p className="page-subtitle m-0 max-w-[52ch]">
              We are Just Acoustics, a Singapore team helping rooms sound clearer, calmer and easier to use. Since 2022 we have treated offices, worship spaces,
              restaurants, schools, studios and homes, with panels we design and install ourselves.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/projects"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-dark-100)] px-7 text-sm font-semibold text-white no-underline transition-transform duration-200 hover:-translate-y-0.5"
              >
                See our work <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="page-link self-center px-3">
                Talk to us <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] bg-[var(--color-white-200)]">
            <Image src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
        </section>

        {/* Who we are */}
        <StoryRow kicker="Who we are" title="Music, renovation and carpentry, under one roof." image={PHOTOS.install}>
          <p className="page-card-copy m-0">
            Just Acoustics started in 2022 with people from three trades. Music taught us to hear what is wrong with a room. Renovation taught us how spaces in
            Singapore actually get built. Carpentry meant we could make the fix ourselves.
          </p>
          <p className="page-card-copy m-0">
            Put together, that let us develop our own acoustic panels and installation methods, so professional treatment costs less and is simpler to get done
            than it has ever been.
          </p>
        </StoryRow>

        {/* What we do */}
        <StoryRow kicker="What we do" title="We fix echo, noise and unclear speech." image={PHOTOS.siteVisit} reverse>
          <p className="page-card-copy m-0">
            We visit the space, find what is causing the problem and recommend treatment that fits, both acoustically and visually. Then we make the panels and
            install them.
          </p>
          <div className="flex flex-wrap gap-2">
            {SPACES.map((space) => (
              <span key={space} className="page-filter !py-1.5 !text-[13px]">
                {space}
              </span>
            ))}
          </div>
        </StoryRow>

        {/* What we believe */}
        <section className="home-shell page-hero-shell flex flex-col gap-6 md:!p-8">
          <div className="flex flex-col gap-4">
            <span className="soft-pill self-start">What we believe</span>
            <h2 className="page-title !text-[clamp(28px,3.2vw,44px)]">Three things we hold ourselves to.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {BELIEFS.map((belief, index) => (
              <div key={belief.title} className="glass-card flex flex-col gap-3 p-6">
                <span className="text-sm font-semibold text-[var(--color-brand-orange)]">0{index + 1}</span>
                <h3 className="page-card-title m-0">{belief.title}</h3>
                <p className="page-card-copy m-0">{belief.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why we do it */}
        <section className="home-shell page-hero-shell flex flex-col items-start gap-5 md:!px-12 md:!py-14">
          <span className="soft-pill">Why we do it</span>
          <p
            className="m-0 max-w-[24ch] text-[clamp(28px,3.6vw,52px)] font-medium leading-[1.05] tracking-[-1.2px] text-[var(--color-dark-100)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Sound changes how people work, gather and feel in a room. <span className="text-[var(--color-brand-orange)]">Most rooms are never built with that in mind.</span>
          </p>
          <p className="page-card-copy m-0 max-w-[60ch]">
            Too many people put up with meetings they cannot follow, restaurants they cannot talk in and halls where the message gets lost. It is fixable, and it
            should not take a big budget or a complicated process. That is why we started, and why we keep doing it.
          </p>
        </section>

        {/* Our work */}
        {projectCards.length >= 3 && (
          <section className="home-shell page-hero-shell flex flex-col gap-6 md:!p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4">
                <span className="soft-pill self-start">Our work</span>
                <h2 className="page-title !text-[clamp(28px,3.2vw,44px)]">Some of the rooms we have treated.</h2>
              </div>
              <Link href="/projects" className="page-link">
                See all projects <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {projectCards.map((project) => (
                <Link key={project._id} href={`/projects/${project.slug.current}`} className="group flex flex-col gap-2 no-underline">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[var(--color-white-200)]">
                    <Image
                      src={urlFor(project.mainImage!).width(800).height(600).url()}
                      alt={project.mainImage?.alt || project.title}
                      fill
                      sizes="(min-width: 768px) 30vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <span className="px-1 text-[15px] font-semibold text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]">
                    {project.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <BrandScroller logos={settings?.brandLogos} />
      <Testimonials testimonials={testimonials} />
      <ContactCTA />
    </>
  )
}
