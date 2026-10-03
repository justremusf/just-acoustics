'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import TrackedAnchor from '@/components/analytics/TrackedAnchor'

// Pages that already put the form or payment front and centre.
const HIDDEN_ON = ['/contact', '/checkout', '/thank-you', '/proposals']
// Ad landing pages keep visitors on the page: jump to their own form instead of /contact.
const LANDING_PAGES = ['/office-acoustic-treatment', '/restaurant-echo-reduction', '/acoustic-panels-singapore']

/**
 * Phone-only bar pinned to the bottom of the screen once the visitor scrolls past the first screenful,
 * so the next step is always one tap away. Hidden on desktop.
 */
export default function MobileActionBar() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const hidden = HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  useEffect(() => {
    if (hidden) return
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hidden, pathname])

  const shown = visible && !hidden

  // Let the floating WhatsApp button and cookie pill step aside while the bar is up.
  useEffect(() => {
    document.body.dataset.mobileBar = shown ? 'on' : 'off'
    return () => {
      delete document.body.dataset.mobileBar
    }
  }, [shown])

  if (hidden) return null

  const consultationHref = LANDING_PAGES.includes(pathname) ? '#consultation' : '/contact'

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-[90] border-t border-black/8 bg-white/95 px-3 pt-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 lg:hidden ${shown ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
      style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <Link
          href={consultationHref}
          tabIndex={shown ? 0 : -1}
          className="flex h-12 flex-1 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-[15px] font-semibold text-[var(--color-dark-100)] no-underline"
        >
          Free consultation
        </Link>
        <TrackedAnchor
          href="https://wa.me/6589301905"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={shown ? 0 : -1}
          className="flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white no-underline"
          style={{ backgroundColor: '#25D366' }}
        >
          WhatsApp
        </TrackedAnchor>
      </div>
    </div>
  )
}
