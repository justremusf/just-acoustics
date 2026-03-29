import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  robots: { index: false },
}

export default function CookiePolicyPage() {
  return (
    <div className="max-w-[740px] mx-auto px-5 py-20">
      <h1
        className="text-[var(--color-dark-100)] m-0 mb-8"
        style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 500 }}
      >
        Cookie Policy
      </h1>
      <p className="text-[var(--color-gray-200)] text-sm mb-10">Last updated: March 2025</p>

      <div className="prose prose-base max-w-none text-[var(--color-gray-100)] leading-relaxed [&_h2]:text-[var(--color-dark-100)] [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4">
        <h2>What are cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and understand how you use it.</p>

        <h2>Cookies we use</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-white-300)]">
              <th className="text-left py-3 pr-4 font-semibold text-[var(--color-dark-100)]">Cookie</th>
              <th className="text-left py-3 pr-4 font-semibold text-[var(--color-dark-100)]">Purpose</th>
              <th className="text-left py-3 font-semibold text-[var(--color-dark-100)]">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-white-300)]">
              <td className="py-3 pr-4">_ga, _ga_*</td>
              <td className="py-3 pr-4">Google Analytics — anonymous usage tracking</td>
              <td className="py-3">2 years</td>
            </tr>
            <tr className="border-b border-[var(--color-white-300)]">
              <td className="py-3 pr-4">_gid</td>
              <td className="py-3 pr-4">Google Analytics — distinguishes users</td>
              <td className="py-3">24 hours</td>
            </tr>
          </tbody>
        </table>

        <h2>Managing cookies</h2>
        <p>You can control cookies through your browser settings. Disabling analytics cookies will not affect your ability to use this website.</p>

        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:info@justacoustics.co" className="text-[var(--color-brand-orange)]">info@justacoustics.co</a>.</p>
      </div>
    </div>
  )
}
