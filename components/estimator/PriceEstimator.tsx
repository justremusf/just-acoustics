'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { trackEvent } from '@/components/analytics/trackEvent'
import {
  SIZE_BANDS,
  SPACE_TYPES,
  findSizeBand,
  findSpaceType,
  formatPriceEntry,
  type SizeBandSlug,
} from '@/lib/priceGuide'

const WHATSAPP_BASE = 'https://wa.me/6589301905'

export type PriceEstimatorProps = {
  /** Space slug from lib/priceGuide.ts (e.g. "office") to preselect. */
  defaultSpace?: string
  /** Tighter spacing and no heading, for dropping into other sections. */
  compact?: boolean
  id?: string
}

export function PriceEstimator({ defaultSpace, compact = false, id }: PriceEstimatorProps) {
  const headingId = useId()
  const [spaceSlug, setSpaceSlug] = useState<string | null>(findSpaceType(defaultSpace)?.slug ?? null)
  const [sizeSlug, setSizeSlug] = useState<SizeBandSlug | null>(null)

  const space = findSpaceType(spaceSlug)
  const size = findSizeBand(sizeSlug)
  const entry = space && size ? space.prices[size.slug] : null
  const priceText = entry ? formatPriceEntry(entry) : null

  const eventParams =
    space && size && entry
      ? {
          space: space.slug,
          size: size.slug,
          price_low: entry.low,
          ...(entry.high != null ? { price_high: entry.high } : {}),
          price_label: priceText,
        }
      : null

  function select(nextSpace: string | null, nextSize: SizeBandSlug | null) {
    setSpaceSlug(nextSpace)
    setSizeSlug(nextSize)
    const s = findSpaceType(nextSpace)
    const b = findSizeBand(nextSize)
    if (!s || !b) return
    const e = s.prices[b.slug]
    trackEvent('price_estimate_view', {
      space: s.slug,
      size: b.slug,
      price_low: e.low,
      ...(e.high != null ? { price_high: e.high } : {}),
      price_label: formatPriceEntry(e),
    })
  }

  const quoteHref =
    space && size
      ? `/contact?${new URLSearchParams({ space: space.slug, size: size.slug }).toString()}`
      : '/contact'

  const whatsappText =
    space && size && priceText
      ? [
          'Hi Just Acoustics, I used the price estimator on your website.',
          `Space: ${space.label}`,
          `Size: ${size.label} (${size.area})`,
          `Typical range shown: ${priceText}`,
          'Could you give me an exact quote?',
        ].join('\n')
      : 'Hi Just Acoustics, I would like a quote for acoustic treatment.'
  const whatsappHref = `${WHATSAPP_BASE}?${new URLSearchParams({ text: whatsappText }).toString()}`

  const pillClass = (active: boolean) =>
    `page-filter min-h-[44px] cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-orange)] ${active ? 'active' : ''}`

  return (
    <div
      id={id}
      className={`flex scroll-mt-28 flex-col ${compact ? 'gap-5' : 'gap-7'}`}
      role="group"
      aria-labelledby={headingId}
    >
      {compact ? (
        <p id={headingId} className="page-kicker text-[var(--color-brand-orange)]">
          Instant price estimate
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="page-kicker text-[var(--color-brand-orange)]">Instant price estimate</p>
          <h2 id={headingId} className="page-card-title">
            What will my room cost?
          </h2>
          <p className="page-card-copy max-w-[60ch]">
            Pick your space and its size to see what similar projects typically cost in Singapore.
          </p>
        </div>
      )}

      <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
        <legend className="mb-3 p-0 text-sm font-bold text-[var(--color-dark-100)]">1. Type of space</legend>
        <div className="flex flex-wrap gap-2">
          {SPACE_TYPES.map((option) => {
            const active = option.slug === spaceSlug
            return (
              <button
                key={option.slug}
                type="button"
                aria-pressed={active}
                className={pillClass(active)}
                onClick={() => select(option.slug, sizeSlug)}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
        <legend className="mb-3 p-0 text-sm font-bold text-[var(--color-dark-100)]">2. Room size</legend>
        <div className="flex flex-wrap gap-2">
          {SIZE_BANDS.map((option) => {
            const active = option.slug === sizeSlug
            return (
              <button
                key={option.slug}
                type="button"
                aria-pressed={active}
                className={`${pillClass(active)} flex-col !items-start gap-0.5 !rounded-[18px]`}
                onClick={() => select(spaceSlug, option.slug)}
              >
                <span>
                  {option.label} <span className="font-normal opacity-80">· {option.area}</span>
                </span>
                <span className="text-xs font-normal opacity-80">e.g. {option.examples}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className={`glass-card flex flex-col gap-5 ${compact ? 'p-5' : 'p-[clamp(20px,3vw,32px)]'}`}>
        <div aria-live="polite" aria-atomic="true" className="flex flex-col gap-3">
          {space && size && entry && priceText ? (
            <>
              <p className="page-kicker">
                {space.label} · {size.label} ({size.area})
              </p>
              <p
                className="m-0 text-[clamp(26px,3.4vw,38px)] font-medium leading-[1.05] tracking-[-0.8px] text-[var(--color-dark-100)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {entry.display === 'range' ? (
                  <>
                    <span className="block text-base font-semibold tracking-normal text-[var(--color-gray-100)]">
                      Typical range
                    </span>
                    {priceText}
                  </>
                ) : (
                  priceText
                )}
              </p>
              <p className="page-card-copy">
                Includes supply and installation, with panels designed for your room.
                {entry.siteVisit ? ' Larger spaces like this are quoted after a site visit.' : ''}
              </p>
              <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">
                Final price confirmed after we see your space.
              </p>
            </>
          ) : (
            <p className="page-card-copy">
              {space
                ? 'Now pick a room size to see the typical range.'
                : size
                  ? 'Now pick your type of space to see the typical range.'
                  : 'Pick a type of space and a room size to see the typical range.'}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={quoteHref}
            className="page-cta w-full sm:w-fit"
            onClick={() =>
              trackEvent('price_estimate_cta_click', { cta: 'exact_quote', link_url: quoteHref, ...(eventParams ?? {}) })
            }
          >
            Get my exact quote
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="page-link min-h-[44px] justify-center sm:justify-start"
            onClick={() => {
              trackEvent('price_estimate_cta_click', { cta: 'whatsapp', ...(eventParams ?? {}) })
              trackEvent('whatsapp_click', { link_url: whatsappHref, source: 'price_estimator', ...(eventParams ?? {}) })
            }}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default PriceEstimator
