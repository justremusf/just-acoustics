const TALLY_ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
] as const

type BuildTallyUrlOptions = {
  pageUrl?: string
  referrer?: string
}

export function buildTallyUrlWithAttribution(
  baseTallyUrl: string,
  { pageUrl, referrer }: BuildTallyUrlOptions = {}
) {
  const tallyUrl = new URL(baseTallyUrl)

  if (pageUrl) {
    const currentUrl = new URL(pageUrl)

    TALLY_ATTRIBUTION_KEYS.forEach((key) => {
      const value = currentUrl.searchParams.get(key)

      if (value !== null) {
        tallyUrl.searchParams.set(key, value)
      }
    })

    tallyUrl.searchParams.set('landing_page', currentUrl.href)
  }

  if (referrer) {
    tallyUrl.searchParams.set('referrer', referrer)
  }

  return tallyUrl.toString()
}
