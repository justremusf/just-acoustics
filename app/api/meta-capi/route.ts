import { after, NextResponse, type NextRequest } from 'next/server'
import { ANALYTICS_CONSENT_COOKIE, resolveAnalyticsConsent } from '@/lib/analyticsConsent'
import { CONSENT_REGION_COOKIE, isStrictConsentCountry } from '@/lib/consentRegion'
import { META_CAPI_EVENTS, META_CAPI_MAX_BODY_BYTES, META_EVENT_ID, type MetaCapiEventName } from '@/lib/metaCapi/shared'
import { buildFbc, clientIp, hashUserData, isRateLimited, isReplay, sendToMeta, type MetaServerEvent } from '@/lib/metaCapi/server'

/**
 * Meta Conversions API relay. The browser (lib/metaCapi/client.ts) mirrors each standard pixel
 * event here with the same event_id; this adds IP, user agent and fbp/fbc and forwards it to the
 * Graph API so Meta can match and deduplicate it. See docs/TRACKING.md → "Meta Conversions API".
 *
 * Always answers 204 for well-formed requests (including when skipped), so it never reveals whether
 * an event was forwarded. Without META_CAPI_ACCESS_TOKEN it does nothing at all.
 */
export const runtime = 'nodejs'

const ALLOWED_EVENTS = new Set<string>(META_CAPI_EVENTS)
const FBCLID = /^[A-Za-z0-9_-]{10,500}$/
const COOKIE_VALUE = /^fb\.\d\.\d{10,13}\.[A-Za-z0-9_.-]{1,500}$/
const CURRENCY = /^[A-Z]{3}$/

const noContent = () => new NextResponse(null, { status: 204 })

function shortString(value: unknown, length: number) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, length) : undefined
}

function adConsentAllowed(request: NextRequest) {
  const regionCookie = request.cookies.get(CONSENT_REGION_COOKIE)?.value
  const strictRegion = regionCookie ? regionCookie === 'strict' : isStrictConsentCountry(request.headers.get('x-vercel-ip-country'))
  return resolveAnalyticsConsent(request.cookies.get(ANALYTICS_CONSENT_COOKIE)?.value, strictRegion) === 'all'
}

function buildCustomData(raw: unknown) {
  if (!raw || typeof raw !== 'object') return undefined
  const input = raw as Record<string, unknown>
  const out: Record<string, unknown> = {}
  if (typeof input.value === 'number' && Number.isFinite(input.value) && input.value >= 0 && input.value <= 1_000_000) out.value = input.value
  const currency = shortString(input.currency, 3)?.toUpperCase()
  if (currency && CURRENCY.test(currency)) out.currency = currency
  if (out.value !== undefined && !out.currency) out.currency = 'SGD'
  const contentName = shortString(input.content_name, 160)
  if (contentName) out.content_name = contentName
  if (Array.isArray(input.content_ids)) {
    const ids = input.content_ids.map((id) => shortString(id, 100)).filter((id): id is string => Boolean(id)).slice(0, 10)
    if (ids.length) {
      out.content_ids = ids
      out.content_type = 'product'
    }
  }
  for (const key of ['method', 'source', 'space'] as const) {
    const value = shortString(input[key], 60)
    if (value) out[key] = value
  }
  return Object.keys(out).length ? out : undefined
}

export async function POST(request: NextRequest) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID
  if (!accessToken || !pixelId) return noContent()

  const siteOrigin = request.nextUrl.origin
  const origin = request.headers.get('origin')
  if (origin && origin !== siteOrigin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin') return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })

  const declaredLength = Number(request.headers.get('content-length') || 0)
  if (declaredLength > META_CAPI_MAX_BODY_BYTES) return NextResponse.json({ error: 'Too large' }, { status: 413 })
  const text = await request.text().catch(() => '')
  if (!text || text.length > META_CAPI_MAX_BODY_BYTES) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  let body: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object')
    body = parsed as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const eventName = shortString(body.event_name, 40)
  const eventId = shortString(body.event_id, 160)
  const sourceUrl = shortString(body.event_source_url, 1000)
  let sourceUrlOk = false
  try {
    sourceUrlOk = Boolean(sourceUrl) && new URL(sourceUrl as string).host === request.nextUrl.host
  } catch {
    sourceUrlOk = false
  }
  if (!eventName || !ALLOWED_EVENTS.has(eventName) || !eventId || !META_EVENT_ID.test(eventId) || !sourceUrlOk) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
  }

  const ip = clientIp(request.headers)
  const userAgent = request.headers.get('user-agent')?.slice(0, 500)
  // Meta needs the user agent for website events; requests without one are not real browsers.
  if (!userAgent) return noContent()
  if (isRateLimited(ip || 'unknown')) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  if (!adConsentAllowed(request)) return noContent()
  if (isReplay(eventId)) return noContent()

  const userData: Record<string, string> = { client_user_agent: userAgent }
  if (ip) userData.client_ip_address = ip
  const fbp = request.cookies.get('_fbp')?.value
  if (fbp && COOKIE_VALUE.test(fbp)) userData.fbp = fbp
  const fbcCookie = request.cookies.get('_fbc')?.value
  const fbclid = shortString(body.fbclid, 500)
  if (fbcCookie && COOKIE_VALUE.test(fbcCookie)) userData.fbc = fbcCookie
  else if (fbclid && FBCLID.test(fbclid)) userData.fbc = buildFbc(fbclid, typeof body.fbclid_at === 'number' ? body.fbclid_at : undefined)
  const externalId = shortString(body.external_id, 100)
  const hashedExternalId = externalId ? hashUserData('external_id', externalId) : undefined
  if (hashedExternalId) userData.external_id = hashedExternalId

  const customData = buildCustomData(body.custom_data)
  const event: MetaServerEvent = {
    event_name: eventName as MetaCapiEventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: sourceUrl as string,
    action_source: 'website',
    user_data: userData,
    ...(customData ? { custom_data: customData } : {}),
  }

  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE || undefined
  // Respond first; the Graph API call runs after the response so the visitor never waits on it.
  after(() => sendToMeta(pixelId, accessToken, event, testEventCode))
  return noContent()
}
