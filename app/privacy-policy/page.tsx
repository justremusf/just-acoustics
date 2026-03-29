import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Just Acoustics — how we collect, use and protect your personal data.',
  robots: { index: false },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[740px] mx-auto px-5 py-20">
      <h1
        className="text-[var(--color-dark-100)] m-0 mb-8"
        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 500 }}
      >
        Privacy Policy
      </h1>
      <p className="text-[var(--color-gray-200)] text-sm mb-10">Last updated: March 2025</p>

      <div className="prose prose-base max-w-none text-[var(--color-gray-100)] leading-relaxed [&_h2]:text-[var(--color-dark-100)] [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4">
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
        <p>We also collect anonymised usage data via Google Analytics (page views, session duration) to improve our website.</p>

        <h2>2. How We Use Your Data</h2>
        <ul>
          <li>To respond to your enquiry and provide consultation</li>
          <li>To send you a project proposal or quote</li>
          <li>To contact you regarding your acoustic treatment project</li>
          <li>To send marketing communications (only with your consent)</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>We do not sell your personal data. We may share data with trusted service providers (e.g. email delivery services) strictly for the purpose of fulfilling your request.</p>

        <h2>4. Data Retention</h2>
        <p>We retain your data for as long as necessary to fulfil the purposes above, or as required by law.</p>

        <h2>5. Your Rights</h2>
        <p>Under the PDPA, you have the right to:</p>
        <ul>
          <li>Access your personal data held by us</li>
          <li>Correct inaccurate personal data</li>
          <li>Withdraw consent for marketing communications at any time</li>
        </ul>
        <p>To exercise these rights, email us at <a href="mailto:info@justacoustics.co" className="text-[var(--color-brand-orange)]">info@justacoustics.co</a>.</p>

        <h2>6. Cookies</h2>
        <p>We use cookies for analytics purposes. See our <a href="/cookie-policy" className="text-[var(--color-brand-orange)]">Cookie Policy</a> for details.</p>

        <h2>7. Contact</h2>
        <p>
          For privacy-related queries, contact our Data Protection Officer at{' '}
          <a href="mailto:info@justacoustics.co" className="text-[var(--color-brand-orange)]">info@justacoustics.co</a>.
        </p>
      </div>
    </div>
  )
}
