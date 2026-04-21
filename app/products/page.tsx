import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Product } from '@/lib/types'
import FAQ from '@/components/sections/FAQ'
import type { FaqItem } from '@/components/sections/FAQ'

const PRODUCTS_FAQS: FaqItem[] = [
  {
    q: 'Should I use wall panels or ceiling panels?',
    a: 'Wall panels are most effective for echo and flutter echo. Ceiling panels (clouds) help in open-plan or tall-ceiling spaces where wall placement is limited.',
  },
  {
    q: 'What is the difference between standard and custom panels?',
    a: 'Standard panels come in fixed sizes and colours. Custom panels are sized and finished to match specific dimensions or visual briefs.',
  },
  {
    q: 'Does panel thickness matter?',
    a: 'Yes. Thicker panels (50mm+) absorb more low-mid frequencies and are better for studios or vocal booths. 25mm panels work well for general echo control.',
  },
  {
    q: 'Are your panels fire-rated?',
    a: 'Our commercial-grade panels meet fire safety requirements for Singapore. We can provide certificates on request for project submissions.',
  },
  {
    q: 'Do acoustic panels block outside noise?',
    a: 'No. Acoustic panels reduce echo and reverberation inside the room. They do not stop sound from entering through walls, ceilings, or floors.',
  },
]

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

      <FAQ items={PRODUCTS_FAQS} title="Product Questions" subtitle="Common questions before choosing a panel." />
    </div>
  )
}
