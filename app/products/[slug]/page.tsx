import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getProductBySlug, getAllProductSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Product } from '@/lib/types'

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
    title: product.seo?.metaTitle || product.title,
    description: product.seo?.metaDescription || product.description,
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
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <Link
        href="/products"
        className="text-[var(--color-gray-200)] text-sm no-underline hover:text-[var(--color-dark-100)] transition-colors inline-flex items-center gap-1 mb-10"
      >
        ← All Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Images */}
        <div>
          {product.mainImage && (
            <div className="rounded-[16px] overflow-hidden mb-4">
              <Image
                src={urlFor(product.mainImage).width(600).height(480).url()}
                alt={product.mainImage.alt || product.title}
                width={600}
                height={480}
                className="w-full object-cover"
                priority
              />
            </div>
          )}
          {product.gallery && product.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {product.gallery.slice(0, 6).map((img, i) => (
                <div key={i} className="rounded-[10px] overflow-hidden aspect-square">
                  <Image
                    src={urlFor(img).width(200).height(200).url()}
                    alt={img.alt || `${product.title} ${i + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1
            className="text-[var(--color-dark-100)] m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(24px, 3vw, var(--fs-h4))',
              lineHeight: '132%',
              fontWeight: 500,
              letterSpacing: '-0.96px',
            }}
          >
            {product.title}
          </h1>

          {product.description && (
            <p className="text-[var(--color-gray-100)] text-base m-0 mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[var(--color-dark-100)] text-base font-semibold mb-3">Key Features</h3>
              <ul className="list-none m-0 p-0 flex flex-col gap-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[var(--color-gray-100)] text-base">
                    <span className="text-[var(--color-brand-orange)] mt-0.5">✔</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/contact"
            className="inline-block bg-[var(--color-brand-orange)] text-white rounded-[100px] px-8 py-3.5 text-base no-underline hover:bg-[var(--color-gray-100)] transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>

      {/* Body */}
      {product.body && (
        <div className="mt-16 pt-10 border-t border-[var(--color-white-300)]">
          <div className="prose prose-lg max-w-none text-[var(--color-gray-100)] leading-relaxed">
            <PortableText value={product.body as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </div>
      )}
    </div>
  )
}
