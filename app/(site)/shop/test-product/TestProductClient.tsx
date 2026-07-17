'use client'

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  Flame,
  HelpCircle,
  Layers,
  Palette,
  Ruler,
  Truck,
  Wrench,
} from 'lucide-react'
import FAQ, { type FaqItem } from '@/components/sections/FAQ'
import ShimmerButton from '@/components/ui/shimmer-button'
import { urlFor } from '@/sanity/lib/image'
import type { ShopItem } from '@/lib/types'
import {
  calculateShopPrice,
  formatSgd,
  getDefaultSelection,
  normaliseQuantity,
  resolveShopSelection,
  type ShopQuoteSelection,
} from '@/lib/shopPricing'

const SIZE_OPTIONS = [
  { id: '600x600', label: 'Square', widthMm: 600, heightMm: 600, description: '60 x 60cm', priceAdjustment: -45, available: true },
  { id: '1200x600', label: 'Standard', widthMm: 1200, heightMm: 600, description: '60 x 120cm', priceAdjustment: 0, available: true },
  { id: '1800x600', label: 'Tall', widthMm: 1800, heightMm: 600, description: '60 x 180cm', priceAdjustment: 60, available: true },
]

const THICKNESS_OPTIONS = [
  { id: '25mm', label: '25 mm', millimeters: 25, nrc: 'NRC 0.80', description: 'Slim profile', priceAdjustment: 0, available: true },
  { id: '50mm', label: '50 mm', millimeters: 50, nrc: 'NRC 1.00', description: 'Higher absorption', priceAdjustment: 35, available: true },
]

const INSTALLATION_OPTIONS = [
  { id: 'self-install', label: 'Self-install', description: 'Panels are supplied for your own installation.', priceType: 'none', price: 0, available: true },
  { id: 'professional-install', label: 'Professional installation', description: 'Our licensed team installs the panels.', priceType: 'perUnit', price: 45, available: true },
]

const SIZE_IMAGES: Record<string, string> = {
  '600x600': '/assets/shop/standard-flexi/standard-flexi-600x600.webp',
  '1200x600': '/assets/shop/standard-flexi/standard-flexi-1200x600.webp',
  '1800x600': '/assets/shop/standard-flexi/standard-flexi-1800x600.webp',
}

const COLOUR_CHART_SRC = '/assets/shop/standard-flexi/source/colour-swatches.webp'

const GALLERY_IMAGES = [
  '/assets/shop/standard-flexi/gallery/flexi-gallery-1.webp',
  '/assets/shop/standard-flexi/gallery/flexi-gallery-2.webp',
  '/assets/shop/standard-flexi/gallery/flexi-gallery-3.webp',
  '/assets/shop/standard-flexi/gallery/flexi-gallery-4.webp',
]

const COLOUR_NAMES = [
  'White',
  'Egg White 01',
  'Stone Grey 02',
  'Sand 03',
  'Ash 04',
  'Pearl 05',
  'Silver Mist 06',
  'Frost 07',
  'Dove Grey 08',
  'Cement 09',
  'Steel 10',
  'Moss 11',
  'Olive 12',
  'Blush 13',
  'Amber 14',
  'Walnut 15',
  'Terracotta 16',
  'Crimson 17',
  'Magenta 18',
  'Rose 19',
  'Plum 20',
  'Fog 21',
  'Seafoam 22',
  'Sky Blue 23',
  'Charcoal 24',
  'Slate 25',
  'Linen 26',
  'Concrete 27',
  'Ocean Blue 28',
  'Powder Blue 29',
  'Graphite 30',
  'Navy 31',
  'Oat 32',
  'Mocha 33',
  'Bone 34',
  'Anchor Grey 35',
  'Espresso 36',
  'Black',
]

const COLOURS = COLOUR_NAMES.map((name, index) => {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return {
    id,
    name,
    swatchSrc: `/assets/shop/standard-flexi/swatches/${String(index + 1).padStart(2, '0')}-${id}.png`,
    priceAdjustment: 0,
    available: true,
  }
})

const VISIBLE_COLOUR_IDS = [
  'white',
  'pearl-05',
  'terracotta-16',
  'magenta-18',
  'seafoam-22',
  'sky-blue-23',
  'linen-26',
  'bone-34',
  'black',
]

const PERFORMANCE_FREQUENCIES = [
  '40 Hz',
  '50 Hz',
  '63 Hz',
  '80 Hz',
  '100 Hz',
  '125 Hz',
  '160 Hz',
  '200 Hz',
  '250 Hz',
  '315 Hz',
  '400 Hz',
  '500 Hz',
  '630 Hz',
  '800 Hz',
  '1000 Hz',
  '1250 Hz',
  '1600 Hz',
  '2000 Hz',
  '2500 Hz',
  '3150 Hz',
  '4000 Hz',
  '5000 Hz',
  '6300 Hz',
  '8000 Hz',
  '10000 Hz',
]

const PERFORMANCE_SERIES = [
  {
    label: 'Standard Flexi Acoustic Panel',
    color: '#c46a35',
    values: [0.01, 0.05, 0.03, 0.12, 0.14, 0.40, 0.43, 0.72, 0.84, 0.94, 1.12, 1.18, 1.06, 1.05, 1.02, 1.06, 0.99, 1.03, 1.05, 1.04, 1.01, 1.04, 1.10, 1.13, 1.15],
  },
  {
    label: 'Typical Foam Panel',
    color: '#377d8b',
    values: [0.00, 0.00, 0.01, 0.04, 0.08, 0.28, 0.18, 0.35, 0.36, 0.48, 0.63, 0.80, 0.88, 0.89, 0.92, 0.96, 0.90, 0.78, 0.73, 0.76, 0.77, 0.78, 0.74, 0.75, 0.75],
  },
]

const HIGHLIGHTS = [
  { icon: Layers, title: 'Broadband absorption', copy: 'Controls echo across highs, mids, and low-mid reflections.' },
  { icon: Flame, title: 'High safety rating', copy: 'Fire safe, formaldehyde safe, and emissions safe.' },
  { icon: Palette, title: '38 colour finishes', copy: 'Texture-backed swatches make it easier to choose a finish.' },
  { icon: Ruler, title: 'Three sizes', copy: 'Compact, standard, and long-format panels for real rooms.' },
  { icon: Truck, title: 'Made to order', copy: 'Typical lead time is 3-4 weeks after confirmation.' },
  { icon: Wrench, title: 'Install support', copy: 'Licensed team installation for walls, ceilings, and full-wall options.' },
]

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Can these panels soundproof my room?',
    a: 'No. Acoustic panels improve sound inside a room by absorbing reflections. Soundproofing needs construction changes that reduce sound transfer through walls, ceilings, doors, and gaps.',
  },
  {
    q: 'How many panels do I need?',
    a: 'It depends on room size, ceiling height, surface finishes, and how bad the echo is. Send room photos and dimensions and we can suggest a practical starting layout.',
  },
  {
    q: 'Which thickness should I choose?',
    a: 'Choose 25 mm for a slim profile and 50 mm when stronger broadband absorption is the priority.',
  },
  {
    q: 'Can you install them?',
    a: 'Yes. Choose professional installation and we will confirm mounting, access, and site requirements before production.',
  },
]

function getImageSrc(image: ShopItem['mainImage'] | NonNullable<ShopItem['gallery']>[number] | undefined, width: number, height: number) {
  return image?.asset?._ref ? urlFor(image).width(width).height(height).url() : null
}

function getTestItem(item: ShopItem): ShopItem {
  return {
    ...item,
    defaultSizeId: '1200x600',
    defaultThicknessId: item.defaultThicknessId || '25mm',
    sizeOptions: SIZE_OPTIONS,
    thicknessOptions: THICKNESS_OPTIONS,
    colourOptions: COLOURS,
    installationOptions: item.installationOptions?.length ? item.installationOptions : INSTALLATION_OPTIONS,
  } as ShopItem
}

function getSizeImage(selection: ShopQuoteSelection) {
  return selection.sizeId ? SIZE_IMAGES[selection.sizeId] : SIZE_IMAGES['1200x600']
}

function getSwatchSrc(option: ReturnType<typeof resolveShopSelection>['colourOption'] | undefined) {
  if (!option) return null
  if (option.swatchImage?.asset?._ref) return urlFor(option.swatchImage).width(160).height(160).url()
  return 'swatchSrc' in option && typeof option.swatchSrc === 'string' ? option.swatchSrc : null
}

function TestAccordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-black/8 last:border-b-0" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left marker:hidden">
        <h3 className="m-0 text-lg font-semibold leading-tight text-[var(--color-dark-100)]">{title}</h3>
        <ChevronDown className="h-5 w-5 shrink-0 text-[var(--color-gray-200)] transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-sm leading-7 text-[var(--color-gray-100)]">{children}</div>
    </details>
  )
}

function TestPerformanceChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const chartRef = useRef<HTMLDivElement | null>(null)
  const viewWidth = 1680
  const viewHeight = 460
  const pad = { top: 58, right: 28, bottom: 62, left: 82 }
  const innerWidth = viewWidth - pad.left - pad.right
  const innerHeight = viewHeight - pad.top - pad.bottom
  const maxValue = 1.32
  const step = innerWidth / (PERFORMANCE_FREQUENCIES.length - 1)
  const xFor = (index: number) => pad.left + index * step
  const yFor = (value: number) => pad.top + innerHeight - (value / maxValue) * innerHeight
  const activeIndex = hoverIndex ?? 13

  const linePath = (values: number[]) =>
    values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(value)}`).join(' ')

  const updateHover = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = chartRef.current?.getBoundingClientRect()
    if (!rect) return
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    setHoverIndex(Math.round(ratio * (PERFORMANCE_FREQUENCIES.length - 1)))
  }

  return (
    <div className="mt-8 pb-1" ref={chartRef}>
      <div className="relative w-full">
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="h-auto w-full">
          {[0, 0.3, 0.5, 0.8, 1, 1.3].map((tick) => {
            const y = yFor(tick)
            return (
              <g key={tick}>
                <line x1={pad.left} x2={viewWidth - pad.right} y1={y} y2={y} stroke="rgba(15,23,42,0.08)" />
                <text x={pad.left - 14} y={y + 5} textAnchor="end" fill="#41515a" fontSize="15">
                  {tick === 0 ? '0' : tick.toFixed(1).replace('.0', '')}
                </text>
              </g>
            )
          })}

          <text x={20} y={viewHeight / 2} fill="#24343c" fontSize="15" transform={`rotate(-90 20 ${viewHeight / 2})`} textAnchor="middle">
            Sound Absorption Coefficient
          </text>
          <text x={viewWidth / 2} y={viewHeight - 12} fill="#24343c" fontSize="15" textAnchor="middle">
            Frequency
          </text>

          {PERFORMANCE_FREQUENCIES.map((freq, index) => (
            <text key={freq} x={xFor(index)} y={viewHeight - 38} textAnchor="middle" fill="#41515a" fontSize="13">
              {freq}
            </text>
          ))}

          <g>
            <rect x={viewWidth / 2 - 170} y="10" width="340" height="32" rx="8" fill="#f1f3f3" />
            {PERFORMANCE_SERIES.map((series, index) => (
              <g key={series.label} transform={`translate(${viewWidth / 2 - 145 + index * 170}, 26)`}>
                <line x1="0" x2="20" y1="0" y2="0" stroke={series.color} strokeWidth="4" strokeLinecap="round" />
                <circle cx="10" cy="0" r="4" fill={series.color} />
                <text x="28" y="5" fill="#1f2528" fontSize="13" fontWeight="700">
                  {series.label}
                </text>
              </g>
            ))}
          </g>

          {PERFORMANCE_SERIES.map((series) => (
            <g key={series.label}>
              <path d={linePath(series.values)} fill="none" stroke={series.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {series.values.map((value, index) => (
                <circle key={`${series.label}-${index}`} cx={xFor(index)} cy={yFor(value)} r="4.5" fill={series.color} />
              ))}
            </g>
          ))}

          {hoverIndex !== null && (
            <g>
              <line x1={xFor(activeIndex)} x2={xFor(activeIndex)} y1={pad.top} y2={viewHeight - pad.bottom} stroke="rgba(15,23,42,0.16)" strokeDasharray="6 7" />
              {PERFORMANCE_SERIES.map((series) => (
                <circle key={`${series.label}-hover`} cx={xFor(activeIndex)} cy={yFor(series.values[activeIndex])} r="7" fill={series.color} stroke="#fff" strokeWidth="2" />
              ))}
            </g>
          )}
        </svg>
        <div
          className="absolute inset-0"
          onPointerMove={updateHover}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerDown={updateHover}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

function OptionHeader({ pretext, value }: { pretext: string; value?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="m-0 text-sm font-medium text-[var(--color-gray-100)]">
        {pretext}: <span className="font-semibold text-[var(--color-dark-100)]">{value || 'Select'}</span>
      </p>
    </div>
  )
}

export default function TestProductClient({ item }: { item: ShopItem }) {
  const router = useRouter()
  const product = useMemo(() => getTestItem(item), [item])
  const [selection, setSelection] = useState<ShopQuoteSelection>(() => getDefaultSelection(product))
  const [imageMode, setImageMode] = useState<'size' | 'colour' | 'gallery'>('size')
  const [selectedGallery, setSelectedGallery] = useState(0)
  const [isColourOpen, setIsColourOpen] = useState(false)
  const colourRef = useRef<HTMLDivElement | null>(null)
  const resolved = resolveShopSelection(product, selection)
  const price = calculateShopPrice(product, selection)
  const visibleColours = VISIBLE_COLOUR_IDS
    .map((id) => product.colourOptions?.find((option) => option.id === id))
    .filter((option): option is NonNullable<typeof product.colourOptions>[number] => Boolean(option))
  const hiddenColourCount = Math.max(0, (product.colourOptions?.length || 0) - visibleColours.length)

  const sanityImages = [item.mainImage, ...(item.gallery || [])]
    .map((image, index) => {
      const src = getImageSrc(image, 1200, 1500)
      return src ? { src, alt: `${item.title} image ${index + 1}` } : null
    })
    .filter((image): image is { src: string; alt: string } => Boolean(image))

  const mediaImages = [
    {
      src: imageMode === 'colour' ? COLOUR_CHART_SRC : getSizeImage(selection),
      alt: imageMode === 'colour' ? `${item.title} colour chart` : `${item.title} ${resolved.sizeOption?.label || ''}`,
    },
    ...sanityImages,
    ...GALLERY_IMAGES.map((src, index) => ({ src, alt: `${item.title} installed space ${index + 1}` })),
  ].filter((image, index, arr) => arr.findIndex((candidate) => candidate.src === image.src) === index)

  const selectImage = (index: number) => {
    if (index < 0 || index >= mediaImages.length || index === selectedGallery) return
    setSelectedGallery(index)
    setImageMode('gallery')
  }

  const selectNextImage = () => {
    setSelectedGallery((current) => (current + 1) % mediaImages.length)
    setImageMode('gallery')
  }

  const selectPreviousImage = () => {
    setSelectedGallery((current) => (current - 1 + mediaImages.length) % mediaImages.length)
    setImageMode('gallery')
  }

  const setSelectionValue = <K extends keyof ShopQuoteSelection>(key: K, value: ShopQuoteSelection[K]) => {
    setSelection((current) => ({ ...current, [key]: value }))
  }

  const handleAddToCart = () => {
    window.sessionStorage.setItem(
      'just-acoustics-cart-draft',
      JSON.stringify({
        slug: item.slug.current,
        title: item.title,
        testRoute: '/shop/test-product',
        selection,
        price,
        resolved: {
          size: resolved.sizeOption?.label,
          thickness: resolved.thicknessOption?.label,
          colour: resolved.colourOption?.name,
          installation: resolved.installationOption?.label,
        },
        updatedAt: new Date().toISOString(),
      })
    )
    router.push('/contact')
  }

  useEffect(() => {
    if (imageMode !== 'gallery') setSelectedGallery(0)
  }, [imageMode])

  useEffect(() => {
    if (!isColourOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (colourRef.current && !colourRef.current.contains(event.target as Node)) {
        setIsColourOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [isColourOpen])

  return (
    <main className="overflow-x-clip bg-[linear-gradient(180deg,#f8faf9_0%,#fff_42%,#f8faf9_100%)]">
      <div className="site-container px-4 py-6 sm:px-5 lg:py-12">
        <Link href="/shop" className="page-link mb-5 inline-flex">← Back to shop</Link>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,820px)_minmax(430px,620px)] lg:items-start lg:justify-center">
          <div className="grid gap-2 lg:sticky lg:top-24 lg:self-start">
            <div className="product-media-card glass-card overflow-hidden rounded-[28px]">
              <div className="group relative aspect-[5/6] w-full overflow-hidden bg-white">
                {mediaImages.length > 0 ? (
                  <div
                    className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: `translateX(-${selectedGallery * 100}%)` }}
                  >
                    {mediaImages.map((image, index) => (
                      <div key={`${image.src}-${index}`} className="relative h-full w-full shrink-0">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1023px) 100vw, 52vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-gray-200)]">No image</div>
                )}
                <div className="absolute left-4 top-4 rounded-full border border-white/45 bg-white/72 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-dark-100)] shadow-[0_16px_36px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                  Test layout
                </div>
                {mediaImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={selectPreviousImage}
                      className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/72 text-2xl text-[var(--color-dark-100)] opacity-100 shadow-[0_14px_32px_rgba(15,23,42,0.16)] backdrop-blur-md transition-all duration-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={selectNextImage}
                      className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/72 text-2xl text-[var(--color-dark-100)] opacity-100 shadow-[0_14px_32px_rgba(15,23,42,0.16)] backdrop-blur-md transition-all duration-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
              {mediaImages.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  data-thumb-index={index}
                  onClick={() => selectImage(index)}
                  className={[
                    'glass-card relative h-[70px] w-[68px] shrink-0 overflow-hidden rounded-[14px] transition-all duration-300 ease-out',
                    selectedGallery === index
                      ? 'ring-2 ring-[var(--color-brand-orange)]'
                      : 'opacity-72 hover:scale-[1.02] hover:opacity-100',
                  ].join(' ')}
                >
                  <Image src={image.src} alt={`${image.alt} thumbnail`} width={240} height={300} className="aspect-[6/5] h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <section className="hidden rounded-[24px] border border-black/8 bg-white/66 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:block">
              <p className="page-kicker">Highlights</p>
              <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
                {HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="flex min-h-[86px] items-center gap-3 rounded-[16px] bg-white/82 p-3">
                    <Icon className="h-7 w-7 shrink-0 text-[var(--color-brand-orange)]" strokeWidth={1.7} />
                    <div>
                      <h3 className="m-0 text-sm font-semibold leading-tight text-[var(--color-dark-100)]">{title}</h3>
                      <p className="m-0 mt-1 text-xs leading-5 text-[var(--color-gray-100)]">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="glass-card mx-auto w-full max-w-[620px] overflow-hidden rounded-[24px]">
            <div className="grid gap-5 p-5 sm:p-6">
              <div>
                <Link href="/shop" className="text-sm font-semibold text-[var(--color-gray-100)] no-underline transition-colors hover:text-[var(--color-brand-orange)]">
                  Just Acoustics
                </Link>
                <h1 className="m-0 mt-3 text-[clamp(32px,4vw,54px)] font-medium leading-[0.96] tracking-[-0.04em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h1>
                <p className="m-0 mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-dark-100)]">{formatSgd(price.total)}</p>
                <p className="m-0 mt-3 text-sm leading-6 text-[var(--color-gray-100)]">
                  Best-selling broadband acoustic panels built to reduce echo and improve clarity in studios, offices, churches, and homes.
                </p>
              </div>

              <section>
                <OptionHeader pretext="Size" value={resolved.sizeOption?.label} />
                <div className="grid gap-3 sm:grid-cols-3">
                  {product.sizeOptions?.filter((option) => option.available !== false).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectionValue('sizeId', option.id)
                        setImageMode('size')
                      }}
                      className={[
                        'min-h-[66px] rounded-[12px] border px-3 py-3 text-center transition-all duration-200',
                        selection.sizeId === option.id
                          ? 'border-[var(--color-dark-100)] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                          : 'border-black/8 bg-white/72 hover:border-black/20',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-[var(--color-dark-100)]">{option.description || 'Panel'}</span>
                      <span className="mt-2 block text-xs font-medium text-[var(--color-gray-100)]">{option.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="relative" ref={colourRef}>
                <OptionHeader pretext="Colour" value={resolved.colourOption?.name} />
                <div className="flex flex-wrap gap-3">
                  {visibleColours.map((option) => {
                    const swatchSrc = getSwatchSrc(option)
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSelectionValue('colourId', option.id)
                          setImageMode('colour')
                        }}
                        title={option.name}
                        aria-label={option.name}
                        className={[
                          'group relative h-11 w-11 rounded-full border transition-all duration-200 hover:z-50 hover:-translate-y-0.5 focus-visible:z-50',
                          selection.colourId === option.id
                            ? 'border-[var(--color-dark-100)] ring-2 ring-[var(--color-brand-orange)] ring-offset-2'
                            : 'border-black/10 hover:border-black/25',
                        ].join(' ')}
                        style={!swatchSrc ? { backgroundColor: option.hex || '#f5f5f5' } : undefined}
                      >
                        {swatchSrc && <Image src={swatchSrc} alt={option.name || 'Colour swatch'} width={96} height={96} className="h-full w-full rounded-full object-cover" />}
                        <span className="pointer-events-none absolute left-1/2 top-full z-[80] mt-2 w-max max-w-[150px] -translate-x-1/2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] font-semibold text-[var(--color-dark-100)] opacity-0 shadow-[0_12px_26px_rgba(15,23,42,0.14)] transition-opacity group-hover:opacity-100">
                          {option.name}
                        </span>
                      </button>
                    )
                  })}
                  {hiddenColourCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsColourOpen((current) => !current)}
                      className="h-11 w-11 rounded-full border border-black/10 bg-white text-sm font-semibold text-[var(--color-dark-100)] transition-all duration-200 hover:-translate-y-0.5 hover:border-black/25"
                      aria-expanded={isColourOpen}
                      aria-label={`Show ${hiddenColourCount} more colours`}
                    >
                      +{hiddenColourCount}
                    </button>
                  )}
                </div>
                {isColourOpen && (
                  <div className="absolute left-0 top-full z-30 mt-3 w-full rounded-[22px] border border-black/8 bg-white p-4 shadow-[0_24px_54px_rgba(15,23,42,0.14)]">
                    <div className="flex items-center justify-between gap-3">
                      <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gray-200)]">All colours</p>
                      <button type="button" onClick={() => setIsColourOpen(false)} className="text-xs font-semibold text-[var(--color-gray-200)] transition-colors hover:text-[var(--color-dark-100)]">
                        Close
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-8 gap-3">
                      {product.colourOptions?.filter((option) => option.available !== false).map((option) => {
                        const swatchSrc = getSwatchSrc(option)
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setSelectionValue('colourId', option.id)
                              setImageMode('colour')
                            }}
                            title={option.name}
                            aria-label={option.name}
                            className={[
                              'group relative h-9 w-9 rounded-full border transition-all duration-200 hover:z-50 hover:-translate-y-0.5 focus-visible:z-50',
                              selection.colourId === option.id
                                ? 'border-[var(--color-dark-100)] ring-2 ring-[var(--color-brand-orange)]'
                                : 'border-black/10 hover:border-black/25',
                            ].join(' ')}
                            style={!swatchSrc ? { backgroundColor: option.hex || '#f5f5f5' } : undefined}
                          >
                            {swatchSrc && <Image src={swatchSrc} alt={option.name || 'Colour swatch'} width={72} height={72} className="h-full w-full rounded-full object-cover" />}
                            <span className="pointer-events-none absolute left-1/2 top-full z-[80] mt-2 w-max max-w-[150px] -translate-x-1/2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] font-semibold text-[var(--color-dark-100)] opacity-0 shadow-[0_12px_26px_rgba(15,23,42,0.14)] transition-opacity group-hover:opacity-100">
                              {option.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </section>

              <section>
                <OptionHeader pretext="Thickness" value={resolved.thicknessOption?.label} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {product.thicknessOptions?.filter((option) => option.available !== false).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectionValue('thicknessId', option.id)}
                      className={[
                        'rounded-[12px] border px-4 py-3 text-center transition-all duration-200',
                        selection.thicknessId === option.id
                          ? 'border-[var(--color-dark-100)] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                          : 'border-black/8 bg-white/72 hover:border-black/20',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-[var(--color-dark-100)]">{option.label}</span>
                      <span className="mt-2 block text-xs leading-5 text-[var(--color-gray-100)]">{option.description || option.nrc}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="border-t border-black/8 pt-4">
                <OptionHeader pretext="Installation" value={resolved.installationOption?.label} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {product.installationOptions?.filter((option) => option.available !== false).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectionValue('installationId', option.id)}
                      className={[
                        'rounded-[14px] border px-4 py-3 text-left transition-all duration-200',
                        selection.installationId === option.id
                          ? 'border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.12)]'
                          : 'border-black/8 bg-white/72 hover:border-black/20',
                      ].join(' ')}
                    >
                      <span className="block text-sm font-semibold text-[var(--color-dark-100)]">{option.label}</span>
                      <span className="mt-2 block text-xs leading-5 text-[var(--color-gray-100)]">{option.description}</span>
                    </button>
                  ))}
                </div>
              </section>

              <Link href="/contact" className="flex items-center gap-3 rounded-[10px] bg-[#e7f0f1] px-4 py-3 no-underline text-[#3f7f88] transition-colors hover:bg-[#dfecee]">
                <HelpCircle className="h-6 w-6 shrink-0" strokeWidth={1.7} />
                <p className="m-0 text-sm font-medium leading-6">
                  Not sure which panel is right for you? Get a free consultation with our acoustic experts.
                </p>
              </Link>

              <div className="flex flex-col gap-4 border-t border-black/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="page-kicker">Quantity</p>
                  <div className="mt-3 inline-flex h-12 overflow-hidden rounded-full border border-black/8 bg-white/82">
                    <button type="button" onClick={() => setSelectionValue('quantity', normaliseQuantity(product, selection.quantity - 1))} className="h-full w-12 text-xl">-</button>
                    <div className="flex h-full w-14 items-center justify-center border-x border-black/8 text-sm font-semibold text-[var(--color-dark-100)]">{selection.quantity}</div>
                    <button type="button" onClick={() => setSelectionValue('quantity', normaliseQuantity(product, selection.quantity + 1))} className="h-full w-12 text-xl">+</button>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gray-200)]">{price.quantityLabel}</p>
                  <p className="m-0 mt-1 text-lg font-semibold text-[var(--color-dark-100)]">{formatSgd(price.total)}</p>
                </div>
              </div>

              <button type="button" onClick={handleAddToCart} className="page-cta add-to-cart min-h-[62px] w-full text-[18px]">
                Add to Cart · {formatSgd(price.total)}
              </button>

              <section className="border-t border-black/8 pt-4">
                <p className="page-kicker">Product details</p>
                <div className="mt-3 grid gap-2">
                  <TestAccordion title="Description" defaultOpen>
                    <p className="m-0">
                      Standard Flexi acoustic panels are made-to-order broadband absorbers for rooms where speech clarity, focus, and comfort matter. They can be used on walls, ceilings, or full-wall layouts across homes and commercial spaces.
                    </p>
                  </TestAccordion>
                  <TestAccordion title="Specifications">
                    <ul className="m-0 grid gap-2 pl-5">
                      <li>Available sizes: 60 x 60cm, 60 x 120cm, and 60 x 180cm.</li>
                      <li>Available thickness: 25 mm and 50 mm.</li>
                      <li>Available finishes: 38 colour options.</li>
                      <li>Lead time: 3-4 weeks after order confirmation.</li>
                    </ul>
                  </TestAccordion>
                  <TestAccordion title="Materials & Safety">
                    <p className="m-0">
                      Fire safe, formaldehyde safe, and emissions safe. Project-specific requirements can be confirmed before production.
                    </p>
                  </TestAccordion>
                </div>
              </section>
            </div>
          </aside>
        </section>

        <section className="mt-5 grid gap-3 lg:hidden">
          {HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-center gap-3 rounded-[18px] border border-black/8 bg-white/76 p-4">
              <Icon className="h-6 w-6 shrink-0 text-[var(--color-brand-orange)]" strokeWidth={1.7} />
              <div>
                <h3 className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">{title}</h3>
                <p className="m-0 mt-1 text-xs leading-5 text-[var(--color-gray-100)]">{copy}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[28px] border border-black/8 bg-white/82 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)] sm:p-8 lg:p-12">
          <p className="page-kicker">Performance you can trust</p>
          <h2 className="m-0 mt-3 max-w-[920px] text-[clamp(34px,5vw,64px)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Performance You Can <span className="text-[#c46a35]">Trust</span>
          </h2>
          <p className="m-0 mt-5 max-w-[980px] text-base leading-8 text-[var(--color-gray-100)]">
            Flexi panels are built for broadband absorption across practical room frequencies. The goal is simple: clearer conversations, more controlled video calls, and spaces that feel calmer without looking temporary.
          </p>
          <TestPerformanceChart />
        </section>

        <section className="mt-8 rounded-[28px] border border-black/8 bg-white/76 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
            <p className="page-kicker">Proof in real spaces</p>
            <h2 className="m-0 mt-3 text-[clamp(32px,4vw,56px)] font-medium leading-none tracking-[-0.04em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Clarity, backed by practical installation.
            </h2>
            </div>
            <p className="m-0 max-w-[420px] text-sm leading-6 text-[var(--color-gray-100)]">
              Installed examples across work, music, hospitality, and residential rooms.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {GALLERY_IMAGES.map((src, index) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-white">
                <Image src={src} alt={`Standard Flexi acoustic panel installed ${index + 1}`} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/28 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/32 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6">
          {[
            {
              title: 'Pro-level sound control',
              copy: 'Control flutter echoes, harsh reflections, and uncontrolled reverb so speech, music, and calls sound more intentional.',
              image: GALLERY_IMAGES[2],
              reverse: false,
            },
            {
              title: 'Slim profile. Flexible placement.',
              copy: 'Use Flexi panels on walls, ceilings, or full-wall layouts without making the room feel like a temporary studio buildout.',
              image: SIZE_IMAGES['1800x600'],
              reverse: true,
            },
            {
              title: 'Custom finish and fit',
              copy: 'Choose from 38 colour textures and three core sizes so the treatment fits the room visually as well as acoustically.',
              image: COLOUR_CHART_SRC,
              reverse: false,
            },
          ].map((section) => (
            <div key={section.title} className={`overflow-hidden rounded-[28px] border border-black/8 bg-white/82 shadow-[0_22px_70px_rgba(15,23,42,0.06)] lg:flex ${section.reverse ? 'lg:flex-row-reverse' : ''}`}>
              <div className="relative min-h-[320px] flex-1 lg:min-h-[560px]">
                <Image src={section.image} alt={section.title} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="flex flex-1 items-center p-6 sm:p-8 lg:p-12">
                <div>
                  <h2 className="m-0 text-[clamp(32px,4vw,56px)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {section.title}
                  </h2>
                  <p className="m-0 mt-5 text-base leading-8 text-[var(--color-gray-100)]">{section.copy}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="relative mt-8 min-h-[480px] overflow-hidden rounded-[32px] border border-white/30 bg-black text-white shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
          <Image src={GALLERY_IMAGES[0]} alt="Acoustic consultation for Standard Flexi panels" fill sizes="100vw" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-black/42" />
          <div className="relative z-10 flex min-h-[480px] items-end p-6 sm:p-10 lg:items-center lg:justify-center lg:text-center">
            <div className="max-w-[760px]">
              <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-white/70">Free consultation</p>
              <h2 className="m-0 mt-4 text-[clamp(38px,6vw,72px)] font-medium leading-[0.94] tracking-[-0.05em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Start with a room recommendation.
              </h2>
              <p className="m-0 mt-5 text-base leading-8 text-white/82">
                Send your room photos, dimensions, and goals. We will help you choose the right quantity, placement, size, thickness, and colour.
              </p>
              <Link href="/contact" className="mt-7 inline-block no-underline">
                <ShimmerButton className="h-auto px-8 py-4 text-sm">Free Consultation</ShimmerButton>
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <FAQ items={FAQ_ITEMS} title="FAQ" subtitle="The common things to check before choosing panel quantity, thickness, finish, and installation." />
        </div>
      </div>
    </main>
  )
}
