'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import type { ShopItem } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  'wall-panels': 'Wall Panels',
  'ceiling-panels': 'Ceiling Panels',
  soundproofing: 'Soundproofing',
  'custom-solutions': 'Custom Solutions',
  accessories: 'Accessories',
  'standard-panels': 'Standard Panels',
}

function TabContent({ item }: { item: ShopItem }) {
  const [activeTab, setActiveTab] = useState<'details' | 'specs'>('details')
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
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

      <div className="mt-6 text-sm leading-7 text-[var(--color-gray-100)]">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {item.shortDescription && <p className="m-0">{item.shortDescription}</p>}
            {item.body && item.body.length > 0 && (
              <div className="portable-copy">
                <PortableText value={item.body as PortableTextBlock[]} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          item.specifications && item.specifications.length > 0 ? (
            <div className="grid gap-2.5">
              {item.specifications.map((spec) => (
                <div
                  key={`${spec.label}-${spec.value}`}
                  className="flex flex-col gap-1 rounded-[18px] border border-black/6 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="font-medium text-[var(--color-dark-100)]">{spec.label}</span>
                  <span className="text-[var(--color-gray-100)] sm:text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0">Specifications coming soon.</p>
          )
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)] lg:items-start">
          <div className="grid gap-4">
            <div className="glass-card overflow-hidden rounded-[28px]">
              <div className="relative aspect-[4/3] bg-white">
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

          <div className="flex flex-col gap-4 lg:pt-3">
            <span className="soft-pill">{item.category ? CATEGORY_LABELS[item.category] || item.category : 'Product'}</span>
            <div className="space-y-3">
              <h1 className="page-title max-w-[14ch] text-[clamp(36px,3.6vw,52px)] leading-[0.98] tracking-[-1.4px]">
                {item.title}
              </h1>
              {item.price != null && (
                <p
                  className="m-0 font-medium text-[clamp(20px,1.6vw,24px)] leading-none tracking-[-0.3px] text-[var(--color-dark-100)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  S${item.price.toLocaleString()}
                </p>
              )}
              {item.sku && <p className="page-kicker">SKU {item.sku}</p>}
            </div>
            <p className="page-subtitle">
              {item.shortDescription || 'Made-to-order acoustic treatment with consultation support to help match quantity and placement to the room.'}
            </p>
            <Link href="/contact" className="page-cta mt-3 w-fit">Contact Us to Buy</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="home-shell page-hero-shell">
          <TabContent item={item} />
        </div>

        <div className="grid gap-6 lg:sticky lg:top-24">
          <div className="glass-card p-5 sm:p-6">
            <p className="page-kicker">Key Features</p>
            <div className="mt-4 flex flex-col gap-3 text-sm leading-6 text-[var(--color-gray-100)]">
              {(item.features || []).slice(0, 3).map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span className="mt-1 text-[var(--color-brand-orange)]">●</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
