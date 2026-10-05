import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getAllPostSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { toArticleView, toExplorerPost } from '@/sanity/lib/views'
import { canonicalPath, serializeJsonLd, SITE_PREVIEW_IMAGE, SITE_URL, stripBrand } from '@/lib/seo'
import { buildArticleNav } from '@/lib/contentView'
import type { Post } from '@/lib/types'
import ArticleDetail from '@/components/blog/ArticleDetail'
import PageEngagementTracker from '@/components/analytics/PageEngagementTracker'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllPostSlugs().catch(() => [])
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post: Post | null = await getPostBySlug(slug).catch(() => null)
  if (!post) return {}
  const title = stripBrand(post.seo?.metaTitle) || post.title
  const description = post.seo?.metaDescription || post.excerpt
  return {
    title,
    description,
    alternates: { canonical: canonicalPath(`/blog/${slug}`) },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalPath(`/blog/${slug}`),
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
      siteName: 'Just Acoustics',
      locale: 'en_SG',
      images: [{ url: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : SITE_PREVIEW_IMAGE, width: 1200, height: 630 }],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, allPosts]: [Post | null, Post[]] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getAllPosts().catch(() => [] as Post[]),
  ])
  if (!post) notFound()

  const article = toArticleView(post)
  const listed = (Array.isArray(allPosts) ? allPosts : []).filter((p) => p?.slug?.current).map(toExplorerPost)
  const nav = buildArticleNav(listed, slug, post.category)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post.mainImage && { image: urlFor(post.mainImage).width(1200).height(630).url() }),
    articleSection: article.topicLabel,
    inLanguage: 'en-SG',
    timeRequired: `PT${article.readingTime}M`,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalPath(`/blog/${slug}`) },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Resource Centre', item: canonicalPath('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalPath(`/blog/${slug}`) },
    ],
  }

  return (
    <>
      <PageEngagementTracker pageType="blog" contentName={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <ArticleDetail article={article} nav={nav} />
    </>
  )
}
