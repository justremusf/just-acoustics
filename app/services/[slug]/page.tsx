import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getServiceBySlug, getAllServiceSlugs, getAllProducts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Product, Service } from '@/lib/types'

export const revalidate = 60

const SERVICE_PRODUCT_MAP: Record<string, string[]> = {
  'offices-meeting-rooms': ['acoustic-wall-panels', 'acoustic-ceiling-panels', 'office-soundproofing'],
  'restaurants-cafes-bars': ['acoustic-ceiling-panels', 'acoustic-wall-panels', 'custom-print-acoustic-panels'],
  'churches-event-spaces': ['acoustic-wall-panels', 'acoustic-ceiling-panels', 'custom-acoustic-panels'],
  'education-spaces': ['acoustic-wall-panels', 'polyester-felt-panels', 'acoustic-ceiling-panels'],
  'gym-leisure-spaces': ['polyester-felt-panels', 'acoustic-wall-panels', 'custom-acoustic-panels'],
  'cinema-music-studios': ['acoustic-wall-panels', 'acoustic-fabric-wall', 'custom-acoustic-panels'],
}

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
  const [service, allProducts]: [Service | null, Product[]] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getAllProducts().catch(() => []),
  ])
  if (!service) notFound()

  const relatedSlugs = SERVICE_PRODUCT_MAP[slug] ?? ['acoustic-wall-panels', 'acoustic-ceiling-panels', 'custom-acoustic-panels']
  const relatedProducts = relatedSlugs
    .map((productSlug) => allProducts.find((product) => product.slug.current === productSlug))
    .filter(Boolean)
    .slice(0, 3) as Product[]

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

      {relatedProducts.length > 0 && (
        <section className="home-shell page-hero-shell">
          <div className="flex flex-col gap-8">
            <div className="max-w-[760px]">
              <span className="soft-pill">Relevant Solutions</span>
              <h2 className="page-title mt-5 text-[clamp(36px,4.5vw,60px)] leading-[0.98] tracking-[-2px]">
                Acoustic products that fit this kind of space.
              </h2>
              <p className="page-subtitle mt-5 max-w-[62ch]">
                Ready to move on to the next step? Check out the acoustic solutions we have available to solve your space&apos;s sound issues.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {relatedProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug.current}`}
                  className="page-card glass-card group h-full transition-transform duration-300 hover:-translate-y-1"
                >
                  {product.mainImage && (
                    <div className="page-card-image aspect-[4/3]">
                      <Image
                        src={urlFor(product.mainImage).width(560).height(420).url()}
                        alt={product.mainImage.alt || product.title}
                        width={560}
                        height={420}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="page-card-body">
                    {product.category && <p className="page-kicker">{product.category.replace('-', ' ')}</p>}
                    <h3 className="page-card-title transition-colors group-hover:text-[var(--color-brand-orange)]">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="page-card-copy line-clamp-3">{product.description}</p>
                    )}
                    <span className="page-link mt-1">Learn more <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="page-card-copy max-w-[62ch]">
                See the full solutions range if you want to compare the treatment types before reaching out.
              </p>
              <Link href="/products" className="page-cta w-fit">
                See Acoustic Solutions
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
