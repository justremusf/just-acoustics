'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import { markLeadTracked, wasSubmissionTracked } from '@/components/analytics/leadTrackingState'
import { trackEvent } from '@/components/analytics/trackEvent'
import { buildTallyUrlWithAttribution, captureAttribution } from '@/lib/tallyAttribution'

type TallyWindow = Window & {
  Tally?: {
    loadEmbeds?: () => void
  }
}

type TallySubmittedPayload = {
  id?: string
  formId?: string
  formName?: string
}

type TallyAttributionIframeProps = {
  baseUrl: string
  title: string
  className?: string
  style?: CSSProperties
}

export default function TallyAttributionIframe({
  baseUrl,
  title,
  className,
  style,
}: TallyAttributionIframeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()
  const [src, setSrc] = useState(baseUrl)

  const routeKey = useMemo(() => `${pathname}?${search}`, [pathname, search])

  useEffect(() => {
    captureAttribution()
    const nextSrc = buildTallyUrlWithAttribution(baseUrl)

    setSrc(nextSrc)

    window.requestAnimationFrame(() => {
      const tallyWindow = window as TallyWindow
      tallyWindow.Tally?.loadEmbeds?.()
    })
  }, [baseUrl, routeKey])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (typeof event.data !== 'string' || !event.data.includes('Tally.FormSubmitted')) return

      if (event.origin !== 'https://tally.so') return

      try {
        const parsed = JSON.parse(event.data) as {
          event?: string
          payload?: TallySubmittedPayload
        }

        if (parsed.event !== 'Tally.FormSubmitted') return

        const submissionId = parsed.payload?.id
        if (wasSubmissionTracked(submissionId)) return

        trackEvent('generate_lead', {
          form_name: 'free_acoustic_consultation',
          page_path: pathname,
          tally_form_id: parsed.payload?.formId || '',
          tally_form_name: parsed.payload?.formName || title,
          tracking_source: 'tally_form_submitted',
          ...captureAttribution(),
        })
        markLeadTracked('tally_form_submitted', submissionId)

        window.setTimeout(() => {
          router.push('/thank-you')
        }, 150)
      } catch {
        // Ignore malformed postMessage payloads from other scripts.
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [pathname, router, title])

  return (
    <iframe
      src={src}
      width="100%"
      height="640"
      frameBorder="0"
      title={title}
      className={className}
      style={style}
    />
  )
}
