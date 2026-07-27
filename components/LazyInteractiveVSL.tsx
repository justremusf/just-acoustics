'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { InteractiveVSLConfig } from '@/data/vslConfig'

const InteractiveVSL = dynamic(() => import('@/components/InteractiveVSL'), {
  ssr: false,
  loading: () => null,
})

function VSLPosterPlaceholder({
  poster,
  compact,
  hidden = false,
}: {
  poster: string
  compact: boolean
  hidden?: boolean
}) {
  return (
    <section
      aria-hidden="true"
      className={[
        compact ? 'px-4 py-6 sm:px-5 md:py-8' : 'px-4 py-7 sm:px-5 md:py-9',
        'pointer-events-none transition-opacity duration-500 ease-out',
        hidden ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="site-container">
        <div
          className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-[var(--color-dark-100)] bg-cover bg-center sm:aspect-video"
          style={{ backgroundImage: `url("${poster}")` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.04),rgba(1,1,1,0.66))]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/45 shadow-lg backdrop-blur-sm">
              <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

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
  const [interactiveReady, setInteractiveReady] = useState(false)

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
    <div ref={containerRef} className="relative">
      <VSLPosterPlaceholder
        poster={config.intro.poster}
        compact={compact}
        hidden={interactiveReady}
      />
      {shouldRender ? (
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-500 ease-out ${interactiveReady ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <InteractiveVSL
            config={config}
            pageLocation={pageLocation}
            compact={compact}
            onReady={setInteractiveReady}
          />
        </div>
      ) : null}
    </div>
  )
}
