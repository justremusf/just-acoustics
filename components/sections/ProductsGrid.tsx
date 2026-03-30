import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import ShimmerButton from '@/components/ui/shimmer-button'

// Fallback products matching the current site
const FALLBACK_PRODUCTS = [
  { _id: '1', title: 'Acoustic Wall Panels', slug: { current: 'acoustic-wall-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbb798931f99abbc38_1.avif' } },
  { _id: '2', title: 'Acoustic Ceiling Panels', slug: { current: 'acoustic-ceiling-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb0907dcf8dacbcd54_2.png' } },
  { _id: '3', title: 'Acoustic Fabric Wall', slug: { current: 'acoustic-fabric-wall' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbd1be500fee866d95_3.png' } },
  { _id: '4', title: 'Custom Print Panels', slug: { current: 'custom-print-acoustic-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb30cf5a46b9a7edd3_4.png' } },
  { _id: '5', title: 'Office Soundproofing', slug: { current: 'office-soundproofing' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbd62acdbb9d45cd3d_5.png' } },
  { _id: '6', title: 'Polyester Felt Panels', slug: { current: 'polyester-felt-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb6d770477375c64bd_6.png' } },
  { _id: '7', title: 'Custom Acoustic Panel', slug: { current: 'custom-acoustic-panels' }, mainImage: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const }, _fallbackSrc: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb255645d4686056e2_7.png' } },
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
  const items = products && products.length > 0 ? products.slice(0, 7) : FALLBACK_PRODUCTS

  return (
    <section className="mt-16 mb-16">
      {/* Section heading */}
      <div className="max-w-[1280px] mx-auto px-5 mb-10 md:mb-12 text-center">
        <h2
          className="text-[var(--color-dark-100)] m-0 mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
            lineHeight: '124%',
            fontWeight: 500,
            letterSpacing: '-1.04px',
          }}
        >
          Acoustic Solutions
        </h2>
        <p className="text-[var(--color-gray-100)] text-base m-0 max-w-xl mx-auto">
          Our dynamic range of acoustic panels reduces echo and matches your space, whether it&apos;s walls or ceilings.
        </p>
      </div>

      {/* Mobile: horizontal scroll row */}
      <div className="md:hidden overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-3 px-5">
          {items.map((product) => {
            const p = product as Product | FallbackProduct
            const isFallback = '_fallbackSrc' in (p.mainImage || {})
            const imgSrc = isFallback
              ? (p.mainImage as FallbackProduct['mainImage'])._fallbackSrc!
              : p.mainImage
              ? urlFor(p.mainImage as Product['mainImage'] & {}).width(400).url()
              : '/placeholder.jpg'

            return (
              <Link
                key={p._id}
                href={`/products/${p.slug.current}`}
                className="flex-none w-[72vw] block bg-[var(--color-white-200)] rounded-[16px] overflow-hidden no-underline group"
              >
                <div className="overflow-hidden rounded-t-[16px]">
                  <Image
                    src={imgSrc}
                    alt={p.title}
                    width={300}
                    height={220}
                    className="w-full object-cover"
                    unoptimized={isFallback}
                  />
                </div>
                <h3 className="text-[var(--color-dark-100)] px-4 pt-3 pb-4 m-0 text-lg font-semibold">
                  {p.title}
                </h3>
              </Link>
            )
          })}

          {/* CTA card */}
          <div className="flex-none w-[72vw] bg-[var(--color-brand-orange)] rounded-[16px] flex flex-col items-center justify-center p-6 text-center gap-3">
            <h3 className="text-white m-0 text-xl font-semibold">Which works for me?</h3>
            <p className="text-white/80 text-base m-0">Let us recommend the best solution for you!</p>
            <Link
              href="/contact"
              className="mt-2 inline-block bg-white text-[var(--color-dark-100)] rounded-[100px] px-5 py-2.5 text-sm no-underline font-semibold"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => {
            const p = product as Product | FallbackProduct
            const isFallback = '_fallbackSrc' in (p.mainImage || {})
            const imgSrc = isFallback
              ? (p.mainImage as FallbackProduct['mainImage'])._fallbackSrc!
              : p.mainImage
              ? urlFor(p.mainImage as Product['mainImage'] & {}).width(400).url()
              : '/placeholder.jpg'

            return (
              <Link
                key={p._id}
                href={`/products/${p.slug.current}`}
                className="block bg-[var(--color-white-200)] rounded-[16px] overflow-hidden no-underline group"
              >
                <div className="overflow-hidden rounded-t-[16px]">
                  <Image
                    src={imgSrc}
                    alt={p.title}
                    width={300}
                    height={240}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={isFallback}
                  />
                </div>
                <h3 className="text-[var(--color-dark-100)] px-4 pt-4 pb-4 m-0 text-lg font-semibold group-hover:text-[var(--color-brand-orange)] transition-colors">
                  {p.title}
                </h3>
              </Link>
            )
          })}

          {/* CTA card — spans 2 cols at 3-col breakpoint, 1 col at 4-col (fills remaining space) */}
          <div className="col-span-2 lg:col-span-1 bg-[var(--color-white-200)] rounded-[16px] flex flex-col items-center justify-center p-6 text-center gap-3">
            <h3 className="text-[var(--color-dark-100)] m-0 text-xl font-semibold">Which works for me?</h3>
            <p className="text-[var(--color-gray-200)] text-base m-0">Let us recommend the best solution for you!</p>
            <Link href="/contact" className="mt-2 no-underline">
              <ShimmerButton className="text-sm px-5 py-2.5 h-auto">
                Get Free Quote
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
