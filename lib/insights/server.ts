import { neon } from '@neondatabase/serverless'

export type InsightEventInput = {
  eventName: string
  sessionId: string
  visitorId: string
  path: string
  referrer: string | null
  campaign: Record<string, string>
  properties: Record<string, string | number | boolean | null>
  deviceType: 'mobile' | 'tablet' | 'desktop'
  viewportWidth: number
}

type InsightDashboard = {
  configured: boolean
  totals: { events: number; visitors: number; sessions: number; leads: number; cartAdds: number; contacts: number }
  funnel: Array<{ eventName: string; count: number }>
  topPages: Array<{ path: string; count: number }>
  topEvents: Array<{ eventName: string; count: number }>
  campaignSources: Array<{ source: string; count: number }>
}

let schemaPromise: Promise<void> | null = null

function getSql() {
  const databaseUrl = process.env.DATABASE_URL
  return databaseUrl ? neon(databaseUrl) : null
}

async function ensureSchema() {
  if (schemaPromise) return schemaPromise
  const sql = getSql()
  if (!sql) return

  schemaPromise = (async () => {
    await sql.query(`CREATE TABLE IF NOT EXISTS ja_insights_events (
      id BIGSERIAL PRIMARY KEY,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      event_name TEXT NOT NULL,
      session_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      path TEXT NOT NULL,
      referrer TEXT,
      campaign JSONB NOT NULL DEFAULT '{}'::jsonb,
      properties JSONB NOT NULL DEFAULT '{}'::jsonb,
      device_type TEXT NOT NULL,
      viewport_width INTEGER NOT NULL
    )`)
    await sql.query('CREATE INDEX IF NOT EXISTS ja_insights_events_occurred_at_idx ON ja_insights_events (occurred_at DESC)')
    await sql.query('CREATE INDEX IF NOT EXISTS ja_insights_events_name_idx ON ja_insights_events (event_name, occurred_at DESC)')
  })().catch((error: unknown) => {
    // A transient initialisation failure must not poison every later request
    // handled by this warm instance. The failed request still reports failure.
    schemaPromise = null
    throw error
  })
  return schemaPromise
}

export async function insertInsightEvent(event: InsightEventInput) {
  const sql = getSql()
  if (!sql) return false
  await ensureSchema()
  await sql`INSERT INTO ja_insights_events (event_name, session_id, visitor_id, path, referrer, campaign, properties, device_type, viewport_width)
    VALUES (${event.eventName}, ${event.sessionId}, ${event.visitorId}, ${event.path}, ${event.referrer}, ${JSON.stringify(event.campaign)}::jsonb, ${JSON.stringify(event.properties)}::jsonb, ${event.deviceType}, ${event.viewportWidth})`
  return true
}

export async function getInsightsDashboard(days = 30): Promise<InsightDashboard> {
  const sql = getSql()
  if (!sql) {
    return {
      configured: false,
      totals: { events: 0, visitors: 0, sessions: 0, leads: 0, cartAdds: 0, contacts: 0 },
      funnel: [], topPages: [], topEvents: [], campaignSources: [],
    }
  }

  await ensureSchema()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const [totalsResult, funnel, topPages, topEvents, campaignSources] = await Promise.all([
    sql`SELECT COUNT(*)::int AS events, COUNT(DISTINCT visitor_id)::int AS visitors, COUNT(DISTINCT session_id)::int AS sessions,
      COUNT(*) FILTER (WHERE event_name = 'generate_lead')::int AS leads,
      COUNT(*) FILTER (WHERE event_name = 'add_to_cart')::int AS cart_adds,
      COUNT(*) FILTER (WHERE event_name IN ('whatsapp_click', 'phone_click', 'email_click'))::int AS contacts
      FROM ja_insights_events WHERE occurred_at >= ${since}::timestamptz`,
    sql`SELECT event_name AS "eventName", COUNT(*)::int AS count FROM ja_insights_events
      WHERE occurred_at >= ${since}::timestamptz AND event_name = ANY(ARRAY['page_view', 'product_view', 'add_to_cart', 'begin_checkout', 'generate_lead'])
      GROUP BY event_name ORDER BY count DESC`,
    sql`SELECT path, COUNT(*)::int AS count FROM ja_insights_events WHERE occurred_at >= ${since}::timestamptz
      GROUP BY path ORDER BY count DESC LIMIT 8`,
    sql`SELECT event_name AS "eventName", COUNT(*)::int AS count FROM ja_insights_events WHERE occurred_at >= ${since}::timestamptz
      GROUP BY event_name ORDER BY count DESC LIMIT 10`,
    sql`SELECT NULLIF(campaign->>'utm_source', '') AS source, COUNT(*)::int AS count FROM ja_insights_events
      WHERE occurred_at >= ${since}::timestamptz AND NULLIF(campaign->>'utm_source', '') IS NOT NULL
      GROUP BY source ORDER BY count DESC LIMIT 8`,
  ])

  const row = totalsResult[0] || {}
  return {
    configured: true,
    totals: {
      events: Number(row.events || 0), visitors: Number(row.visitors || 0), sessions: Number(row.sessions || 0),
      leads: Number(row.leads || 0), cartAdds: Number(row.cart_adds || 0), contacts: Number(row.contacts || 0),
    },
    funnel: funnel.map((item) => ({ eventName: String(item.eventName), count: Number(item.count) })),
    topPages: topPages.map((item) => ({ path: String(item.path), count: Number(item.count) })),
    topEvents: topEvents.map((item) => ({ eventName: String(item.eventName), count: Number(item.count) })),
    campaignSources: campaignSources.map((item) => ({ source: String(item.source), count: Number(item.count) })),
  }
}
