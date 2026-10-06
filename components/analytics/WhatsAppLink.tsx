'use client'

import TrackedAnchor from '@/components/analytics/TrackedAnchor'
import { useWhatsAppHref } from '@/hooks/useWhatsAppHref'

type WhatsAppLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  /** Placement, sent as the `source` param of whatsapp_click (e.g. "footer", "lander_hero"). */
  source: string
  /** Page-specific sentence(s) after the browsing context, e.g. a photo request. */
  followUp?: string
  /** Message for the server HTML (and visitors without JS) before the contextual one is built. */
  fallbackText?: string
}

/** WhatsApp link whose prefilled message reflects what the visitor has been looking at. Opens in a new tab. */
export default function WhatsAppLink({ source, followUp, fallbackText, children, ...props }: WhatsAppLinkProps) {
  const href = useWhatsAppHref(followUp, fallbackText)
  return (
    <TrackedAnchor target="_blank" rel="noopener noreferrer" {...props} href={href} trackingSource={source}>
      {children}
    </TrackedAnchor>
  )
}
