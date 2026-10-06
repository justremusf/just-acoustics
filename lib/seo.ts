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

export const ORGANIZATION_ID = `${SITE_URL}/#organization`

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
    .replace(/\s*[|—\-–]\s*Just Acoustics(?:\s+Shop)?\s*$/i, '')
    .trim()
}

const BRAND_SUFFIX = ' | Just Acoustics'
const MAX_TITLE = 60
const MAX_DESCRIPTION = 155

/**
 * Pick the first title that still fits Google's ~60-character display once the
 * " | Just Acoustics" template suffix is added. Pass the preferred wording first.
 */
export function fitTitle(...options: Array<string | undefined | null>): string {
  const candidates = options.filter((option): option is string => Boolean(option && option.trim()))
  return (
    candidates.find((option) => option.length + BRAND_SUFFIX.length <= MAX_TITLE) ??
    candidates[candidates.length - 1] ??
    'Just Acoustics'
  )
}

/** Trim CMS descriptions to the length search results display, on a word boundary. */
export function clampDescription(text: string | undefined | null, max = MAX_DESCRIPTION): string | undefined {
  if (!text) return undefined
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, '')}…`
}

/** Explicit page previews prevent child routes inheriting the homepage URL/image. */
export function pageMetadata({ title, description, path, image, imageAlt, article, noindex, absoluteTitle }: {
  title: string
  description?: string
  path: string
  /** Social preview image; defaults to the site preview photo. */
  image?: string
  imageAlt?: string
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[] }
  /** Keep the page reachable for links but out of search results. */
  noindex?: boolean
  /** Use the title as-is, without the " | Just Acoustics" template suffix. */
  absoluteTitle?: boolean
}): Metadata {
  const url = canonicalPath(path)
  const desc = clampDescription(description)
  const images = [
    image
      ? { url: image, alt: imageAlt || title }
      : { url: SITE_PREVIEW_IMAGE, alt: imageAlt || title, width: 1200, height: 630 },
  ]
  // Long CMS titles drop the brand suffix rather than being cut off in results.
  const useAbsolute = absoluteTitle || title.length + BRAND_SUFFIX.length > MAX_TITLE
  return {
    title: useAbsolute ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: url },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description: desc,
      url,
      siteName: 'Just Acoustics',
      locale: 'en_SG',
      type: article ? 'article' : 'website',
      ...(article?.publishedTime && { publishedTime: article.publishedTime }),
      ...(article?.modifiedTime && { modifiedTime: article.modifiedTime }),
      ...(article?.authors?.length && { authors: article.authors }),
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images,
    },
  }
}

/** Service schema for a space page or service landing page, tied to the sitewide organisation. */
export function serviceJsonLd({ name, description, path, serviceType, minPrice }: {
  name: string
  description?: string
  path: string
  serviceType?: string
  /** Lowest typical installed price in SGD, from lib/priceGuide.ts. */
  minPrice?: number
}) {
  const url = canonicalPath(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    ...(description && { description }),
    serviceType: serviceType || 'Acoustic treatment',
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'Country', name: 'Singapore' },
    url,
    ...(minPrice != null && {
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'SGD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice,
          priceCurrency: 'SGD',
          description: 'Typical supply and installation price. Final quote after reviewing the room.',
        },
      },
    }),
  }
}

/** BreadcrumbList starting at Home. */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalPath(item.path),
    })),
  }
}
