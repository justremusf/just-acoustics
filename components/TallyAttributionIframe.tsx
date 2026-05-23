'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { buildTallyUrlWithAttribution } from '@/lib/tallyAttribution'

type TallyWindow = Window & {
  Tally?: {
    loadEmbeds?: () => void
  }
}

type TallyAttributionIframeProps = {
  baseUrl: string
  title: string
  className?: string
  style?: CSSProperties
}

export default function TallyAttributionIframe({
  baseUrl,
  title,
  className,
  style,
}: TallyAttributionIframeProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()
  const [src, setSrc] = useState(baseUrl)

  const routeKey = useMemo(() => `${pathname}?${search}`, [pathname, search])

  useEffect(() => {
    const nextSrc = buildTallyUrlWithAttribution(baseUrl, {
      pageUrl: window.location.href,
      referrer: document.referrer,
    })

    setSrc(nextSrc)

    window.requestAnimationFrame(() => {
      const tallyWindow = window as TallyWindow
      tallyWindow.Tally?.loadEmbeds?.()
    })
  }, [baseUrl, routeKey])

  return (
    <iframe
      src={src}
      width="100%"
      height="640"
      frameBorder="0"
      title={title}
      className={className}
      style={style}
    />
  )
}
