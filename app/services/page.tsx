import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllServices } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Service } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Acoustic Services',
  description: 'Office acoustics, restaurant sound treatment, church audio, studio soundproofing and more across Singapore.',
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
    </div>
  )
}
