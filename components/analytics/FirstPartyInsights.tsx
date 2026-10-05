'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackFirstPartyEvent } from '@/lib/insights/client'

export default function FirstPartyInsights() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackFirstPartyEvent('page_view', { page_path: pathname || '/' })
  }, [pathname, searchParams])

  useEffect(() => {
    const onConsent = () => trackFirstPartyEvent('page_view', { page_path: pathname || '/' })
    window.addEventListener('ja-consent-change', onConsent)
    return () => window.removeEventListener('ja-consent-change', onConsent)
  }, [pathname])

  return null
}
