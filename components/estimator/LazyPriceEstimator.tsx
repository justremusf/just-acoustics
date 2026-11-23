'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { PriceEstimatorProps } from '@/components/estimator/PriceEstimator'

const PriceEstimator = dynamic(() => import('@/components/estimator/PriceEstimator'), { ssr: false })

/**
 * Loads the estimator's code only when it comes within ~600px of the screen, so pages where it
 * sits below the fold don't pay for it on first load. The placeholder keeps the same id (anchor
 * links like the hero's "See prices" still land here) and roughly the question's height, so the
 * page doesn't jump when it swaps in.
 */
export default function LazyPriceEstimator(props: PriceEstimatorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || show) return
    if (!('IntersectionObserver' in window)) {
      setShow(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [show])

  // The box keeps its height while the estimator's code downloads (dynamic() renders nothing
  // until then), so the sections below never jump up and back down (pricing page CLS 0.58 → 0).
  const minHeight = props.defaultSpace ? 'min-h-[420px]' : 'min-h-[580px]'

  if (show) {
    return (
      <div className={minHeight}>
        <PriceEstimator {...props} />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      id={props.id}
      className={`scroll-mt-28 rounded-[24px] bg-black/[0.03] ${minHeight}`}
      aria-hidden="true"
    />
  )
}
