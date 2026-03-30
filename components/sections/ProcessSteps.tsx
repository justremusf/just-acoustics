import Link from 'next/link'
import { MessageSquare, Send, FileText, Ruler, Wrench } from 'lucide-react'
import ShimmerButton from '@/components/ui/shimmer-button'

const steps = [
  {
    title: 'Contact Us',
    description: 'Reach out through the form here',
    icon: MessageSquare,
  },
  {
    title: 'Send Info',
    description: 'Share photos of your space',
    icon: Send,
  },
  {
    title: 'Site Visit',
    description: 'We inspect & measure your site',
    icon: Ruler,
  },
  {
    title: 'Proposal',
    description: 'Receive a custom solution',
    icon: FileText,
  },
  {
    title: 'Installation',
    description: 'Enjoy your quiet & treated space',
    icon: Wrench,
  },
]

export default function ProcessSteps() {
  return (
    <section className="mx-4 rounded-[20px] bg-[var(--color-white-200)] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-5">

        {/* Heading */}
        <div className="text-center mb-20 md:mb-24">
          <h2
            className="text-[var(--color-dark-100)] m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
              lineHeight: '124%',
              fontWeight: 500,
              letterSpacing: '-1.04px',
            }}
          >
            How to Get Started
          </h2>
          <p className="text-[var(--color-gray-100)] text-base m-0">
            Getting started with us is simple!
          </p>
        </div>

        {/* Desktop: horizontal row with arrows */}
        <div className="hidden md:flex items-start justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <>
                <div key={step.title} className="flex flex-col items-center text-center" style={{ flex: '1' }}>
                  <div className="mb-6 text-[var(--color-dark-100)]">
                    <Icon size={56} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-[var(--color-dark-100)] m-0 mb-2 font-semibold"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(16px, 1.5vw, 20px)',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-gray-100)] text-sm m-0 leading-relaxed" style={{ maxWidth: '130px' }}>
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div key={`arrow-${i}`} className="shrink-0 text-[var(--color-gray-300)] pt-5 px-2">
                    <svg width="28" height="16" viewBox="0 0 28 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 8H25M25 8L18 1M25 8L18 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </>
            )
          })}
        </div>

        {/* Mobile: 2-col grid */}
        <div className="md:hidden grid grid-cols-2 gap-10">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="flex flex-col items-center text-center gap-3">
                <div className="text-[var(--color-dark-100)]">
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <h3
                  className="text-[var(--color-dark-100)] m-0 font-semibold text-base"
                  style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.3px' }}
                >
                  {step.title}
                </h3>
                <p className="text-[var(--color-gray-100)] text-sm m-0 leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-20 md:mt-24">
          <Link href="/contact" className="no-underline inline-block">
            <ShimmerButton className="text-base px-8 py-4 h-auto">
              Contact Us Now
            </ShimmerButton>
          </Link>
        </div>

      </div>
    </section>
  )
}
