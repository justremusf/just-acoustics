export type ContactEventName = 'whatsapp_click' | 'phone_click' | 'email_click'

/** The contact event a link should fire, or null for ordinary links. */
export function contactEventForHref(href: string | null | undefined): ContactEventName | null {
  if (!href) return null
  if (href.includes('wa.me/') || href.includes('api.whatsapp.com') || href.startsWith('whatsapp:')) return 'whatsapp_click'
  if (href.startsWith('tel:')) return 'phone_click'
  if (href.startsWith('mailto:')) return 'email_click'
  return null
}
