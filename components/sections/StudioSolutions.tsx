'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopItem } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import { calculateShopPrice, formatSgd, getDefaultSelection, resolveShopSelection, type ShopQuoteSelection } from '@/lib/shopPricing'
import { formatCmDimensionLabel, getItemSizeLabel, formatThicknessLabel } from '@/lib/shopDisplay'

interface Props {
  shopItems: ShopItem[]
}

type LabelProductConfig = {
  title: string
  itemSlugs: string[]
  sizeId?: string
  thicknessId?: string
  description: string
  fallbackImage: string
}

const labelProducts: Record<string, LabelProductConfig> = {
  'bass-trap': {
    title: 'Bass Trap',
    itemSlugs: ['150mm-studio-bass-trap'],
    sizeId: '1200x600',
    thicknessId: '150mm',
    description: 'Control low-frequency buildup in corners.',
    fallbackImage: '/assets/webflow/696a4efbb798931f99abbc38_1.avif',
  },
  'wall-panel': {
    title: 'Wall Panel',
    itemSlugs: ['1200x600-studio-acoustic-panel', 'standard-flexi-acoustic-panel'],
    sizeId: '1200x600',
    description: 'Broadband wall reflections treatment.',
    fallbackImage: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png',
  },
  'first-reflection': {
    title: 'First Reflection',
    itemSlugs: ['1200x600-studio-acoustic-panel', 'standard-flexi-acoustic-panel'],
    sizeId: '1200x600',
    description: 'Treat first reflection side-wall points.',
    fallbackImage: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png',
  },
  'gobos': {
    title: 'Gobos',
    itemSlugs: ['square-studio-acoustic-panel', 'standard-flexi-acoustic-panel'],
    sizeId: '600x600',
    description: 'Freestanding panels for sound bleed control.',
    fallbackImage: '/assets/webflow/696a4efb6d770477375c64bd_6.png',
  },
  'ceiling-cloud': {
    title: 'Ceiling Cloud',
    itemSlugs: ['1200x600-studio-acoustic-panel', 'standard-flexi-acoustic-panel'],
    sizeId: '1200x600',
    description: 'Ceiling suspended cloud panels.',
    fallbackImage: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png',
  },
}

type ProductDetails = {
  title: string
  subtitle: string
  description: string
  image: string
  link: string
  price: string
}

function buildProductDetails(item: ShopItem, config: LabelProductConfig): ProductDetails {
  const defaults = getDefaultSelection(item)
  const selection: ShopQuoteSelection = {
    ...defaults,
    sizeId: config.sizeId || defaults.sizeId,
    thicknessId: config.thicknessId || defaults.thicknessId,
  }
  const price = calculateShopPrice(item, selection)
  const resolved = resolveShopSelection(item, selection)
  const sizeLabel = formatCmDimensionLabel(resolved.sizeOption) || getItemSizeLabel(item)
  const thicknessLabel = formatThicknessLabel(resolved.thicknessOption)
  const imageSrc = item.mainImage?.asset?._ref
    ? urlFor(item.mainImage).width(120).height(120).url()
    : config.fallbackImage
  const titleLabel = config.thicknessId ? thicknessLabel || sizeLabel : sizeLabel
  const subtitleParts = config.thicknessId
    ? [sizeLabel, item.shortDescription || config.description]
    : [thicknessLabel, item.shortDescription || config.description]

  return {
    title: `${titleLabel} ${config.title}`.trim(),
    subtitle: subtitleParts.filter(Boolean).join(' · ') || config.title,
    description: item.shortDescription || config.description,
    image: imageSrc,
    link: `/shop/${item.slug.current}`,
    price: `From ${formatSgd(price.total)}`,
  }
}

interface StudioLabel {
  id: string
  label: string
  productKey: keyof typeof labelProducts
  top?: string
  bottom?: string
  left?: string
  right?: string
}

export default function StudioSolutions({ shopItems }: Props) {
  const [hoveredLabel, setHoveredLabel] = useState<{
    cardId: string
    labelId: string
  } | null>(null)

  const itemsBySlug = useMemo(
    () => new Map(shopItems.map((item) => [item.slug.current, item] as const)),
    [shopItems]
  )

  const getProductDetails = (labelKey: keyof typeof labelProducts): ProductDetails | null => {
    const config = labelProducts[labelKey]
    const item = config.itemSlugs.flatMap((slug) => {
      const found = itemsBySlug.get(slug)
      return found ? [found] : []
    })[0]

    return item ? buildProductDetails(item, config) : null
  }

  const studioCards: {
    id: string
    title: string
    image: string
    problem: string
    result: string
    labels: StudioLabel[]
  }[] = [
    {
      id: 'hdb-bedroom',
      title: 'HDB Bedroom Studio',
      image: '/assets/webflow/696a4efbb798931f99abbc38_1.avif',
      problem: 'Muddiness, boxy sound, neighbour complaints.',
      result: 'Cleaner mixes, tighter bass, more accurate monitoring.',
      labels: [
        { id: 'wall-panels', label: 'Wall Panels', productKey: 'wall-panel', top: '15%', left: '15%' },
        { id: 'bass-traps', label: 'Bass Traps', productKey: 'bass-trap', bottom: '20%', left: '15%' },
      ],
    },
    {
      id: 'condo-mixing',
      title: 'Condo Mixing Room',
      image: '/assets/webflow/696a4efb255645d4686056e2_7.png',
      problem: 'Unclear low-end, harsh highs, translation issues.',
      result: 'Balanced room, better mixes that translate anywhere.',
      labels: [
        { id: 'bass-traps', label: 'Bass Traps', productKey: 'bass-trap', top: '25%', left: '15%' },
        { id: 'first-reflection', label: 'First Reflection', productKey: 'first-reflection', top: '35%', right: '20%' },
      ],
    },
    {
      id: 'drum-room',
      title: 'Drum Room + Gobos',
      image: '/assets/webflow/696a4efb6d770477375c64bd_6.png',
      problem: 'Excessive reflections, uncontrolled bleed.',
      result: 'Focused drums, tighter sound, more punch.',
      labels: [
        { id: 'gobos', label: 'Gobos', productKey: 'gobos', top: '35%', left: '20%' },
        { id: 'bass-traps', label: 'Bass Traps', productKey: 'bass-trap', bottom: '25%', left: '45%' },
      ],
    },
    {
      id: 'ceiling-cloud-tight',
      title: 'Ceiling Cloud for Tight Spaces',
      image: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png',
      problem: 'Low ceiling, flutter echo, no space for thick panels.',
      result: 'Controlled reflections without losing headroom.',
      labels: [
        { id: 'ceiling-cloud', label: 'Ceiling Cloud', productKey: 'ceiling-cloud', top: '12%', left: '42%' },
        { id: 'wall-panels', label: 'Wall Panels', productKey: 'wall-panel', bottom: '30%', right: '18%' },
      ],
    },
  ]

  return (
    <section className="px-4 py-12 md:px-12 bg-white text-black">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between mb-8 border-b border-black/5 pb-4">
          <div>
            <h2
              className="text-2xl sm:text-[28px] font-bold text-[#0a0a0a] leading-tight"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}
            >
              Solutions for every studio.
            </h2>
          </div>
          <Link href="/spaces" className="text-xs font-bold text-[var(--color-brand-orange-dark)] hover:underline flex items-center gap-1">
            View all solutions <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {studioCards.map((card) => (
            <div
              key={card.id}
              className="glass-card flex flex-col rounded-[24px] border border-black/8 bg-white/70 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.03)] overflow-visible group"
            >
              <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden mb-4 border border-black/5 bg-black/5">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 22vw"
                  className="object-cover"
                />

                {card.labels.map((l) => {
                  const prod = getProductDetails(l.productKey)
                  const isHovered = hoveredLabel?.cardId === card.id && hoveredLabel?.labelId === l.id

                  if (!prod) return null

                  return (
                    <div
                      key={l.id}
                      className="absolute z-20"
                      style={{
                        top: l.top || 'auto',
                        bottom: l.bottom || 'auto',
                        left: l.left || 'auto',
                        right: l.right || 'auto',
                      }}
                      onMouseEnter={() => setHoveredLabel({ cardId: card.id, labelId: l.id })}
                      onMouseLeave={() => setHoveredLabel(null)}
                    >
                      <Link
                        href={prod.link}
                        className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-orange)] border border-orange-500/20 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-black shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white"
                      >
                        <span className="h-1 w-1 rounded-full bg-black animate-ping" />
                        {l.label}
                      </Link>

                      {isHovered && (
                        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-60 bg-white/95 rounded-xl p-3.5 border border-black/10 shadow-2xl backdrop-blur-sm flex gap-3 animate-fade-in text-black z-30 pointer-events-auto">
                          <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 border border-black/5">
                            <Image src={prod.image} alt={prod.title} fill className="object-cover" />
                          </div>

                          <div className="flex flex-col justify-between">
                            <div>
                              <h4 className="text-[10px] font-extrabold text-[var(--color-dark-100)] leading-tight">
                                {prod.title}
                              </h4>
                              <p className="text-[9px] text-black/50 leading-tight mt-0.5 font-semibold">
                                {prod.subtitle}
                              </p>
                              <p className="text-[9px] text-black/50 leading-tight mt-0.5 font-semibold">
                                {prod.description}
                              </p>
                            </div>
                            <div className="mt-1.5 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-black">{prod.price}</span>
                              <Link
                                href={prod.link}
                                className="text-[9px] font-bold text-[var(--color-brand-orange-dark)] hover:underline"
                              >
                                View product →
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--color-dark-100)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {card.title}
                  </h3>

                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] leading-relaxed">
                      <span className="font-bold text-black/80 block uppercase text-[8px] tracking-wider mb-0.5">Problem:</span>
                      <span className="text-black/70 font-semibold">{card.problem}</span>
                    </div>

                    <div className="text-[11px] leading-relaxed">
                      <span className="font-bold text-black/80 block uppercase text-[8px] tracking-wider mb-0.5">Result:</span>
                      <span className="text-black/70 font-semibold">{card.result}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
