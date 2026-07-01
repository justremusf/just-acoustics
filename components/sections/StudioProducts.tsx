'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopItem } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import {
  calculateShopPrice,
  formatSgd,
  getDefaultSelection,
  resolveShopSelection,
  type ShopQuoteSelection,
} from '@/lib/shopPricing'
import { formatCmDimensionLabel, formatThicknessLabel, getItemSizeLabel, getPackageSummary } from '@/lib/shopDisplay'

interface Props {
  shopItems: ShopItem[]
}

type StudioCardConfig = {
  id: string
  itemSlugs: string[]
  packageId?: string
  sizeId?: string
  quantity?: number
  badge?: string
  fallbackImage: string
  graphData: number[]
  features: string[]
}

type StudioProductCard = {
  id: string
  item: ShopItem
  title: string
  subtitle: string
  includes: string
  badge?: string
  imageSrc: string
  priceLabel: string
  priceValue: number
  packageId?: string
  selection: ShopQuoteSelection
  features: string[]
  graphData: number[]
}

const STUDIO_CARD_CONFIGS: StudioCardConfig[] = [
  {
    id: 'single-panel',
    itemSlugs: ['square-studio-acoustic-panel', 'standard-flexi-acoustic-panel', '1200x600-studio-acoustic-panel'],
    sizeId: '600x600',
    quantity: 1,
    badge: 'Best seller',
    fallbackImage: '/assets/webflow/696a4efbb798931f99abbc38_1.avif',
    graphData: [15, 45, 95, 98, 97, 95],
    features: [
      'Broadband absorption across the frequency range',
      'Reduce early reflections and flutter echo',
      'Improve clarity and stereo imaging',
      'Made in Singapore',
    ],
  },
  {
    id: 'starter-kit',
    itemSlugs: ['1200x600-studio-acoustic-panel', 'standard-flexi-acoustic-panel'],
    packageId: 'starter',
    sizeId: '1200x600',
    quantity: 1,
    badge: 'Starter package',
    fallbackImage: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png',
    graphData: [20, 50, 96, 99, 98, 96],
    features: [
      'Great first reflection treatment package',
      'Complete kit with easy mounting brackets',
      'Ideal for small studio rooms',
      'Made in Singapore',
    ],
  },
  {
    id: 'impact-kit',
    itemSlugs: ['1200x600-studio-acoustic-panel', 'standard-flexi-acoustic-panel'],
    packageId: 'impact',
    sizeId: '1200x600',
    quantity: 1,
    badge: 'Mix room package',
    fallbackImage: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png',
    graphData: [25, 60, 98, 100, 99, 97],
    features: [
      'Broadband absorption with wider coverage',
      'Control early reflections and bass buildup',
      'Recommended for dedicated mix rooms',
      'Made in Singapore',
    ],
  },
]

function buildCard(item: ShopItem, config: StudioCardConfig): StudioProductCard {
  const defaults = getDefaultSelection(item)
  const selection: ShopQuoteSelection = {
    ...defaults,
    sizeId: config.sizeId || defaults.sizeId,
    packageId: config.packageId,
    quantity: config.quantity ?? defaults.quantity,
  }
  const price = calculateShopPrice(item, selection)
  const resolved = resolveShopSelection(item, selection)
  const resolvedSize = item.sizeOptions?.find((option) => option.id === selection.sizeId && option.available !== false)
    || item.sizeOptions?.find((option) => option.available !== false)
  const resolvedPackage = config.packageId
    ? item.packageOptions?.find((option) => option.id === config.packageId && option.available !== false)
    : undefined
  const thicknessLabel = formatThicknessLabel(resolved.thicknessOption)
  const imageSrc = item.mainImage?.asset?._ref
    ? urlFor(item.mainImage).width(600).height(450).url()
    : config.fallbackImage

  const sizeLabel = formatCmDimensionLabel(resolvedSize) || getItemSizeLabel(item)
  const title = config.packageId
    ? resolvedPackage
      ? `${resolvedPackage.panelCount || 0}-Panel ${resolvedPackage.name || 'Package'} Kit`
      : `${sizeLabel} Studio Kit`
    : item.productLine === 'bass-trap'
      ? `${thicknessLabel || sizeLabel} Bass Trap`
      : `${sizeLabel} Acoustic Panel`
  const subtitle = config.packageId
    ? [sizeLabel, resolvedPackage?.bestFor, item.shortDescription || item.title].filter(Boolean).join(' · ')
    : item.shortDescription || item.title
  const includes = config.packageId
    ? resolvedPackage?.description || getPackageSummary(resolvedPackage) || item.shortDescription || item.title
    : item.shortDescription || item.title

  return {
    id: config.id,
    item,
    title,
    subtitle,
    includes,
    badge: config.badge,
    imageSrc,
    priceLabel: formatSgd(price.total),
    priceValue: price.total,
    packageId: config.packageId,
    selection,
    features: item.features?.length ? item.features.slice(0, 4) : config.features,
    graphData: config.graphData,
  }
}

export default function StudioProducts({ shopItems }: Props) {
  const [activeCard, setActiveCard] = useState<StudioProductCard | null>(null)
  const [selection, setSelection] = useState<ShopQuoteSelection | null>(null)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', roomType: 'Music Studio', notes: '' })
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const itemsBySlug = useMemo(
    () => new Map(shopItems.map((item) => [item.slug.current, item] as const)),
    [shopItems]
  )

  const cards = useMemo(
    () =>
      STUDIO_CARD_CONFIGS.flatMap((config) => {
        const item = config.itemSlugs.flatMap((slug) => {
          const found = itemsBySlug.get(slug)
          return found ? [found] : []
        })[0]

        return item ? [buildCard(item, config)] : []
      }),
    [itemsBySlug]
  )

  const activeImageSrc = activeCard?.item.mainImage?.asset?._ref
    ? urlFor(activeCard.item.mainImage).width(720).height(450).url()
    : activeCard?.imageSrc || '/assets/webflow/696a4efb30cf5a46b9a7edd3_4.png'

  const handleQuickView = (card: StudioProductCard) => {
    setSelection(card.selection)
    setActiveCard(card)
    setDetailsOpen(false)
    setStatus('idle')
    setMessage('')
  }

  const setSelectionValue = <K extends keyof ShopQuoteSelection>(key: K, value: ShopQuoteSelection[K]) => {
    if (!selection) return
    setSelection((current) => (current ? { ...current, [key]: value } : null))
    setStatus('idle')
    setMessage('')
  }

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!activeCard || !selection) return

    setStatus('submitting')
    setMessage('')

    const response = await fetch('/api/shop-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: activeCard.item.slug.current,
        selection,
        customer,
      }),
    }).catch(() => null)

    if (!response?.ok) {
      const body = response ? await response.json().catch(() => null) : null
      setStatus('error')
      setMessage(body?.error || 'Could not send the quote request.')
      return
    }

    const body = await response.json().catch(() => null)
    setStatus('success')
    setMessage(body?.quoteReference ? `Submitted! Ref: ${body.quoteReference}` : 'Quote submitted successfully!')
  }

  return (
    <section className="px-4 py-12 md:px-12 bg-white text-black">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between mb-8 border-b border-black/5 pb-4">
          <div>
            <h2
              className="text-2xl sm:text-[28px] font-bold text-[#0a0a0a]"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}
            >
              Shop acoustic panels & kits.
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-[var(--color-brand-orange-dark)] hover:underline flex items-center gap-1">
            View all products <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="glass-card flex flex-col justify-between rounded-[24px] border border-black/8 bg-white/70 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)]"
            >
              <div>
                <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-black/5 mb-4 border border-black/5">
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover"
                  />
                  {card.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-[var(--color-brand-orange)] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-black">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[var(--color-dark-100)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  {card.title}
                </h3>
                <p className="text-xs text-black/50 font-semibold mt-1">{card.subtitle}</p>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-xl font-extrabold text-black">{card.priceLabel}</span>
                </div>

                <p className="text-[10px] text-black/50 font-bold mt-1">{card.includes}</p>

                <div className="mt-4 border-t border-black/5 pt-3 flex items-center gap-1">
                  {card.item.colourOptions?.slice(0, 5).map((col) => (
                    <span
                      key={col.id}
                      className="block h-4.5 w-4.5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: col.hex || '#ccc' }}
                      title={col.name}
                    />
                  ))}
                  {card.item.colourOptions && card.item.colourOptions.length > 5 && (
                    <span className="text-[9px] text-black/50 font-bold ml-1">+{card.item.colourOptions.length - 5}</span>
                  )}
                </div>

                <div className="mt-4 h-14 w-full flex flex-col justify-end bg-black/5 rounded-xl px-3 py-1.5 border border-black/5">
                  <svg className="w-full h-8" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                      d={`M 0 30 Q 25 ${30 - card.graphData[1] / 4} 50 ${30 - card.graphData[2] / 4.5} T 100 ${30 - card.graphData[5] / 4}`}
                      fill="none"
                      stroke="var(--color-brand-orange)"
                      strokeWidth="1.5"
                    />
                    <path
                      d={`M 0 30 Q 25 ${30 - card.graphData[1] / 4} 50 ${30 - card.graphData[2] / 4.5} T 100 ${30 - card.graphData[5] / 4} L 100 30 Z`}
                      fill="url(#cardGrad)"
                      opacity="0.12"
                    />
                    <defs>
                      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-brand-orange)" />
                        <stop offset="100%" stopColor="var(--color-brand-orange)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <button
                onClick={() => handleQuickView(card)}
                className="mt-5 w-full rounded-full bg-black py-2.5 text-center text-xs font-bold text-white transition-all duration-300 hover:bg-black/90 flex items-center justify-center gap-2"
              >
                <span>🔍</span> Quick View
              </button>
            </div>
          ))}
        </div>

        {activeCard && selection && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-end p-4 pointer-events-none">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto transition-opacity"
              onClick={() => setActiveCard(null)}
            />

            <div className="relative z-10 w-full max-w-[420px] bg-white text-black border border-black/8 rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] flex flex-col justify-between overflow-y-auto max-h-[85vh] p-6 pointer-events-auto animate-fade-up">
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center rounded-full border border-black/10 bg-white text-lg text-black/60 hover:text-black hover:shadow-sm transition-all z-20"
                aria-label="Close"
              >
                ×
              </button>

              <div className="flex-1 pb-16">
                <div className="mb-4 pr-8">
                  <h2 className="text-xl font-bold text-black leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {activeCard.title}
                  </h2>
                  <p className="text-xs text-black/50 font-semibold mt-0.5">{activeCard.subtitle}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <span className="text-[var(--color-brand-orange-dark)]">★★★★★</span>
                    <span className="font-bold text-black/70">4.9 (125 reviews)</span>
                  </div>
                </div>

                <div className="relative aspect-[16/9] rounded-[16px] overflow-hidden mb-5 border border-black/5 bg-black/5">
                  <Image src={activeImageSrc} alt={activeCard.title} fill className="object-cover" />
                </div>

                <div className="border-t border-black/5 pt-4 mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-black/40 font-bold mb-2">Thickness</p>
                  <div className="flex gap-2">
                    {activeCard.item.thicknessOptions?.filter((option) => option.available !== false).map((thick) => (
                      <button
                        key={thick.id}
                        type="button"
                        onClick={() => setSelectionValue('thicknessId', thick.id || selection.thicknessId)}
                        className={`flex-1 rounded-xl border py-2 text-center text-xs font-bold transition-all duration-200 ${
                          selection.thicknessId === thick.id
                            ? 'border-black bg-black text-white'
                            : 'border-black/10 bg-white hover:border-black/30'
                        }`}
                      >
                        {thick.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-black/40 font-bold mb-2">Colours</p>
                  <div className="flex flex-wrap gap-2">
                    {activeCard.item.colourOptions?.filter((col) => col.available !== false).map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectionValue('colourId', col.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 ${
                          selection.colourId === col.id
                            ? 'border-black ring-2 ring-[var(--color-brand-orange)] ring-offset-1'
                            : 'border-black/15 hover:border-black/30'
                        }`}
                        title={col.name}
                      >
                        <span
                          className="block h-5.5 w-5.5 rounded-full border border-black/10"
                          style={{ backgroundColor: col.hex || '#ccc' }}
                        />
                      </button>
                    ))}
                  </div>
                  {selection.colourId && (
                    <p className="text-[10px] text-black/50 font-bold mt-1.5 uppercase">
                      Swatch: {activeCard.item.colourOptions?.find((c) => c.id === selection.colourId)?.name}
                    </p>
                  )}
                </div>

                <div className="border-t border-black/5 pt-4 mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-black/40 font-bold mb-2">Frequency Response (Absorption Coefficient)</p>
                  <div className="bg-black/5 rounded-[14px] p-3 border border-black/5">
                    <svg className="w-full h-14" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
                      <path
                        d={`M 0 30 Q 25 ${30 - activeCard.graphData[1] / 4} 50 ${30 - activeCard.graphData[2] / 4.5} T 100 ${30 - activeCard.graphData[5] / 4}`}
                        fill="none"
                        stroke="var(--color-brand-orange)"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div className="flex justify-between text-[8px] text-black/40 font-bold mt-1 uppercase">
                      <span>125</span>
                      <span>250</span>
                      <span>500</span>
                      <span>1k</span>
                      <span>2k</span>
                      <span>4k</span>
                      <span>Hz</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-black/40 font-bold mb-2">About</p>
                  <ul className="space-y-1.5 text-xs text-black/70 leading-normal pl-0 list-none font-semibold">
                    {activeCard.features.map((feat, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <span className="text-[var(--color-brand-orange-dark)]">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-white border-t border-black/5 p-4 flex flex-col gap-3">
                {!detailsOpen ? (
                  <button
                    onClick={() => setDetailsOpen(true)}
                    className="w-full py-3 rounded-xl bg-black text-white text-xs font-bold text-center hover:bg-black/90 transition shadow-sm"
                  >
                    Add to Cart – {formatSgd(calculateShopPrice(activeCard.item, selection).total)}
                  </button>
                ) : (
                  <form onSubmit={submitOrder} className="bg-black/5 rounded-[18px] p-3 border border-black/5 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        required
                        placeholder="Name"
                        value={customer.name}
                        onChange={(e) => setCustomer((curr) => ({ ...curr, name: e.target.value }))}
                        className="flex-1 h-9 border border-black/10 rounded-lg px-2.5 text-xs bg-white focus:border-[var(--color-brand-orange)] outline-none"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email"
                        value={customer.email}
                        onChange={(e) => setCustomer((curr) => ({ ...curr, email: e.target.value }))}
                        className="flex-1 h-9 border border-black/10 rounded-lg px-2.5 text-xs bg-white focus:border-[var(--color-brand-orange)] outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-2.5 rounded-lg bg-black text-white font-bold text-center hover:bg-black/90 disabled:opacity-50 text-[10px] uppercase tracking-wider"
                    >
                      {status === 'submitting' ? 'Sending...' : 'Confirm Quote'}
                    </button>
                    {message && <p className="text-[10px] font-bold text-center text-emerald-700">{message}</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
