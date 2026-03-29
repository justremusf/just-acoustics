import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Contact Us',
    description: 'Reach out through our contact form or WhatsApp. Tell us about your space and acoustic challenges.',
  },
  {
    number: '02',
    title: 'Send Info',
    description: 'Share photos and measurements of your space so we can prepare a tailored recommendation.',
  },
  {
    number: '03',
    title: 'Site Visit',
    description: 'Our acoustic specialist inspects and measures your space to design the perfect solution.',
  },
  {
    number: '04',
    title: 'Proposal',
    description: 'Receive a personalised acoustic solution with product recommendations, layout, and pricing.',
  },
  {
    number: '05',
    title: 'Installation',
    description: 'Our team installs your panels professionally and efficiently. Then enjoy your quiet, treated space.',
  },
]

export default function ProcessSteps() {
  return (
    <section className="mx-4 rounded-[20px] bg-[var(--color-white-200)] py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-5">
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
            How it Works
          </h2>
          <p className="text-[var(--color-gray-100)] text-base m-0">
            Getting started with us is simple!
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="bg-white rounded-[16px] p-5 md:p-8 flex gap-4 md:gap-6 items-start"
              style={{
                borderRight: '3px solid var(--color-white-100)',
                borderBottom: '3px solid var(--color-white-100)',
              }}
            >
              <div
                className="text-[var(--color-gray-400)] font-semibold shrink-0"
                style={{ fontSize: 'clamp(40px, 8vw, 64px)', lineHeight: 1 }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="pt-2">
                <h3
                  className="text-[var(--color-dark-100)] m-0 mb-2 text-2xl font-semibold"
                  style={{ letterSpacing: '-0.48px' }}
                >
                  {step.title}
                </h3>
                <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/contact"
            className="inline-block bg-[var(--color-brand-orange)] text-white rounded-[100px] px-8 py-3.5 text-base no-underline transition-all duration-300 hover:bg-[var(--color-gray-100)] hover:tracking-wide"
          >
            👉 Start now
          </Link>
        </div>
      </div>
    </section>
  )
}
