'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative z-[9999] pt-[26px]">
      <div className="flex justify-center px-4">
        <div
          className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-[40px] py-2 pl-6 pr-2 w-full max-w-[860px] border border-white/60"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset' }}
        >
          {/* Logo */}
          <Link href="/" className="block transition-all duration-300 hover:scale-105 hover:opacity-80">
            <Image
              src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69635d202eb00a587d5f2386_Just%20Acoustics%201600x900%20(1).svg"
              alt="Just Acoustics"
              width={180}
              height={40}
              className="w-[140px] md:w-[180px]"
              style={{ height: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-gray-100)] text-[15px] no-underline transition-all duration-300 hover:text-[var(--color-dark-100)] hover:tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/contact"
              className="bg-[var(--color-brand-orange)] text-white rounded-[100px] px-6 py-3 text-[15px] no-underline transition-all duration-300 hover:bg-[var(--color-gray-100)] hover:tracking-wide"
            >
              Free Consultation
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 cursor-pointer bg-transparent border-0"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect y="4" width="24" height="2" rx="1" fill="#4a4a4a" />
              <rect y="11" width="24" height="2" rx="1" fill="#4a4a4a" />
              <rect y="18" width="24" height="2" rx="1" fill="#4a4a4a" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile offcanvas */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99999] bg-[var(--color-dark-100)] flex flex-col justify-center items-center">
          <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image
                src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696374f75670859d95904082_Just%20Acoustics%201600x900.svg"
                alt="Just Acoustics"
                width={140}
                height={32}
                style={{ filter: 'invert(1)' }}
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="cursor-pointer bg-transparent border-0"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <ul className="list-none m-0 p-0 text-center w-full px-8">
            {[{ label: 'Home', href: '/' }, ...navLinks, { label: 'Contact', href: '/contact' }].map((link) => (
              <li key={link.href} className="mb-4">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--color-gray-300)] text-[44px] sm:text-[56px] leading-[1.12] no-underline transition-colors duration-300 hover:text-white block py-2"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="inline-block bg-[var(--color-brand-orange)] text-white rounded-[100px] px-8 py-4 text-base no-underline"
            >
              Free Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
