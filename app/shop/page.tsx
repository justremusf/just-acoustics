import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllShopItems } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { ShopItem } from '@/lib/types'
import ShopFilters from '@/components/sections/ShopFilters'
import FAQ from '@/components/sections/FAQ'
import type { FaqItem } from '@/components/sections/FAQ'

const SHOP_FAQS: FaqItem[] = [
  {
    q: 'What is the typical lead time for panels?',
    a: 'Standard panels are usually ready within 5–7 business days. Custom panels and made-to-order sizes take 2–3 weeks from confirmation.',
  },
  {
    q: 'Do you deliver and install, or is this self-install?',
    a: 'Both options are available. You can purchase panels for self-installation, or we can quote delivery and professional installation as a service.',
  },
  {
    q: 'How many panels do I need for my room?',
    a: 'As a guide, treating 20–30% of wall surface area gives a noticeable improvement. We are happy to help you calculate coverage for your specific room.',
  },
  {
    q: 'Can I mix different panel categories in one order?',
    a: 'Yes. You can combine wall panels, ceiling panels, and accessories in a single order. Contact us if you need a bundled price.',
  },
  {
    q: 'Do you work on commercial projects?',
    a: 'Yes. Our shop panels are used in offices, restaurants, churches, and studios. For larger commercial projects, reach out for a project consultation.',
  },
]

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
  accessories: 'Accessories',
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string }> }) {
  const { category, sort } = await searchParams
  const allItems: ShopItem[] = await getAllShopItems().catch(() => [])

  const filtered = category ? allItems.filter((i) => i.category === category) : allItems
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return (a.price ?? Infinity) - (b.price ?? Infinity)
    if (sort === 'price-desc') return (b.price ?? -Infinity) - (a.price ?? -Infinity)
    return 0
  })

  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex min-h-[184px] flex-col gap-5 md:min-h-0">
        <span className="soft-pill">Shop</span>
        <h1 className="page-title">Shop Acoustic Panels Online</h1>
        <p className="page-subtitle">
          Browse package deals, standard panels, and made-to-order options with upfront pricing. If you are unsure what fits, use the consultation flow before buying.
        </p>
      </section>

      <section className="home-shell page-hero-shell flex min-h-[110px] flex-col gap-4 md:min-h-0">
        <ShopFilters
          category={category}
          sort={sort}
          categories={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
        />
      </section>

      {sorted.length === 0 ? (
        <section className="glass-card page-hero-shell">
          <p className="page-card-copy">No products yet. Check back soon.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {sorted.map((item, index) => (
            <Link
              key={item._id}
              href={'/shop/' + item.slug.current}
              className="page-card glass-card group h-full transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="page-card-image aspect-square bg-[var(--color-white-200)]">
                {item.mainImage?.asset._ref && (
                  <Image
                    src={urlFor(item.mainImage).width(720).height(720).url()}
                    alt={item.mainImage.alt || item.title}
                    width={720}
                    height={720}
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) calc(50vw - 40px), calc(25vw - 40px)"
                    priority={index < 2}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="page-card-body min-h-[136px]">
                {item.category && <p className="page-kicker">{CATEGORY_LABELS[item.category] || item.category}</p>}
                <h2 className="page-card-title transition-colors group-hover:text-[var(--color-brand-orange)]">{item.title}</h2>
                {item.price != null && <p className="page-card-copy">S${item.price.toLocaleString()}</p>}
                <span className="page-link mt-1">Request a Quote <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <FAQ items={SHOP_FAQS} title="Shop Questions" subtitle="Everything you need to know before ordering." />
    </div>
  )
}
