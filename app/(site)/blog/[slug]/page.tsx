import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getAllPostSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { toArticleView, toExplorerPost } from '@/sanity/lib/views'
import { absoluteUrl, breadcrumbJsonLd as buildBreadcrumbJsonLd, canonicalPath, ORGANIZATION_ID, pageMetadata, serializeJsonLd, SITE_PREVIEW_IMAGE, SITE_URL, stripBrand } from '@/lib/seo'
import { serviceForArticle } from '@/lib/serviceLinks'
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
  return pageMetadata({
    title: stripBrand(post.seo?.metaTitle) || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/blog/${slug}`,
    image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined,
    imageAlt: post.mainImage?.alt || post.title,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
  })
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
  const author = post.author?.name ? post.author : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...((post._updatedAt || post.publishedAt) && { dateModified: post._updatedAt || post.publishedAt }),
    image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : absoluteUrl(SITE_PREVIEW_IMAGE),
    articleSection: article.topicLabel,
    inLanguage: 'en-SG',
    timeRequired: `PT${article.readingTime}M`,
    author: author
      ? { '@type': 'Person', name: author.name, ...(author.role && { jobTitle: author.role }), worksFor: { '@id': ORGANIZATION_ID } }
      : { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalPath(`/blog/${slug}`) },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Resource Centre', path: '/blog' },
    { name: post.title, path: `/blog/${slug}` },
  ])

  const serviceLink = serviceForArticle(slug, post.category)

  return (
    <>
      <PageEngagementTracker pageType="blog" contentName={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <ArticleDetail article={article} nav={nav} serviceLink={serviceLink} />
    </>
  )
}
