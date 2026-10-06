'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { readAnalyticsConsent } from '@/lib/analyticsConsent'
import { trackFirstPartyEvent } from '@/lib/insights/client'

/**
 * Page views for the first-party insights store, plus Meta PageView on client-side navigations
 * (the pixel snippet in app/layout.tsx only covers the first page load). GA4 counts client-side
 * navigations itself through enhanced measurement ("page changes based on browser history events").
 */
export default function FirstPartyInsights() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // The page view the consent gate held back (opt-in regions before a choice), sent once allowed.
  const heldBack = useRef<string | null>(null)
  const lastMetaPath = useRef<string | null>(null)

  useEffect(() => {
    const path = pathname || '/'
    if (readAnalyticsConsent() === 'unset') heldBack.current = path
    else trackFirstPartyEvent('page_view', { page_path: path })

    // The layout snippet already sent PageView for the landing page; later routes send their own.
    if (lastMetaPath.current !== null && lastMetaPath.current !== path && readAnalyticsConsent() === 'all') {
      window.fbq?.('track', 'PageView')
    }
    lastMetaPath.current = path
  }, [pathname, searchParams])

  useEffect(() => {
    const onConsent = () => {
      if (!heldBack.current || readAnalyticsConsent() === 'unset') return
      trackFirstPartyEvent('page_view', { page_path: heldBack.current })
      heldBack.current = null
    }
    window.addEventListener('ja-consent-change', onConsent)
    return () => window.removeEventListener('ja-consent-change', onConsent)
  }, [])

  return null
}
