// Shared by the blog server page and the client-side explorer.
// Keep plain data here: values exported from a 'use client' file arrive on the server as references, not data.

export interface ExplorerPost {
  _id: string
  title: string
  slug: string
  category?: string
  contentType?: string
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  pinned?: boolean
  image?: { src: string; alt: string; position?: string; width?: number; height?: number }
}

export const CONTENT_TYPES = [
  { value: 'article', label: 'Articles', singular: 'Article' },
  { value: 'guide', label: 'Guides', singular: 'Guide' },
  { value: 'comparison', label: 'Comparisons', singular: 'Comparison' },
  { value: 'video', label: 'Videos', singular: 'Video' },
  { value: 'case-study', label: 'Case Studies', singular: 'Case Study' },
] as const

/** Blog covers carry their own titles and graphics, so cards always show the whole image at its own shape. */
export const DEFAULT_COVER_RATIO = 1200 / 630

export function coverRatio(image?: { width?: number; height?: number }) {
  return image?.width && image?.height ? image.width / image.height : DEFAULT_COVER_RATIO
}
