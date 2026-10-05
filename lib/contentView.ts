// View models and pure helpers for the project and article detail pages.
// Plain data only (no 'use client', no Sanity client) so both server pages and
// client components can import from here safely.

import type { PortableTextBlock } from '@portabletext/react'
import type { ExplorerPost } from '@/lib/blogContent'

export interface ViewImage {
  src: string
  alt: string
  /** CSS object-position derived from the Sanity hotspot. */
  position?: string
  width?: number
  height?: number
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const PROJECT_CATEGORY_LABELS: Record<string, string> = {
  restaurants: 'Restaurants',
  'office-spaces': 'Office Spaces',
  schools: 'Schools',
  'studios-homes': 'Studios & Homes',
  churches: 'Churches',
  'gym-leisure': 'Gym & Leisure',
  cinema: 'Cinema',
}

export interface ProjectCardView {
  slug: string
  title: string
  category?: string
  categoryLabel?: string
  location?: string
  image?: ViewImage
}

export interface ProjectView {
  title: string
  slug: string
  category?: string
  categoryLabel?: string
  clientName?: string
  location?: string
  spaceType?: string
  spaceSize?: string
  completed?: string
  description?: string
  mainImage?: ViewImage
  gallery: ViewImage[]
  problem?: PortableTextBlock[]
  solution?: PortableTextBlock[]
  result?: PortableTextBlock[]
  metrics: { label: string; value: string }[]
  before?: ViewImage
  after?: ViewImage
  testimonial?: { quote: string; authorName?: string; authorRole?: string }
}

export interface ProjectNavView {
  prev?: ProjectCardView
  next?: ProjectCardView
  more: ProjectCardView[]
}

/**
 * Neighbours follow the /projects index order. "More" prefers the same category,
 * then fills with the rest, and avoids repeating prev/next when there is enough to choose from.
 */
export function buildProjectNav(all: ProjectCardView[], slug: string, category?: string, count = 3): ProjectNavView {
  const index = all.findIndex((p) => p.slug === slug)
  const others = all.filter((p) => p.slug !== slug)
  if (index === -1 || others.length === 0) return { more: pickMore(others, category, [], count) }

  const wrap = all.length >= 3
  const prev = index > 0 ? all[index - 1] : wrap ? all[all.length - 1] : undefined
  const next = index < all.length - 1 ? all[index + 1] : wrap ? all[0] : undefined
  const neighbours = [prev?.slug, next?.slug].filter(Boolean) as string[]
  return { prev, next: next?.slug === prev?.slug ? undefined : next, more: pickMore(others, category, neighbours, count) }
}

function pickMore(others: ProjectCardView[], category: string | undefined, avoid: string[], count: number) {
  const rank = (p: ProjectCardView) => (category && p.category === category ? 0 : 2) + (avoid.includes(p.slug) ? 1 : 0)
  return others
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i)
    .slice(0, count)
    .map(({ p }) => p)
}

// ─── Articles ────────────────────────────────────────────────────────────────

export interface ArticleHeading {
  id: string
  text: string
}

export interface ArticleView {
  title: string
  slug: string
  topic?: string
  topicLabel: string
  typeLabel: string
  date?: string
  readingTime: number
  excerpt?: string
  image?: ViewImage
  /** Portable text with image blocks already resolved to `inlineImage` (src/alt/size). */
  body: PortableTextBlock[]
  faqs: { q: string; a: string }[]
  author?: { name: string; role?: string; bio?: string } | null
}

export interface ArticleNavView {
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
  related: ExplorerPost[]
}

/** Same-topic posts first (newest first), then the latest posts. */
export function buildArticleNav(all: ExplorerPost[], slug: string, topic?: string, count = 3): ArticleNavView {
  const index = all.findIndex((p) => p.slug === slug)
  const prev = index > 0 ? all[index - 1] : undefined
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined
  const others = all.filter((p) => p.slug !== slug)
  const related = [...others.filter((p) => topic && p.category === topic), ...others.filter((p) => !topic || p.category !== topic)].slice(0, count)
  return {
    prev: prev && { slug: prev.slug, title: prev.title },
    next: next && { slug: next.slug, title: next.title },
    related,
  }
}

export function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'section'
  )
}

type Span = { _type?: string; text?: string }
type Block = { _type?: string; _key?: string; style?: string; children?: Span[] }

export function blockText(block: unknown) {
  const children = (block as Block)?.children
  return Array.isArray(children) ? children.map((c) => c?.text ?? '').join('') : ''
}

/** h2 headings in the body with stable, unique ids, keyed by block _key (or index). */
export function extractHeadings(body: unknown[]) {
  const used = new Map<string, number>()
  const byBlock = new Map<string, string>()
  const headings: ArticleHeading[] = []
  body.forEach((raw, index) => {
    const block = raw as Block
    if (block?._type !== 'block' || block.style !== 'h2') return
    const text = blockText(block).trim()
    if (!text) return
    const base = slugify(text)
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    const id = seen ? `${base}-${seen + 1}` : base
    byBlock.set(block._key ?? `i${index}`, id)
    headings.push({ id, text })
  })
  return { headings, byBlock }
}

/** Matches the GROQ estimate used on /blog: characters / 5 / 200 wpm. */
export function estimateReadingTime(body: unknown[]) {
  const chars = body.reduce<number>((sum, block) => sum + blockText(block).length, 0)
  return Math.max(1, Math.round(chars / 5 / 200))
}

/** Pixel size encoded in a Sanity asset ref: image-<id>-<w>x<h>-<ext>. */
export function sanityRefDimensions(ref?: string) {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i)
  return match ? { width: Number(match[1]), height: Number(match[2]) } : undefined
}

export function formatLongDate(value?: string, withDay = true) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString('en-SG', withDay ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' })
}

export const WHATSAPP_URL = 'https://wa.me/6589301905'

export function whatsappLink(message: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}
