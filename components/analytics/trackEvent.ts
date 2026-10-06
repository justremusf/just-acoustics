'use client'

import { track as vercelTrack } from '@vercel/analytics'
import { readAnalyticsConsent } from '@/lib/analyticsConsent'
import { trackFirstPartyEvent, type InsightProperties } from '@/lib/insights/client'
import { recordProductView } from '@/lib/whatsappContext'

/**
 * One event, every destination. See docs/TRACKING.md for the full taxonomy.
 *
 * - GA4 (gtag)                    always (analytics storage is granted by default)
 * - Vercel Web Analytics track()  always (cookieless)
 * - First-party insights          once the visitor is not in an undecided opt-in region
 * - Google Ads conversion         only when ad cookies are allowed and a label env var is set
 * - Meta pixel                    only when ad cookies are allowed
 */

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
// Each key is an event name; each value is the conversion label from Google Ads
// (Goals → Conversions → <action> → Tag setup → "send_to": "AW-XXXX/<label>").
const googleAdsLabels: Partial<Record<string, string | undefined>> = {
  generate_lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD,
  whatsapp_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP,
  phone_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE,
  email_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_EMAIL,
  purchase: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE,
}

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
const META_STANDARD_EVENTS: Partial<Record<string, string>> = {
  generate_lead: 'Lead',
  whatsapp_click: 'Contact',
  phone_click: 'Contact',
  email_click: 'Contact',
  product_view: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
}
const META_CUSTOM_EVENTS = new Set(['price_estimate_view', 'price_estimate_cta_click', 'calculator_used', 'vsl_space_type_selected'])

// Vercel custom events take flat primitive props, and only a handful of them are useful in its dashboard.
const VERCEL_PROPS = ['source', 'method', 'space', 'size', 'cta', 'calculator', 'product_slug', 'value', 'currency', 'form_name', 'page_path']

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

type EventParams = Record<string, unknown>

const CONTACT_METHODS: Partial<Record<string, string>> = {
  whatsapp_click: 'whatsapp',
  phone_click: 'phone',
  email_click: 'email',
}

function withDefaults(eventName: string, params: EventParams): EventParams {
  const base: EventParams = {
    page_path: window.location.pathname,
    ...params,
  }

  if (eventName === 'generate_lead') return { value: 1, currency: 'SGD', ...base }

  const method = CONTACT_METHODS[eventName]
  if (method) return { method, source: 'inline_link', ...base }

  // GA4 ecommerce reports need an items array; build one from the flat product params when missing.
  if ((eventName === 'add_to_cart' || eventName === 'purchase' || eventName === 'begin_checkout') && !base.items && base.product_slug) {
    return {
      ...base,
      items: [
        {
          item_id: base.product_slug,
          item_name: base.product_name ?? base.product_slug,
          quantity: base.quantity ?? 1,
          ...(typeof base.value === 'number' && typeof base.quantity === 'number' && base.quantity > 0
            ? { price: Math.round((base.value / base.quantity) * 100) / 100 }
            : {}),
        },
      ],
    }
  }

  return base
}

function flatProps(params: EventParams, keys?: string[]) {
  const out: Record<string, string | number | boolean | null> = {}
  Object.entries(params).forEach(([key, value]) => {
    if (keys && !keys.includes(key)) return
    if (typeof value === 'string') out[key] = value.slice(0, 160)
    else if (typeof value === 'number' || typeof value === 'boolean' || value === null) out[key] = value
  })
  return out
}

function adsAllowed() {
  return readAnalyticsConsent() === 'all'
}

export type TrackEventDeliveryOptions = {
  eventCallback?: () => void
  eventTimeoutMs?: number
  /** Stable id for this conversion (Tally submission id, order reference). Lets Google Ads and Meta drop duplicates. */
  dedupeId?: string
  /** Re-send to GA4 and Google Ads only (both dedupe or tolerate it); skips Meta, Vercel and first-party. */
  googleOnly?: boolean
}

/** Returns true when the event was handed to gtag. */
export function trackEvent(eventName: string, params: object = {}, deliveryOptions: TrackEventDeliveryOptions = {}) {
  if (typeof window === 'undefined') return false
  const eventParams = withDefaults(eventName, params as EventParams)
  const { dedupeId, googleOnly } = deliveryOptions

  if (eventName === 'product_view' && typeof eventParams.product_name === 'string') {
    recordProductView(eventParams.product_name, window.location.pathname)
  }

  if (!googleOnly) {
    trackFirstPartyEvent(eventName, flatProps(eventParams) as InsightProperties)
    try {
      vercelTrack(eventName, flatProps(eventParams, VERCEL_PROPS))
    } catch {
      // Vercel Analytics must never break the page.
    }
  }

  let gaAccepted = false
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...eventParams,
      ...(deliveryOptions.eventCallback ? { event_callback: deliveryOptions.eventCallback } : {}),
      ...(deliveryOptions.eventTimeoutMs ? { event_timeout: deliveryOptions.eventTimeoutMs } : {}),
    })
    gaAccepted = true

    const adsLabel = googleAdsLabels[eventName]
    if (googleAdsId && adsLabel && adsAllowed()) {
      window.gtag('event', 'conversion', {
        send_to: `${googleAdsId}/${adsLabel}`,
        value: typeof eventParams.value === 'number' ? eventParams.value : 1,
        currency: 'SGD',
        ...(dedupeId ? { transaction_id: dedupeId } : {}),
      })
    }
  }

  if (!googleOnly && metaPixelId && typeof window.fbq === 'function' && adsAllowed()) {
    const metaParams = flatProps(eventParams, ['source', 'method', 'space', 'size', 'value', 'currency', 'content_name', 'product_slug', 'product_name', 'price_low', 'price_high', 'cta', 'calculator'])
    if (eventParams.product_name && !metaParams.content_name) metaParams.content_name = String(eventParams.product_name)
    const options = dedupeId ? { eventID: `${eventName}:${dedupeId}` } : undefined
    const standard = META_STANDARD_EVENTS[eventName]
    if (standard) window.fbq('track', standard, metaParams, ...(options ? [options] : []))
    else if (META_CUSTOM_EVENTS.has(eventName)) window.fbq('trackCustom', eventName, metaParams, ...(options ? [options] : []))
  }

  return gaAccepted
}
