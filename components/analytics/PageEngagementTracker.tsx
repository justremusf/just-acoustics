'use client'

import { useEffect } from 'react'
import { trackFirstPartyEvent } from '@/lib/insights/client'

type PageEngagementTrackerProps = {
  pageType: 'blog' | 'pricing' | 'landing_page'
  contentName?: string
}

function scrollPercent() {
  const available = document.documentElement.scrollHeight - window.innerHeight
  return available <= 0 ? 100 : Math.round((window.scrollY / available) * 100)
}

export default function PageEngagementTracker({ pageType, contentName }: PageEngagementTrackerProps) {
  useEffect(() => {
    const context = { page_type: pageType, ...(contentName ? { content_name: contentName } : {}) }
    const sent = new Set<string>()
    const emit = (eventName: string, properties = {}) => {
      if (sent.has(eventName)) return
      sent.add(eventName)
      trackFirstPartyEvent(eventName, { ...context, ...properties })
    }

    trackFirstPartyEvent(pageType === 'blog' ? 'blog_view' : pageType === 'pricing' ? 'pricing_view' : 'landing_page_view', context)

    const onScroll = () => {
      const depth = scrollPercent()
      if (depth >= 50) emit('page_engaged', { scroll_depth: 50 })
      if (depth >= 90) emit('page_deep_read', { scroll_depth: 90 })
    }
    const readTimer = window.setTimeout(() => emit('page_engaged', { engaged_seconds: 45 }), 45_000)
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-insight-cta]')
      if (!target) return
      trackFirstPartyEvent('page_cta_clicked', {
        ...context,
        cta_name: target.dataset.insightCta || 'unspecified',
        cta_destination: target instanceof HTMLAnchorElement ? target.pathname : null,
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick)
    onScroll()
    return () => {
      window.clearTimeout(readTimer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick)
    }
  }, [contentName, pageType])

  return null
}
