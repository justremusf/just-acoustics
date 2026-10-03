'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isStrictConsentRegion, migrateLegacyAnalyticsConsent, readConsentChoice, saveAnalyticsConsent } from '@/lib/analyticsConsent'

type Mode = 'hidden' | 'notice' | 'optin'

const NOTICE_SEEN_KEY = 'ja_cookie_notice_seen'

/**
 * Opt-in regions (EEA/UK/CH): a small banner; nothing is set until the visitor accepts.
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

  if (mode === 'notice') {
    return (
      <aside
        aria-label="Cookie notice"
        className="fixed bottom-4 left-4 z-[100] flex max-w-[calc(100vw-120px)] items-center gap-3 rounded-full border border-black/10 bg-white/95 py-2 pl-4 pr-2 text-[13px] text-black/70 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur sm:max-w-md"
      >
        <span className="min-w-0">
          We use cookies to improve your experience.{' '}
          <Link href="/cookie-policy#settings" className="font-semibold text-black underline">
            Settings
          </Link>
        </span>
        <button type="button" onClick={() => choose('all')} className="shrink-0 rounded-full bg-black px-3.5 py-1.5 text-[13px] font-semibold text-white">
          OK
        </button>
      </aside>
    )
  }

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.2)] md:flex md:items-center md:gap-5"
    >
      <p className="m-0 flex-1 text-sm leading-6 text-black/70">
        We use cookies to give you a better experience.{' '}
        <Link href="/cookie-policy" className="font-semibold text-black underline">
          Learn more
        </Link>
      </p>
      <div className="mt-3 flex shrink-0 gap-2 md:mt-0">
        <button type="button" onClick={() => choose('analytics_only')} className="rounded-full px-4 py-2 text-sm font-semibold text-black/60 hover:text-black">
          Decline
        </button>
        <button type="button" onClick={() => choose('all')} className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white">
          Accept cookies
        </button>
      </div>
    </aside>
  )
}
