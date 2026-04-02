import type { Metadata } from 'next'

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
        <p className="page-subtitle">Last updated: March 2025</p>
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
            </tbody>
          </table>
          <h2>Managing cookies</h2>
          <p>You can control cookies through your browser settings. Disabling analytics cookies will not affect your ability to use this website.</p>
          <h2>Contact</h2>
          <p>Questions? Email <a href="mailto:info@justacoustics.co">info@justacoustics.co</a>.</p>
        </div>
      </section>
    </div>
  )
}
