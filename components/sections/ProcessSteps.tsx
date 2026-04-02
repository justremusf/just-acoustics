import Link from 'next/link'
import { MessageSquare, Send, FileText, Ruler, Wrench } from 'lucide-react'
import ShimmerButton from '@/components/ui/shimmer-button'

const steps = [
  {
    title: 'Contact Us',
    description: 'Tell us what the room is used for and what sounds wrong.',
    icon: MessageSquare,
  },
  {
    title: 'Send Info',
    description: 'Share photos, layout details, or a floorplan if available.',
    icon: Send,
  },
  {
    title: 'Site Visit',
    description: 'We assess the space and confirm where treatment will matter most.',
    icon: Ruler,
  },
  {
    title: 'Proposal',
    description: 'You receive a clear recommendation tailored to the space.',
    icon: FileText,
  },
  {
    title: 'Installation',
    description: 'We install the treatment and help you get the result you came for.',
    icon: Wrench,
  },
]

export default function ProcessSteps() {
  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="mb-8 text-center md:mb-10">
          <span className="soft-pill">How to get started</span>
          <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">A simple process from first message to better sound.</h2>
          <p className="home-copy mx-auto mt-4 max-w-[48ch]">You do not need to know the technical answer before contacting us. We guide the process from diagnosis to installation.</p>
        </div>

        <div className="hidden md:grid md:grid-cols-5 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="relative">
                <div className="glass-card flex h-full flex-col p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">0{i + 1}</span>
                  <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--color-white-200)] text-[var(--color-dark-100)]">
                    <Icon size={28} strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 text-[28px] leading-[1.04] font-medium tracking-[-1px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-[var(--color-gray-100)]">{step.description}</p>
                </div>
                {i < steps.length - 1 && <div className="pointer-events-none absolute right-[-10px] top-1/2 hidden -translate-y-1/2 text-[var(--color-gray-300)] xl:block">→</div>}
              </div>
            )
          })}
        </div>

        <div className="space-y-3 md:hidden">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="glass-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--color-white-200)] text-[var(--color-dark-100)]">
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">0{i + 1}</span>
                    <h3 className="mt-2 text-[26px] leading-[1.04] font-medium tracking-[-1px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-gray-100)]">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center md:mt-10">
          <Link href="/contact" className="inline-block w-full no-underline sm:w-auto">
            <ShimmerButton className="h-auto w-full px-8 py-4 text-sm sm:w-auto">Free Consultation</ShimmerButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
