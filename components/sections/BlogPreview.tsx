'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/lib/types'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'
import ShimmerButton from '@/components/ui/shimmer-button'

interface Props {
  posts?: Post[]
}

export default function BlogPreview({ posts = [] }: Props) {
  const visiblePosts = posts.slice(0, 6)
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([])

  useEffect(() => {
    if (visiblePosts.length < 2) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visiblePosts.length)
    }, 4200)

    return () => window.clearInterval(interval)
  }, [visiblePosts.length])

  useEffect(() => {
    const track = trackRef.current
    const activeCard = cardRefs.current[activeIndex]
    if (!track || !activeCard) return

    const trackBounds = track.getBoundingClientRect()
    const cardBounds = activeCard.getBoundingClientRect()
    const left = cardBounds.left - trackBounds.left + track.scrollLeft

    track.scrollTo({
      left,
      behavior: 'smooth',
    })
  }, [activeIndex])

  if (visiblePosts.length === 0) return null

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + visiblePosts.length) % visiblePosts.length)
  }

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % visiblePosts.length)
  }

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,1.34fr)] lg:gap-10">
          <div className="max-w-[520px]">
            <span className="soft-pill">Resource Center</span>
            <h2 className="home-heading mt-4 max-w-[12ch] text-[var(--color-dark-100)]">
              Learn More About Acoustic Treatment from Our Articles.
            </h2>
            <p className="home-copy mt-4 max-w-[44ch]">
              Practical guidance, room-specific advice, and clearer buying context from the kinds of acoustic problems we solve most often across Singapore.
            </p>

            <div className="mt-6">
              <Link href="/blog" className="w-full no-underline sm:w-auto">
                <ShimmerButton className="h-auto w-full px-7 py-4 text-sm sm:w-auto">
                  Explore Resource Center
                </ShimmerButton>
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white/78 text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/14 hover:text-[var(--color-brand-orange)]"
                aria-label="Previous article"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white/78 text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/14 hover:text-[var(--color-brand-orange)]"
                aria-label="Next article"
              >
                →
              </button>
            </div>

            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {visiblePosts.map((post, index) => {
                const topic = RESOURCE_TOPICS.find((item) => item.value === post.category)

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    ref={(element) => {
                      cardRefs.current[index] = element
                    }}
                    className="group flex min-h-[360px] min-w-[84%] snap-start flex-col rounded-[24px] border border-black/6 bg-white/84 p-5 no-underline shadow-[0_16px_42px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 md:min-w-[calc(50%-8px)]"
                  >
                    <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                      {topic?.title || 'Acoustic Education'}
                    </p>
                    <h3
                      className="mt-4 m-0 text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(24px, 2.4vw, 34px)',
                        lineHeight: '1.02',
                        fontWeight: 600,
                        letterSpacing: '-0.8px',
                      }}
                    >
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-4 text-[14px] leading-6 text-[var(--color-gray-100)]">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]">
                      Read article
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
