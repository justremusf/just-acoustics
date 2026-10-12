// Server only: imported by app/api/meta-capi/route.ts. Never import this from client code.
import { createHash } from 'node:crypto'

const GRAPH_VERSION = 'v21.0'

/** SHA-256 hex, as Meta expects for every hashed user_data field. */
export function sha256(value: string) {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

/**
 * Normalise and hash PII the way Meta's matching expects. The site does not send any PII today;
 * this exists so that if an email or phone is ever added it can only reach Meta hashed.
 */
export function hashUserData(kind: 'em' | 'ph' | 'external_id', raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  if (kind === 'em') return sha256(trimmed.toLowerCase())
  if (kind === 'ph') {
    const digits = trimmed.replace(/\D/g, '')
    return digits ? sha256(digits) : undefined
  }
  return sha256(trimmed)
}

/** Meta's click-id format: `fb.1.<ms timestamp>.<fbclid>`. */
export function buildFbc(fbclid: string, capturedAtMs: number | undefined, nowMs = Date.now()) {
  const ts = capturedAtMs && capturedAtMs > 0 && capturedAtMs <= nowMs ? Math.round(capturedAtMs) : nowMs
  return `fb.1.${ts}.${fbclid}`
}

/** First hop in x-forwarded-for is the visitor on Vercel; x-real-ip is the fallback. */
export function clientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || undefined
}

/**
 * Best-effort, per-instance limits. Serverless instances do not share memory, so this stops a
 * single client hammering one instance rather than being a global quota.
 */
const WINDOW_MS = 60_000
const PER_IP_LIMIT = 20
const MAX_TRACKED = 5_000
const hits = new Map<string, { count: number; resetAt: number }>()
const seenEventIds = new Map<string, number>()

export function isRateLimited(key: string, now = Date.now()) {
  if (hits.size > MAX_TRACKED) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
    if (hits.size > MAX_TRACKED) hits.clear()
  }
  const entry = hits.get(key)
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > PER_IP_LIMIT
}

/** True when this event_id was already forwarded recently (replays are dropped, not re-sent). */
export function isReplay(eventId: string, now = Date.now()) {
  if (seenEventIds.size > MAX_TRACKED) {
    for (const [k, t] of seenEventIds) if (now - t > 10 * WINDOW_MS) seenEventIds.delete(k)
    if (seenEventIds.size > MAX_TRACKED) seenEventIds.clear()
  }
  if (seenEventIds.has(eventId)) return true
  seenEventIds.set(eventId, now)
  return false
}

export type MetaServerEvent = {
  event_name: string
  event_time: number
  event_id: string
  event_source_url: string
  action_source: 'website'
  user_data: Record<string, string | string[]>
  custom_data?: Record<string, unknown>
}

/**
 * POSTs one event to the Graph API. The token travels in the body (never the URL) and is never
 * logged; on failure only Meta's status and error message are logged.
 */
export async function sendToMeta(pixelId: string, accessToken: string, event: MetaServerEvent, testEventCode?: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: [event],
        access_token: accessToken,
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      }),
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    if (!response.ok) {
      const detail = (await response.json().catch(() => null)) as { error?: { message?: string; code?: number } } | null
      console.warn('[meta-capi] Graph API rejected event', response.status, detail?.error?.code, detail?.error?.message)
    }
  } catch (error) {
    console.warn('[meta-capi] Graph API request failed', error instanceof Error ? error.name : 'unknown')
  }
}
