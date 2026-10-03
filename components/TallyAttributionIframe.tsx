'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
  // The iframe is rendered on the server without a src and loaded exactly once, on mount, with
  // attribution already attached. Swapping src after a first load made the form load twice.
  const [src, setSrc] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    captureAttribution()
    setLoaded(false)
    setSrc(buildTallyUrlWithAttribution(baseUrl))
  }, [baseUrl, pathname])

  useEffect(() => {
    if (!src) return
    // embed.js handles dynamic height; make sure it picks up this iframe once it exists.
    const tallyWindow = window as TallyWindow
    tallyWindow.Tally?.loadEmbeds?.()
  }, [src])

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://tally.so') return

      const message = parseTallySubmittedMessage(event.data)
      const search = window.location.search.replace(/^\?/, '')
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
  }, [pathname, router, title])

  return (
    <div className="relative">
      {!loaded && (
        <div aria-hidden="true" className="absolute inset-0 flex flex-col gap-4 p-1">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex flex-col gap-2">
              <div className="h-3 w-32 animate-pulse rounded-full bg-black/8" />
              <div className="h-12 w-full animate-pulse rounded-[14px] bg-black/5" />
            </div>
          ))}
          <div className="mt-2 h-12 w-40 animate-pulse rounded-full bg-black/10" />
        </div>
      )}
      <iframe
        src={src ?? undefined}
        width="100%"
        height="640"
        frameBorder="0"
        title={title}
        className={className}
        onLoad={() => {
          if (src) setLoaded(true)
        }}
        style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 200ms ease' }}
      />
    </div>
  )
}
