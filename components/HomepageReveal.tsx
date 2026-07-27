'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export default function HomepageReveal({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-home-reveal]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      root.classList.add('is-ready')
      return
    }

    const viewportCutoff = window.innerHeight * 0.94
    items.forEach((item) => {
      if (item.getBoundingClientRect().top < viewportCutoff) item.classList.add('is-visible')
    })
    root.classList.add('is-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const item = entry.target as HTMLElement
          item.classList.add('is-visible')
          observer.unobserve(item)
        })
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.04 },
    )

    items.forEach((item) => {
      if (!item.classList.contains('is-visible')) observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="homepage-reveal-root">
      {children}
    </div>
  )
}
