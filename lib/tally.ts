// Shared Tally settings. Plain module (no 'use client') so server pages can import it.
export const TALLY_CONSULTATION_FORM_URL =
  'https://tally.so/embed/NppZoQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1'

/** Session key holding the visitor's form URL (attribution included), computed once while warming up. */
export const TALLY_URL_STORAGE_KEY = 'ja_tally_url'
/** Session key set once the form has been preloaded in the background this visit. */
export const TALLY_WARM_STORAGE_KEY = 'ja_tally_warm'

/** The form URL without its query string, used to check a stored URL belongs to the right form. */
export function tallyFormPrefix(baseUrl: string) {
  return baseUrl.split('?')[0]
}

export function readStoredTallyUrl(baseUrl: string): string | null {
  try {
    const stored = window.sessionStorage.getItem(TALLY_URL_STORAGE_KEY)
    return stored && stored.startsWith(tallyFormPrefix(baseUrl)) ? stored : null
  } catch {
    return null
  }
}
