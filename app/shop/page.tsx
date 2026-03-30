import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllShopItems } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { ShopItem } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Shop — Just Acoustics',
  description: 'Shop acoustic panels and soundproofing products from Just Acoustics, Singapore.',
}

const CATEGORY_LABELS: Record<string, string> = {
  'package-deals': 'Package Deals',
  'standard-panels': 'Standard Panels',
  'custom-panels': 'Custom Panels',
  'ceiling-panels': 'Ceiling Panels',
  'accessories': 'Accessories',
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const allItems: ShopItem[] = await getAllShopItems().catch(() => [])
  const filtered = category ? allItems.filter((i) => i.category === category) : allItems

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <div className="mb-14">
        <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm mb-4">
          Shop
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
          Shop Acoustic Products
        </h1>
        <p className="text-[var(--color-gray-100)] text-base m-0 max-w-xl">
          Browse acoustic panels, package deals, and custom solutions for your space.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/shop"
          className={`rounded-[100px] px-5 py-2 text-sm no-underline transition-colors border ${
            !category
              ? 'bg-[var(--color-dark-100)] text-white border-[var(--color-dark-100)]'
              : 'border-[var(--color-gray-300)] text-[var(--color-gray-200)] hover:border-[var(--color-dark-100)] hover:text-[var(--color-dark-100)]'
          }`}
        >
          All
        </Link>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/shop?category=${value}`}
            className={`rounded-[100px] px-5 py-2 text-sm no-underline transition-colors border ${
              category === value
                ? 'bg-[var(--color-dark-100)] text-white border-[var(--color-dark-100)]'
                : 'border-[var(--color-gray-300)] text-[var(--color-gray-200)] hover:border-[var(--color-dark-100)] hover:text-[var(--color-dark-100)]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-gray-200)]">No products yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <Link
              key={item._id}
              href={`/shop/${item.slug.current}`}
              className="block no-underline group rounded-[16px] overflow-hidden bg-[var(--color-white-200)] transition-shadow duration-300"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}
            >
              {item.mainImage?.asset._ref && (
                <div className="overflow-hidden aspect-square">
                  <Image
                    src={urlFor(item.mainImage).width(400).height(400).url()}
                    alt={item.mainImage.alt || item.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                {item.category && (
                  <span className="text-[var(--color-gray-200)] text-xs uppercase tracking-wide mb-1 block">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </span>
                )}
                <h2 className="text-[var(--color-dark-100)] m-0 text-base font-semibold group-hover:text-[var(--color-brand-orange)] transition-colors">
                  {item.title}
                </h2>
                {item.price != null && (
                  <p className="text-[var(--color-gray-200)] text-sm m-0 mt-1">S${item.price.toLocaleString()}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
