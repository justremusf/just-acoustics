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
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <Link
        href="/services"
        className="text-[var(--color-gray-200)] text-sm no-underline hover:text-[var(--color-dark-100)] transition-colors inline-flex items-center gap-1 mb-10"
      >
        ← All Services
      </Link>

      {service.mainImage && (
        <div className="rounded-[20px] overflow-hidden mb-12 h-[400px]">
          <Image
            src={urlFor(service.mainImage).width(990).height(400).url()}
            alt={service.mainImage.alt || service.title}
            width={990}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.5fr] gap-12 items-start">
        <div>
          <h1
            className="text-[var(--color-dark-100)] m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
              lineHeight: '124%',
              fontWeight: 500,
              letterSpacing: '-1.04px',
            }}
          >
            {service.title}
          </h1>

          {service.shortDescription && (
            <p className="text-[var(--color-gray-100)] text-lg m-0 mb-8 leading-relaxed">
              {service.shortDescription}
            </p>
          )}

          {service.body && (
            <div className="prose prose-lg max-w-none text-[var(--color-gray-100)] leading-relaxed">
              <PortableText value={service.body as Parameters<typeof PortableText>[0]['value']} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sticky top-12">
          {service.benefits && service.benefits.length > 0 && (
            <div className="bg-[var(--color-white-200)] rounded-[16px] p-6 mb-4">
              <h3 className="text-[var(--color-dark-100)] text-base font-semibold m-0 mb-4">Benefits</h3>
              <ul className="list-none m-0 p-0 flex flex-col gap-2">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[var(--color-gray-100)] text-sm">
                    <span className="text-[var(--color-brand-orange)] mt-0.5">✔</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href="/contact"
            className="block w-full bg-[var(--color-brand-orange)] text-white text-center rounded-[100px] px-6 py-3.5 text-base no-underline hover:bg-[var(--color-gray-100)] transition-colors"
          >
            Get Free Quote
          </Link>
        </div>
      </div>
    </div>
  )
}
