'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { recordPageView } from '@/lib/whatsappContext'

/** Remembers (this session only) which space types the visitor looks at, for WhatsApp prefill. */
export default function BrowsingContextTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) recordPageView(pathname)
  }, [pathname])

  return null
}
