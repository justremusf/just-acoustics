import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Free Consultation',
  description: 'Get your free acoustic consultation. Complete the form and our team will be in touch within 24 hours.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center">
        <div className="max-w-[1280px] mx-auto px-5">
          <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm mb-6">
            Contact Us
          </span>
          <h1
            className="text-[var(--color-dark-100)] m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 5vw, var(--fs-h2))',
              lineHeight: '112%',
              fontWeight: 500,
              letterSpacing: '-1.28px',
            }}
          >
            Book Your Free Consultation
          </h1>
          <p className="text-[var(--color-gray-100)] text-base m-0 max-w-lg mx-auto leading-relaxed">
            Fill out the form below and we will recommend the best noise reduction solution for you!
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">

            {/* Contact info — left */}
            <div className="flex flex-col gap-8">
              <h2
                className="text-[var(--color-dark-100)] m-0 text-2xl font-semibold"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}
              >
                Contact Us
              </h2>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[var(--color-dark-100)] font-semibold text-base">Hotline Phone Number</span>
                  <a
                    href="tel:+6589301905"
                    className="text-[var(--color-gray-100)] text-base no-underline hover:text-[var(--color-brand-orange)] transition-colors flex items-center gap-2"
                  >
                    📞 +65 8930 1905
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[var(--color-dark-100)] font-semibold text-base">WhatsApp</span>
                  <a
                    href="https://wa.me/6589301905"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-gray-100)] text-base no-underline hover:text-[var(--color-brand-orange)] transition-colors flex items-center gap-2"
                  >
                    💬 Click here to start chat
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[var(--color-dark-100)] font-semibold text-base">Email</span>
                  <a
                    href="mailto:info@justacoustics.co"
                    className="text-[var(--color-gray-100)] text-base no-underline hover:text-[var(--color-brand-orange)] transition-colors flex items-center gap-2"
                  >
                    ✉️ info@justacoustics.co
                  </a>
                </div>
              </div>
            </div>

            {/* Tally form — right */}
            <div
              className="bg-white rounded-[20px] p-8 md:p-10"
              style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
            >
              <iframe
                src="https://tally.so/embed/NppZoQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="1100"
                frameBorder="0"
                title="Free Acoustic Consultation"
                style={{ overflow: 'hidden', display: 'block' }}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
