'use client'

import { useEffect, useRef } from 'react'
import { hasRecentLeadTracking, markLeadTracked } from '@/components/analytics/leadTrackingState'
import { trackEvent } from '@/components/analytics/trackEvent'
import { getAttributionEventParams } from '@/lib/tallyAttribution'

export default function LeadConversionTracker() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    if (hasRecentLeadTracking()) return

    const navigationEntry = window.performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined

    if (navigationEntry && navigationEntry.type !== 'navigate') return

    trackEvent('generate_lead', {
      form_name: 'free_acoustic_consultation',
      page_path: '/thank-you',
      tracking_source: 'thank_you_page',
      ...getAttributionEventParams(),
    })
    markLeadTracked('thank_you_page')

    hasTracked.current = true
  }, [])

  return null
}
