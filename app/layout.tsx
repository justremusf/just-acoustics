import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Instrument_Sans, Manrope, League_Spartan } from 'next/font/google'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import AttributionProvider from '@/components/analytics/AttributionProvider'
import CookieConsentBanner from '@/components/analytics/CookieConsentBanner'
import GaPageViewTracker from '@/components/analytics/GaPageViewTracker'
import HapticProvider from '@/components/providers/HapticProvider'
import { SITE_LOGO_URL, SITE_URL } from '@/lib/seo'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  variable: '--font-spartan',
  weight: ['800'],
  display: 'swap',
})

const SITE_PREVIEW_IMAGE =
  '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Just Acoustics | Acoustic Panels Singapore | Echo Control',
    template: '%s | Just Acoustics',
  },
  description:
    'Acoustic Solutions for Offices, Restaurants, Churches and more in Singapore. Expert echo control, noise reduction and acoustic panel installation.',
  keywords: ['acoustic panels', 'soundproofing', 'echo control', 'Singapore', 'office acoustics'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: SITE_URL,
    siteName: 'Just Acoustics',
    images: [
      {
        url: SITE_PREVIEW_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Just Acoustics — Acoustic Panels Singapore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: SITE_PREVIEW_IMAGE,
        alt: 'Just Acoustics — Acoustic Panels Singapore',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const hasTracking = Boolean(gaId || googleAdsId || metaPixelId)
  const gtagId = gaId || googleAdsId

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${manrope.variable} ${leagueSpartan.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="bg-white">
        <HapticProvider>
          {hasTracking && (
            <>
              {gtagId && (
                <>
                  <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
                    strategy="lazyOnload"
                  />
                  <Script id="gtag-init" strategy="lazyOnload">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      window.gtag = gtag;
                      gtag('consent', 'default', {
                        analytics_storage: 'denied',
                        ad_storage: 'denied',
                        ad_user_data: 'denied',
                        ad_personalization: 'denied',
                        wait_for_update: 500
                      });
                      if (document.cookie.split('; ').includes('ja_analytics_consent=granted')) {
                        gtag('consent', 'update', {
                          analytics_storage: 'granted',
                          ad_storage: 'granted',
                          ad_user_data: 'granted',
                          ad_personalization: 'granted'
                        });
                      }
                      gtag('js', new Date());
                      ${gaId ? `gtag('config', '${gaId}');` : ''}
                      ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ''}
                    `}
                  </Script>
                </>
              )}
              {metaPixelId && (
                <>
                  <Script id="meta-pixel-base" strategy="lazyOnload">
                    {`
                      !function(f,b,e,v,n,t,s)
                      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                      n.queue=[];t=b.createElement(e);t.async=!0;
                      t.src=v;s=b.getElementsByTagName(e)[0];
                      s.parentNode.insertBefore(t,s)}(window, document,'script',
                      'https://connect.facebook.net/en_US/fbevents.js');
                      fbq('init', '${metaPixelId}');
                      fbq('track', 'PageView');
                    `}
                  </Script>
                  <noscript>
                    <img
                      height="1"
                      width="1"
                      style={{ display: 'none' }}
                      src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                      alt=""
                    />
                  </noscript>
                </>
              )}
              {gaId && (
                <Suspense fallback={null}>
                  <GaPageViewTracker gaId={gaId} />
                </Suspense>
              )}
            </>
          )}
          <Suspense fallback={null}>
            <AttributionProvider />
          </Suspense>
          <CookieConsentBanner />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': ['Organization', 'LocalBusiness'],
                name: 'Just Acoustics',
                url: SITE_URL,
                logo: SITE_LOGO_URL,
                description:
                  'Acoustic panel supply and installation for offices, restaurants, churches, studios, and more in Singapore.',
                telephone: '+65 8930 1905',
                email: 'info@justacoustics.co',
                priceRange: '$$',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'SG',
                  addressRegion: 'Singapore',
                  addressLocality: 'Singapore',
                },
                areaServed: { '@type': 'Country', name: 'Singapore' },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  telephone: '+65 8930 1905',
                  email: 'info@justacoustics.co',
                  availableLanguage: 'English',
                },
                sameAs: [
                  'https://www.instagram.com/justacoustics',
                  'https://www.facebook.com/justacoustics',
                ],
              }),
            }}
          />
          {children}
          <SpeedInsights />
          <Analytics />
        </HapticProvider>
      </body>
    </html>
  )
}
