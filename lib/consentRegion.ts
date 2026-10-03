export const CONSENT_REGION_COOKIE = 'ja_consent_region'

// EEA (EU + Iceland, Liechtenstein, Norway), UK and Switzerland: cookies need opt-in consent.
const STRICT_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
  'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
])

/** Only countries we positively identify as opt-in regions are strict; unknown stays standard. */
export function isStrictConsentCountry(country: string | null | undefined) {
  return Boolean(country && STRICT_COUNTRIES.has(country.toUpperCase()))
}
