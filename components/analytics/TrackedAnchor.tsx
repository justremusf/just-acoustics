'use client'

import { useRef } from 'react'
import { trackEvent } from '@/components/analytics/trackEvent'

type TrackedAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

function getEventName(href: string) {
  if (href.includes('wa.me') || href.includes('api.whatsapp.com')) return 'whatsapp_click'
  if (href.startsWith('tel:')) return 'phone_click'
  if (href.startsWith('mailto:')) return 'email_click'
  return null
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
        if (!eventName) return
        if (isPendingRef.current) {
          event.preventDefault()
          return
        }

        isPendingRef.current = true
        event.preventDefault()

        console.log(`${eventName} fired`)
        trackEvent(eventName, { link_url: href })

        window.setTimeout(() => {
          if (target === '_blank') {
            window.open(href, '_blank', 'noopener,noreferrer')
          } else {
            window.location.href = href
          }
          isPendingRef.current = false
        }, 150)
      }}
    >
      {children}
    </a>
  )
}
