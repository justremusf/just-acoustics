import Link from 'next/link'
import PriceEstimator from '@/components/estimator/PriceEstimator'

export default function HomePriceEstimate() {
  return (
    <section id="estimate" className="scroll-mt-24 px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell page-hero-shell mx-auto grid max-w-[1580px] gap-8 p-[clamp(22px,4vw,42px)] lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div className="flex flex-col items-start">
          <h2 className="home-heading text-[var(--color-dark-100)]">What does it cost?</h2>
          <p className="home-copy mt-5 max-w-[48ch]">
            Pick your space and its size to see what similar projects typically cost in Singapore, including supply and installation.
          </p>
          <Link href="/pricing" className="home-link mt-5 inline-flex items-center gap-2">
            How pricing works <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="min-w-0">
          <PriceEstimator compact />
        </div>
      </div>
    </section>
  )
}
