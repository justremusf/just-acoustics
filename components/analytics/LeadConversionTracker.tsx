'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/components/analytics/trackEvent'

export default function LeadConversionTracker() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return

    const navigationEntry = window.performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined

    if (navigationEntry && navigationEntry.type !== 'navigate') return

    console.log('generate_lead fired')
    trackEvent('generate_lead', {
      form_name: 'free_acoustic_consultation',
      page_path: '/thank-you',
    })

    hasTracked.current = true
  }, [])

  return null
}
