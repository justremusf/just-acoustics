import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark-100)] pt-16 md:pt-20">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left col */}
          <div>
            <h2
              className="text-white m-0 mb-10"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(36px, 5vw, 60px)',
                fontWeight: 500,
                lineHeight: '112%',
                letterSpacing: '-1.2px',
              }}
            >
              Let&apos;s Reduce<br />Noise Together
            </h2>

            {/* Social media row */}
            <div className="flex items-center gap-5 py-5 border-t border-white/15">
              <span className="text-white/50 text-sm w-48 shrink-0">Social media</span>
              <div className="flex items-center gap-3">
                <a href="https://x.com/justacoustics" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/25 text-white hover:border-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://linkedin.com/company/justacoustics" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/25 text-white hover:border-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://instagram.com/justacoustics" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/25 text-white hover:border-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="https://facebook.com/justacoustics" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/25 text-white hover:border-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Email row */}
            <div className="flex items-center gap-5 py-5 border-t border-white/15">
              <span className="text-white/50 text-sm w-48 shrink-0">Email</span>
              <a href="mailto:info@justacoustics.co" className="text-white text-sm no-underline hover:text-white/70 transition-colors">
                info@justacoustics.co
              </a>
            </div>

            {/* Hotline / WhatsApp row */}
            <div className="flex items-center gap-5 py-5 border-t border-b border-white/15">
              <span className="text-white/50 text-sm w-48 shrink-0">Hotline / Whatsapp</span>
              <a href="https://wa.me/6589301905" target="_blank" rel="noopener noreferrer"
                className="text-white text-sm no-underline hover:text-white/70 transition-colors">
                +65 8930 1905
              </a>
            </div>
          </div>

          {/* Right col — nav links */}
          <div className="pt-0 md:pt-4">
            <ul className="list-none m-0 p-0 border-t border-white/15">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-white/15">
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-5 text-white no-underline hover:text-white/60 transition-colors group"
                    style={{ fontSize: 'clamp(15px, 1.5vw, 17px)' }}
                  >
                    {link.label}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path
                        d="M3 15L15 3M15 3H7M15 3V11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="border-t border-white/15 mt-12 md:mt-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm m-0">
            Just Acoustics © {new Date().getFullYear()} – All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-white/40 text-sm no-underline hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-white/40 text-sm no-underline hover:text-white/70 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
