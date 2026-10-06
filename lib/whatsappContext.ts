/**
 * Contextual WhatsApp messages: only what the site already knows about this visit (space type
 * browsed, estimator result, product being viewed). Never placeholders for the visitor to fill in.
 *
 * Plain module (no 'use client'): safe to import from server and client code. The storage helpers
 * no-op on the server.
 */

export const WHATSAPP_NUMBER = '6589301905'
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const GENERIC_WHATSAPP_MESSAGE = "Hi Just Acoustics, I'd like some advice on acoustic treatment."
export const BROWSING_CONTEXT_EVENT = 'ja-browsing-context'
const STORAGE_KEY = 'ja_browsing_context_v1'

export type SpaceKey = 'office' | 'restaurant' | 'school' | 'church' | 'home' | 'home-studio' | 'gym'

const SPACES: Record<SpaceKey, { phrase: string; noun: string }> = {
  office: { phrase: 'an office', noun: 'office' },
  restaurant: { phrase: 'a restaurant', noun: 'restaurant' },
  school: { phrase: 'a school', noun: 'classroom' },
  church: { phrase: 'a church', noun: 'church' },
  home: { phrase: 'my home', noun: 'home' },
  'home-studio': { phrase: 'a home studio', noun: 'home studio' },
  gym: { phrase: 'a gym', noun: 'gym' },
}

const SIZE_LABELS: Record<string, string> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  'very-large': 'very large',
}

/** Ad landing pages and other single-space pages. */
const PAGE_SPACES: Record<string, SpaceKey> = {
  '/office-acoustic-treatment': 'office',
  '/restaurant-echo-reduction': 'restaurant',
  '/school-acoustic-treatment': 'school',
  '/acoustic-panels-singapore': 'home',
  '/church-acoustics': 'church',
}

export type BrowsingContext = {
  spaces: Partial<Record<SpaceKey, { count: number; last: number }>>
  estimate?: { space: SpaceKey; size: string; low: number; high?: number | null; at: number }
  product?: { name: string; path: string; at: number }
  /** Last path counted, so a re-render or a query-string change is not a second view. */
  lastPath?: string
}

export function emptyContext(): BrowsingContext {
  return { spaces: {} }
}

export function isSpaceKey(value: unknown): value is SpaceKey {
  return typeof value === 'string' && value in SPACES
}

/** Maps a space slug (estimator slugs or /spaces/<slug> page slugs) to a space key. */
export function spaceFromSlug(slug: string | null | undefined): SpaceKey | null {
  if (!slug) return null
  const value = slug.toLowerCase()
  if (isSpaceKey(value)) return value
  if (/studio/.test(value)) return 'home-studio'
  if (/office|meeting|co-?working/.test(value)) return 'office'
  if (/restaurant|cafe|café|f-?and-?b|dining|bar/.test(value)) return 'restaurant'
  if (/school|education|classroom|childcare|preschool/.test(value)) return 'school'
  if (/church|worship|hall|temple|mosque/.test(value)) return 'church'
  if (/gym|fitness|activity/.test(value)) return 'gym'
  if (/home|hdb|condo|living|bedroom|residential/.test(value)) return 'home'
  return null
}

export function spaceFromPath(pathname: string | null | undefined): SpaceKey | null {
  if (!pathname) return null
  const path = pathname.replace(/\/+$/, '') || '/'
  if (PAGE_SPACES[path]) return PAGE_SPACES[path]
  const match = path.match(/^\/spaces\/([^/]+)$/)
  return match ? spaceFromSlug(match[1]) : null
}

function bump(context: BrowsingContext, space: SpaceKey, by: number, now: number): BrowsingContext {
  const current = context.spaces[space]
  return {
    ...context,
    spaces: { ...context.spaces, [space]: { count: (current?.count ?? 0) + by, last: now } },
  }
}

export function withPageView(context: BrowsingContext, pathname: string, now = Date.now()): BrowsingContext {
  if (context.lastPath === pathname) return context
  const space = spaceFromPath(pathname)
  const next = { ...context, lastPath: pathname }
  return space ? bump(next, space, 1, now) : next
}

/** An estimator pick is an explicit statement about the room, so it weighs more than a page view. */
export function withEstimate(
  context: BrowsingContext,
  estimate: { space: string; size: string; low: number; high?: number | null },
  now = Date.now(),
): BrowsingContext {
  const space = spaceFromSlug(estimate.space)
  if (!space) return context
  return { ...bump(context, space, 2, now), estimate: { space, size: estimate.size, low: estimate.low, high: estimate.high ?? null, at: now } }
}

export function withProduct(context: BrowsingContext, name: string, path: string, now = Date.now()): BrowsingContext {
  const clean = name.replace(/\s+/g, ' ').trim().slice(0, 80)
  return clean ? { ...context, product: { name: clean, path, at: now } } : context
}

/** The page the visitor is on wins; otherwise the most-viewed space, ties going to the most recent. */
export function pickSpace(context: BrowsingContext, currentPath?: string | null): SpaceKey | null {
  const onPage = spaceFromPath(currentPath)
  if (onPage) return onPage
  let best: SpaceKey | null = null
  for (const [key, stats] of Object.entries(context.spaces) as Array<[SpaceKey, { count: number; last: number }]>) {
    const top = best ? context.spaces[best]! : null
    if (!top || stats.count > top.count || (stats.count === top.count && stats.last > top.last)) best = key
  }
  return best
}

function formatAmount(amount: number) {
  return amount.toLocaleString('en-SG', { maximumFractionDigits: 0 })
}

function estimateSentence(estimate: NonNullable<BrowsingContext['estimate']>, space: SpaceKey | null) {
  const size = SIZE_LABELS[estimate.size] ?? estimate.size.replace(/-/g, ' ')
  const same = !space || estimate.space === space
  const room = same ? 'room' : SPACES[estimate.space].noun
  const saw = same ? 'I saw' : 'I also saw'
  const article = /^[aeiou]/i.test(size) ? 'an' : 'a'
  return estimate.high != null
    ? `${saw} the S$${formatAmount(estimate.low)}–${formatAmount(estimate.high)} estimate for ${article} ${size} ${room}.`
    : `${saw} the estimate from S$${formatAmount(estimate.low)} for ${article} ${size} ${room}.`
}

export type WhatsAppMessageOptions = {
  currentPath?: string | null
  /** Page-specific sentence(s) appended after the context, e.g. the thank-you page's photo request. */
  followUp?: string
}

export function buildWhatsAppMessage(context: BrowsingContext | null, options: WhatsAppMessageOptions = {}) {
  const ctx = context ?? emptyContext()
  const space = pickSpace(ctx, options.currentPath)
  const sentences: string[] = []

  if (space) sentences.push(`I'm looking into acoustic treatment for ${SPACES[space].phrase}.`)
  if (ctx.product && options.currentPath && ctx.product.path === options.currentPath) {
    sentences.push(`I'm interested in the ${ctx.product.name}.`)
  }
  if (ctx.estimate) sentences.push(estimateSentence(ctx.estimate, space))
  if (options.followUp) sentences.push(options.followUp.trim())

  if (!sentences.length) return GENERIC_WHATSAPP_MESSAGE
  return `Hi Just Acoustics, ${sentences.join(' ')}`
}

export function whatsAppHref(text: string) {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`
}

/** Server-safe initial href: no session context yet, so the generic message (plus any follow-up). */
export function initialWhatsAppHref(followUp?: string) {
  return whatsAppHref(buildWhatsAppMessage(null, { followUp }))
}

// --- sessionStorage (browser only) ---

export function readBrowsingContext(): BrowsingContext {
  if (typeof window === 'undefined') return emptyContext()
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null') as BrowsingContext | null
    if (!parsed || typeof parsed !== 'object' || typeof parsed.spaces !== 'object') return emptyContext()
    if (parsed.estimate && !isSpaceKey(parsed.estimate.space)) delete parsed.estimate
    return parsed
  } catch {
    return emptyContext()
  }
}

function writeBrowsingContext(next: BrowsingContext, previous: BrowsingContext) {
  if (typeof window === 'undefined' || next === previous) return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage blocked: messages fall back to the current page only.
  }
  window.dispatchEvent(new Event(BROWSING_CONTEXT_EVENT))
}

function update(change: (context: BrowsingContext) => BrowsingContext) {
  const previous = readBrowsingContext()
  writeBrowsingContext(change(previous), previous)
}

export function recordPageView(pathname: string) {
  update((context) => withPageView(context, pathname))
}

export function recordEstimate(estimate: { space: string; size: string; low: number; high?: number | null }) {
  update((context) => withEstimate(context, estimate))
}

export function recordProductView(name: string, path: string) {
  update((context) => withProduct(context, name, path))
}
