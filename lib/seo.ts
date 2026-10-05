import type { Metadata } from 'next'

export const SITE_URL = 'https://www.justacoustics.co'

/** Keep CMS text inside JSON-LD from terminating its enclosing script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export const SITE_LOGO_PATH =
  '/assets/webflow/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg'

export const SITE_LOGO_URL = `${SITE_URL}${SITE_LOGO_PATH}`

/** Default social preview image (a real install photo). */
export const SITE_PREVIEW_IMAGE = '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp'

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

/** Explicit page previews prevent child routes inheriting the homepage URL/image. */
export function pageMetadata({ title, description, path, image, article }: {
  title: string
  description?: string
  path: string
  image?: string
  article?: { publishedTime?: string }
}): Metadata {
  const url = canonicalPath(path)
  const images = image ? [{ url: image, alt: title }] : []
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Just Acoustics',
      locale: 'en_SG',
      type: article ? 'article' : 'website',
      ...(article?.publishedTime && { publishedTime: article.publishedTime }),
      images,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images,
    },
  }
}
