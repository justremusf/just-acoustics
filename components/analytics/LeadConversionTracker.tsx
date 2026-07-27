'use client'

import { useEffect, useRef } from 'react'
import {
  canQueueLead,
  getLeadTrackingRecord,
  markLeadQueued,
  markLeadSent,
} from '@/components/analytics/leadTrackingState'
import { trackEvent } from '@/components/analytics/trackEvent'

const GTAG_WAIT_MS = 10 * 1000
const GTAG_POLL_MS = 100

export default function LeadConversionTracker() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return

    const searchParams = new URLSearchParams(window.location.search)
    const submissionId = searchParams.get('submission_id') || ''
    if (searchParams.get('submitted') !== 'tally' || !submissionId) return

    const initialRecord = getLeadTrackingRecord(submissionId)
    if (!initialRecord || initialRecord.status === 'sent') return

    let pollTimer: number | undefined
    let cancelled = false
    const waitDeadline = Date.now() + GTAG_WAIT_MS

    const tryQueueLead = () => {
      if (cancelled || hasTracked.current) return

      const record = getLeadTrackingRecord(submissionId)
      if (!record || record.status === 'sent') return

      if (typeof window.gtag === 'function' && canQueueLead(record)) {
        const gaAccepted = trackEvent(
          'generate_lead',
          {
            value: 1,
            currency: 'SGD',
            form_name: 'free_acoustic_consultation',
            page_path: '/thank-you',
            source_page: record.sourcePage,
            tally_form_id: record.formId || '',
            tally_form_name: record.formName || '',
            tracking_source: record.source,
            ...record.attribution,
          },
          {
            eventCallback: () => {
              window.setTimeout(() => markLeadSent(submissionId), 0)
            },
            eventTimeoutMs: 2000,
          }
        )

        if (gaAccepted && markLeadQueued(submissionId)) {
          hasTracked.current = true
          return
        }
      }

      if (Date.now() < waitDeadline) {
        pollTimer = window.setTimeout(tryQueueLead, GTAG_POLL_MS)
      }
    }

    tryQueueLead()

    return () => {
      cancelled = true
      if (pollTimer) window.clearTimeout(pollTimer)
    }
  }, [])

  return null
}
