'use client'

import { useEffect, useRef, useState } from 'react'
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

function getImageSrc(image: ShopItem['mainImage'] | NonNullable<ShopItem['gallery']>[number] | null | undefined, width: number, height: number) {
  return image && 'asset' in image && image.asset._ref ? urlFor(image).width(width).height(height).url() : null
}

function TabContent({ item }: { item: ShopItem }) {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'acoustical' | 'installation'>('details')
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
    { id: 'acoustical', label: 'Acoustical Specs' },
    { id: 'installation', label: 'Installation' },
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

        {activeTab === 'acoustical' && (
          item.acousticalSpecs?.rows && item.acousticalSpecs.rows.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {item.acousticalSpecs.title && (
                  <h3
                    className="m-0 text-[clamp(26px,3vw,38px)] font-medium tracking-[-0.03em] text-[var(--color-dark-100)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.acousticalSpecs.title}
                  </h3>
                )}
                {item.acousticalSpecs.subtitle && (
                  <p
                    className="m-0 text-[clamp(17px,2vw,21px)] tracking-[-0.02em] text-[var(--color-gray-100)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.acousticalSpecs.subtitle}
                  </p>
                )}
              </div>

              <div className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full border-collapse text-left text-[14px] leading-6 text-[var(--color-gray-100)]">
                    <thead className="bg-[linear-gradient(180deg,rgba(255,188,42,0.10),rgba(255,255,255,0.92))]">
                      <tr>
                        <th className="border-b border-r border-black/6 px-4 py-4 font-semibold text-[var(--color-dark-100)]">Thickness</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">125Hz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">250Hz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">500Hz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">1kHz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">2kHz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">4kHz</th>
                        <th className="border-b px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">NRC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.acousticalSpecs.rows.map((row) => (
                        <tr key={row.thickness} className="bg-white even:bg-[rgba(255,188,42,0.04)]">
                          <td className="border-r border-black/6 px-4 py-4 font-medium text-[var(--color-dark-100)]">{row.thickness}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz125}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz250}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz500}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz1000}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz2000}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz4000}</td>
                          <td className="px-4 py-4 text-center font-semibold text-[var(--color-brand-orange-dark)]">{row.nrc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="m-0">Acoustical specs coming soon.</p>
          )
        )}

        {activeTab === 'installation' && (
          item.installation && item.installation.length > 0 ? (
            <div className="portable-copy">
              <PortableText value={item.installation as PortableTextBlock[]} />
            </div>
          ) : (
            <p className="m-0">Installation details coming soon.</p>
          )
        )}
      </div>
    </div>
  )
}

export default function ShopItemDetail({ item }: { item: ShopItem }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const thumbRowRef = useRef<HTMLDivElement | null>(null)
  const lightboxThumbRowRef = useRef<HTMLDivElement | null>(null)
  const allImages = [item.mainImage, ...(item.gallery || [])].filter(Boolean)
  const mainSrc = getImageSrc(allImages[selectedImage], 1400, 1120)

  const selectImage = (index: number) => {
    if (index < 0 || index >= allImages.length || index === selectedImage) return
    setSelectedImage(index)
  }

  const selectNextImage = () => setSelectedImage((current) => (current + 1) % allImages.length)
  const selectPreviousImage = () => setSelectedImage((current) => (current - 1 + allImages.length) % allImages.length)

  useEffect(() => {
    if (!lightboxOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowRight') selectNextImage()
      if (event.key === 'ArrowLeft') selectPreviousImage()
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, allImages.length])

  useEffect(() => {
    const activeThumb = thumbRowRef.current?.querySelector<HTMLButtonElement>(`[data-thumb-index="${selectedImage}"]`)
    activeThumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })

    const activeLightboxThumb =
      lightboxThumbRowRef.current?.querySelector<HTMLButtonElement>(`[data-lightbox-thumb-index="${selectedImage}"]`)
    activeLightboxThumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedImage])

  return (
    <div className="page-wrap page-stack">
      <Link href="/shop" className="page-link">← Back to all products</Link>

      <section className="home-shell page-hero-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)] lg:items-start">
          <div className="grid gap-4">
            <div className="glass-card overflow-hidden rounded-[28px]">
              <div className="group relative aspect-[4/3] w-full overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => mainSrc && setLightboxOpen(true)}
                  className="absolute inset-0 block w-full overflow-hidden text-left"
                  aria-label="Open image gallery"
                >
                  {allImages.length > 0 ? (
                    <div
                      className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${allImages.length * 100}%`, transform: `translateX(-${selectedImage * (100 / allImages.length)}%)` }}
                    >
                      {allImages.map((img, index) => {
                        const src = getImageSrc(img, 1400, 1120)
                        return (
                          <div key={index} className="relative h-full shrink-0" style={{ width: `${100 / allImages.length}%` }}>
                            {src ? (
                              <Image src={src} alt={`${item.title} ${index + 1}`} fill className="object-cover" />
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-gray-200)]">No image</div>
                  )}
                </button>

                {allImages.length > 1 && (
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

            {allImages.length > 1 && (
              <div ref={thumbRowRef} className="no-scrollbar flex gap-3 overflow-x-auto bg-white pb-1">
                {allImages.map((img, index) => {
                  const thumbSrc = getImageSrc(img, 240, 240)
                  if (!thumbSrc) return null
                  return (
                    <button
                      key={index}
                      type="button"
                      data-thumb-index={index}
                      onClick={() => selectImage(index)}
                      className={
                        selectedImage === index
                          ? 'glass-card relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[18px] ring-2 ring-[var(--color-brand-orange)] transition-transform duration-300 ease-out'
                          : 'glass-card relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[18px] opacity-72 transition-all duration-300 ease-out hover:scale-[1.02] hover:opacity-100'
                      }
                    >
                      <Image
                        src={thumbSrc}
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
            <div>
              <h1
                className="m-0 max-w-[16ch] text-[29px] text-[var(--color-dark-100)] sm:text-[36px]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  lineHeight: '1.06',
                  fontWeight: 500,
                  letterSpacing: '-0.5px',
                }}
              >
                {item.title}
              </h1>
              {item.price != null && (
                <p
                  className="mt-5 mb-0 font-medium text-[clamp(18px,1.2vw,21px)] leading-none tracking-[-0.1px] text-[var(--color-dark-100)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  S${item.price.toLocaleString()}
                </p>
              )}
              {item.sku && <p className="page-kicker mt-3">SKU {item.sku}</p>}
            </div>
            <p className="max-w-[58ch] text-[15px] leading-8 text-[var(--color-gray-100)]">
              {item.shortDescription || 'Made-to-order acoustic treatment with consultation support to help match quantity and placement to the room.'}
            </p>
            <Link href="/contact" className="page-cta mt-3 w-fit">Request a Quote</Link>
          </div>
        </div>
      </section>

      {lightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/92 px-4 py-6 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex h-full max-w-[1400px] flex-col">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="m-0 text-sm font-medium text-white/72">
                {selectedImage + 1} / {allImages.length}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/10 text-xl text-white transition-colors hover:bg-white/16"
                aria-label="Close gallery"
              >
                ×
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-black">
              <div
                className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${allImages.length * 100}%`, transform: `translateX(-${selectedImage * (100 / allImages.length)}%)` }}
              >
                {allImages.map((img, index) => {
                  const src = getImageSrc(img, 1800, 1400)
                  return (
                    <div key={index} className="relative h-full shrink-0" style={{ width: `${100 / allImages.length}%` }}>
                      {src ? (
                        <Image
                          src={src}
                          alt={`${item.title} enlarged ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      ) : null}
                    </div>
                  )
                })}
              </div>

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={selectPreviousImage}
                    className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/35 text-2xl text-white transition-colors hover:bg-black/55"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={selectNextImage}
                    className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/35 text-2xl text-white transition-colors hover:bg-black/55"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div ref={lightboxThumbRowRef} className="no-scrollbar mt-4 flex justify-start gap-3 overflow-x-auto pb-1">
                {allImages.map((img, index) => {
                  const thumbSrc = getImageSrc(img, 240, 240)
                  if (!thumbSrc) return null
                  return (
                    <button
                      key={index}
                      type="button"
                      data-lightbox-thumb-index={index}
                      onClick={() => selectImage(index)}
                      className={
                        selectedImage === index
                          ? 'relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[16px] ring-2 ring-[var(--color-brand-orange)]'
                          : 'relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[16px] opacity-72 transition-opacity hover:opacity-100'
                      }
                    >
                      <Image
                        src={thumbSrc}
                        alt={`${item.title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

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
