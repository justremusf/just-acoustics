'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { buildTallyUrlWithAttribution, captureAttribution } from '@/lib/tallyAttribution'
import { TALLY_CONSULTATION_FORM_URL, TALLY_URL_STORAGE_KEY, TALLY_WARM_STORAGE_KEY } from '@/lib/tally'

type NetworkInformation = { saveData?: boolean; effectiveType?: string }

/**
 * Makes the contact form open instantly. On any page, once the browser is idle, it works out this
 * visitor's form URL (with attribution), stores it for the contact page to reuse verbatim, and loads
 * the form once in a hidden iframe so Tally's files are already in the browser cache.
 */
export default function TallyPreloader() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/contact') return

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '')) return

    let iframe: HTMLIFrameElement | null = null
    let removeTimer = 0

    const warm = () => {
      try {
        if (!window.sessionStorage.getItem(TALLY_URL_STORAGE_KEY)) {
          captureAttribution()
          window.sessionStorage.setItem(TALLY_URL_STORAGE_KEY, buildTallyUrlWithAttribution(TALLY_CONSULTATION_FORM_URL))
        }
        if (window.sessionStorage.getItem(TALLY_WARM_STORAGE_KEY)) return
        window.sessionStorage.setItem(TALLY_WARM_STORAGE_KEY, '1')

        iframe = document.createElement('iframe')
        iframe.src = window.sessionStorage.getItem(TALLY_URL_STORAGE_KEY) || TALLY_CONSULTATION_FORM_URL
        iframe.title = 'Preloading contact form'
        iframe.setAttribute('aria-hidden', 'true')
        iframe.tabIndex = -1
        iframe.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:0;border:0;opacity:0;pointer-events:none;'
        // Once loaded, its files stay cached; drop the element so it costs nothing while browsing.
        iframe.addEventListener('load', () => {
          removeTimer = window.setTimeout(() => iframe?.remove(), 3000)
        })
        document.body.appendChild(iframe)
      } catch {
        // Storage blocked or similar: the contact page simply loads the form itself.
      }
    }

    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(warm, { timeout: 4000 })
      else setTimeout(warm, 1500)
    }

    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.removeEventListener('load', schedule)
      window.clearTimeout(removeTimer)
    }
  }, [pathname])

  return null
}
