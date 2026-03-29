import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Product } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Acoustic Products',
  description: 'Browse our range of acoustic panels, ceiling panels, and custom solutions for any space in Singapore.',
}

const CATEGORY_LABELS: Record<string, string> = {
  'wall-panels': 'Wall Panels',
  'ceiling-panels': 'Ceiling Panels',
  'custom-solutions': 'Custom Solutions',
  soundproofing: 'Soundproofing',
}

export default async function ProductsPage() {
  const products: Product[] = await getAllProducts().catch(() => [])

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <div className="mb-14">
        <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm mb-4">
          Products
        </span>
        <h1
          className="text-[var(--color-dark-100)] m-0 mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 5vw, var(--fs-h2))',
            lineHeight: '112%',
            fontWeight: 500,
            letterSpacing: '-1.28px',
          }}
        >
          Acoustic Products &amp; Solutions
        </h1>
        <p className="text-[var(--color-gray-100)] text-base m-0 max-w-xl">
          Our dynamic range of acoustic panels reduces echo and matches your space, whether it&apos;s walls or ceilings.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-[var(--color-gray-200)]">Products coming soon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug.current}`}
              className="block no-underline group"
            >
              <div className="bg-[var(--color-white-200)] rounded-[16px] overflow-hidden">
                {product.mainImage && (
                  <div className="overflow-hidden rounded-t-[16px]">
                    <Image
                      src={urlFor(product.mainImage).width(300).height(240).url()}
                      alt={product.mainImage.alt || product.title}
                      width={300}
                      height={240}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  {product.category && (
                    <span className="text-[var(--color-gray-200)] text-xs uppercase tracking-wide mb-1 block">
                      {CATEGORY_LABELS[product.category] || product.category}
                    </span>
                  )}
                  <h2
                    className="text-[var(--color-dark-100)] m-0 text-base font-semibold group-hover:text-[var(--color-brand-orange)] transition-colors"
                  >
                    {product.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 bg-[var(--color-white-200)] rounded-[16px] p-10 text-center">
        <h2
          className="text-[var(--color-dark-100)] m-0 mb-3 text-2xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Not sure which product is right for you?
        </h2>
        <p className="text-[var(--color-gray-100)] text-base m-0 mb-6">
          Let us recommend the best acoustic solution for your space!
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[var(--color-brand-orange)] text-white rounded-[100px] px-6 py-3 text-base no-underline hover:bg-[var(--color-gray-100)] transition-colors"
        >
          Get Free Quote
        </Link>
      </div>
    </div>
  )
}
