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
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Solutions</span>
        <h1 className="page-title">Acoustic Products</h1>
        <p className="page-subtitle">
          Browse wall panels, ceiling treatments, and custom acoustic products built to improve clarity while fitting the space visually.
        </p>
      </section>

      {products.length === 0 ? (
        <section className="glass-card page-hero-shell">
          <p className="page-card-copy">Products coming soon.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product._id}
              href={'/products/' + product.slug.current}
              className="page-card glass-card group transition-transform duration-300 hover:-translate-y-1"
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
                {product.category && <p className="page-kicker">{CATEGORY_LABELS[product.category] || product.category}</p>}
                <h2 className="page-card-title transition-colors group-hover:text-[var(--color-brand-orange)]">{product.title}</h2>
                <span className="page-link mt-1">Learn more <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="home-shell page-hero-shell text-center">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-5">
          <span className="soft-pill">Need Help Choosing</span>
          <h2 className="page-card-title text-[clamp(26px,3vw,38px)]">Not sure which product you need?</h2>
          <p className="page-subtitle max-w-[52ch]">
            Share the room type, noise issue, and a few photos. We will point you to the right product for the space before you decide.
          </p>
          <Link href="/contact" className="page-cta">Free Consultation</Link>
        </div>
      </section>
    </div>
  )
}
