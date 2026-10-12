'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react'
import { trackEvent } from '@/components/analytics/trackEvent'
import WhatsAppLink from '@/components/analytics/WhatsAppLink'
import { recordEstimate } from '@/lib/whatsappContext'
import {
  SIZE_BANDS,
  SPACE_TYPES,
  findSizeBand,
  findSpaceType,
  formatPriceEntry,
  type SizeBandSlug,
} from '@/lib/priceGuide'

type Step = 'space' | 'size' | 'result'

const headingFont = { fontFamily: 'var(--font-heading)' }

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
  // One question at a time: pages that already know the space start on the size question.
  const [step, setStep] = useState<Step>(findSpaceType(defaultSpace) ? 'size' : 'space')
  const questionRef = useRef<HTMLHeadingElement>(null)
  const movedRef = useRef(false)

  // Move focus to each new question (not on first render) so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!movedRef.current) return
    questionRef.current?.focus({ preventScroll: true })
  }, [step])

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

  function goTo(next: Step) {
    movedRef.current = true
    setStep(next)
  }

  function select(nextSpace: string | null, nextSize: SizeBandSlug | null) {
    setSpaceSlug(nextSpace)
    setSizeSlug(nextSize)
    const s = findSpaceType(nextSpace)
    const b = findSizeBand(nextSize)
    if (!s || !b) return
    const e = s.prices[b.slug]
    // Same figures the visitor sees: a range only when the card shows one.
    recordEstimate({ space: s.slug, size: b.slug, low: e.low, high: e.display === 'range' ? e.high : null })
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

  const stepNumber = step === 'space' ? 1 : step === 'size' ? 2 : 3
  const optionClass =
    'flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-3 rounded-[16px] border border-black/10 bg-white px-5 py-3 text-left text-[15px] font-semibold text-[var(--color-dark-100)] transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-orange)] aria-pressed:border-[var(--color-dark-100)] aria-pressed:bg-[var(--color-white-200)]'
  const questionClass = `!m-0 font-medium leading-[1.08] tracking-[-0.6px] text-[var(--color-dark-100)] outline-none ${compact ? 'text-[22px]' : 'text-[clamp(24px,3vw,34px)]'}`
  const backClass =
    'inline-flex w-fit cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-[var(--color-gray-100)] hover:text-[var(--color-dark-100)]'

  return (
    <div id={id} className={`flex scroll-mt-28 flex-col ${compact ? 'gap-4' : 'gap-6'}`} role="group" aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-4">
        <p id={headingId} className="page-kicker m-0 text-[var(--color-brand-orange)]">
          Instant price estimate
        </p>
        <p className="m-0 text-xs font-semibold text-[var(--color-gray-200)]" aria-live="polite">
          {step === 'result' ? 'Your estimate' : `Question ${stepNumber} of 2`}
        </p>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-black/8" aria-hidden="true">
        <div
          className="h-full rounded-full bg-[var(--color-brand-orange)] transition-[width] duration-500 ease-out"
          style={{ width: `${(stepNumber / 3) * 100}%` }}
        />
      </div>

      {step === 'space' && (
        <div key="space" className="flex flex-col gap-4 motion-safe:animate-[estimator-step_0.3s_ease-out]">
          <h3 ref={questionRef} tabIndex={-1} className={questionClass} style={headingFont}>
            What kind of space is it?
          </h3>
          {!compact && <p className="page-card-copy m-0">Two quick taps. No contact details needed.</p>}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {SPACE_TYPES.map((option) => (
              <button
                key={option.slug}
                type="button"
                aria-pressed={option.slug === spaceSlug}
                className={optionClass}
                onClick={() => {
                  select(option.slug, sizeSlug)
                  goTo(sizeSlug ? 'result' : 'size')
                }}
              >
                {option.label}
                <ArrowRight className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'size' && (
        <div key="size" className="flex flex-col gap-4 motion-safe:animate-[estimator-step_0.3s_ease-out]">
          <button type="button" className={backClass} onClick={() => goTo('space')}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {space ? space.label : 'Back'}
          </button>
          <h3 ref={questionRef} tabIndex={-1} className={questionClass} style={headingFont}>
            How big is the room?
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {SIZE_BANDS.map((option) => (
              <button
                key={option.slug}
                type="button"
                aria-pressed={option.slug === sizeSlug}
                className={optionClass}
                onClick={() => {
                  select(spaceSlug, option.slug)
                  goTo('result')
                }}
              >
                <span className="flex flex-col gap-0.5">
                  <span>
                    {option.label} <span className="font-normal text-[var(--color-gray-100)]">· {option.area}</span>
                  </span>
                  <span className="text-xs font-normal text-[var(--color-gray-200)]">e.g. {option.examples}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && space && size && entry && priceText && (
        <div key="result" className="flex flex-col gap-5 motion-safe:animate-[estimator-step_0.3s_ease-out]">
          <button type="button" className={backClass} onClick={() => goTo('size')}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {space.label} · {size.label}
          </button>
          <div className={`glass-card flex flex-col gap-3 ${compact ? 'p-5' : 'p-[clamp(20px,3vw,32px)]'}`}>
            <h3 ref={questionRef} tabIndex={-1} className="page-kicker !m-0 flex flex-wrap items-center gap-2 outline-none">
              {entry.display === 'range' ? 'Typical range' : 'Typical price'}
              <span className="rounded-full border border-black/10 bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-[var(--color-gray-100)]">
                Supply + installation
              </span>
            </h3>
            <p
              className="m-0 text-[clamp(30px,4vw,42px)] font-medium leading-[1.05] tracking-[-0.8px] text-[var(--color-dark-100)]"
              style={headingFont}
            >
              {priceText}
            </p>
            <p className="page-card-copy m-0">
              For a {size.label.toLowerCase()} {space.label.toLowerCase()} ({size.area}), with panels designed for your room.
              {entry.siteVisit ? ' Larger spaces like this are quoted after a site visit.' : ''} Final price confirmed after we see your space.
            </p>
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
            {/* Message comes from lib/whatsappContext, which already includes the estimate picked above. */}
            <WhatsAppLink
              source="price_estimator"
              followUp="Could you give me an exact quote?"
              className="page-link min-h-[44px] justify-center sm:justify-start"
              onClick={() => trackEvent('price_estimate_cta_click', { cta: 'whatsapp', ...(eventParams ?? {}) })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Ask on WhatsApp
            </WhatsAppLink>
          </div>
          <Link href="/shop" className="m-0 w-fit text-sm font-semibold text-[var(--color-gray-100)] underline-offset-2 hover:underline">
            Installing yourself? See panel prices →
          </Link>
        </div>
      )}
    </div>
  )
}

export default PriceEstimator
