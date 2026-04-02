import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Just Acoustics — how we collect, use and protect your personal data.',
  robots: { index: false },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="page-wrap page-stack max-w-[940px]">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Legal</span>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-subtitle">Last updated: March 2025</p>
      </section>

      <section className="home-shell page-hero-shell">
        <div className="rich-content max-w-none">
          <p>
            Just Acoustics (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data in accordance with Singapore&apos;s <strong>Personal Data Protection Act 2012 (PDPA)</strong>.
          </p>
          <h2>1. Data We Collect</h2>
          <p>When you contact us or submit an enquiry form, we may collect:</p>
          <ul>
            <li>Name, email address, phone number</li>
            <li>Information about your space and acoustic needs</li>
            <li>Photos or files you choose to share with us</li>
          </ul>
          <p>We also collect anonymised usage data via Google Analytics to improve the website.</p>
          <h2>2. How We Use Your Data</h2>
          <ul>
            <li>To respond to your enquiry and provide consultation</li>
            <li>To send you a project proposal or quote</li>
            <li>To contact you regarding your acoustic treatment project</li>
            <li>To send marketing communications, only with your consent</li>
          </ul>
          <h2>3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with trusted service providers strictly for the purpose of fulfilling your request.</p>
          <h2>4. Data Retention</h2>
          <p>We retain your data for as long as necessary to fulfil the purposes above, or as required by law.</p>
          <h2>5. Your Rights</h2>
          <p>Under the PDPA, you have the right to access your personal data, correct inaccurate personal data, and withdraw consent for marketing communications at any time.</p>
          <p>To exercise these rights, email <a href="mailto:info@justacoustics.co">info@justacoustics.co</a>.</p>
          <h2>6. Cookies</h2>
          <p>We use cookies for analytics purposes. See our <Link href="/cookie-policy">Cookie Policy</Link> for details.</p>
          <h2>7. Contact</h2>
          <p>For privacy-related queries, contact our Data Protection Officer at <a href="mailto:info@justacoustics.co">info@justacoustics.co</a>.</p>
        </div>
      </section>
    </div>
  )
}
