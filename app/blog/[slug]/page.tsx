import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllPostSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Post } from '@/lib/types'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllPostSlugs().catch(() => [])
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post: Post | null = await getPostBySlug(slug).catch(() => null)
  if (!post) return {}
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: post.mainImage
      ? { images: [{ url: urlFor(post.mainImage).width(1200).height(630).url() }] }
      : undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post: Post | null = await getPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  return (
    <article className="max-w-[740px] mx-auto px-5 py-20">
      <Link
        href="/blog"
        className="text-[var(--color-gray-200)] text-sm no-underline hover:text-[var(--color-dark-100)] transition-colors inline-flex items-center gap-1 mb-8"
      >
        ← Back to Blog
      </Link>

      {post.publishedAt && (
        <p className="text-[var(--color-gray-200)] text-sm mb-4">
          {new Date(post.publishedAt).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}

      <h1
        className="text-[var(--color-dark-100)] m-0 mb-6"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
          lineHeight: '124%',
          fontWeight: 500,
          letterSpacing: '-1.04px',
        }}
      >
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="rounded-[16px] overflow-hidden mb-10">
          <Image
            src={urlFor(post.mainImage).width(740).height(420).url()}
            alt={post.mainImage.alt || post.title}
            width={740}
            height={420}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      {post.body && (
        <div className="prose prose-lg max-w-none text-[var(--color-gray-100)] leading-relaxed">
          <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      <div className="mt-16 pt-10 border-t border-[var(--color-white-300)]">
        <p className="text-[var(--color-gray-100)] text-base mb-4">
          Want to improve your space acoustics?
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[var(--color-brand-orange)] text-white rounded-[100px] px-6 py-3 text-base no-underline hover:bg-[var(--color-gray-100)] transition-colors"
        >
          Get a Free Consultation
        </Link>
      </div>
    </article>
  )
}
