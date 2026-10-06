import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Camera, Check, MessageCircle, Phone } from 'lucide-react'
import LeadConversionTracker from '@/components/analytics/LeadConversionTracker'
import TrackedAnchor from '@/components/analytics/TrackedAnchor'
import WhatsAppLink from '@/components/analytics/WhatsAppLink'
import { getAllProjects } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for reaching out to Just Acoustics. Our team will review your submission and get back to you shortly.',
  robots: {
    index: false,
    follow: false,
  },
}

// Prefixed on the client with what the visitor was looking at (e.g. "for an office").
const WHATSAPP_PHOTOS_FOLLOW_UP =
  'I just sent the consultation form on your website. Here are some photos of my room:'

const PHOTO_TIPS = ['The whole room, taken from a corner', 'The ceiling', 'Rough room size, if you know it']

const NEXT_STEPS = [
  'We reach out within 1 hour.',
  'We look at your photos and ask anything we still need to know.',
  'You get a clear recommendation and quote for your space.',
]

export default async function ThankYouPage() {
  const projects: Project[] = await getAllProjects().catch(() => [])
  const recent = projects.filter((project) => project.mainImage?.asset && project.slug?.current).slice(0, 3)

  return (
    <div className="page-wrap page-stack">
      <LeadConversionTracker />

      <section className="home-shell page-hero-shell flex flex-col items-center gap-4 text-center md:!py-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-[var(--color-dark-100)]">
          <Check size={24} aria-hidden="true" />
        </span>
        <h1 className="page-title max-w-[18ch] text-center">Got it. We will reach out within 1 hour.</h1>
        <p className="page-subtitle m-0 max-w-[48ch] text-center">Your consultation request is in. Want a faster, more accurate answer? Send us a few photos now.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="home-shell page-hero-shell flex flex-col gap-5 md:!p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <Camera size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="page-kicker">Speed it up</p>
              <h2 className="page-card-title m-0">WhatsApp us 2–3 photos of the room</h2>
            </div>
          </div>
          <p className="page-card-copy m-0">Photos let us spot the problem and quote you faster, often without a site visit. Helpful shots:</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {PHOTO_TIPS.map((tip) => (
              <li key={tip} className="flex items-center gap-2 text-sm text-[var(--color-gray-100)]">
                <Check size={15} aria-hidden="true" className="shrink-0 text-[var(--color-brand-orange)]" />
                {tip}
              </li>
            ))}
          </ul>
          <WhatsAppLink
            source="thank_you"
            followUp={WHATSAPP_PHOTOS_FOLLOW_UP}
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full px-6 text-sm font-semibold text-white no-underline transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#25D366' }}
          >
            <MessageCircle size={17} aria-hidden="true" /> Send photos on WhatsApp
          </WhatsAppLink>
        </div>

        <div className="glass-card flex flex-col gap-4 p-6">
          <p className="page-kicker">What happens next</p>
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {NEXT_STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-6 text-[var(--color-gray-100)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-dark-100)] text-xs font-semibold text-white">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <TrackedAnchor href="tel:+6589301905" trackingSource="thank_you" className="page-link mt-auto pt-2">
            <Phone size={14} aria-hidden="true" /> Prefer to talk? +65 8930 1905
          </TrackedAnchor>
        </div>
      </section>

      {recent.length === 3 && (
        <section className="home-shell page-hero-shell flex flex-col gap-5 md:!p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">While you wait</p>
              <h2 className="page-card-title mt-1.5">Rooms we have treated</h2>
            </div>
            <Link href="/projects" className="page-link whitespace-nowrap">
              All projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recent.map((project) => (
              <Link key={project._id} href={`/projects/${project.slug.current}`} className="group flex flex-col gap-2 no-underline">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[var(--color-white-200)]">
                  <Image
                    src={urlFor(project.mainImage!).width(700).height(525).url()}
                    alt={project.mainImage?.alt || project.title}
                    fill
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <span className="px-1 text-[15px] font-semibold text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]">{project.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
