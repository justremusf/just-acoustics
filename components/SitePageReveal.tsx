'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const REVEAL_SELECTOR = [
  '[data-home-reveal]',
  '[data-site-reveal]',
  ':scope > section',
  ':scope > main > section',
  ':scope > main > div',
  ':scope > div:not([data-home-reveal]):not([data-site-reveal]) > section',
  ':scope > div:not([data-home-reveal]):not([data-site-reveal]) > main > section',
].join(',')

function getRevealItems(root: HTMLElement) {
  const candidates = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
  return candidates.filter(
    (item) => !candidates.some((parent) => parent !== item && parent.contains(item)),
  )
}

export function SitePageReveal({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    root.classList.remove('is-ready')
    const items = getRevealItems(root)
    items.forEach((item) => item.classList.remove('is-visible'))

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
  }, [pathname])

  return (
    <div ref={rootRef} className="site-page-reveal-root">
      {children}
    </div>
  )
}
