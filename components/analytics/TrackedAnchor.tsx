'use client'

import { trackEvent } from '@/components/analytics/trackEvent'
import { contactEventForHref } from '@/components/analytics/contactLinks'
import {
  buildUrlWithAttribution,
  buildWhatsAppUrlWithAttribution,
  getAttributionEventParams,
} from '@/lib/tallyAttribution'

type TrackedAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Where on the site this link sits, sent as the `source` event param (e.g. "floating_button"). */
  trackingSource?: string
}

function getFinalHref(href: string) {
  if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
    return buildWhatsAppUrlWithAttribution(href)
  }

  try {
    const url = new URL(href, window.location.origin)

    if (url.origin === window.location.origin || url.hostname.includes('justacoustics.co')) {
      return buildUrlWithAttribution(href)
    }
  } catch {
    return href
  }

  return href
}

/**
 * Anchor that fires whatsapp_click / phone_click / email_click once and adds attribution to the
 * destination. The browser's own navigation is never blocked or delayed (no popup-blocker issues):
 * the href is updated in place before the default action runs.
 */
export default function TrackedAnchor({ href, onClick, trackingSource, children, ...props }: TrackedAnchorProps) {
  return (
    <a
      {...props}
      href={href}
      data-ja-tracked=""
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || !href) return

        const finalHref = getFinalHref(href)
        if (finalHref !== href) event.currentTarget.href = finalHref

        const eventName = contactEventForHref(href)
        if (eventName) {
          trackEvent(eventName, {
            source: trackingSource || 'inline_link',
            link_url: finalHref.slice(0, 100),
            ...getAttributionEventParams(),
          })
        }
      }}
    >
      {children}
    </a>
  )
}
