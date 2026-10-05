import { MetadataRoute } from 'next'
import { getAllPostSlugs, getAllShopItemSlugs, getAllSpaceSlugs, getAllProjectSlugs } from '@/sanity/lib/queries'
import { SITE_URL } from '@/lib/seo'

const BASE_URL = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, productSlugs, spaceSlugs, projectSlugs] = await Promise.all([
    getAllPostSlugs().catch(() => []),
    getAllShopItemSlugs().catch(() => []),
    getAllSpaceSlugs().catch(() => []),
    getAllProjectSlugs().catch(() => []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/spaces`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/shop`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    // High-intent evergreen landing pages are intentionally listed alongside
    // CMS routes so Google can discover their canonical URLs directly.
    { url: `${BASE_URL}/acoustic-panels-singapore`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/office-acoustic-treatment`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/restaurant-echo-reduction`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/church-acoustics`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/school-acoustic-treatment`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/acoustic-panel-calculator`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const posts = postSlugs.map((s: { slug: string; _updatedAt?: string }) => ({
    url: `${BASE_URL}/blog/${s.slug}`,
    lastModified: s._updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const products = productSlugs.map((s: { slug: string; _updatedAt?: string }) => ({
    url: `${BASE_URL}/shop/${s.slug}`,
    lastModified: s._updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const spaces = spaceSlugs.map((s: { slug: string; _updatedAt?: string }) => ({
    url: `${BASE_URL}/spaces/${s.slug}`,
    lastModified: s._updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const projects = projectSlugs.map((s: { slug: string; _updatedAt?: string }) => ({
    url: `${BASE_URL}/projects/${s.slug}`,
    lastModified: s._updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...posts, ...products, ...spaces, ...projects]
}
