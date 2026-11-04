import { MetadataRoute } from 'next'
import { canonicalPath } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio$', '/studio/', '/api/'],
      },
      // Explicitly state access for AI search crawlers. The general rule above
      // already permits these paths, but named rules make this intent clear to
      // crawler operators and protect it from future blanket restrictions.
      ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'].map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/studio$', '/studio/', '/api/'],
      })),
    ],
    sitemap: canonicalPath('/sitemap.xml'),
  }
}
