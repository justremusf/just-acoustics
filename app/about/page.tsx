import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ShimmerButton from '@/components/ui/shimmer-button'

export const metadata: Metadata = {
  title: 'About',
  description: "Learn about Just Acoustics — Singapore's expert acoustic panel installers for commercial and residential spaces.",
}

export default function AboutPage() {
  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.82fr)] lg:items-end">
        <div className="max-w-[760px]">
          <span className="soft-pill">About</span>
          <h1 className="page-title mt-5">We help spaces sound clearer, calmer, and easier to use.</h1>
          <p className="page-subtitle mt-5">
            Just Acoustics designs and installs acoustic treatment for workplaces, worship spaces,
            hospitality venues, schools, studios, and homes across Singapore.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/contact" className="w-full no-underline sm:w-auto">
              <ShimmerButton className="h-auto w-full px-8 py-4 text-sm sm:w-auto">
                Free Consultation
              </ShimmerButton>
            </Link>
            <Link href="/projects" className="page-link">
              See completed projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { value: '100+', label: 'spaces improved' },
            { value: '4.9★', label: 'Google rating' },
            { value: 'SG', label: 'local install team' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-5 md:p-6">
              <div
                className="text-[var(--color-dark-100)]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  lineHeight: '1',
                  fontWeight: 600,
                }}
              >
                {item.value}
              </div>
              <p className="mt-2 mb-0 text-sm text-[var(--color-gray-100)]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-shell page-hero-shell grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] lg:items-center">
        <div>
          <p className="page-kicker">What We Do</p>
          <h2 className="page-title mt-4 text-[clamp(28px,3.8vw,44px)]">
            Acoustic treatment should improve the whole experience of the room.
          </h2>
          <p className="page-subtitle mt-5 max-w-[54ch]">
            We do not treat acoustics like a generic product drop. We look at how people speak,
            listen, work, gather, worship, or host in the space, then recommend the treatment
            that makes that experience feel better.
          </p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp"
              alt="Installed acoustic panels in a Just Acoustics project"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {[
          {
            title: 'Diagnose first',
            body:
              'We start with the actual problem: echo, poor speech clarity, spill, or listener fatigue. That keeps the recommendation grounded in what the room is doing now.',
          },
          {
            title: 'Match the treatment',
            body:
              'Wall panels, ceiling systems, felt, fabric, and custom finishes are matched to the room, the visual style, and the level of treatment needed.',
          },
          {
            title: 'Install with confidence',
            body:
              'Our work is designed to feel intentional once it is in place, so the room sounds better without looking like an afterthought.',
          },
        ].map((item) => (
          <section key={item.title} className="glass-card p-6 md:p-7">
            <p className="page-kicker">Approach</p>
            <h2
              className="mt-4 mb-0 text-[var(--color-dark-100)]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(22px, 2.2vw, 28px)',
                lineHeight: '1.06',
                fontWeight: 600,
                letterSpacing: '-0.7px',
              }}
            >
              {item.title}
            </h2>
            <p className="page-card-copy mt-4">{item.body}</p>
          </section>
        ))}
      </section>

      <section className="home-shell page-hero-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <div className="max-w-[520px]">
            <span className="soft-pill">Where We Work</span>
            <h2 className="page-title mt-5 text-[clamp(28px,3.8vw,44px)]">
              Built for the kinds of spaces where clear sound matters.
            </h2>
            <p className="page-subtitle mt-5">
              We regularly work across office, hospitality, worship, education, studio, and home
              environments where clarity and comfort directly affect how the space feels.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              'Offices & meeting rooms',
              'Restaurants, cafes & bars',
              'Churches & event spaces',
              'Schools & studios',
            ].map((item) => (
              <div key={item} className="glass-card p-5 md:p-6">
                <p className="m-0 text-base font-semibold text-[var(--color-dark-100)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-shell page-hero-shell flex flex-col gap-5 text-center">
        <span className="soft-pill mx-auto">Let&apos;s Talk</span>
        <h2 className="page-title mx-auto max-w-[14ch] text-[clamp(28px,3.8vw,44px)]">
          Tell us what the room sounds like now and we&apos;ll guide the next step.
        </h2>
        <p className="page-subtitle mx-auto max-w-[58ch]">
          If you have photos, a layout, or a floorplan, send them through. If not, start with the
          problem you are hearing and we&apos;ll take it from there.
        </p>
        <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="w-full no-underline sm:w-auto">
            <ShimmerButton className="h-auto w-full px-8 py-4 text-sm sm:w-auto">
              Free Consultation
            </ShimmerButton>
          </Link>
          <Link href="/services" className="page-link">
            Explore applications <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
