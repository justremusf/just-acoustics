import type { Metadata } from 'next'
import { getAllPosts } from '@/sanity/lib/queries'
import { toExplorerPost } from '@/sanity/lib/views'
import type { Post } from '@/lib/types'
import { pageMetadata } from '@/lib/seo'
import BlogExplorer from '@/components/blog/BlogExplorer'

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: 'Acoustic Treatment Guides Singapore',
  description:
    'Acoustic treatment guides, buying advice, room-specific tips, comparisons, videos and case studies from the Just Acoustics team in Singapore.',
  path: '/blog',
})

export default async function BlogPage() {
  const posts: Post[] = await getAllPosts().catch(() => [])

  return (
    <div className="page-wrap page-stack">
      <BlogExplorer posts={posts.filter((post) => post.slug?.current).map(toExplorerPost)} />
    </div>
  )
}
