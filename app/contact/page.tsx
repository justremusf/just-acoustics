import type { Metadata } from 'next'

const consultationSteps = [
  'Submit the form',
  'We will reach out to you within 1 hour',
  'We provide free consultation on your space',
]

export const metadata: Metadata = {
  title: 'Contact — Free Consultation',
  description: 'Get your free acoustic consultation. Complete the form and our team will be in touch within 1 hour.',
}

export default function ContactPage() {
  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-5 text-center">
        <span className="soft-pill mx-auto">Contact</span>
        <h1 className="page-title">Book your free acoustic consultation.</h1>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="glass-card p-6">
            <span className="soft-pill">What To Expect</span>
            <ol className="mt-5 flex list-decimal flex-col gap-4 pl-5 text-sm leading-6 text-[var(--color-gray-100)]">
              {consultationSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="glass-card p-6">
            <span className="soft-pill">Direct Contact</span>
            <div className="mt-5 flex flex-col gap-5">
              <div>
                <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">Hotline</p>
                <a href="tel:+6589301905" className="page-link mt-2">+65 8930 1905</a>
              </div>
              <div>
                <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">WhatsApp</p>
                <a href="https://wa.me/6589301905" target="_blank" rel="noopener noreferrer" className="page-link mt-2">Start chat directly</a>
              </div>
              <div>
                <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">Email</p>
                <a href="mailto:info@justacoustics.co" className="page-link mt-2">info@justacoustics.co</a>
              </div>
            </div>
          </div>
        </aside>

        <div className="home-shell rounded-[32px] p-5 md:p-8 lg:p-10">
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
      </section>
    </div>
  )
}
