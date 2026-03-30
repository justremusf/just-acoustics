'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { ShopItem } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  'wall-panels': 'Wall Panels',
  'ceiling-panels': 'Ceiling Panels',
  'soundproofing': 'Soundproofing',
  'custom-solutions': 'Custom Solutions',
  'accessories': 'Accessories',
}

function TabContent({ item }: { item: ShopItem }) {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'guide'>('details')

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
    { id: 'guide', label: 'Qty Guide' },
  ] as const

  return (
    <div>
      <div className="flex border-b border-[var(--color-gray-500)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${
              activeTab === tab.id
                ? 'border-[var(--color-dark-100)] text-[var(--color-dark-100)]'
                : 'border-transparent text-[var(--color-gray-200)] hover:text-[var(--color-dark-100)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-6 text-[var(--color-gray-100)] text-base leading-relaxed">
        {activeTab === 'details' && (
          <div>
            {item.shortDescription && <p className="mb-4">{item.shortDescription}</p>}
            {item.features && item.features.length > 0 && (
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {item.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[var(--color-brand-orange)] mt-0.5">✔</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {activeTab === 'specs' && (
          <p className="text-[var(--color-gray-200)]">Specifications coming soon.</p>
        )}
        {activeTab === 'guide' && (
          <div>
            <p className="mb-4">Calculate your room volume (L×W×H m) to match the recommendations below.</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-1.5 text-sm">
              {['20m³ = 8 panels', '30m³ = 12 panels', '40m³ = 16 panels', '50m³ = 20 panels', '60m³ = 24 panels'].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[var(--color-gray-200)]">
              Contact us for a free consultation if unsure.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopItemDetail({ item }: { item: ShopItem }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const allImages = [item.mainImage, ...(item.gallery || [])].filter(Boolean)
  const mainImg = allImages[selectedImage]
  const mainSrc = mainImg && 'asset' in mainImg && mainImg.asset._ref
    ? urlFor(mainImg).width(800).height(700).url()
    : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-5 pt-8 pb-2">
        <div className="flex items-center gap-2 text-sm text-[var(--color-gray-200)]">
          <Link href="/shop" className="no-underline hover:text-[var(--color-dark-100)] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[var(--color-dark-100)]">{item.title}</span>
        </div>
      </div>

      {/* Hero: image + purchase panel */}
      <section className="max-w-[1280px] mx-auto px-5 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: image + thumbnails */}
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--color-white-200)] rounded-[16px] overflow-hidden aspect-[4/3] relative">
              {mainSrc ? (
                <Image src={mainSrc} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-gray-300)] text-sm">
                  No image
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => {
                  if (!img || !('asset' in img) || !img.asset._ref) return null
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-none w-20 h-20 rounded-[10px] overflow-hidden border-2 transition-colors cursor-pointer ${
                        i === selectedImage ? 'border-[var(--color-dark-100)]' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={urlFor(img).width(160).height(160).url()}
                        alt={`${item.title} ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right: purchase panel */}
          <div className="flex flex-col gap-6">
            {item.category && (
              <span className="text-[var(--color-gray-200)] text-sm uppercase tracking-wide">
                {CATEGORY_LABELS[item.category] || item.category}
              </span>
            )}

            <h1
              className="text-[var(--color-dark-100)] m-0"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                lineHeight: '112%',
                fontWeight: 500,
                letterSpacing: '-1px',
              }}
            >
              {item.title}
            </h1>

            {item.price != null && (
              <div className="text-[var(--color-dark-100)] font-semibold text-2xl">
                S${item.price.toLocaleString()}
              </div>
            )}

            {item.sku && (
              <p className="text-[var(--color-gray-200)] text-sm m-0">SKU: {item.sku}</p>
            )}

            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-brand-orange)]" />
              <span className="text-sm text-[var(--color-gray-100)]">Made to Order</span>
            </div>

            <Link
              href="/contact"
              className="no-underline block text-center bg-[var(--color-brand-orange)] text-white rounded-[100px] px-8 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Enquire Now
            </Link>

            <p className="text-[var(--color-gray-200)] text-sm m-0 text-center">
              Free consultation included — we&apos;ll recommend the right quantity for your space.
            </p>

            <div className="pt-2">
              <TabContent item={item} />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      {item.features && item.features.length > 0 && (
        <section className="py-14 md:py-20 bg-[var(--color-white-200)]">
          <div className="max-w-[1280px] mx-auto px-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {item.features.map((f) => (
                <div key={f} className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-dark-100)] flex items-center justify-center text-white text-base font-bold">
                    ✔
                  </div>
                  <p className="text-[var(--color-dark-100)] font-semibold text-base m-0">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full-width gallery image */}
      {allImages.length > 1 && (() => {
        const img = allImages[1]
        if (!img || !('asset' in img) || !img.asset._ref) return null
        return (
          <section className="py-4">
            <div className="mx-4 rounded-[20px] overflow-hidden" style={{ maxHeight: 520 }}>
              <Image
                src={urlFor(img).width(1280).height(520).url()}
                alt={item.title}
                width={1280}
                height={520}
                className="w-full object-cover"
              />
            </div>
          </section>
        )
      })()}

      {/* About + features split */}
      {item.shortDescription && (
        <section className="py-14 md:py-20">
          <div className="max-w-[1280px] mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <h2
                  className="text-[var(--color-dark-100)] m-0 mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    lineHeight: '120%',
                    fontWeight: 500,
                    letterSpacing: '-0.8px',
                  }}
                >
                  About This Product
                </h2>
                <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed">
                  {item.shortDescription}
                </p>
              </div>
              {item.features && item.features.length > 0 && (
                <div className="bg-[var(--color-white-200)] rounded-[20px] p-8 flex flex-col gap-4">
                  {item.features.slice(0, 4).map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <span className="text-[var(--color-brand-orange)] text-lg mt-0.5">✔</span>
                      <span className="text-[var(--color-dark-100)] font-medium text-base">{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Purchasing guide + room volume table */}
      <section className="py-14 md:py-20 bg-[var(--color-white-200)]">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="text-[var(--color-dark-100)] m-0 mb-4"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(22px, 2.5vw, 32px)',
                  lineHeight: '120%',
                  fontWeight: 500,
                  letterSpacing: '-0.6px',
                }}
              >
                Purchasing Guide
              </h2>
              <p className="text-[var(--color-gray-100)] text-base leading-relaxed m-0">
                Not sure how many panels you need? We offer a free consultation to help recommend the right quantity and placement for your space. Reach out with your room dimensions and use case.
              </p>
              <Link
                href="/contact"
                className="inline-block mt-6 no-underline bg-[var(--color-dark-100)] text-white rounded-[100px] px-6 py-3 text-sm font-semibold hover:opacity-80 transition-opacity"
              >
                Get Free Consultation
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm text-[var(--color-gray-100)]">
              <p className="font-semibold text-[var(--color-dark-100)] text-base m-0 mb-3">Room Volume Guide</p>
              {[
                ['20 m³', '8 panels'],
                ['30 m³', '12 panels'],
                ['40 m³', '16 panels'],
                ['50 m³', '20 panels'],
                ['60 m³', '24 panels'],
                ['70 m³', '28 panels'],
                ['80 m³', '32 panels'],
              ].map(([vol, qty]) => (
                <div key={vol} className="flex items-center justify-between border-b border-[var(--color-gray-500)] py-2">
                  <span>{vol}</span>
                  <span className="font-medium text-[var(--color-dark-100)]">{qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to shop */}
      <section className="py-12">
        <div className="max-w-[1280px] mx-auto px-5 text-center">
          <Link
            href="/shop"
            className="no-underline inline-flex items-center gap-2 text-[var(--color-gray-100)] text-base hover:text-[var(--color-dark-100)] transition-colors"
          >
            ← Back to all products
          </Link>
        </div>
      </section>
    </>
  )
}
