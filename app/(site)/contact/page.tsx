import type { Metadata } from 'next'
import Script from 'next/script'
import { preconnect, preload } from 'react-dom'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import TrackedAnchor from '@/components/analytics/TrackedAnchor'
import WhatsAppLink from '@/components/analytics/WhatsAppLink'
import TallyAttributionIframe from '@/components/TallyAttributionIframe'
import BrandScroller from '@/components/sections/BrandScroller'
import FAQ, { type FaqItem } from '@/components/sections/FAQ'
import { getFeaturedTestimonials, getSiteSettings } from '@/sanity/lib/queries'
import { FALLBACK_TESTIMONIALS } from '@/lib/testimonials'
import type { Testimonial } from '@/lib/types'
import { pageMetadata } from '@/lib/seo'
import { TALLY_CONSULTATION_FORM_URL } from '@/lib/tally'

export const revalidate = 60


const NEXT_STEPS = ['Send us the form. It takes about two minutes.', 'We reach out within 1 hour.', 'We give you a free consultation on your space.']

const DIRECT_CONTACT = [
  { icon: MessageCircle, label: 'WhatsApp', value: 'Start a chat', href: 'https://wa.me/6589301905', external: true },
  { icon: Phone, label: 'Call', value: '+65 8930 1905', href: 'tel:+6589301905' },
  { icon: Mail, label: 'Email', value: 'info@justacoustics.co', href: 'mailto:info@justacoustics.co' },
]

// Answers mirror what the site already states in its FAQ and pricing pages.
const OBJECTIONS: FaqItem[] = [
  {
    q: 'Is the consultation really free?',
    a: 'Yes. We look at the problem you are trying to solve, how the room is used and the likely treatment options, so you have a clear next step before you commit to anything.',
  },
  {
    q: "I don't know what I need yet.",
    a: 'That is normal, and it is what the consultation is for. Tell us what bothers you about the room, whether it is echo, noise or people struggling to hear, and we will work out the rest.',
  },
  {
    q: 'How much will it cost?',
    a: 'It depends on the room and how much treatment it needs. Smaller spaces usually start from around $1,000, and office and home-studio projects commonly range from $1,000 to $3,000. We confirm the final quote after reviewing your space.',
  },
  {
    q: 'Will installation disrupt us?',
    a: 'Most projects are installed within one to two days. We plan the install to keep disruption low and the site clean, and many jobs can be scheduled around business hours.',
  },
  {
    q: 'Is this the same as soundproofing?',
    a: 'Not quite. Acoustic treatment makes a room sound clearer and calmer by controlling echo inside it. Soundproofing stops sound travelling between rooms. Not sure which you need? Ask us, that is what we are here for.',
  },
]

export const metadata: Metadata = pageMetadata({
  title: 'Free Acoustic Consultation Singapore',
  description:
    'Book a free acoustic consultation in Singapore. Send your room details and the Just Acoustics team will reach out within 1 hour.',
  path: '/contact',
})

export default async function ContactPage() {
  // Start talking to Tally while the page is still loading, so the form appears sooner.
  preconnect('https://tally.so')
  preload('https://tally.so/widgets/embed.js', { as: 'script' })

  const [featured, settings] = await Promise.all([getFeaturedTestimonials().catch(() => []), getSiteSettings().catch(() => null)])
  const testimonials: Omit<Testimonial, '_id' | 'image'>[] = (featured as Testimonial[]).length > 0 ? (featured as Testimonial[]).slice(0, 3) : FALLBACK_TESTIMONIALS

  return (
    <>
      <div className="page-wrap page-stack">
        {/* Form first: on mobile it sits right under the heading; on desktop beside the reassurance column. */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:items-start">
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <span className="soft-pill self-start">Free consultation</span>
            <h1 className="page-title !text-[clamp(32px,4vw,52px)]">Get your free acoustic consultation.</h1>
            <p className="page-subtitle m-0">Find out what your room needs and what it will cost, for free. We will reach out within 1 hour.</p>

            <div className="hidden flex-col gap-4 lg:flex">
              <NextSteps />
              <DirectContact />
            </div>
          </div>

          <div id="form" className="home-shell scroll-mt-28 overflow-hidden rounded-[28px] p-4 sm:p-6 md:p-8">
            <TallyAttributionIframe baseUrl={TALLY_CONSULTATION_FORM_URL} title="Free Acoustic Consultation" style={{ overflow: 'hidden', display: 'block' }} />
          </div>

          <div className="flex flex-col gap-4 lg:hidden">
            <NextSteps />
            <DirectContact />
          </div>
        </section>

        <FAQ items={OBJECTIONS} title="Questions before you reach out" subtitle="Quick answers to what most people ask us first." flush />

        {/* Proof */}
        <section className="flex flex-col gap-4">
          <p className="page-kicker px-1">What clients say</p>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={`${item.authorName}-${item.company}`} className="glass-card m-0 flex flex-col gap-4 p-6">
                <span className="text-[var(--color-brand-orange)]" aria-label={`${item.rating ?? 5} out of 5 stars`}>
                  {'★'.repeat(item.rating ?? 5)}
                </span>
                <blockquote className="page-card-copy m-0">“{item.review}”</blockquote>
                <figcaption className="mt-auto text-sm">
                  <span className="font-semibold text-[var(--color-dark-100)]">{item.authorName}</span>
                  {item.company && <span className="text-[var(--color-gray-200)]"> · {item.company}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>

      <BrandScroller logos={settings?.brandLogos} />

      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </>
  )
}

function NextSteps() {
  return (
    <div className="glass-card p-5">
      <p className="page-kicker">What happens next</p>
      <ol className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
        {NEXT_STEPS.map((step, index) => (
          <li key={step} className="flex items-start gap-3 text-sm leading-6 text-[var(--color-gray-100)]">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-dark-100)] text-xs font-semibold text-white">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function DirectContact() {
  return (
    <div className="glass-card p-5">
      <p className="page-kicker">Prefer to talk?</p>
      <div className="mt-4 flex flex-col gap-3">
        {DIRECT_CONTACT.map(({ icon: Icon, label, value, href, external }) => {
          const className =
            'flex items-center gap-3 rounded-[14px] border border-black/6 bg-white/70 px-3 py-2.5 no-underline transition-colors hover:border-black/15'
          const content = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-[var(--color-dark-100)]">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-xs text-[var(--color-gray-200)]">{label}</span>
                <span className="text-sm font-semibold text-[var(--color-dark-100)]">{value}</span>
              </span>
            </>
          )
          return external ? (
            <WhatsAppLink key={label} source="contact_page" className={className}>
              {content}
            </WhatsAppLink>
          ) : (
            <TrackedAnchor key={label} href={href} trackingSource="contact_page" className={className}>
              {content}
            </TrackedAnchor>
          )
        })}
      </div>
    </div>
  )
}
