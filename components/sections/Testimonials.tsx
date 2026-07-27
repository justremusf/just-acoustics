'use client'

import { useRef, useState } from 'react'
import type { Testimonial } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const CASE_STUDY_VIDEO_ID = '-1WDATPou2Y'
const CASE_STUDY_THUMBNAILS = [
  `https://i.ytimg.com/vi/${CASE_STUDY_VIDEO_ID}/hqdefault.jpg`,
  `https://i.ytimg.com/vi/${CASE_STUDY_VIDEO_ID}/maxresdefault.jpg`,
]

const FALLBACK_TESTIMONIALS: Omit<Testimonial, '_id' | 'image'>[] = [
  {
    authorName: 'Gerald',
    company: 'Mortgage Hub',
    review:
      'They are patient and explained the options of reducing echoes in the office space professionally. I recommend Just Acoustics for both residential and commercial projects.',
    rating: 5,
  },
  {
    authorName: 'Irvin',
    company: 'Church of Christ',
    review:
      'The Just Acoustics team were professional, efficient and detailed in their work. Highly recommended for homes and businesses!',
    rating: 5,
  },
  {
    authorName: 'Madeleine',
    company: 'Concentricheal',
    review:
      'Working with the team was very smooth! They are highly knowledgeable in elaborating on the sound treatment options and recommending the best one that fits our requirements.',
    rating: 5,
  },
]

interface Props {
  testimonials?: Testimonial[]
}

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-[var(--color-brand-orange)]' : 'text-[var(--color-gray-300)]'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function Testimonials({ testimonials }: Props) {
  const items = testimonials && testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS
  const [isStoryVideoActive, setIsStoryVideoActive] = useState(false)
  const [storyThumbnailIndex, setStoryThumbnailIndex] = useState(0)
  const reviewsRailRef = useRef<HTMLDivElement | null>(null)

  const moveReviews = (direction: -1 | 1) => {
    const rail = reviewsRailRef.current
    if (!rail) return

    rail.scrollBy({
      left: direction * Math.max(250, rail.clientWidth * 0.76),
      behavior: 'smooth',
    })
  }

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1580px]">
        <div className="max-w-[620px] pb-[25px]">
          <h2 className="home-heading mt-5 text-[var(--color-dark-100)]">
            Hear from our clients
          </h2>
        </div>

        <div className="glass-card mt-10 overflow-hidden md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="section-shell-pad">
              <p className="page-kicker text-[var(--color-brand-orange)]">Client story</p>
              <h3
                className="m-0 mt-4 text-[var(--color-dark-100)]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(22px, 2.8vw, 32px)',
                  lineHeight: '1.08',
                  fontWeight: 500,
                  letterSpacing: '-0.8px',
                  width: 'min(100%, 588px)',
                }}
              >
                Case Study: Noisy Yoga Studio
              </h3>
            </div>
            <div className="min-h-[220px] border-t border-black/6 lg:border-t-0 lg:border-l lg:border-black/6">
              <div className="relative h-full w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                {isStoryVideoActive ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${CASE_STUDY_VIDEO_ID}?autoplay=1&rel=0&playsinline=1`}
                    title="Client Testimonial Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsStoryVideoActive(true)}
                    className="group absolute inset-0 block border-0 bg-[#171717] p-0 text-left"
                    aria-label="Play client testimonial video"
                  >
                    <img
                      src={CASE_STUDY_THUMBNAILS[storyThumbnailIndex]}
                      alt="Client testimonial preview"
                      className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
                      loading="lazy"
                      decoding="async"
                      onError={() => {
                        if (storyThumbnailIndex < CASE_STUDY_THUMBNAILS.length - 1) {
                          setStoryThumbnailIndex((index) => index + 1)
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38)_56%,rgba(0,0,0,0.68))]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/50 bg-[var(--color-brand-orange)] text-[31px] text-white shadow-[0_0_0_12px_rgba(255,165,0,0.12),0_24px_60px_rgba(0,0,0,0.32)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:shadow-[0_0_0_16px_rgba(255,165,0,0.15),0_30px_72px_rgba(0,0,0,0.4)]">
                        <span className="translate-x-[2px]">▶</span>
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4 md:hidden">
          <p className="m-0 text-sm font-semibold text-[var(--color-gray-100)]">
            Swipe to see more reviews
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => moveReviews(-1)}
              aria-label="Previous review"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white/82 text-[var(--color-dark-100)] shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => moveReviews(1)}
              aria-label="Next review"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white/82 text-[var(--color-dark-100)] shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={reviewsRailRef}
          className="no-scrollbar mt-4 grid snap-x snap-mandatory auto-cols-[min(76vw,310px)] grid-flow-col gap-4 overflow-x-auto pb-3 pr-[18vw] md:mt-10 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible md:pr-0 md:pb-0"
        >
          {items.map((t, i) => (
            <div
              key={'_id' in t ? (t._id as string) : i}
              className="glass-card flex min-w-0 snap-start flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset] md:p-6"
            >
              <Stars rating={t.rating} />
              <p className="m-0 text-base leading-relaxed text-[var(--color-gray-100)]">&ldquo;{t.review}&rdquo;</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                {'image' in t && t.image ? (
                  <Image
                    src={urlFor(t.image).width(48).height(48).url()}
                    alt={t.authorName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-gray-600)] text-lg font-semibold text-white">
                    {t.authorName[0]}
                  </div>
                )}
                <div>
                  <p className="m-0 text-base font-semibold text-[var(--color-dark-100)]">{t.authorName}</p>
                  {t.company && <p className="m-0 text-sm text-[var(--color-gray-200)]">{t.company}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
