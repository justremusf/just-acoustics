'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { readAnalyticsConsent, saveAnalyticsConsent } from '@/lib/analyticsConsent'

export default function CookieConsentBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(readAnalyticsConsent() === 'unset')
  }, [])

  if (!visible || pathname.startsWith('/proposals/')) return null

  const choose = (consent: 'granted' | 'denied') => {
    saveAnalyticsConsent(consent)
    setVisible(false)
  }

  return (
    <aside
      aria-label="Analytics consent"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.2)] md:flex md:items-center md:gap-6"
    >
      <p className="m-0 flex-1 text-sm leading-6 text-black/70">
        We use analytics and advertising cookies to understand enquiries and improve our campaigns.
        Essential enquiry attribution remains available for the current visit. Read our{' '}
        <Link href="/cookie-policy" className="font-semibold text-black underline">cookie policy</Link>.
      </p>
      <div className="mt-4 flex shrink-0 gap-2 md:mt-0">
        <button type="button" onClick={() => choose('denied')} className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black">
          Essential only
        </button>
        <button type="button" onClick={() => choose('granted')} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
          Allow analytics
        </button>
      </div>
    </aside>
  )
}
