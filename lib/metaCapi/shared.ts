/**
 * Shared between the browser sender (lib/metaCapi/client.ts) and the server route
 * (app/api/meta-capi/route.ts). Keep it free of browser- and server-only imports.
 */

/** Meta standard events forwarded server-side. PageView is deliberately left browser-only. */
export const META_CAPI_EVENTS = ['Lead', 'Contact', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'] as const
export type MetaCapiEventName = (typeof META_CAPI_EVENTS)[number]

/** `<site event>:<id>`, e.g. `whatsapp_click:3f2c…` or `generate_lead:<tally submission id>`. */
export const META_EVENT_ID = /^[a-z][a-z0-9_]{1,40}:[A-Za-z0-9._-]{4,100}$/

/** Largest request body the route accepts, in bytes. Real events are ~600 bytes. */
export const META_CAPI_MAX_BODY_BYTES = 2048

export type MetaCapiRequestBody = {
  event_name: MetaCapiEventName
  event_id: string
  event_source_url: string
  /** Raw fbclid (URL or stored attribution), used only when the `_fbc` cookie is missing. */
  fbclid?: string
  /** When that fbclid was captured (ms since epoch), for the `fbc` timestamp. */
  fbclid_at?: number
  /** Anonymous first-party visitor id; hashed server-side before it reaches Meta. */
  external_id?: string
  custom_data?: {
    value?: number
    currency?: string
    content_name?: string
    content_ids?: string[]
    content_type?: 'product'
    method?: string
    source?: string
    space?: string
  }
}
