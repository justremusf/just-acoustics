import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import WhyChooseUs from '@/components/sections/WhyChooseUs'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Just Acoustics — Singapore\'s expert acoustic panel installers for commercial and residential spaces.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-[var(--color-dark-100)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <span className="inline-block border border-white/30 text-white rounded-[100px] px-4 py-2 text-sm mb-6">
            About Us
          </span>
          <h1
            className="text-white m-0 mb-6"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px, 5vw, var(--fs-h2))',
              lineHeight: '112%',
              fontWeight: 500,
              letterSpacing: '-1.28px',
            }}
          >
            We are Just Acoustics
          </h1>
          <p className="text-white/70 text-base m-0 max-w-xl leading-relaxed">
            Experts in acoustics. We quietly transform noisy spaces into places where people want to be.
          </p>
        </div>
      </section>

      {/* Our approach */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[344px_1fr] gap-[30px] items-center">
            <div className="flex flex-col gap-2.5">
              <h2
                className="text-[var(--color-dark-100)] m-0"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 3.5vw, var(--fs-h3))',
                  lineHeight: '124%',
                  fontWeight: 500,
                  letterSpacing: '-1.04px',
                }}
              >
                Our Approach
              </h2>
              <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm self-start">
                Since 2019
              </span>
            </div>
            <div className="text-left">
              <p className="text-[var(--color-gray-100)] text-base mb-4 leading-relaxed">
                <strong>What we do.</strong> Unwanted noise hurts customer comfort and business performance, so we fix acoustics in hospitality, offices, education and healthcare spaces across Singapore. We focus on echo and noise control, using custom-made acoustic panels that deliver strong results whilst fitting in with the project requirements.
              </p>
              <p className="text-[var(--color-gray-100)] text-base mb-4 leading-relaxed">
                <strong>Why it works.</strong> Our panels are crafted from industry-grade materials and tested in the lab, delivering excellent noise reduction and echo control. Delivering top performance, safety, and a clean look.
              </p>
              <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed">
                <strong>How we help.</strong> You get practical, expert advice, and custom solutions that fit your space, timeline and budget. With lower noise, clearer speech and better comfort, your customers stay longer, your team communicates better, and your space simply works the way it should.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-[var(--color-white-200)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'Projects Completed' },
              { number: '4.9★', label: 'Google Rating' },
              { number: '10+', label: 'Years Experience' },
              { number: '100%', label: 'Singapore-Based' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-6">
                <div
                  className="text-[var(--color-dark-100)] font-semibold mb-1"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: 48, lineHeight: '112%' }}
                >
                  {stat.number}
                </div>
                <div className="text-[var(--color-gray-200)] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-5 text-center">
          <h2
            className="text-[var(--color-dark-100)] m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(24px, 3vw, var(--fs-h4))',
              lineHeight: '132%',
              fontWeight: 500,
            }}
          >
            Acoustic Solutions for your space is just a click away
          </h2>
          <p className="text-[var(--color-gray-100)] text-base m-0 mb-8">
            Book your free consultation with us now!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[var(--color-brand-orange)] text-white rounded-[100px] px-8 py-4 text-base no-underline hover:bg-[var(--color-gray-100)] transition-colors"
          >
            👉 Start now
          </Link>
        </div>
      </section>
    </>
  )
}
