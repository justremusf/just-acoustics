'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { isStrictConsentRegion, migrateLegacyAnalyticsConsent, readConsentChoice, saveAnalyticsConsent } from '@/lib/analyticsConsent'

type Mode = 'hidden' | 'notice' | 'optin'

const NOTICE_SEEN_KEY = 'ja_cookie_notice_seen'

/**
 * One tiny pill. Opt-in regions (EEA/UK/CH) also get "No thanks"; nothing is set until they choose.
 * Everywhere else: cookies are already on, so this is a one-line notice. It disappears when the
 * visitor dismisses it or moves to another page (continued browsing after being told).
 */
export default function CookieConsentBanner() {
  const pathname = usePathname()
  const [mode, setMode] = useState<Mode>('hidden')
  const firstPath = useRef(pathname)

  useEffect(() => {
    migrateLegacyAnalyticsConsent()
    if (readConsentChoice() !== 'unset') return
    if (isStrictConsentRegion()) {
      setMode('optin')
      return
    }
    // Already shown on an earlier page this visit (e.g. after a full page load): they kept browsing.
    try {
      if (window.sessionStorage.getItem(NOTICE_SEEN_KEY)) {
        saveAnalyticsConsent('all')
        return
      }
      window.sessionStorage.setItem(NOTICE_SEEN_KEY, '1')
    } catch {
      // Storage blocked: fall back to dismissing on the next client-side navigation.
    }
    setMode('notice')
  }, [])

  useEffect(() => {
    if (mode === 'notice' && pathname !== firstPath.current) {
      saveAnalyticsConsent('all')
      setMode('hidden')
    }
  }, [mode, pathname])

  if (mode === 'hidden' || pathname.startsWith('/proposals/')) return null

  const choose = (consent: 'analytics_only' | 'all') => {
    saveAnalyticsConsent(consent)
    setMode('hidden')
  }

  return (
    <aside
      aria-label="Cookie notice"
      className="cookie-pill fixed bottom-4 left-4 z-[100] flex items-center gap-2.5 rounded-full border border-black/10 bg-white/95 py-1.5 pl-3.5 pr-1.5 text-[12px] text-black/70 shadow-[0_10px_28px_rgba(0,0,0,0.12)] backdrop-blur"
    >
      <span>We use cookies.</span>
      {mode === 'optin' && (
        <button type="button" onClick={() => choose('analytics_only')} className="text-[12px] text-black/45 underline-offset-2 hover:text-black hover:underline">
          No thanks
        </button>
      )}
      <button type="button" onClick={() => choose('all')} className="rounded-full bg-black px-3 py-1 text-[12px] font-semibold text-white">
        OK
      </button>
    </aside>
  )
}
