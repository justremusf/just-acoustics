'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import { createPendingLead } from '@/components/analytics/leadTrackingState'
import { buildTallyUrlWithAttribution, captureAttribution } from '@/lib/tallyAttribution'

type TallyWindow = Window & {
  Tally?: {
    loadEmbeds?: () => void
  }
}

type TallySubmittedPayload = {
  id?: string
  responseId?: string
  submissionId?: string
  formId?: string
  formName?: string
}

type TallySubmittedMessage = {
  event?: string
  payload?: TallySubmittedPayload
}

function parseTallySubmittedMessage(data: unknown): TallySubmittedMessage | null {
  let parsed: unknown = data

  if (typeof data === 'string') {
    if (!data.includes('Tally.FormSubmitted')) return null

    try {
      parsed = JSON.parse(data)
    } catch {
      return null
    }
  }

  if (!parsed || typeof parsed !== 'object') return null

  const message = parsed as TallySubmittedMessage
  if (message.event !== 'Tally.FormSubmitted') return null
  if (!message.payload || typeof message.payload !== 'object') return null

  return message
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
      if (event.origin !== 'https://tally.so') return

      const message = parseTallySubmittedMessage(event.data)
      if (!message) return

      const submissionId =
        message.payload?.id || message.payload?.responseId || message.payload?.submissionId
      if (!submissionId) return

      const wasCreated = createPendingLead({
        submissionId,
        source: 'tally_form_submitted',
        sourcePage: search ? `${pathname}?${search}` : pathname,
        formId: message.payload?.formId,
        formName: message.payload?.formName || title,
        attribution: captureAttribution() || {},
      })
      if (!wasCreated) return

      const thankYouParams = new URLSearchParams({
        submitted: 'tally',
        submission_id: submissionId,
      })
      router.push(`/thank-you?${thankYouParams.toString()}`)
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [pathname, router, search, title])

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
