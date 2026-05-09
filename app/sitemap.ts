import { MetadataRoute } from 'next'
import { getAllPostSlugs, getAllProductSlugs, getAllServiceSlugs, getAllProjectSlugs } from '@/sanity/lib/queries'
import { SITE_URL } from '@/lib/seo'

const BASE_URL = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, productSlugs, serviceSlugs, projectSlugs] = await Promise.all([
    getAllPostSlugs().catch(() => []),
    getAllProductSlugs().catch(() => []),
    getAllServiceSlugs().catch(() => []),
    getAllProjectSlugs().catch(() => []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const posts = postSlugs.map((s: { slug: string }) => ({
    url: `${BASE_URL}/blog/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const products = productSlugs.map((s: { slug: string }) => ({
    url: `${BASE_URL}/products/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const services = serviceSlugs.map((s: { slug: string }) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const projects = projectSlugs.map((s: { slug: string }) => ({
    url: `${BASE_URL}/projects/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...posts, ...products, ...services, ...projects]
}
