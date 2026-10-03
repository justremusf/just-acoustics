import type { Metadata } from 'next'
import { getAllPosts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Post } from '@/lib/types'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'
import { canonicalPath } from '@/lib/seo'
import BlogExplorer from '@/components/blog/BlogExplorer'
import { CONTENT_TYPES, type ExplorerPost } from '@/lib/blogContent'

export const revalidate = 60

interface BlogPageProps {
  searchParams: Promise<{ topic?: string; type?: string; search?: string }>
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { topic, type, search } = await searchParams
  const isFiltered = Boolean(topic || type || search)
  return {
    title: 'Acoustic Education',
    description:
      'Read acoustic treatment guides, buying advice, room-specific tips, comparisons, videos, and case studies from the Just Acoustics team.',
    alternates: { canonical: canonicalPath('/blog') },
    robots: isFiltered ? { index: false, follow: true } : undefined,
  }
}

function toExplorerPost(post: Post): ExplorerPost {
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
    image: post.mainImage?.asset
      ? {
          src: urlFor(post.mainImage).width(1600).fit('max').url(),
          alt: post.mainImage.alt || post.title,
          // Respect the editor's hotspot so crops keep the subject in frame.
          position: post.mainImage.hotspot
            ? `${Math.round(post.mainImage.hotspot.x * 100)}% ${Math.round(post.mainImage.hotspot.y * 100)}%`
            : undefined,
        }
      : undefined,
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [{ topic, type, search }, posts]: [{ topic?: string; type?: string; search?: string }, Post[]] = await Promise.all([
    searchParams,
    getAllPosts().catch(() => [] as Post[]),
  ])

  const initialTopic = RESOURCE_TOPICS.some((item) => item.value === topic) ? topic : ''
  const initialType = CONTENT_TYPES.some((item) => item.value === type) ? type : ''

  return (
    <div className="page-wrap page-stack">
      <BlogExplorer
        posts={posts.filter((post) => post.slug?.current).map(toExplorerPost)}
        initialTopic={initialTopic}
        initialType={initialType}
        initialSearch={search?.trim() ?? ''}
      />
    </div>
  )
}
