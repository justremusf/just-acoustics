'use client'

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const googleAdsLabels = {
  generate_lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD,
  whatsapp_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP,
  phone_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE,
  email_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_EMAIL,
} as const

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

export function trackEvent(eventName: string, params: object = {}) {
  if (typeof window === 'undefined') return

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }

  const adsLabel = googleAdsLabels[eventName as keyof typeof googleAdsLabels]
  if (googleAdsId && adsLabel && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: `${googleAdsId}/${adsLabel}`,
      ...params,
    })
  }

  if (metaPixelId && typeof window.fbq === 'function') {
    if (eventName === 'generate_lead') {
      window.fbq('track', 'Lead', params)
      return
    }

    if (
      eventName === 'whatsapp_click' ||
      eventName === 'phone_click' ||
      eventName === 'email_click'
    ) {
      window.fbq('track', 'Contact', params)
    }
  }
}
