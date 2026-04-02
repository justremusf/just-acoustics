import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import ShimmerButton from '@/components/ui/shimmer-button'

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
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[620px]">
            <span className="soft-pill">Solutions</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">Acoustic Panels that fit your space</h2>
            <p className="home-copy mt-4 max-w-[54ch]">
              Browse the most common treatment types we recommend when a room needs clearer speech, lower echo, or better listening comfort.
            </p>
          </div>
          <Link href="/products" className="home-link inline-flex items-center gap-2 self-start md:self-auto">
            See all solutions <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
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
                  className="glass-card group block overflow-hidden rounded-[24px] border border-white/55 bg-white/35 no-underline shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="overflow-hidden rounded-t-[20px] rounded-b-none">
                    <Image
                      src={imgSrc}
                      alt={p.title}
                      width={320}
                      height={220}
                      className="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={isFallback}
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                      Product
                    </span>
                    <h3 className="mt-3 text-[24px] leading-[1.04] font-medium tracking-[-0.9px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {p.title}
                    </h3>
                  </div>
                </Link>
              )
            })}

            <div className="glass-card flex flex-col justify-between rounded-[24px] border border-white/55 bg-white/35 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">Need direction</span>
                <h3 className="mt-3 text-[24px] leading-[1.04] font-medium tracking-[-0.9px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Which solution fits my space?
                </h3>
                <p className="mt-4 text-sm leading-6 text-[var(--color-gray-100)]">Tell us about the room and we’ll point you toward the right panel system.</p>
              </div>
              <Link href="/contact" className="mt-6 no-underline">
                <ShimmerButton className="h-auto w-full px-5 py-3 text-sm">Contact Us</ShimmerButton>
              </Link>
            </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:gap-4 xl:grid-cols-4">
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
                    className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={isFallback}
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">Product</span>
                  <h3 className="mt-3 text-[26px] leading-[1.04] font-medium tracking-[-1px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {p.title}
                  </h3>
                </div>
              </Link>
            )
          })}

          <div className="glass-card col-span-2 flex flex-col justify-between rounded-[24px] border border-white/55 bg-white/35 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 xl:col-span-1">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">Need direction</span>
              <h3 className="mt-3 text-[28px] leading-[1.04] font-medium tracking-[-1px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                Not sure which panel is right for you?
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-[var(--color-gray-100)]">We’ll recommend the best acoustic treatment based on the room, not guesswork.</p>
            </div>
            <Link href="/contact" className="mt-6 no-underline">
              <ShimmerButton className="h-auto px-6 py-3 text-sm">Contact Us</ShimmerButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
