import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import ShimmerButton from '@/components/ui/shimmer-button'

const FALLBACK_PRODUCTS = [
  { _id: '1', title: 'Acoustic Wall Panels', slug: { current: 'acoustic-wall-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: '/assets/webflow/696a4efbb798931f99abbc38_1.avif' } },
  { _id: '2', title: 'Acoustic Ceiling Panels', slug: { current: 'acoustic-ceiling-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png' } },
  { _id: '4', title: 'Custom Print Panels', slug: { current: 'custom-print-acoustic-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: '/assets/webflow/696a4efb30cf5a46b9a7edd3_4.png' } },
]

interface FallbackProduct {
  _id: string
  title: string
  slug: { current: string }
  mainImage: {
    _type: 'image'
    asset: { _ref: string; _type: 'reference' }
    _fallbackSrc?: string
  }
}

interface Props {
  products?: Product[]
}

export default function ProductsGrid({ products }: Props) {
  const featuredSlugs = new Set([
    'acoustic-wall-panels',
    'acoustic-ceiling-panels',
    'custom-print-acoustic-panels',
  ])

  const items =
    products && products.length > 0
      ? products.filter((product) => featuredSlugs.has(product.slug.current))
      : FALLBACK_PRODUCTS

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[620px]">
            <span className="soft-pill">Solutions</span>
            <h2 className="home-heading mt-5 text-[var(--color-dark-100)]">Acoustic Panels that fit your space</h2>
            <p className="home-copy mt-5 max-w-[54ch]">
              Browse the most common treatment types we recommend when a room needs clearer speech, lower echo, or better listening comfort.
            </p>
          </div>
          <Link href="/products" className="home-link hidden items-center gap-2 self-start md:inline-flex md:self-auto">
            See all solutions <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Single responsive grid — no hidden/duplicate rendering */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => {
            const p = product as Product | FallbackProduct
            const isFallback = '_fallbackSrc' in (p.mainImage || {})
            const imgSrc = isFallback
              ? (p.mainImage as FallbackProduct['mainImage'])._fallbackSrc!
              : p.mainImage
              ? urlFor(p.mainImage as Product['mainImage'] & {}).width(500).url()
              : '/placeholder.jpg'

            return (
              <Link
                key={p._id}
                href={`/products/${p.slug.current}`}
                className="glass-card group overflow-hidden rounded-[24px] border border-white/55 bg-white/35 no-underline shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="overflow-hidden rounded-t-[20px] rounded-b-none">
                  <Image
                    src={imgSrc}
                    alt={p.title}
                    width={320}
                    height={240}
                    sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) calc(33vw - 32px), calc(25vw - 32px)"
                    className="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[240px]"
                    unoptimized={isFallback}
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                    Product
                  </span>
                  <h3
                    className="mt-3 text-[24px] leading-[1.04] font-medium tracking-[-0.9px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)] md:text-[26px] md:tracking-[-1px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {p.title}
                  </h3>
                </div>
              </Link>
            )
          })}

          {/* CTA card — always last in the grid */}
          <div className="glass-card col-span-1 flex flex-col justify-between rounded-[24px] border border-white/55 bg-white/35 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 md:p-6 md:text-center xl:col-span-1">
            <div className="md:mx-auto md:max-w-[620px]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">Need direction</span>
              <h3
                className="mt-3 text-[24px] leading-[1.04] font-medium tracking-[-0.9px] text-[var(--color-dark-100)] md:text-[28px] md:tracking-[-1px]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Not sure which panel is right for you?
              </h3>
              <p className="mt-4 text-sm leading-6 text-[var(--color-gray-100)] md:text-[15px] md:leading-7">
                We&apos;ll recommend the best acoustic treatment based on the room, not guesswork.
              </p>
            </div>
            {/* Mobile: full-width shimmer button */}
            <Link href="/contact" className="mt-6 no-underline md:hidden">
              <ShimmerButton className="h-auto w-full px-5 py-3 text-sm">Contact Us</ShimmerButton>
            </Link>
            {/* Desktop: text link */}
            <Link
              href="/contact"
              className="mt-6 hidden items-center gap-2 self-center text-sm font-semibold text-[var(--color-dark-100)] no-underline transition-colors hover:text-[var(--color-brand-orange)] md:inline-flex"
            >
              Contact Us <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Mobile-only "See all" link row */}
          <div className="flex justify-end px-1 md:hidden">
            <Link href="/products" className="home-link inline-flex items-center gap-2">
              See all solutions <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
