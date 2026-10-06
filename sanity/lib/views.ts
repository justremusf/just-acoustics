// Turns raw Sanity documents into the plain view models the detail pages render.
// Keeping image URLs resolved here means the page components only ever see src/alt strings.

import type { PortableTextBlock } from '@portabletext/react'
import { urlFor } from './image'
import type { Post, Project, SanityImage } from '@/lib/types'
import type { ExplorerPost } from '@/lib/blogContent'
import { CONTENT_TYPES } from '@/lib/blogContent'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'
import {
  PROJECT_CATEGORY_LABELS,
  estimateReadingTime,
  formatLongDate,
  sanityRefDimensions,
  type ArticleView,
  type ProjectCardView,
  type ProjectView,
  type ViewImage,
} from '@/lib/contentView'

export function toViewImage(image: SanityImage | undefined, fallbackAlt: string, width = 1600): ViewImage | undefined {
  if (!image?.asset?._ref) return undefined
  const dims = sanityRefDimensions(image.asset._ref)
  return {
    src: urlFor(image).width(width).fit('max').url(),
    alt: image.alt || fallbackAlt,
    position: image.hotspot ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%` : undefined,
    width: dims?.width,
    height: dims?.height,
  }
}

export function toExplorerPost(post: Post): ExplorerPost {
  const image = toViewImage(post.mainImage, post.title)
  return {
    _id: post._id,
    title: post.title,
    slug: post.slug.current,
    category: post.category,
    contentType: post.contentType,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    pinned: post.pinned,
    image: image && { src: image.src, alt: image.alt, position: image.position, width: image.width, height: image.height },
  }
}

export function toProjectCard(project: Project): ProjectCardView {
  return {
    slug: project.slug.current,
    title: project.title,
    category: project.category,
    categoryLabel: project.category ? PROJECT_CATEGORY_LABELS[project.category] : undefined,
    location: project.location,
    image: toViewImage(project.mainImage, project.title, 1000),
  }
}

function hasBlocks(value?: unknown[]): value is PortableTextBlock[] {
  return Array.isArray(value) && value.some((block) => (block as { _type?: string })?._type)
}

export function toProjectView(project: Project): ProjectView {
  const gallery = (project.gallery ?? [])
    .map((img, i) => toViewImage(img, `${project.title} – photo ${i + 1}`, 2000))
    .filter((img): img is ViewImage => Boolean(img))
  const quote = project.testimonial?.quote?.trim()
  return {
    title: project.title,
    slug: project.slug.current,
    category: project.category,
    categoryLabel: project.category ? PROJECT_CATEGORY_LABELS[project.category] : undefined,
    clientName: project.clientName,
    location: project.location,
    spaceType: project.spaceType,
    spaceSize: project.spaceSize,
    completed: formatLongDate(project.completionDate, false),
    description: project.description,
    mainImage: toViewImage(project.mainImage, project.title, 2400),
    gallery,
    problem: hasBlocks(project.problem) ? project.problem : undefined,
    solution: hasBlocks(project.solution) ? project.solution : undefined,
    result: hasBlocks(project.result) ? project.result : undefined,
    metrics: (project.metrics ?? [])
      .filter((m) => m?.label && m?.value)
      .map((m) => ({ label: m.label as string, value: m.value as string })),
    // Before/after only reads as a comparison when both exist.
    before: project.afterImage ? toViewImage(project.beforeImage, `${project.title} before treatment`) : undefined,
    after: project.beforeImage ? toViewImage(project.afterImage, `${project.title} after treatment`) : undefined,
    testimonial: quote
      ? { quote, authorName: project.testimonial?.authorName, authorRole: project.testimonial?.authorRole }
      : undefined,
  }
}

/** Swap Sanity image blocks for resolved `inlineImage` blocks so the renderer needs no Sanity client. */
function resolveBody(body: unknown[], title: string): PortableTextBlock[] {
  return body.flatMap((raw) => {
    const block = raw as { _type?: string; _key?: string; asset?: SanityImage['asset'] }
    if (block?._type === 'imagePlaceholder') return []
    if (block?._type === 'image') {
      const image = toViewImage(block as unknown as SanityImage, title, 1600)
      return image ? [{ _type: 'inlineImage', _key: block._key, ...image } as unknown as PortableTextBlock] : []
    }
    return [raw as PortableTextBlock]
  })
}

export function toArticleView(post: Post): ArticleView {
  const body = Array.isArray(post.body) ? post.body : []
  return {
    title: post.title,
    slug: post.slug.current,
    topic: post.category,
    topicLabel: RESOURCE_TOPICS.find((t) => t.value === post.category)?.title ?? 'Acoustic Education',
    typeLabel: CONTENT_TYPES.find((t) => t.value === post.contentType)?.singular ?? 'Article',
    date: formatLongDate(post.publishedAt),
    readingTime: post.readingTime || estimateReadingTime(body),
    excerpt: post.excerpt,
    image: toViewImage(post.mainImage, post.title, 2400),
    body: resolveBody(body, post.title),
    author: post.author?.name ? { name: post.author.name, role: post.author.role, bio: post.author.bio } : null,
    faqs: (post.faqs ?? []).filter((f) => f?.question && f?.answer).map((f) => ({ q: f.question, a: f.answer })),
  }
}
