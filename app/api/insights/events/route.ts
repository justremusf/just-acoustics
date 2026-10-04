import { NextResponse } from 'next/server'
import { insertInsightEvent, type InsightEventInput } from '@/lib/insights/server'

export const runtime = 'nodejs'

const EVENT_NAME = /^[a-z][a-z0-9_]{1,63}$/
const ID = /^[a-zA-Z0-9-]{8,100}$/
const ALLOWED_EVENTS = new Set([
  'page_view', 'product_view', 'product_option_selected', 'add_to_cart', 'begin_checkout', 'generate_lead', 'whatsapp_click', 'phone_click', 'email_click', 'cart_opened',
  'blog_view', 'pricing_view', 'landing_page_view', 'page_engaged', 'page_deep_read', 'page_cta_clicked', 'pricing_range_opened',
])

function readString(value: unknown, length: number) {
  return typeof value === 'string' ? value.slice(0, length) : ''
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })

  try {
    const body = await request.json()
    const eventName = readString(body.eventName, 64)
    const sessionId = readString(body.sessionId, 100)
    const visitorId = readString(body.visitorId, 100)
    if (!ALLOWED_EVENTS.has(eventName) || !EVENT_NAME.test(eventName) || !ID.test(sessionId) || !ID.test(visitorId)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    const event: InsightEventInput = {
      eventName, sessionId, visitorId,
      path: readString(body.path, 500) || '/',
      referrer: typeof body.referrer === 'string' ? readString(body.referrer, 300) : null,
      campaign: typeof body.campaign === 'object' && body.campaign ? body.campaign : {},
      properties: typeof body.properties === 'object' && body.properties ? body.properties : {},
      deviceType: body.deviceType === 'mobile' || body.deviceType === 'tablet' ? body.deviceType : 'desktop',
      viewportWidth: Number.isFinite(body.viewportWidth) ? Math.max(0, Math.min(10000, Math.round(body.viewportWidth))) : 0,
    }
    await insertInsightEvent(event)
  } catch {
    // Analytics must never make a visitor-facing journey fail.
  }

  return new NextResponse(null, { status: 204 })
}
