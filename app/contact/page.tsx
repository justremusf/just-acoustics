import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Free Consultation',
  description: 'Get your free acoustic consultation. Complete the form and our team will be in touch within 24 hours.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-[var(--color-dark-100)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <span className="inline-block border border-white/30 text-white rounded-[100px] px-4 py-2 text-sm mb-6">
            Contact
          </span>
          <h1
            className="text-white m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
              lineHeight: '124%',
              fontWeight: 500,
              letterSpacing: '-1.04px',
            }}
          >
            Free Consultation
          </h1>
          <p className="text-white/70 text-base m-0 max-w-lg leading-relaxed">
            Complete the form to get your free acoustic consultation! We will never share your info with anyone.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.7fr] gap-12 items-start">
            {/* Tally form embed */}
            <div>
              {/*
                Replace the src below with your Tally embed URL.
                Get it from: tally.so → your form → Share → Embed
                Example: https://tally.so/embed/YOUR_FORM_ID?alignLeft=1&hideTitle=1&transparentBackground=1
              */}
              <iframe
                data-tally-src="https://tally.so/embed/NppZoQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="400"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Free Acoustic Consultation"
                className="min-h-[400px]"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}
                  `,
                }}
              />
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-6">
              <div>
                <h2
                  className="text-[var(--color-dark-100)] m-0 mb-6 text-2xl font-semibold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  We are here to help
                </h2>
              </div>

              <div className="flex flex-col gap-0">
                {[
                  {
                    label: 'Phone / WhatsApp',
                    value: '+65 8930 1905',
                    href: 'https://wa.me/6589301905',
                  },
                  {
                    label: 'Email',
                    value: 'info@justacoustics.co',
                    href: 'mailto:info@justacoustics.co',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="py-5 border-b border-[var(--color-gray-500)] flex justify-between items-center"
                  >
                    <span className="text-[var(--color-gray-100)] font-medium text-sm">{item.label}</span>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-[var(--color-dark-100)] font-semibold text-sm no-underline hover:text-[var(--color-brand-orange)] transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                ))}
              </div>

              <div className="bg-[var(--color-white-200)] rounded-[16px] p-6 mt-2">
                <p className="text-[var(--color-gray-100)] text-sm m-0 leading-relaxed">
                  <strong>Make sure contact details are fully filled out</strong> so that we can contact you as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
