export const ATTRIBUTION_STORAGE_KEY = 'ja_attribution_v1'

export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
  'ttclid',
  'landing_page',
  'referrer',
] as const

const CLICK_ID_KEYS = ['gclid', 'fbclid', 'ttclid'] as const
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
] as const

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number]
export type Attribution = Partial<Record<AttributionKey, string>> & {
  lead_ref?: string
}

function isBrowser() {
  return typeof window !== 'undefined'
}

function createLeadRef() {
  const random =
    typeof crypto !== 'undefined' && 'getRandomValues' in crypto
      ? Array.from(crypto.getRandomValues(new Uint8Array(4)))
          .map((value) => value.toString(36).padStart(2, '0'))
          .join('')
      : Math.random().toString(36).slice(2, 10)

  return `JA-${random.slice(0, 6).toUpperCase()}`
}

function readStoredAttribution(): Attribution | null {
  if (!isBrowser()) return null

  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStoredAttribution(attribution: Attribution) {
  if (!isBrowser()) return

  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Ignore storage failures; attribution should never block navigation.
  }
}

function hasExplicitAttribution(url: URL) {
  return [...UTM_KEYS, ...CLICK_ID_KEYS].some((key) => url.searchParams.has(key))
}

function getKnownReferrerSource(referrer: string) {
  if (!referrer) return null

  try {
    const referrerUrl = new URL(referrer)
    const hostname = referrerUrl.hostname.toLowerCase()

    if (hostname.includes('justacoustics.co')) return null
    if (hostname.includes('google.')) return { utm_source: 'google_organic', utm_medium: 'organic' }
    if (hostname.includes('facebook.com')) return { utm_source: 'facebook_organic', utm_medium: 'social' }
    if (hostname.includes('instagram.com')) return { utm_source: 'instagram_organic', utm_medium: 'social' }
    if (hostname.includes('tiktok.com')) return { utm_source: 'tiktok_organic', utm_medium: 'social' }
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return { utm_source: 'youtube_organic', utm_medium: 'social' }
    }

    return { utm_source: hostname.replace(/^www\./, ''), utm_medium: 'referral' }
  } catch {
    return null
  }
}

function attributionFromUrl(url: URL, referrer: string): Attribution {
  const attribution: Attribution = {
    landing_page: url.href,
    referrer,
  }

  UTM_KEYS.forEach((key) => {
    const value = url.searchParams.get(key)
    if (value) attribution[key] = value
  })

  CLICK_ID_KEYS.forEach((key) => {
    const value = url.searchParams.get(key)
    if (value) attribution[key] = value
  })

  return attribution
}

function attributionFromReferrer(url: URL, referrer: string): Attribution {
  const detected = getKnownReferrerSource(referrer)

  if (detected) {
    return {
      ...detected,
      landing_page: url.href,
      referrer,
    }
  }

  return {
    utm_source: 'direct',
    utm_medium: 'none',
    landing_page: url.href,
    referrer,
  }
}

export function captureAttribution() {
  if (!isBrowser()) return null

  const currentUrl = new URL(window.location.href)
  const referrer = document.referrer || ''
  const stored = readStoredAttribution()
  const shouldReplaceStored = hasExplicitAttribution(currentUrl)

  if (stored && !shouldReplaceStored) {
    return stored
  }

  const nextAttribution = shouldReplaceStored
    ? attributionFromUrl(currentUrl, referrer)
    : attributionFromReferrer(currentUrl, referrer)

  if (stored?.lead_ref) {
    nextAttribution.lead_ref = stored.lead_ref
  } else {
    nextAttribution.lead_ref = createLeadRef()
  }

  writeStoredAttribution(nextAttribution)
  return nextAttribution
}

export function getAttribution() {
  return readStoredAttribution() || captureAttribution() || {}
}

export function getAttributionEventParams() {
  const attribution = getAttribution()
  return Object.fromEntries(
    Object.entries(attribution).filter(([, value]) => typeof value === 'string' && value.length > 0)
  )
}

export function buildUrlWithAttribution(baseUrl: string) {
  const url = new URL(baseUrl, isBrowser() ? window.location.origin : undefined)
  const attribution = getAttribution()

  ATTRIBUTION_KEYS.forEach((key) => {
    const value = attribution[key]
    if (value) url.searchParams.set(key, value)
  })

  return url.toString()
}

function getWhatsAppMessage(attribution: Attribution) {
  const lines = [
    'Hi Just Acoustics, I would like help with acoustic treatment.',
    '',
    `Lead ref: ${attribution.lead_ref || createLeadRef()}`,
    `Source: ${attribution.utm_source || 'unknown'}`,
  ]

  if (attribution.utm_campaign) lines.push(`Campaign: ${attribution.utm_campaign}`)
  if (attribution.utm_content) lines.push(`Ad: ${attribution.utm_content}`)
  if (attribution.utm_term) lines.push(`Keyword: ${attribution.utm_term}`)
  if (attribution.landing_page) lines.push(`Landing page: ${attribution.landing_page}`)

  return lines.join('\n')
}

export function buildWhatsAppUrlWithAttribution(baseUrl: string) {
  const attribution = getAttribution()
  const url = new URL(baseUrl)
  url.searchParams.set('text', getWhatsAppMessage(attribution))

  return url.toString()
}

export function buildTallyUrlWithAttribution(baseTallyUrl: string) {
  const tallyUrl = new URL(baseTallyUrl)
  const attribution = getAttribution()

  ATTRIBUTION_KEYS.forEach((key) => {
    const value = attribution[key]
    if (value) tallyUrl.searchParams.set(key, value)
  })

  if (attribution.lead_ref) {
    tallyUrl.searchParams.set('lead_ref', attribution.lead_ref)
  }

  return tallyUrl.toString()
}
