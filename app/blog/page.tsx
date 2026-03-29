import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Post } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Acoustic tips, project case studies, and expert advice from the Just Acoustics team.',
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPage() {
  const posts: Post[] = await getAllPosts().catch(() => [])

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <div className="mb-14">
        <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm mb-4">
          Blog
        </span>
        <h1
          className="text-[var(--color-dark-100)] m-0"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 5vw, var(--fs-h2))',
            lineHeight: '112%',
            fontWeight: 500,
            letterSpacing: '-1.28px',
          }}
        >
          Acoustic Insights
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--color-gray-200)] text-base">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="block no-underline group"
            >
              {post.mainImage && (
                <div className="rounded-[16px] overflow-hidden mb-4 aspect-[16/10]">
                  <Image
                    src={urlFor(post.mainImage).width(400).height(250).url()}
                    alt={post.mainImage.alt || post.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              {post.publishedAt && (
                <p className="text-[var(--color-gray-200)] text-sm m-0 mb-2">{formatDate(post.publishedAt)}</p>
              )}
              <h2
                className="text-[var(--color-dark-100)] m-0 mb-2 text-xl font-semibold leading-snug group-hover:text-[var(--color-brand-orange)] transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-[var(--color-gray-100)] text-sm m-0 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
