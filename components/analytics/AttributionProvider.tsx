'use client'

import { useEffect, useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { captureAttribution } from '@/lib/tallyAttribution'

export default function AttributionProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()
  const routeKey = useMemo(() => `${pathname}?${search}`, [pathname, search])

  useEffect(() => {
    captureAttribution()
    const persistAfterConsent = () => captureAttribution()
    window.addEventListener('ja-consent-change', persistAfterConsent)
    return () => window.removeEventListener('ja-consent-change', persistAfterConsent)
  }, [routeKey])

  return null
}
