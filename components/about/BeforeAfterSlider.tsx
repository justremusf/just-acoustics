'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { MoveHorizontal } from 'lucide-react'

interface Props {
  before: { src: string; alt: string }
  after: { src: string; alt: string }
}

/** Drag (or use arrow keys) to wipe between an untreated and a treated room. */
export default function BeforeAfterSlider({ before, after }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  const moveTo = useCallback((clientX: number) => {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  return (
    <div
      ref={frameRef}
      className="relative aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden rounded-[28px] bg-[var(--color-dark-100)] shadow-[0_30px_80px_rgba(0,0,0,0.18)] touch-pan-y"
      onPointerDown={(event) => {
        setDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
        moveTo(event.clientX)
      }}
      onPointerMove={(event) => {
        if (dragging) moveTo(event.clientX)
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" draggable={false} />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-[var(--color-brand-orange)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-dark-100)]">
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_24px_rgba(0,0,0,0.4)]" style={{ left: `${position}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') setPosition((value) => Math.max(0, value - 5))
            if (event.key === 'ArrowRight') setPosition((value) => Math.min(100, value + 5))
          }}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[var(--color-brand-orange)] text-[var(--color-dark-100)] shadow-[0_12px_30px_rgba(0,0,0,0.3)] outline-none focus-visible:ring-4 focus-visible:ring-white/60"
        >
          <MoveHorizontal size={22} />
        </div>
      </div>
    </div>
  )
}
