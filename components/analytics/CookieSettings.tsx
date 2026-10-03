'use client'

import { useEffect, useState } from 'react'
import { readAnalyticsConsent, saveAnalyticsConsent, type AnalyticsConsent } from '@/lib/analyticsConsent'

/** Lets visitors change their cookie choice at any time (linked from the cookie notice). */
export default function CookieSettings() {
  const [consent, setConsent] = useState<AnalyticsConsent>('unset')

  useEffect(() => setConsent(readAnalyticsConsent()), [])

  const choose = (value: 'analytics_only' | 'all') => {
    saveAnalyticsConsent(value)
    setConsent(value)
  }

  const optionClass = (active: boolean) =>
    `rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${active ? 'bg-black text-white' : 'border border-black/15 text-black hover:border-black/40'}`

  return (
    <div className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">Your cookie setting</p>
        <p className="m-0 mt-1 text-sm text-[var(--color-gray-100)]">
          {consent === 'all'
            ? 'All cookies are on, including advertising.'
            : consent === 'analytics_only'
              ? 'Advertising cookies are off. Basic analytics stays on.'
              : 'You have not chosen yet.'}
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => choose('analytics_only')} className={optionClass(consent === 'analytics_only')} aria-pressed={consent === 'analytics_only'}>
          Turn off advertising cookies
        </button>
        <button type="button" onClick={() => choose('all')} className={optionClass(consent === 'all')} aria-pressed={consent === 'all'}>
          Allow all
        </button>
      </div>
    </div>
  )
}
