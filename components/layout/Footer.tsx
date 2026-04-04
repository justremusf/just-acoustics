import Link from 'next/link'

const navGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Products', href: '/products' },
      { label: 'Services', href: '/services' },
      { label: 'Acoustic Education', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-of-service' },
    ],
  },
]

const socialLinks = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@JustAcoustics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.016 3.016 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/just.acoustics/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61550947084275',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

const contactLinks = [
  {
    label: 'WhatsApp / Hotline',
    value: '+65 8930 1905',
    href: 'https://wa.me/6589301905',
  },
  {
    label: 'Email',
    value: 'info@justacoustics.co',
    href: 'mailto:info@justacoustics.co',
  },
]

export default function Footer() {
  return (
    <footer className="relative pt-10 pb-8 md:pt-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-12 h-48 w-48 rounded-full bg-[rgba(255,165,0,0.12)] blur-[90px]" />
        <div className="absolute right-[10%] bottom-8 h-52 w-52 rounded-full bg-[rgba(255,245,224,0.9)] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-5">
        <div className="overflow-hidden rounded-[34px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,242,236,0.96))] shadow-[0_28px_90px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.88)_inset]">
          <div className="grid gap-4 p-3 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:p-4">
            <div className="relative overflow-hidden rounded-[30px] border border-black/8 bg-[linear-gradient(180deg,#ffb62d,#ffa500_52%,#f09b00)] p-5 shadow-[0_26px_70px_rgba(255,165,0,0.28)] sm:p-6">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-10%] top-[-8%] h-40 w-40 rounded-full bg-white/22 blur-[60px]" />
                <div className="absolute right-[-8%] bottom-[-12%] h-48 w-48 rounded-full bg-[rgba(0,0,0,0.08)] blur-[80px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-white/28" />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <div className="space-y-4">
                  <div className="max-w-[271px]">
                    <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
                      Connect with us
                    </p>
                    <h2
                      className="mt-3 mb-0 text-white"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(26px, 3vw, 38px)',
                        lineHeight: '1',
                        fontWeight: 500,
                        letterSpacing: '-1.1px',
                      }}
                    >
                      Let&apos;s Reduce Noise Together
                    </h2>
                  </div>
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                  {contactLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="rounded-[16px] border border-white/24 bg-white/18 px-4 py-2.5 text-white no-underline shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/24"
                    >
                      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/72">
                        {item.label}
                      </p>
                      <p
                        className="mt-2 mb-0"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(16px, 1.6vw, 20px)',
                          lineHeight: '1.05',
                          letterSpacing: '-0.6px',
                        }}
                      >
                        {item.value}
                      </p>
                    </a>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/contact"
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[100px] bg-white px-6 py-4 text-[14px] font-semibold text-[var(--color-dark-100)] no-underline shadow-[0_18px_36px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/92 sm:w-auto"
                  >
                    Free Consultation
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[var(--color-dark-100)] shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/92"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-black/6 bg-white/58 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.82)_inset] sm:p-6 md:p-7">
              <div className="flex h-full flex-col gap-5">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
                  {navGroups.map((group) => (
                    <div key={group.title}>
                      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-200)]">
                        {group.title}
                      </p>
                      <div className="mt-4 flex flex-col gap-4">
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-dark-100)] no-underline transition-colors hover:text-[var(--color-brand-orange)]"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col gap-2 px-1 text-sm text-[var(--color-gray-100)] md:flex-row md:items-start md:justify-between"
          style={{ marginTop: '40px' }}
        >
          <p className="m-0">Just Acoustics © {new Date().getFullYear()} — All rights reserved</p>
          <p className="m-0 text-[var(--color-gray-200)]">
            Acoustic panels, echo control, and sound treatment across Singapore.
          </p>
        </div>
      </div>
    </footer>
  )
}
