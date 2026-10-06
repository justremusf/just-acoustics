'use client'

import { useEffect } from 'react'
import {
  getLeadTrackingRecord,
  markLeadQueued,
  markLeadSent,
} from '@/components/analytics/leadTrackingState'
import { trackEvent } from '@/components/analytics/trackEvent'

/**
 * Fires generate_lead exactly once per Tally submission, on /thank-you?submitted=tally&submission_id=…
 *
 * TallyAttributionIframe only records the submission (leadTrackingState) and redirects; this is the
 * single place the lead is sent, so the Tally message and the thank-you load can never both count it.
 * A reload, back-navigation or a direct visit without a pending record sends nothing. If GA4 never
 * confirmed delivery, a later visit re-sends to Google only (GA4 + Ads, which dedupes on
 * transaction_id); Meta, Vercel and first-party insights only ever get the first send.
 */
export default function LeadConversionTracker() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const submissionId = searchParams.get('submission_id') || ''
    if (searchParams.get('submitted') !== 'tally' || !submissionId) return

    const record = getLeadTrackingRecord(submissionId)
    if (!record || record.status === 'sent') return

    const firstSend = record.status === 'pending'
    const queued = markLeadQueued(submissionId)
    if (!queued) return

    trackEvent(
      'generate_lead',
      {
        form_name: 'free_acoustic_consultation',
        source: 'tally_form',
        source_page: record.sourcePage,
        tally_form_id: record.formId || '',
        tally_form_name: record.formName || '',
        tracking_source: record.source,
        ...record.attribution,
      },
      {
        dedupeId: submissionId,
        googleOnly: !firstSend,
        eventCallback: () => {
          window.setTimeout(() => markLeadSent(submissionId), 0)
        },
        eventTimeoutMs: 2000,
      }
    )
  }, [])

  return null
}
