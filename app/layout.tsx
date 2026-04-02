import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Manrope, League_Spartan } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
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
  metadataBase: new URL('https://justacoustics.co'),
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://justacoustics.co',
    siteName: 'Just Acoustics',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Just Acoustics — Acoustic Panels Singapore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${manrope.variable} ${leagueSpartan.variable}`}>
      <body className="bg-white">
        <div className="min-h-screen overflow-x-clip">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <SpeedInsights />
        <Analytics />
        <WhatsAppButton />
      </body>
    </html>
  )
}
