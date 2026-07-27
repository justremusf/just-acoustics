'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ShimmerButton from '@/components/ui/shimmer-button'

const HERO_IMAGES = [
  {
    src: '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
    alt: 'Installed acoustic panels in a hospitality space',
  },
  {
    src: '/assets/webflow/696a459f805f921445e4427e_9.avif',
    alt: 'Acoustic treatment in an event space',
  },
  {
    src: '/assets/webflow/6964fb659de42387a7d78754_Image%20from%20TinyPNG%20(4).avif',
    alt: 'Acoustic treatment in an office space',
  },
  {
    src: '/assets/webflow/696a4efb255645d4686056e2_7.webp',
    alt: 'Acoustic treatment in a music studio',
  },
] as const

export default function Hero() {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const isVisibleRef = useRef(true)
  const activeImageRef = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    const observer = section
      ? new IntersectionObserver(([entry]) => {
          isVisibleRef.current = entry.isIntersecting
        }, { threshold: 0.15 })
      : null
    if (section && observer) observer.observe(section)

    let transitionTimer: number | undefined
    const interval = window.setInterval(() => {
      if (document.hidden || !isVisibleRef.current) return
      const candidate = (activeImageRef.current + 1) % HERO_IMAGES.length
      const preload = new window.Image()
      preload.decoding = 'async'
      preload.src = HERO_IMAGES[candidate].src
      void preload.decode().catch(() => undefined).then(() => {
        setNextImageIndex(candidate)
        window.requestAnimationFrame(() => setIsTransitioning(true))
        transitionTimer = window.setTimeout(() => {
          activeImageRef.current = candidate
          setActiveImageIndex(candidate)
          setNextImageIndex(null)
          setIsTransitioning(false)
        }, 900)
      })
    }, 6000)

    return () => {
      observer?.disconnect()
      window.clearInterval(interval)
      if (transitionTimer) window.clearTimeout(transitionTimer)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto mt-0 w-[calc(100%-2rem)] max-w-[1580px] overflow-hidden rounded-[24px] px-0 pt-[188px] pb-12 sm:mt-0 sm:pt-[198px] md:mt-[-82px] md:pt-[246px] md:pb-20"
      style={{ fontSize: 16, lineHeight: '1.5em' }}
    >
      <div className="absolute inset-0 z-0 rounded-[24px] overflow-hidden">
        <Image
          src={HERO_IMAGES[activeImageIndex].src}
          alt={HERO_IMAGES[activeImageIndex].alt}
          fill
          priority
          fetchPriority="high"
          quality={72}
          sizes="(max-width: 1580px) 100vw, 1580px"
          className="object-cover"
        />
        {nextImageIndex !== null && (
          <Image
            src={HERO_IMAGES[nextImageIndex].src}
            alt={HERO_IMAGES[nextImageIndex].alt}
            fill
            quality={72}
            sizes="(max-width: 1580px) 100vw, 1580px"
            className={`object-cover transition-opacity duration-[900ms] ease-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      <div className="absolute inset-0 z-0 rounded-[24px] bg-[linear-gradient(115deg,rgba(1,1,1,0.80)_0%,rgba(1,1,1,0.62)_44%,rgba(1,1,1,0.42)_100%)]" />
      <div className="absolute inset-0 z-0 rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(255,165,0,0.22),transparent_32%),linear-gradient(to_top,rgba(1,1,1,0.22),transparent_24%)]" />

      <div className="relative z-10 mx-auto max-w-[1580px] px-4 sm:px-5">
        <div className="grid grid-cols-1 gap-10">
          <div className="max-w-[760px]">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-[100px] border border-white/18 bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/84 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-[12px] sm:tracking-[0.18em]">
              Acoustic Panels Singapore
            </span>
            <h1
              className="m-0 max-w-[15ch] text-white sm:max-w-[18ch]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(30px, 7.2vw, 50px)',
                lineHeight: '0.99',
                fontWeight: 500,
                letterSpacing: '-1.4px',
              }}
            >
              Acoustic Panel Specialists for Echo Reduction
            </h1>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-7 text-white/82 sm:text-[16px] sm:leading-7 md:text-[17px]">
              We supply and install acoustic panels for home studios, churches, offices, restaurants, and schools. Fixing sound quality &amp; speech clarity.
            </p>

            <div className="mt-12 mb-4 flex flex-col gap-3 sm:mt-14 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/contact" className="no-underline">
                <ShimmerButton className="h-auto w-full px-7 py-4 text-[14px] font-semibold sm:min-w-[212px] sm:w-auto">
                  Free Acoustic Consultation
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
