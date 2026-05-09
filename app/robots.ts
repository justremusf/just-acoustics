import { MetadataRoute } from 'next'
import { canonicalPath } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/'],
      },
    ],
    sitemap: canonicalPath('/sitemap.xml'),
  }
}
