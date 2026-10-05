import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Instrument_Sans, Manrope } from 'next/font/google'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import AttributionProvider from '@/components/analytics/AttributionProvider'
import ClarityAnalytics from '@/components/analytics/ClarityAnalytics'
import CookieConsentBanner from '@/components/analytics/CookieConsentBanner'
import FirstPartyInsights from '@/components/analytics/FirstPartyInsights'
import HapticProvider from '@/components/providers/HapticProvider'
import { serializeJsonLd, SITE_LOGO_URL, SITE_PREVIEW_IMAGE, SITE_URL } from '@/lib/seo'
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

// Decides, before any tag fires, whether ad cookies are allowed: an explicit choice wins; otherwise
// they are on outside opt-in regions (see middleware.ts) and off inside them.
const CONSENT_SNIPPET = `
  (function () {
    function readCookie(name) {
      var match = document.cookie.split('; ').find(function (item) { return item.indexOf(name + '=') === 0; });
      return match ? match.split('=')[1] : '';
    }
    var choice = readCookie('ja_analytics_consent');
    var strict = readCookie('ja_consent_region') === 'strict';
    window.__jaAdsAllowed = choice === 'all' || choice === 'granted' || (!strict && choice !== 'analytics_only' && choice !== 'denied');
  })();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
  const hasTracking = Boolean(gaId || googleAdsId || metaPixelId)
  const gtagId = gaId || googleAdsId

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body suppressHydrationWarning className="bg-white">
        <HapticProvider>
          {hasTracking && (
            <>
              {gtagId && (
                <>
                  <Script id="gtag-init" strategy="beforeInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      window.gtag = gtag;
                      ${CONSENT_SNIPPET}
                      var adConsent = window.__jaAdsAllowed ? 'granted' : 'denied';
                      gtag('consent', 'default', {
                        analytics_storage: 'granted',
                        ad_storage: adConsent,
                        ad_user_data: adConsent,
                        ad_personalization: adConsent,
                        wait_for_update: 500
                      });
                      gtag('js', new Date());
                      ${gaId ? `gtag('config', '${gaId}');` : ''}
                      ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ''}
                    `}
                  </Script>
                  <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
                    strategy="afterInteractive"
                  />
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
                      ${CONSENT_SNIPPET}
                      if (!window.__jaAdsAllowed) fbq('consent', 'revoke');
                      fbq('init', '${metaPixelId}');
                      fbq('track', 'PageView');
                    `}
                  </Script>
                </>
              )}
            </>
          )}
          <Suspense fallback={null}>
            <AttributionProvider />
          </Suspense>
          <ClarityAnalytics projectId={clarityProjectId} />
          <Suspense fallback={null}>
            <FirstPartyInsights />
          </Suspense>
          <CookieConsentBanner />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': ['Organization', 'LocalBusiness'],
                    '@id': `${SITE_URL}/#organization`,
                    name: 'Just Acoustics',
                    url: SITE_URL,
                    logo: SITE_LOGO_URL,
                    image: `${SITE_URL}${SITE_PREVIEW_IMAGE}`,
                    foundingDate: '2022',
                    description:
                      'Singapore acoustic treatment specialist supplying and installing acoustic panels for offices, restaurants, churches, schools, studios, gyms, cinemas, and homes.',
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
                    knowsAbout: [
                      'Acoustic treatment',
                      'Acoustic panels',
                      'Echo reduction',
                      'Speech clarity',
                      'Room acoustics',
                    ],
                    contactPoint: {
                      '@type': 'ContactPoint',
                      contactType: 'customer service',
                      telephone: '+65 8930 1905',
                      email: 'info@justacoustics.co',
                      availableLanguage: 'English',
                    },
                    sameAs: [
                      'https://www.instagram.com/just.acoustics/',
                      'https://www.facebook.com/profile.php?id=61550947084275',
                      'https://www.youtube.com/@JustAcoustics',
                    ],
                  },
                  {
                    '@type': 'WebSite',
                    '@id': `${SITE_URL}/#website`,
                    url: SITE_URL,
                    name: 'Just Acoustics',
                    inLanguage: 'en-SG',
                    publisher: { '@id': `${SITE_URL}/#organization` },
                  },
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
