'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/components/analytics/trackEvent'
import { contactEventForHref } from '@/components/analytics/contactLinks'
import { buildWhatsAppUrlWithAttribution, getAttributionEventParams } from '@/lib/tallyAttribution'

/**
 * Safety net: any WhatsApp / phone / email link that is not a TrackedAnchor (blog CTAs, project
 * pages, checkout help, installation enquiries…) still fires its contact event. Links that track
 * themselves carry data-ja-tracked and are skipped, so nothing fires twice. An ancestor's
 * data-track-source names the placement; otherwise the source is "inline_link". WhatsApp links also
 * get the lead-source block added to their message just before they open, so every chat shows its source.
 */
export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor || anchor.hasAttribute('data-ja-tracked')) return
      const href = anchor.getAttribute('href')
      const eventName = contactEventForHref(href)
      if (!eventName) return
      const source = (anchor.closest('[data-track-source]') as HTMLElement | null)?.dataset.trackSource || 'inline_link'
      if (eventName === 'whatsapp_click' && href) {
        try {
          anchor.href = buildWhatsAppUrlWithAttribution(new URL(href, window.location.href).toString())
        } catch {
          // Keep the original link if it cannot be parsed.
        }
      }
      trackEvent(eventName, { source, link_url: (href || '').slice(0, 100), ...getAttributionEventParams() })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
