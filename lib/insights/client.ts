'use client'

import { readAnalyticsConsent } from '@/lib/analyticsConsent'

const VISITOR_KEY = 'ja_insights_visitor_v1'
const SESSION_KEY = 'ja_insights_session_v1'
const SESSION_TTL_MS = 30 * 60 * 1000
const BLOCKED_PROPERTY = /email|phone|name|message|address|password|token|card|payment/i

type InsightValue = string | number | boolean | null | undefined
export type InsightProperties = Record<string, InsightValue>

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function getStoredId(key: string, persistent: boolean) {
  const store = persistent ? window.localStorage : window.sessionStorage
  const existing = store.getItem(key)
  if (existing) return existing
  const value = randomId()
  store.setItem(key, value)
  return value
}

function getSessionId() {
  const lastSeen = Number(window.sessionStorage.getItem(`${SESSION_KEY}_last_seen`) || 0)
  if (Date.now() - lastSeen > SESSION_TTL_MS) window.sessionStorage.removeItem(SESSION_KEY)
  const id = getStoredId(SESSION_KEY, false)
  window.sessionStorage.setItem(`${SESSION_KEY}_last_seen`, String(Date.now()))
  return id
}

function sanitiseProperties(properties: InsightProperties) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([key, value]) => !BLOCKED_PROPERTY.test(key) && value !== undefined)
      .slice(0, 20)
      .map(([key, value]) => [key.slice(0, 48), typeof value === 'string' ? value.slice(0, 160) : value]),
  )
}

export function trackFirstPartyEvent(eventName: string, properties: InsightProperties = {}) {
  if (typeof window === 'undefined' || readAnalyticsConsent() === 'unset') return

  const url = new URL(window.location.href)
  const referrer = document.referrer ? new URL(document.referrer).origin : null
  const body = JSON.stringify({
    eventName: eventName.slice(0, 64),
    sessionId: getSessionId(),
    visitorId: getStoredId(VISITOR_KEY, true),
    path: `${url.pathname}${url.search}`.slice(0, 500),
    referrer,
    campaign: Object.fromEntries(
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
        .map((key) => [key, url.searchParams.get(key)])
        .filter(([, value]) => Boolean(value)),
    ),
    properties: sanitiseProperties(properties),
    deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
    viewportWidth: Math.round(window.innerWidth),
  })

  void fetch('/api/insights/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined)
}
