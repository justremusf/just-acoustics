import type { NextConfig } from 'next'

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://va.vercel-scripts.com https://vercel.live https://tally.so",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://pagead2.googlesyndication.com https://www.facebook.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com https://va.vercel-scripts.com https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://www.facebook.com https://connect.facebook.net https://cdn.sanity.io https://*.api.sanity.io https://tally.so",
      "frame-src 'self' https://tally.so https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'self'",
      "form-action 'self' https://tally.so",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
]

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: process.cwd(),
  // ESLint runs explicitly via `npm run check`; avoid Next 15's legacy ESLint bridge.
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Retired test landing pages.
      { source: '/studio-lander', destination: '/spaces/studios', permanent: true },
      { source: '/studio-landing-page', destination: '/spaces/studios', permanent: true },
      // Blog consolidation (Oct 2026): overlapping articles merged into their stronger twin.
      { source: '/blog/acoustic-treatment-houses-of-worship-singapore', destination: '/blog/church-acoustic-treatment-singapore', permanent: true },
      { source: '/blog/acoustic-treatment-church-singapore', destination: '/blog/church-acoustic-treatment-singapore', permanent: true },
      { source: '/blog/echo-problem-vs-soundproofing-problem', destination: '/blog/acoustic-treatment-vs-soundproofing-singapore', permanent: true },
      { source: '/blog/why-singapore-restaurants-need-acoustic-treatment', destination: '/blog/acoustic-treatment-for-restaurants-singapore', permanent: true },
      { source: '/blog/how-much-acoustic-treatment-does-a-restaurant-usually-need', destination: '/blog/restaurant-acoustic-panel-cost-singapore', permanent: true },
      { source: '/blog/how-acoustic-panels-improve-office-productivity', destination: '/blog/acoustic-treatment-for-offices-singapore', permanent: true },
      { source: '/blog/what-to-prepare-before-an-acoustic-site-visit', destination: '/blog/what-happens-during-acoustic-site-visit', permanent: true },
      { source: '/blog/why-cheap-acoustic-foam-disappoints', destination: '/blog/acoustic-foam-vs-acoustic-panels-singapore', permanent: true },
      { source: '/blog/rental-home-acoustic-panels-no-drilling', destination: '/blog/acoustic-panels-without-drilling-singapore', permanent: true },
      { source: '/blog/what-acoustic-panels-actually-do-before-you-buy-them', destination: '/blog/do-acoustic-panels-really-work', permanent: true },
      { source: '/blog/video-call-room-acoustic-treatment-singapore', destination: '/blog/room-too-echoey-for-video-calls', permanent: true },
      { source: '/blog/acoustic-panel-colours-for-home-office-studio', destination: '/blog/choose-acoustic-panel-colours-office-studio-cafe', permanent: true },
      { source: '/blog/wall-panels-vs-ceiling-panels-studio-acoustic-treatment', destination: '/blog/ceiling-panels-vs-wall-panels-acoustic-treatment-singapore', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [62, 70, 72, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [320, 393, 640, 768, 1024, 1280, 1536, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
