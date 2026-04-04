import type { Metadata } from 'next'
import TrackedAnchor from '@/components/analytics/TrackedAnchor'

export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false },
}

export default function TermsPage() {
  return (
    <div className="page-wrap page-stack max-w-[940px]">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Legal</span>
        <h1 className="page-title">Terms of Service</h1>
        <p className="page-subtitle">Last updated: March 2025</p>
      </section>

      <section className="home-shell page-hero-shell">
        <div className="rich-content max-w-none">
          <h2>1. Use of Website</h2>
          <p>By accessing justacoustics.co, you agree to these Terms. The website is provided for informational purposes about our acoustic services.</p>
          <h2>2. Services</h2>
          <p>Just Acoustics provides acoustic panel supply and installation services in Singapore. All service agreements are governed by separate quotation and project contracts.</p>
          <h2>3. Intellectual Property</h2>
          <p>All content on this website, including text, images, and logos, is owned by Just Acoustics or used with permission. You may not reproduce or redistribute it without written permission.</p>
          <h2>4. Limitation of Liability</h2>
          <p>We make no warranties about the accuracy of information on this website. Just Acoustics shall not be liable for any indirect or consequential losses arising from the use of this website.</p>
          <h2>5. Links</h2>
          <p>We are not responsible for the content of external websites linked from this site.</p>
          <h2>6. Governing Law</h2>
          <p>These Terms are governed by the laws of Singapore.</p>
          <h2>7. Contact</h2>
          <p>For queries, email <TrackedAnchor href="mailto:info@justacoustics.co">info@justacoustics.co</TrackedAnchor>.</p>
        </div>
      </section>
    </div>
  )
}
