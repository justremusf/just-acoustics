import type { Metadata } from 'next'
import { getAllPosts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Post } from '@/lib/types'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'
import { canonicalPath } from '@/lib/seo'
import BlogExplorer, { CONTENT_TYPES, type ExplorerPost } from '@/components/blog/BlogExplorer'

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
    image: post.mainImage?.asset
      ? { src: urlFor(post.mainImage).width(960).height(600).url(), alt: post.mainImage.alt || post.title }
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
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Resource Center</span>
        <h1 className="page-title">Acoustic Education</h1>
        <p className="page-subtitle">
          Pick a topic, search a problem, or just start with the latest. Every guide is written from real installs across Singapore.
        </p>
      </section>

      <BlogExplorer
        posts={posts.filter((post) => post.slug?.current).map(toExplorerPost)}
        initialTopic={initialTopic}
        initialType={initialType}
        initialSearch={search?.trim() ?? ''}
      />
    </div>
  )
}
