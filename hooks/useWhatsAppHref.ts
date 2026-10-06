'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  BROWSING_CONTEXT_EVENT,
  buildWhatsAppMessage,
  initialWhatsAppHref,
  readBrowsingContext,
  whatsAppHref,
} from '@/lib/whatsappContext'
import { buildWhatsAppUrlWithAttribution } from '@/lib/tallyAttribution'

/**
 * WhatsApp href with a message built from what this visit already told us (space browsed, estimate
 * seen, product on screen) plus the short lead ref. The server render and first client render use
 * the generic message, so hydration always matches; the contextual one is swapped in after mount.
 */
export function useWhatsAppHref(followUp?: string, fallbackText?: string) {
  const pathname = usePathname()
  const [href, setHref] = useState(() => (fallbackText ? whatsAppHref(fallbackText) : initialWhatsAppHref(followUp)))

  useEffect(() => {
    const refresh = () => {
      const text = buildWhatsAppMessage(readBrowsingContext(), { currentPath: pathname, followUp })
      setHref(buildWhatsAppUrlWithAttribution(whatsAppHref(text)))
    }
    refresh()
    window.addEventListener(BROWSING_CONTEXT_EVENT, refresh)
    return () => window.removeEventListener(BROWSING_CONTEXT_EVENT, refresh)
  }, [pathname, followUp])

  return href
}
