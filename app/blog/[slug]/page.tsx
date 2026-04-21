import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllPostSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Post } from '@/lib/types'
import FAQ from '@/components/sections/FAQ'
import type { FaqItem } from '@/components/sections/FAQ'

const BLOG_FAQS: FaqItem[] = [
  {
    q: 'How do I know if my room needs acoustic treatment?',
    a: 'If speech is unclear, music sounds muddy, or you notice a noticeable echo after sounds stop, the room likely has too much reverb. A free consultation can confirm this.',
  },
  {
    q: 'What is the difference between acoustic treatment and soundproofing?',
    a: 'Acoustic treatment controls sound quality inside a room by absorbing reflections. Soundproofing reduces how much sound travels between rooms or from outside.',
  },
  {
    q: 'Do acoustic panels work for home offices?',
    a: 'Yes. Even a small number of panels placed on the walls behind and beside you can noticeably improve call clarity and reduce echo.',
  },
  {
    q: 'How many panels do I need?',
    a: 'It depends on room size, ceiling height, and hard surface coverage. We typically recommend treating 20–30% of total wall area as a starting point.',
  },
]

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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post.mainImage && { image: urlFor(post.mainImage).width(1200).height(630).url() }),
    author: { '@type': 'Organization', name: 'Just Acoustics' },
    publisher: {
      '@type': 'Organization',
      name: 'Just Acoustics',
      logo: { '@type': 'ImageObject', url: 'https://justacoustics.co/assets/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://justacoustics.co/blog/${slug}` },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://justacoustics.co' },
      { '@type': 'ListItem', position: 2, name: 'Resource Centre', item: 'https://justacoustics.co/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://justacoustics.co/blog/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <div className="page-wrap page-stack max-w-[940px]">
      <Link href="/blog" className="page-link">← Back to Resource Center</Link>

      <article className="home-shell page-hero-shell flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {post.publishedAt && (
            <span className="soft-pill">
              {new Date(post.publishedAt).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
          <h1 className="page-title">{post.title}</h1>
          {post.excerpt && <p className="page-subtitle">{post.excerpt}</p>}
        </div>

        {post.mainImage && (
          <div className="glass-card overflow-hidden rounded-[28px]">
            <Image
              src={urlFor(post.mainImage).width(1200).height(720).url()}
              alt={post.mainImage.alt || post.title}
              width={1200}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        )}

        {post.body && (
          <div className="rich-content max-w-none">
            <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
          </div>
        )}
      </article>

      <FAQ items={BLOG_FAQS} title="Common Questions" subtitle="Quick answers about acoustic treatment." />

      <section className="glass-card p-6 text-center">
        <p className="page-card-copy mx-auto max-w-[48ch]">
          Want help applying this to your room? Send us the space details and we will recommend the right next step.
        </p>
        <Link href="/contact" className="page-cta mt-5">Free Consultation</Link>
      </section>
    </div>
    </>
  )
}
