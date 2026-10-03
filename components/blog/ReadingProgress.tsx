'use client'

import { useEffect, useRef } from 'react'

/** Slim bar at the top of the viewport showing how far through the article body the reader is. */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = document.getElementById(targetId)
    const bar = barRef.current
    if (!target || !bar) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = target.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : rect.top < 0 ? 1 : 0
      bar.style.transform = `scaleX(${progress})`
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[1100] h-[3px]">
      <div
        ref={barRef}
        className="h-full origin-left bg-[var(--color-brand-orange)] motion-safe:transition-transform motion-safe:duration-100"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
