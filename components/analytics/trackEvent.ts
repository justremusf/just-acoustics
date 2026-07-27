'use client'

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const googleAdsLabels = {
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

function getGaParams(eventName: string, params: object) {
  if (eventName === 'generate_lead') {
    return {
      value: 1,
      currency: 'SGD',
      engagement_time_msec: 100,
      ...params,
    }
  }

  if (eventName === 'whatsapp_click') {
    return {
      method: 'whatsapp',
      engagement_time_msec: 100,
      ...params,
    }
  }

  if (eventName === 'phone_click') {
    return {
      method: 'phone',
      engagement_time_msec: 100,
      ...params,
    }
  }

  return params
}

export type TrackEventDeliveryOptions = {
  eventCallback?: () => void
  eventTimeoutMs?: number
}

export function trackEvent(
  eventName: string,
  params: object = {},
  deliveryOptions: TrackEventDeliveryOptions = {}
) {
  if (typeof window === 'undefined') return false
  const eventParams = getGaParams(eventName, params)
  let gaAccepted = false

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...eventParams,
      ...(deliveryOptions.eventCallback ? { event_callback: deliveryOptions.eventCallback } : {}),
      ...(deliveryOptions.eventTimeoutMs
        ? { event_timeout: deliveryOptions.eventTimeoutMs }
        : {}),
    })
    gaAccepted = true
  }

  const adsLabel = googleAdsLabels[eventName as keyof typeof googleAdsLabels]
  if (googleAdsId && adsLabel && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: `${googleAdsId}/${adsLabel}`,
      ...eventParams,
    })
  }

  if (metaPixelId && typeof window.fbq === 'function') {
    if (eventName === 'generate_lead') {
      window.fbq('track', 'Lead', eventParams)
      return gaAccepted
    }

    if (
      eventName === 'whatsapp_click' ||
      eventName === 'phone_click' ||
      eventName === 'email_click'
    ) {
      window.fbq('track', 'Contact', eventParams)
    }
  }

  return gaAccepted
}
