import Link from 'next/link'
import Image from 'next/image'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const projectCategories = [
  { label: 'Restaurants', href: '/projects?category=restaurants' },
  { label: 'Office Spaces', href: '/projects?category=office-spaces' },
  { label: 'Schools', href: '/projects?category=schools' },
  { label: 'Studios & Homes', href: '/projects?category=studios-homes' },
  { label: 'Churches', href: '/projects?category=churches' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark-100)] pt-20 pb-6">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16 pb-8 border-b border-[var(--color-gray-100)]">
          {/* Left col */}
          <div>
            <Link href="/">
              <Image
                src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696374f75670859d95904082_Just%20Acoustics%201600x900.svg"
                alt="Just Acoustics"
                width={160}
                height={36}
                style={{ filter: 'invert(1)' }}
              />
            </Link>
            <p className="text-[var(--color-gray-300)] text-sm mt-4 max-w-xs leading-relaxed">
              Acoustic Solutions for Offices, Restaurants, Churches & more in Singapore.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://wa.me/6589301905"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="mailto:info@justacoustics.co"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right col */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Pages</h4>
              <ul className="list-none m-0 p-0">
                {footerLinks.map((link) => (
                  <li key={link.href} className="mb-4 pb-4 border-b border-[var(--color-gray-500)]">
                    <Link
                      href={link.href}
                      className="text-white text-sm no-underline hover:text-[var(--color-white-300)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">Projects</h4>
              <ul className="list-none m-0 p-0">
                {projectCategories.map((link) => (
                  <li key={link.href} className="mb-4 pb-4 border-b border-[var(--color-gray-500)]">
                    <Link
                      href={link.href}
                      className="text-white text-sm no-underline hover:text-[var(--color-white-300)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-gray-300)] text-sm m-0 text-center md:text-left">
            © {new Date().getFullYear()} Just Acoustics. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--color-gray-300)] text-sm no-underline hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
