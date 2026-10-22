'use client'

import { getInsightsVisitorId } from '@/lib/insights/client'
import { getAttribution } from '@/lib/tallyAttribution'
import type { MetaCapiEventName, MetaCapiRequestBody } from '@/lib/metaCapi/shared'

type Params = Record<string, unknown>

function str(value: unknown, length = 160) {
  return typeof value === 'string' && value ? value.slice(0, length) : undefined
}

/**
 * Mirrors a Meta pixel event to /api/meta-capi with the same event_id, so Meta can deduplicate
 * the browser and server copies. Fire-and-forget: sendBeacon (or fetch keepalive) never delays
 * the page or an outbound WhatsApp/tel: navigation. The caller has already checked ad consent;
 * the route checks it again from the request cookies.
 */
export function sendMetaServerEvent(eventName: MetaCapiEventName, eventId: string, params: Params) {
  try {
    const url = new URL(window.location.href)
    const attribution = getAttribution()
    const fbclid = url.searchParams.get('fbclid') || attribution.fbclid || undefined
    const touchedAt = Date.parse(attribution.last_touch_at || '')
    const visitorId = getInsightsVisitorId()

    const body: MetaCapiRequestBody = {
      event_name: eventName,
      event_id: eventId,
      event_source_url: url.href.slice(0, 1000),
      ...(fbclid ? { fbclid: fbclid.slice(0, 500), ...(Number.isFinite(touchedAt) ? { fbclid_at: touchedAt } : {}) } : {}),
      ...(visitorId ? { external_id: visitorId.slice(0, 100) } : {}),
      custom_data: {
        ...(typeof params.value === 'number' && Number.isFinite(params.value) ? { value: params.value } : {}),
        ...(str(params.currency, 3) ? { currency: str(params.currency, 3) } : {}),
        ...(str(params.content_name ?? params.product_name) ? { content_name: str(params.content_name ?? params.product_name) } : {}),
        ...(str(params.product_slug, 100) ? { content_ids: [str(params.product_slug, 100) as string], content_type: 'product' as const } : {}),
        ...(str(params.method, 40) ? { method: str(params.method, 40) } : {}),
        ...(str(params.source, 60) ? { source: str(params.source, 60) } : {}),
        ...(str(params.space, 60) ? { space: str(params.space, 60) } : {}),
      },
    }

    const json = JSON.stringify(body)
    const sent = typeof navigator.sendBeacon === 'function' && navigator.sendBeacon('/api/meta-capi', new Blob([json], { type: 'application/json' }))
    if (!sent) {
      void fetch('/api/meta-capi', { method: 'POST', headers: { 'content-type': 'application/json' }, body: json, keepalive: true }).catch(() => undefined)
    }
  } catch {
    // Server-side tracking must never break the page.
  }
}
