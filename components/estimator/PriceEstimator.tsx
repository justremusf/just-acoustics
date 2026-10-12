'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import Image, { getImageProps } from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Church,
  Coffee,
  Drum,
  GraduationCap,
  Headphones,
  House,
  Landmark,
  Mic,
  Music,
  BookOpen,
  Phone,
  Presentation,
  School,
  Sofa,
  Store,
  Theater,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import { trackEvent } from '@/components/analytics/trackEvent'
import WhatsAppLink from '@/components/analytics/WhatsAppLink'
import { SHIMMER_BUTTON_CLASS } from '@/components/ui/shimmer-button'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { recordEstimate } from '@/lib/whatsappContext'
import { QUIZ_SPACES, findQuizSpace, type QuizIcon } from '@/lib/estimatorQuiz'
import {
  findSizeBand,
  findSpaceType,
  formatPriceEntry,
  type SizeBandSlug,
} from '@/lib/priceGuide'

type Step = 'space' | 'size' | 'result'

const headingFont = { fontFamily: 'var(--font-heading)' }

const ICONS: Record<QuizIcon, LucideIcon> = {
  mic: Mic,
  headphones: Headphones,
  music: Music,
  drum: Drum,
  briefcase: Briefcase,
  phone: Phone,
  users: Users,
  presentation: Presentation,
  building: Building2,
  church: Church,
  landmark: Landmark,
  graduation: GraduationCap,
  book: BookOpen,
  school: School,
  sofa: Sofa,
  house: House,
  theater: Theater,
  utensils: UtensilsCrossed,
  coffee: Coffee,
  store: Store,
}

const RESULT_IMAGE_SIZES = '(min-width: 640px) 480px, 92vw'
const RESULT_IMAGE_QUALITY = 70

/**
 * Start downloading a result photo the moment an answer is pressed, so it is usually ready by the
 * time the result renders. Uses the same srcset/sizes as the <Image> below, so the browser picks
 * the same file and nothing is fetched twice.
 */
function preloadResultImage(src: string) {
  if (typeof window === 'undefined') return
  const { props } = getImageProps({ src, alt: '', fill: true, sizes: RESULT_IMAGE_SIZES, quality: RESULT_IMAGE_QUALITY })
  const img = new window.Image()
  img.decoding = 'async'
  img.sizes = props.sizes ?? ''
  img.srcset = props.srcSet ?? ''
  img.src = props.src
}

function OptionIcon({ icon }: { icon: QuizIcon }) {
  const Icon = ICONS[icon]
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-brand-orange)]/12 text-[#b86a00]">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  )
}

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
  const quizSpace = findQuizSpace(spaceSlug)
  const quizSize = quizSpace?.sizes.find((option) => option.band === sizeSlug)
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
    'flex min-h-[64px] w-full cursor-pointer items-center gap-3.5 rounded-[16px] border border-black/10 bg-white p-3 pr-4 text-left text-[var(--color-dark-100)] transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand-orange)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-orange)] aria-pressed:border-[var(--color-dark-100)] aria-pressed:bg-[var(--color-white-200)]'
  const questionClass = `!m-0 font-medium leading-[1.08] tracking-[-0.6px] text-[var(--color-dark-100)] outline-none ${compact ? 'text-[22px]' : 'text-[clamp(24px,3vw,34px)]'}`
  const backClass =
    'inline-flex w-fit cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-[var(--color-gray-100)] hover:text-[var(--color-dark-100)]'

  return (
    <div id={id} className={`flex scroll-mt-28 flex-col ${compact ? 'gap-4' : 'gap-6'}`} role="group" aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-4">
        <p id={headingId} className="page-kicker !m-0 text-[var(--color-brand-orange)]">
          Instant price estimate
        </p>
        <p className="!m-0 text-xs font-semibold text-[var(--color-gray-200)]" aria-live="polite">
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
          <div className="grid gap-2.5 sm:grid-cols-2">
            {QUIZ_SPACES.map((option) => (
              <button
                key={option.slug}
                type="button"
                aria-pressed={option.slug === spaceSlug}
                className={optionClass}
                onClick={() => {
                  // A new space means new size answers, so always ask the size question again.
                  select(option.slug, null)
                  goTo('size')
                }}
              >
                <OptionIcon icon={option.icon} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-semibold leading-snug">{option.label}</span>
                  <span className="text-[13px] leading-snug text-[var(--color-gray-100)]">{option.hint}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-40" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'size' && quizSpace && (
        <div key="size" className="flex flex-col gap-4 motion-safe:animate-[estimator-step_0.3s_ease-out]">
          <button type="button" className={backClass} onClick={() => goTo('space')}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {quizSpace.label}
          </button>
          <h3 ref={questionRef} tabIndex={-1} className={questionClass} style={headingFont}>
            {quizSpace.sizeQuestion}
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {quizSpace.sizes.map((option) => (
              <button
                key={option.band}
                type="button"
                aria-pressed={option.band === sizeSlug}
                className={optionClass}
                onPointerDown={() => preloadResultImage(option.example.image)}
                onClick={() => {
                  preloadResultImage(option.example.image)
                  select(quizSpace.slug, option.band)
                  goTo('result')
                }}
              >
                <OptionIcon icon={option.icon} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-semibold leading-snug">{option.label}</span>
                  <span className="text-[13px] leading-snug text-[var(--color-gray-100)]">{option.detail}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-40" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && space && size && entry && priceText && quizSpace && quizSize && (
        <div key="result" className="flex flex-col gap-5 motion-safe:animate-[estimator-step_0.3s_ease-out]">
          <button type="button" className={backClass} onClick={() => goTo('size')}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {quizSize.label}
          </button>
          <div className="glass-card flex flex-col overflow-hidden !p-0">
            <Link
              href={`/projects/${quizSize.example.slug}`}
              className="group relative block aspect-[16/10] w-full overflow-hidden bg-[var(--color-white-200)] no-underline"
              data-insight-cta="estimator_case_study"
            >
              <Image
                src={quizSize.example.image}
                alt={`${quizSize.example.title}: acoustic panels installed by Just Acoustics`}
                fill
                sizes={RESULT_IMAGE_SIZES}
                quality={RESULT_IMAGE_QUALITY}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-semibold text-white">
                {quizSize.example.title}
              </span>
              <span className="absolute bottom-3 right-3 inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-bold text-[var(--color-dark-100)] shadow-[0_6px_18px_rgba(0,0,0,0.2)] transition-transform group-hover:-translate-y-0.5">
                View case study →
              </span>
            </Link>
            <div className={`flex flex-col gap-3 ${compact ? 'p-5' : 'p-[clamp(20px,3vw,28px)]'}`}>
              <h3 ref={questionRef} tabIndex={-1} className="page-kicker !m-0 flex flex-wrap items-center gap-2 outline-none">
                ≈ Estimated price range
              </h3>
              <p
                className="!m-0 text-[clamp(30px,4vw,42px)] font-medium leading-[1.05] tracking-[-0.8px] text-[var(--color-dark-100)]"
                style={headingFont}
              >
                {priceText}
              </p>
              <p className="page-card-copy !m-0">
                Panels designed and installed to fix the echo in a space like yours.
                {entry.siteVisit ? ' Bigger spaces like this are quoted after a free site visit.' : ''} We confirm the exact price after seeing your space.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={quoteHref}
              className={`${SHIMMER_BUTTON_CLASS} w-full text-[15px] no-underline sm:w-fit`}
              onClick={() =>
                trackEvent('price_estimate_cta_click', { cta: 'exact_quote', link_url: quoteHref, ...(eventParams ?? {}) })
              }
            >
              Get my free quote
            </Link>
            {/* Message comes from lib/whatsappContext, which already includes the estimate picked above. */}
            <WhatsAppLink
              source="price_estimator"
              followUp="Could you give me an exact quote?"
              className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 text-[15px] font-semibold text-white no-underline transition-transform hover:-translate-y-0.5 sm:w-fit"
              onClick={() => trackEvent('price_estimate_cta_click', { cta: 'whatsapp', ...(eventParams ?? {}) })}
            >
              <WhatsAppIcon size={20} />
              Ask on WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceEstimator
