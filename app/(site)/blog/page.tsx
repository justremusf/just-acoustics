import type { Metadata } from 'next'
import { getAllPosts } from '@/sanity/lib/queries'
import { toExplorerPost } from '@/sanity/lib/views'
import type { Post } from '@/lib/types'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'
import { canonicalPath } from '@/lib/seo'
import BlogExplorer from '@/components/blog/BlogExplorer'
import { CONTENT_TYPES } from '@/lib/blogContent'

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
