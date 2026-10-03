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
  image?: { src: string; alt: string; position?: string }
}

export const CONTENT_TYPES = [
  { value: 'article', label: 'Articles', singular: 'Article' },
  { value: 'guide', label: 'Guides', singular: 'Guide' },
  { value: 'comparison', label: 'Comparisons', singular: 'Comparison' },
  { value: 'video', label: 'Videos', singular: 'Video' },
  { value: 'case-study', label: 'Case Studies', singular: 'Case Study' },
] as const
