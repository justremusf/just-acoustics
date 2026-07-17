'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { InteractiveVSLConfig } from '@/data/vslConfig'

const InteractiveVSL = dynamic(() => import('@/components/InteractiveVSL'), {
  ssr: false,
  loading: () => <div className="aspect-[9/16] rounded-[22px] bg-[var(--color-dark-100)] sm:aspect-video" />,
})

export default function LazyInteractiveVSL({
  config,
  pageLocation,
  compact = false,
}: {
  config: InteractiveVSLConfig
  pageLocation: string
  compact?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShouldRender(true)
      observer.disconnect()
    }, { rootMargin: '240px 0px' })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      {shouldRender ? (
        <InteractiveVSL config={config} pageLocation={pageLocation} compact={compact} />
      ) : (
        <section className={compact ? 'px-4 py-6 sm:px-5 md:py-8' : 'px-4 py-7 sm:px-5 md:py-9'}>
          <div className="site-container">
            <div className="aspect-[9/16] rounded-[22px] bg-[var(--color-dark-100)] sm:aspect-video" />
          </div>
        </section>
      )}
    </div>
  )
}
