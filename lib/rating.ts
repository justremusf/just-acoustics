import type { SiteSettings } from '@/lib/types'

export interface GoogleRating {
  value: number
  count: number
  url?: string
}

/** The Google rating entered in Sanity site settings, or null until both numbers are filled in. */
export function getGoogleRating(settings?: Pick<SiteSettings, 'googleRating' | 'googleReviewCount' | 'googleReviewLink'> | null): GoogleRating | null {
  const value = settings?.googleRating
  const count = settings?.googleReviewCount
  if (!value || !count) return null
  return { value, count, url: settings?.googleReviewLink || undefined }
}
