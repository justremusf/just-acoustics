'use client'

import { useEffect } from 'react'
import { readAnalyticsConsent } from '@/lib/analyticsConsent'

type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] }

declare global {
  interface Window {
    clarity?: ClarityFunction
  }
}

function canStartClarity() {
  const consent = readAnalyticsConsent()
  return consent === 'analytics_only' || consent === 'all'
}

export default function ClarityAnalytics({ projectId }: { projectId?: string }) {
  useEffect(() => {
    if (!projectId) return

    const start = () => {
      if (!canStartClarity() || document.getElementById('microsoft-clarity')) return

      const clarity: ClarityFunction = window.clarity || ((...args: unknown[]) => {
        clarity.q = clarity.q || []
        clarity.q.push(args)
      })
      window.clarity = clarity
      clarity('consent', true)

      const script = document.createElement('script')
      script.id = 'microsoft-clarity'
      script.async = true
      script.src = `https://www.clarity.ms/tag/${projectId}`
      document.head.appendChild(script)
    }

    start()
    window.addEventListener('ja-consent-change', start)
    return () => window.removeEventListener('ja-consent-change', start)
  }, [projectId])

  return null
}
