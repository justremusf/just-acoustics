import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import LeadConversionTracker from '@/components/analytics/LeadConversionTracker'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for contacting the Just Acoustics trade desk.',
  robots: { index: false, follow: false },
}

export default function TradeThankYouPage() {
  return (
    <div className="page-wrap page-stack">
      <LeadConversionTracker />
      <section className="home-shell page-hero-shell flex flex-col items-center gap-4 text-center md:!py-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-[var(--color-dark-100)]">
          <Check size={24} aria-hidden="true" />
        </span>
        <h1 className="page-title max-w-[18ch] text-center">Got it. We will be in touch.</h1>
        <p className="page-subtitle m-0 max-w-[48ch] text-center">Your request has reached our trade desk. In the meantime, the spec sheets and CAD blocks are free to download.</p>
        <Link href="/trade#downloads" className="page-link">Spec sheets and CAD blocks <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </section>
    </div>
  )
}
