import Link from 'next/link'
import Image from 'next/image'
import ShimmerButton from '@/components/ui/shimmer-button'

const steps = [
  {
    title: 'Contact Us',
    description: 'Send us details of your space to get started',
    image: '/assets/webflow/69687b1239333b922d70b26a_Title.avif',
  },
  {
    title: 'Site Visit',
    description: 'We assess your space and provide consultation',
    image: '/assets/webflow/6964fb659de42387a7d78754_Image%20from%20TinyPNG%20(4).avif',
  },
  {
    title: 'Proposal',
    description: 'We design a 3D render of your space',
    image: '/assets/webflow/696a4efb255645d4686056e2_7.png',
  },
  {
    title: 'Installation',
    description: 'Our licensed team works around your schedule',
    image: '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
  },
]

export default function ProcessSteps() {
  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1580px]">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="home-heading text-[var(--color-dark-100)]">How to get started?</h2>
          <p className="home-copy mx-auto mt-5 max-w-[48ch]">We guide the process from diagnosis to installation.</p>
        </div>

        <div className="hidden md:grid md:grid-cols-2 md:gap-5 2xl:grid-cols-4">
          {steps.map((step, i) => {
            return (
              <div key={step.title} className="relative">
                <div className="group relative h-full min-h-[360px] overflow-hidden rounded-[24px] border border-white/55 bg-white/35 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12)]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.06),rgba(1,1,1,0.32)_54%,rgba(1,1,1,0.66))]" />
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                    <div className="rounded-[20px] border border-white/12 bg-[rgba(20,18,16,0.22)] px-6 py-4 text-white backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[22px] leading-[1.04] font-medium tracking-[-0.8px] md:text-[24px]" style={{ fontFamily: 'var(--font-heading)' }}>
                            {step.title}
                          </h3>
                          <p className="mt-3 text-[14px] leading-6 text-white/78">
                            {step.description}
                          </p>
                        </div>
                        <span className="shrink-0 pt-1 text-[14px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                          0{i + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="pointer-events-none absolute right-[-10px] top-1/2 hidden -translate-y-1/2 text-[var(--color-gray-300)] 2xl:block">→</div>}
              </div>
            )
          })}
        </div>

        <div className="space-y-4 md:hidden">
          {steps.map((step, i) => {
            return (
              <div key={step.title} className="group relative min-h-[260px] overflow-hidden rounded-[24px] border border-white/55 bg-white/35 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12)]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.06),rgba(1,1,1,0.26)_48%,rgba(1,1,1,0.66))]" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="rounded-[20px] border border-white/12 bg-[rgba(20,18,16,0.22)] px-6 py-4 text-white backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[20px] leading-[1.04] font-medium tracking-[-0.8px]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {step.title}
                        </h3>
                        <p className="mt-3 text-[14px] leading-6 text-white/78">
                          {step.description}
                        </p>
                      </div>
                      <span className="shrink-0 pt-1 text-[14px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                        0{i + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-[25px] text-center md:mt-12">
          <Link href="/contact" className="inline-block w-full no-underline sm:w-auto">
            <ShimmerButton className="h-auto w-full px-8 py-4 text-sm sm:w-auto">Free Consultation</ShimmerButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
