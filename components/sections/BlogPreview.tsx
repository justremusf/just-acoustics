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

  useEffect(() => {
    if (visiblePosts.length < 2) return
    if (typeof window === 'undefined' || !window.matchMedia('(min-width: 768px)').matches) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visiblePosts.length)
    }, 4200)

    return () => window.clearInterval(interval)
  }, [visiblePosts.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (typeof window === 'undefined' || !window.matchMedia('(min-width: 768px)').matches) return

    const cardWidth = track.clientWidth >= 768 ? (track.clientWidth - 20) / 2 : track.clientWidth * 0.86
    const left = activeIndex * (cardWidth + 20)

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
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px] bg-white" style={{ backdropFilter: 'none' }}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
          <div className="max-w-[560px]">
            <span className="soft-pill">Resource Center</span>
            <h2 className="home-heading mt-5 max-w-[380px] text-[var(--color-dark-100)]">
              Learn More About Acoustics.
            </h2>
            <p className="home-copy mt-5 max-w-[40ch]">
              Practical guidance and room-specific advice to help you understand what treatment your space may need.
            </p>

            <div className="mt-8">
              <Link href="/blog" className="w-full no-underline sm:w-auto">
                <ShimmerButton className="h-auto w-full px-7 py-4 text-sm sm:w-auto">
                  Explore Resource Center
                </ShimmerButton>
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/14 hover:text-[var(--color-brand-orange)]"
                aria-label="Previous article"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/14 hover:text-[var(--color-brand-orange)]"
                aria-label="Next article"
              >
                →
              </button>
            </div>

            <div className="overflow-hidden rounded-[32px] bg-white">
              <div
                ref={trackRef}
                className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden"
              >
              {visiblePosts.map((post, index) => {
                const topic = RESOURCE_TOPICS.find((item) => item.value === post.category)

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group flex min-h-[420px] min-w-[86%] snap-start flex-col rounded-[28px] border border-black/6 bg-white p-7 no-underline shadow-[0_26px_64px_rgba(0,0,0,0.08),0_10px_26px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.9)_inset] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_72px_rgba(0,0,0,0.1),0_12px_30px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.92)_inset] md:min-w-[calc(50%-10px)]"
                  >
                    <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                      {topic?.title || 'Acoustic Education'}
                    </p>
                    <h3
                      className="mt-4 m-0 max-w-[12ch] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]"
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
                      <p className="mt-5 max-w-[32ch] text-[14px] leading-6 text-[var(--color-gray-100)]">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]">
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
      </div>
    </section>
  )
}
