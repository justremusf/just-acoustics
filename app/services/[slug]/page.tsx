import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getServiceBySlug, getAllServiceSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Service } from '@/lib/types'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllServiceSlugs().catch(() => [])
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service: Service | null = await getServiceBySlug(slug).catch(() => null)
  if (!service) return {}
  return {
    title: service.seo?.metaTitle || service.title,
    description: service.seo?.metaDescription || service.shortDescription,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service: Service | null = await getServiceBySlug(slug).catch(() => null)
  if (!service) notFound()

  return (
    <div className="page-wrap page-stack">
      <Link href="/services" className="page-link">← All Services</Link>

      <section className="home-shell page-hero-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="flex flex-col gap-4">
            <span className="soft-pill">Space Application</span>
            <h1 className="page-title">{service.title}</h1>
            {service.shortDescription && <p className="page-subtitle">{service.shortDescription}</p>}
            <Link href="/contact" className="page-cta mt-2 w-fit">Free Consultation</Link>
          </div>

          <div className="grid gap-4">
            {service.mainImage && (
              <div className="glass-card overflow-hidden rounded-[28px]">
                <Image
                  src={urlFor(service.mainImage).width(900).height(720).url()}
                  alt={service.mainImage.alt || service.title}
                  width={900}
                  height={720}
                  className="aspect-[4/3] h-full w-full object-cover"
                  priority
                />
              </div>
            )}
            {service.benefits && service.benefits.length > 0 && (
              <div className="glass-card p-5 sm:p-6">
                <p className="page-kicker">Benefits</p>
                <ul className="mt-4 flex list-none flex-col gap-3 p-0 text-sm leading-6 text-[var(--color-gray-100)]">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-1 text-[var(--color-brand-orange)]">●</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {service.body && (
        <section className="home-shell page-hero-shell">
          <div className="rich-content max-w-none">
            <PortableText value={service.body as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </section>
      )}
    </div>
  )
}
