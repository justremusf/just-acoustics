import type { Metadata } from 'next'
import TrackedAnchor from '@/components/analytics/TrackedAnchor'
import CookieSettings from '@/components/analytics/CookieSettings'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  robots: { index: false },
}

export default function CookiePolicyPage() {
  return (
    <div className="page-wrap page-stack max-w-[940px]">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Legal</span>
        <h1 className="page-title">Cookie Policy</h1>
        <p className="page-subtitle">Last updated: 3 October 2026</p>
      </section>

      <section id="settings" className="scroll-mt-28">
        <CookieSettings />
      </section>

      <section className="home-shell page-hero-shell">
        <div className="rich-content max-w-none">
          <h2>What are cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and understand how you use it.</p>
          <h2>Cookies we use</h2>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga, _ga_*</td>
                <td>Google Analytics, anonymous usage tracking</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google Analytics, distinguishes users</td>
                <td>24 hours</td>
              </tr>
              <tr>
                <td>_clck, _clsk</td>
                <td>Microsoft Clarity, anonymous heatmaps and session analytics</td>
                <td>Up to 1 year</td>
              </tr>
              <tr>
                <td>_gcl_*</td>
                <td>Google Ads, measures which ads lead to enquiries (advertising)</td>
                <td>90 days</td>
              </tr>
              <tr>
                <td>_fbp</td>
                <td>Meta (Facebook/Instagram) Pixel, measures ad performance (advertising)</td>
                <td>90 days</td>
              </tr>
              <tr>
                <td>ja_analytics_consent</td>
                <td>Remembers your cookie choice</td>
                <td>180 days</td>
              </tr>
              <tr>
                <td>ja_consent_region</td>
                <td>Remembers which cookie rules apply in your country</td>
                <td>30 days</td>
              </tr>
            </tbody>
          </table>
          <h2>Managing cookies</h2>
          <p>In Singapore and most countries, cookies are on by default and you can turn advertising cookies off at any time using the setting at the top of this page. In the EU, UK and Switzerland, advertising cookies are only used if you accept them.</p>
          <p>You can also control cookies through your browser settings. Turning cookies off will not affect your ability to use this website.</p>
          <h2>Contact</h2>
          <p>Questions? Email <TrackedAnchor href="mailto:info@justacoustics.co">info@justacoustics.co</TrackedAnchor>.</p>
        </div>
      </section>
    </div>
  )
}
