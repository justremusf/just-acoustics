'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/components/analytics/trackEvent'

export default function ContactInteractionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const link = target.closest('a[href]') as HTMLAnchorElement | null
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        trackEvent('whatsapp_click', { link_url: href })
        return
      }

      if (href.startsWith('tel:')) {
        trackEvent('phone_click', { link_url: href })
        return
      }

      if (href.startsWith('mailto:')) {
        trackEvent('email_click', { link_url: href })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
