import type { Metadata } from 'next'
import Link from 'next/link'
import LeadConversionTracker from '@/components/analytics/LeadConversionTracker'
import ShimmerButton from '@/components/ui/shimmer-button'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for reaching out to Just Acoustics. Our team will review your submission and get back to you shortly.',
  robots: {
    index: false,
    follow: false,
  },
}

const nextSteps = [
  'We will review your room details and contact you shortly.',
  'If needed, we may ask for a few more photos or measurements.',
  'We will recommend the right acoustic approach for your space.',
]

export default function ThankYouPage() {
  return (
    <div className="page-wrap page-stack">
      <LeadConversionTracker />
      <section className="home-shell page-hero-shell flex flex-col items-center gap-5 text-center">
        <span className="soft-pill mx-auto">Thank You</span>
        <h1 className="page-title max-w-[14ch] text-center">
          Your consultation request has been received
        </h1>
        <p className="page-subtitle max-w-[50ch] text-center">
          Thanks for reaching out to Just Acoustics. We have received your form submission and will get in touch soon to help you take the next step for your space.
        </p>
        <div className="mt-3">
          <Link href="/projects" className="inline-block no-underline">
            <ShimmerButton className="h-auto px-8 py-4 text-sm">
              Check out our projects
            </ShimmerButton>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="home-shell page-hero-shell">
          <span className="soft-pill">What Happens Next</span>
          <ol className="mt-5 flex list-decimal flex-col gap-4 pl-5 text-sm leading-7 text-[var(--color-gray-100)]">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="glass-card p-6">
          <span className="soft-pill">Need Direct Help</span>
          <div className="mt-5 flex flex-col gap-4 text-sm leading-6 text-[var(--color-gray-100)]">
            <div>
              <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">Hotline</p>
              <a href="tel:+6589301905" className="page-link mt-2">+65 8930 1905</a>
            </div>
            <div>
              <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">WhatsApp</p>
              <a href="https://wa.me/6589301905" target="_blank" rel="noopener noreferrer" className="page-link mt-2">
                Start chat directly
              </a>
            </div>
            <div>
              <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">Explore Projects</p>
              <Link href="/projects" className="page-link mt-2">Check out our projects</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
