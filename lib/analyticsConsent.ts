export const ANALYTICS_CONSENT_COOKIE = 'ja_analytics_consent'
export type AnalyticsConsent = 'analytics_only' | 'all' | 'unset'

type StoredAnalyticsConsent = Exclude<AnalyticsConsent, 'unset'> | 'granted' | 'denied'

function normaliseAnalyticsConsent(value?: string): AnalyticsConsent {
  if (value === 'all' || value === 'granted') return 'all'
  if (value === 'analytics_only' || value === 'denied') return 'analytics_only'
  return 'unset'
}

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof document === 'undefined') return 'unset'
  const value = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split('=')[1]
  return normaliseAnalyticsConsent(value)
}

export function saveAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'unset'>) {
  const maxAge = 60 * 60 * 24 * 180
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${consent}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`
  const advertisingConsent = consent === 'all' ? 'granted' : 'denied'

  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: advertisingConsent,
    ad_user_data: advertisingConsent,
    ad_personalization: advertisingConsent,
  })
  window.dispatchEvent(new CustomEvent('ja-consent-change', { detail: consent }))
}

export function getStoredAnalyticsConsent(): StoredAnalyticsConsent | 'unset' {
  if (typeof document === 'undefined') return 'unset'
  const value = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split('=')[1]

  return value === 'analytics_only' || value === 'all' || value === 'granted' || value === 'denied'
    ? value
    : 'unset'
}

export function migrateLegacyAnalyticsConsent() {
  const storedConsent = getStoredAnalyticsConsent()
  if (storedConsent === 'granted') {
    saveAnalyticsConsent('all')
  } else if (storedConsent === 'denied') {
    saveAnalyticsConsent('analytics_only')
  }
}
