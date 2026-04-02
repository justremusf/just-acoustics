'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { ShopItem } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  'wall-panels': 'Wall Panels',
  'ceiling-panels': 'Ceiling Panels',
  soundproofing: 'Soundproofing',
  'custom-solutions': 'Custom Solutions',
  accessories: 'Accessories',
}

const volumeGuide = [
  ['20 m³', '8 panels'],
  ['30 m³', '12 panels'],
  ['40 m³', '16 panels'],
  ['50 m³', '20 panels'],
  ['60 m³', '24 panels'],
  ['70 m³', '28 panels'],
  ['80 m³', '32 panels'],
]

function TabContent({ item }: { item: ShopItem }) {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'guide'>('details')
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
    { id: 'guide', label: 'Qty Guide' },
  ] as const

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'page-filter active cursor-pointer' : 'page-filter cursor-pointer'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5 text-sm leading-7 text-[var(--color-gray-100)]">
        {activeTab === 'details' && (
          <div>
            {item.shortDescription && <p className="m-0 mb-4">{item.shortDescription}</p>}
            {item.features && item.features.length > 0 && (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 text-[var(--color-brand-orange)]">●</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'specs' && <p className="m-0">Specifications coming soon.</p>}

        {activeTab === 'guide' && (
          <div className="grid gap-2">
            {volumeGuide.slice(0, 5).map(([volume, qty]) => (
              <div key={volume} className="flex items-center justify-between rounded-[18px] border border-black/6 bg-white/70 px-4 py-3">
                <span>{volume}</span>
                <span className="font-semibold text-[var(--color-dark-100)]">{qty}</span>
              </div>
            ))}
            <p className="mt-3 mb-0 text-sm text-[var(--color-gray-100)]">Use the consultation form for room-specific recommendations.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopItemDetail({ item }: { item: ShopItem }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const allImages = [item.mainImage, ...(item.gallery || [])].filter(Boolean)
  const mainImage = allImages[selectedImage]
  const mainSrc = mainImage && 'asset' in mainImage && mainImage.asset._ref
    ? urlFor(mainImage).width(1200).height(960).url()
    : null

  return (
    <div className="page-wrap page-stack">
      <Link href="/shop" className="page-link">← Back to all products</Link>

      <section className="home-shell page-hero-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="flex flex-col gap-4">
            <span className="soft-pill">{item.category ? CATEGORY_LABELS[item.category] || item.category : 'Product'}</span>
            <h1 className="page-title">{item.title}</h1>
            {item.price != null && (
              <p className="m-0 text-[clamp(28px,3vw,40px)] font-medium leading-none tracking-[-1px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                S${item.price.toLocaleString()}
              </p>
            )}
            {item.sku && <p className="page-kicker">SKU {item.sku}</p>}
            <p className="page-subtitle">
              {item.shortDescription || 'Made-to-order acoustic treatment with consultation support to help match quantity and placement to the room.'}
            </p>
            <Link href="/contact" className="page-cta mt-2 w-fit">Contact Us to Buy</Link>
            <p className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">
              Free consultation included. We can review room photos and suggest the right quantity before you commit.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="glass-card overflow-hidden rounded-[28px]">
              <div className="relative aspect-[4/3]">
                {mainSrc ? (
                  <Image src={mainSrc} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-gray-200)]">No image</div>
                )}
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {allImages.map((img, index) => {
                  if (!img || !('asset' in img) || !img.asset._ref) return null
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={selectedImage === index ? 'glass-card overflow-hidden rounded-[18px] ring-2 ring-[var(--color-brand-orange)]' : 'glass-card overflow-hidden rounded-[18px]'}
                    >
                      <Image
                        src={urlFor(img).width(240).height(240).url()}
                        alt={item.title + ' ' + (index + 1)}
                        width={240}
                        height={240}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="home-shell page-hero-shell">
          <TabContent item={item} />
        </div>

        <div className="grid gap-6 lg:sticky lg:top-24">
          {item.features && item.features.length > 0 && (
            <div className="glass-card p-5 sm:p-6">
              <p className="page-kicker">Key Features</p>
              <div className="mt-4 flex flex-col gap-3 text-sm leading-6 text-[var(--color-gray-100)]">
                {item.features.slice(0, 6).map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-1 text-[var(--color-brand-orange)]">●</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-5 sm:p-6">
            <p className="page-kicker">Room Volume Guide</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--color-gray-100)]">
              {volumeGuide.map(([volume, qty]) => (
                <div key={volume} className="flex items-center justify-between rounded-[18px] border border-black/6 bg-white/70 px-4 py-3">
                  <span>{volume}</span>
                  <span className="font-semibold text-[var(--color-dark-100)]">{qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
