import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getAllProductSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { canonicalPath, stripBrand } from '@/lib/seo'
import type { Product } from '@/lib/types'
import ProductTabContent from './ProductTabContent'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllProductSlugs().catch(() => [])
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product: Product | null = await getProductBySlug(slug).catch(() => null)
  if (!product) return {}
  return {
    title: stripBrand(product.seo?.metaTitle) || product.title,
    description: product.seo?.metaDescription || product.description,
    alternates: { canonical: canonicalPath(`/products/${slug}`) },
    openGraph: product.mainImage
      ? { images: [{ url: urlFor(product.mainImage).width(1200).height(630).url() }] }
      : undefined,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product: Product | null = await getProductBySlug(slug).catch(() => null)
  if (!product) notFound()

  return (
    <div className="page-wrap page-stack">
      <Link href="/products" className="page-link">← All Products</Link>

      <section className="home-shell page-hero-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-start">
          <div className="flex flex-col gap-4">
            <span className="soft-pill">Product</span>
            <h1 className="page-title">{product.title}</h1>
            {product.description && <p className="page-subtitle">{product.description}</p>}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/contact" className="page-cta">Request a Quote</Link>
            </div>
          </div>

          <div className="grid gap-3">
            {product.mainImage && (
              <div className="glass-card overflow-hidden rounded-[28px]">
                <Image
                  src={urlFor(product.mainImage).width(900).height(720).url()}
                  alt={product.mainImage.alt || product.title}
                  width={900}
                  height={720}
                  className="aspect-[4/3] h-full w-full object-cover"
                  priority
                />
              </div>
            )}
            {product.features && product.features.length > 0 && (
              <div className="glass-card p-5 sm:p-6">
                <p className="page-kicker">Key Features</p>
                <ul className="mt-4 flex list-none flex-col gap-3 p-0 text-sm leading-6 text-[var(--color-gray-100)]">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 text-[var(--color-brand-orange)]">●</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {product.gallery && product.gallery.length > 0 && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {product.gallery.slice(0, 6).map((img, index) => (
            <div key={index} className="glass-card overflow-hidden rounded-[24px]">
              <Image
                src={urlFor(img).width(520).height(520).url()}
                alt={img.alt || product.title + ' ' + (index + 1)}
                width={520}
                height={520}
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          ))}
        </section>
      )}

      <section className="home-shell page-hero-shell">
        <ProductTabContent product={product} />
      </section>
    </div>
  )
}
