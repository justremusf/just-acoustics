import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ShimmerButton from '@/components/ui/shimmer-button'

export const metadata: Metadata = {
  title: 'About',
  description: "Learn about Just Acoustics — Singapore's acoustic treatment team for offices, worship spaces, hospitality venues, studios, and homes.",
}

export default function AboutPage() {
  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div className="max-w-[720px]">
          <span className="soft-pill">About</span>
          <h1 className="page-title mt-5 text-[clamp(30px,3.4vw,40px)] leading-[1.02] tracking-[-1px]">
            Our Story
          </h1>
          <div className="mt-5 max-w-[60ch] space-y-4">
            <p className="page-subtitle m-0">
              Just Acoustics helps spaces sound clearer, calmer, and easier to use. Since 2022, we&apos;ve drawn on our roots in music, renovations, and carpentry to develop our own acoustic products and installation methods, making professional treatment more cost-effective and straightforward than it&apos;s ever been.
            </p>
            <p className="page-subtitle m-0">
              We work across offices, worship spaces, restaurants, schools, studios, and homes all over Singapore. Solving echo, noise, and speech clarity problems in a way that actually fits the space acoustically and visually. Because sound changes how people work, gather, and feel in a room, and every space deserves to be heard.
            </p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6964fb659de42387a7d78754_Image%20from%20TinyPNG%20(4).avif"
              alt="Just Acoustics project installation"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="home-shell page-hero-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="max-w-[760px]">
          <h1 className="page-title text-[clamp(34px,4vw,46px)] leading-[1.02] tracking-[-1.4px]">
            We help spaces sound clearer, calmer, and easier to use.
          </h1>
        </div>

        <div className="grid gap-4">
          <div className="glass-card p-6">
            <p
              className="m-0 text-[var(--color-dark-100)]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(30px, 3vw, 42px)',
                lineHeight: '1',
                fontWeight: 600,
                letterSpacing: '-1px',
              }}
            >
              100+
            </p>
            <p className="mt-2 mb-0 text-sm text-[var(--color-gray-100)]">projects completed</p>
          </div>

          <div className="glass-card p-6">
            <p
              className="m-0 text-[var(--color-dark-100)]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(24px, 2.4vw, 34px)',
                lineHeight: '1',
                fontWeight: 600,
                letterSpacing: '-0.8px',
              }}
            >
              4.9★
            </p>
            <p className="mt-2 mb-0 text-sm text-[var(--color-gray-100)]">Google rating</p>
          </div>
        </div>
      </section>

      <section className="home-shell page-hero-shell flex flex-col items-center gap-5 text-center">
        <span className="soft-pill mx-auto">Let&apos;s Get Started</span>
        <h2 className="page-title mx-auto max-w-[18ch] self-center text-center text-[clamp(26px,3vw,40px)]">
          Enough about us, let&apos;s get started on your space.
        </h2>
        <div className="mt-3">
          <Link href="/contact" className="inline-block no-underline">
            <ShimmerButton className="h-auto px-8 py-4 text-sm">
              Get a free consultation now.
            </ShimmerButton>
          </Link>
        </div>
      </section>
    </div>
  )
}
