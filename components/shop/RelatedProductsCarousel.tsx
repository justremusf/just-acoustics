'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'

export type RelatedProductCard = {
  id: string
  title: string
  slug: string
  image?: string
  imageAlt: string
  priceLabel: string
}

export default function RelatedProductsCarousel({ items }: { items: RelatedProductCard[] }) {
  const railRef = useRef<HTMLDivElement | null>(null)

  const move = (direction: -1 | 1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({
      left: direction * Math.max(280, rail.clientWidth * 0.78),
      behavior: 'smooth',
    })
  }

  return (
    <div className="mt-6">
      <div
        ref={railRef}
        className="no-scrollbar grid snap-x snap-mandatory auto-cols-[min(82vw,330px)] grid-flow-col gap-4 overflow-x-auto pb-3 sm:auto-cols-[min(44vw,340px)] lg:auto-cols-[calc((100%_-_32px)/3)]"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/shop/${item.slug}`}
            className="group min-w-0 snap-start overflow-hidden rounded-[24px] border border-black/8 bg-white/82 no-underline shadow-[0_18px_46px_rgba(15,23,42,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(15,23,42,0.12)]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-white-200)]">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 639px) 82vw, (max-width: 1023px) 44vw, 33vw"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  quality={72}
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
              ) : null}
            </div>
            <div className="flex min-h-[118px] items-start justify-between gap-4 p-5">
              <div>
                <h3 className="m-0 text-[22px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h3>
                <p className="m-0 mt-2 text-sm font-semibold text-[var(--color-gray-100)]">{item.priceLabel}</p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--color-dark-100)] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous related products"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next related products"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
