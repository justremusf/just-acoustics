'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ArticleHeading } from '@/lib/contentView'

function useActiveHeading(headings: ArticleHeading[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => Boolean(el))
    if (elements.length === 0) return
    const update = () => {
      // The last heading scrolled past the top third of the viewport marks the current section.
      const line = window.innerHeight * 0.3
      let current: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id
      }
      setActive(current)
    }
    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [headings, enabled])

  return active
}

/** "sidebar" is the sticky desktop list; "inline" is the collapsible version shown above the body on smaller screens. */
export default function ArticleToc({ headings, variant }: { headings: ArticleHeading[]; variant: 'sidebar' | 'inline' }) {
  const active = useActiveHeading(headings, variant === 'sidebar')

  const list = (
    <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
      {headings.map((h) => {
        const isActive = active === h.id
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={isActive ? 'location' : undefined}
              className={`block border-l-2 py-1.5 pl-3 text-[14px] leading-snug no-underline transition-colors ${
                isActive
                  ? 'border-[var(--color-brand-orange)] font-semibold text-[var(--color-dark-100)]'
                  : 'border-black/10 text-[var(--color-gray-100)] hover:border-black/30 hover:text-[var(--color-dark-100)]'
              }`}
            >
              {h.text}
            </a>
          </li>
        )
      })}
    </ol>
  )

  if (variant === 'sidebar') {
    return (
      <nav aria-label="In this article">
        <p className="page-kicker mb-3">In this article</p>
        {list}
      </nav>
    )
  }

  return (
    <details className="group rounded-[18px] border border-black/10 bg-white px-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[14px] font-semibold text-[var(--color-dark-100)] [&::-webkit-details-marker]:hidden">
        In this article
        <span className="flex items-center gap-2 text-[13px] font-normal text-[var(--color-gray-200)]">
          {headings.length} sections
          <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open:rotate-180 motion-reduce:transition-none" />
        </span>
      </summary>
      <nav aria-label="In this article" className="pb-4">
        {list}
      </nav>
    </details>
  )
}
