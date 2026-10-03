import { CONSENT_REGION_COOKIE } from '@/lib/consentRegion'

export const ANALYTICS_CONSENT_COOKIE = 'ja_analytics_consent'
export type AnalyticsConsent = 'analytics_only' | 'all' | 'unset'

type StoredAnalyticsConsent = Exclude<AnalyticsConsent, 'unset'> | 'granted' | 'denied'

function normaliseAnalyticsConsent(value?: string): AnalyticsConsent {
  if (value === 'all' || value === 'granted') return 'all'
  if (value === 'analytics_only' || value === 'denied') return 'analytics_only'
  return 'unset'
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))
    ?.split('=')[1]
}

/** True only when middleware.ts has positively placed the visitor in an opt-in region (EEA/UK/CH). */
export function isStrictConsentRegion() {
  return readCookie(CONSENT_REGION_COOKIE) === 'strict'
}

/** The choice the visitor actually made, if any. */
export function readConsentChoice(): AnalyticsConsent {
  return normaliseAnalyticsConsent(readCookie(ANALYTICS_CONSENT_COOKIE))
}

/**
 * The consent in effect. Outside opt-in regions, cookies are on by default (consent by notification)
 * until the visitor opts out.
 */
export function readAnalyticsConsent(): AnalyticsConsent {
  const choice = readConsentChoice()
  if (choice !== 'unset') return choice
  return isStrictConsentRegion() ? 'unset' : 'all'
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
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq
  fbq?.('consent', consent === 'all' ? 'grant' : 'revoke')
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
