'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/components/analytics/trackEvent'

export default function GaPageViewTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return

    const search = searchParams.toString()
    const pagePath = search ? `${pathname}?${search}` : pathname

    trackEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
      send_to: gaId,
    })
  }, [gaId, pathname, searchParams])

  return null
}
