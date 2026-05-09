export const SITE_URL = 'https://www.justacoustics.co'

export const SITE_LOGO_PATH =
  '/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg'

export const SITE_LOGO_URL = `${SITE_URL}${SITE_LOGO_PATH}`

export function canonicalPath(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  return canonicalPath(path)
}

export function stripBrand(title: string | undefined | null): string | undefined {
  if (!title) return undefined
  return title
    .replace(/\s*[|\u2014\-–]\s*Just Acoustics(?:\s+Shop)?\s*$/i, '')
    .trim()
}
