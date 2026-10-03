import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import ContactCTA from '@/components/sections/ContactCTA'
import { canonicalPath } from '@/lib/seo'

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
}

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

export default function AboutPage() {
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

        {/* Our story */}
        <section className="home-shell page-hero-shell grid gap-8 md:!p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="soft-pill self-start">Our story</span>
              <h2 className="page-title !text-[clamp(28px,3.2vw,44px)]">Music, renovation and carpentry, under one roof.</h2>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="page-card-title m-0 !text-[20px]">Who we are</h3>
              <p className="page-card-copy m-0 max-w-[60ch]">
                Just Acoustics started in 2022 with people from three trades. Music taught us to hear what is wrong with a room. Renovation taught us how spaces in
                Singapore actually get built. Carpentry meant we could make the fix ourselves, so we developed our own panels and installation methods to make
                professional treatment cost less and simpler to get done.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="page-card-title m-0 !text-[20px]">What we do</h3>
              <p className="page-card-copy m-0 max-w-[60ch]">
                We fix echo, noise and unclear speech in offices, worship spaces, restaurants, schools, studios and homes. We visit the space, find what is causing
                the problem, recommend treatment that fits acoustically and visually, then make and install it.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="page-card-title m-0 !text-[20px]">Why we do it</h3>
              <p className="page-card-copy m-0 max-w-[60ch]">
                Sound changes how people work, gather and feel in a room, yet most rooms are never built with that in mind. Too many people put up with meetings
                they cannot follow and halls where the message gets lost. It is fixable, and it should not take a big budget or a complicated process.
              </p>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[24px] bg-[var(--color-white-200)]">
            <Image src={PHOTOS.install.src} alt={PHOTOS.install.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          </div>
        </section>

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

      </div>

      <ContactCTA />
    </>
  )
}
