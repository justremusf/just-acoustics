import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllServices } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Service } from '@/lib/types'
import FAQ from '@/components/sections/FAQ'
import type { FaqItem } from '@/components/sections/FAQ'
import { canonicalPath } from '@/lib/seo'

const SERVICES_FAQS: FaqItem[] = [
  {
    q: 'What is included in a service engagement?',
    a: 'We handle site assessment, acoustic design, product supply, and installation. You receive a full scope and quote before work begins.',
  },
  {
    q: 'Do you do a site visit before quoting?',
    a: 'Yes. For most projects we visit the space to measure, assess the surfaces, and understand the acoustic problem before recommending a solution.',
  },
  {
    q: 'Do you work with residential spaces?',
    a: 'We work across both commercial and residential. Offices, restaurants, and churches make up most of our work, but home studios and listening rooms are also welcome.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'From consultation to install, most projects are completed within two to four weeks. Larger or highly custom projects may take longer.',
  },
  {
    q: 'What happens after installation?',
    a: 'We walk you through the result and confirm everything meets the brief. If adjustments are needed, we handle them before closing the project.',
  },
]

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Acoustic Services',
  description:
    'Acoustic services for offices, restaurants, churches, schools, studios, gyms, and homes across Singapore, from assessment to installation.',
  alternates: { canonical: canonicalPath('/services') },
}

export default async function ServicesPage() {
  const services: Service[] = await getAllServices().catch(() => [])

  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Space Applications</span>
        <h1 className="page-title">Spaces we help sound better</h1>
        <p className="page-subtitle">
          From worship spaces to offices and restaurants, these are the environments where we most often improve clarity, comfort, and noise control.
        </p>
      </section>

      {services.length === 0 ? (
        <section className="glass-card page-hero-shell">
          <p className="page-card-copy">Services coming soon.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service._id}
              href={'/services/' + service.slug.current}
              className="page-card glass-card group grid overflow-hidden md:grid-cols-[240px_minmax(0,1fr)] transition-transform duration-300 hover:-translate-y-1"
            >
              {service.mainImage && (
                <div className="page-card-image min-h-[220px] md:min-h-full">
                  <Image
                    src={urlFor(service.mainImage).width(560).height(420).url()}
                    alt={service.mainImage.alt || service.title}
                    width={560}
                    height={420}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="page-card-body justify-center">
                <p className="page-kicker">Space Application</p>
                <h2 className="page-card-title transition-colors group-hover:text-[var(--color-brand-orange)]">{service.title}</h2>
                {service.shortDescription && <p className="page-card-copy line-clamp-3">{service.shortDescription}</p>}
                <span className="page-link mt-1">View application <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <FAQ items={SERVICES_FAQS} title="Service Questions" subtitle="How our acoustic service works from start to finish." />
    </div>
  )
}
