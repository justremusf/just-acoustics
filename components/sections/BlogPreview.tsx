import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  posts?: Post[]
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPreview({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="py-28 md:py-36">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="flex items-center justify-between mb-16 md:mb-20">
          <h2
            className="text-[var(--color-dark-100)] m-0"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(24px, 3vw, var(--fs-h4))',
              lineHeight: '132%',
              fontWeight: 500,
              letterSpacing: '-0.96px',
            }}
          >
            Latest from the Blog
          </h2>
          <Link
            href="/blog"
            className="text-[var(--color-gray-200)] text-sm no-underline hover:text-[var(--color-dark-100)] transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="block no-underline group"
            >
              {post.mainImage && (
                <div className="rounded-[16px] overflow-hidden mb-4">
                  <Image
                    src={urlFor(post.mainImage).width(400).height(240).url()}
                    alt={post.mainImage.alt || post.title}
                    width={400}
                    height={240}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              {post.publishedAt && (
                <p className="text-[var(--color-gray-200)] text-sm m-0 mb-2">
                  {formatDate(post.publishedAt)}
                </p>
              )}
              <h3
                className="text-[var(--color-dark-100)] m-0 mb-2 text-lg font-semibold leading-snug group-hover:text-[var(--color-brand-orange)] transition-colors"
              >
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-[var(--color-gray-100)] text-sm m-0 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
