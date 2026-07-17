export const ANALYTICS_CONSENT_COOKIE = 'ja_analytics_consent'
export type AnalyticsConsent = 'granted' | 'denied' | 'unset'

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof document === 'undefined') return 'unset'
  const value = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split('=')[1]
  return value === 'granted' || value === 'denied' ? value : 'unset'
}

export function saveAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'unset'>) {
  const maxAge = 60 * 60 * 24 * 180
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${consent}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`
  window.gtag?.('consent', 'update', {
    analytics_storage: consent,
    ad_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
  })
  window.dispatchEvent(new CustomEvent('ja-consent-change', { detail: consent }))
}

