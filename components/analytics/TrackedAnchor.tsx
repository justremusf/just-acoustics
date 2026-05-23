'use client'

import { useRef } from 'react'
import { trackEvent } from '@/components/analytics/trackEvent'
import {
  buildUrlWithAttribution,
  buildWhatsAppUrlWithAttribution,
  getAttributionEventParams,
} from '@/lib/tallyAttribution'

type TrackedAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

function getEventName(href: string) {
  if (href.includes('wa.me') || href.includes('api.whatsapp.com')) return 'whatsapp_click'
  if (href.startsWith('tel:')) return 'phone_click'
  if (href.startsWith('mailto:')) return 'email_click'
  return null
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

export default function TrackedAnchor({
  href,
  onClick,
  target,
  children,
  ...props
}: TrackedAnchorProps) {
  const isPendingRef = useRef(false)

  return (
    <a
      {...props}
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || !href) return

        const eventName = getEventName(href)
        const finalHref = getFinalHref(href)
        if (!eventName && finalHref === href) return
        if (isPendingRef.current) {
          event.preventDefault()
          return
        }

        isPendingRef.current = true
        event.preventDefault()

        if (eventName) {
          trackEvent(eventName, {
            link_url: finalHref,
            ...getAttributionEventParams(),
          })
        }

        window.setTimeout(() => {
          if (target === '_blank') {
            window.open(finalHref, '_blank', 'noopener,noreferrer')
          } else {
            window.location.href = finalHref
          }
          isPendingRef.current = false
        }, 150)
      }}
    >
      {children}
    </a>
  )
}
