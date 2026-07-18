'use client'

import type { Attribution } from '@/lib/tallyAttribution'

const LEAD_TRACKING_KEY = 'ja_lead_tracking_v2'
const LEAD_RECORD_MAX_AGE_MS = 24 * 60 * 60 * 1000
export const LEAD_QUEUE_RETRY_AFTER_MS = 30 * 1000
const MAX_LEAD_ATTEMPTS = 2

export type LeadTrackingStatus = 'pending' | 'queued' | 'sent'

export type LeadTrackingRecord = {
  version: 2
  status: LeadTrackingStatus
  submissionId: string
  source: 'tally_form_submitted'
  sourcePage: string
  formId?: string
  formName?: string
  attribution: Attribution
  createdAt: number
  queuedAt?: number
  sentAt?: number
  attemptCount: number
}

type PendingLeadInput = Pick<
  LeadTrackingRecord,
  'submissionId' | 'source' | 'sourcePage' | 'formId' | 'formName' | 'attribution'
>

function isBrowser() {
  return typeof window !== 'undefined'
}

function isLeadTrackingRecord(value: unknown): value is LeadTrackingRecord {
  if (!value || typeof value !== 'object') return false

  const record = value as Partial<LeadTrackingRecord>
  return (
    record.version === 2 &&
    (record.status === 'pending' || record.status === 'queued' || record.status === 'sent') &&
    typeof record.submissionId === 'string' &&
    record.submissionId.length > 0 &&
    record.source === 'tally_form_submitted' &&
    typeof record.sourcePage === 'string' &&
    typeof record.createdAt === 'number' &&
    typeof record.attemptCount === 'number' &&
    Boolean(record.attribution) &&
    typeof record.attribution === 'object'
  )
}

function readLeadTrackingRecord(): LeadTrackingRecord | null {
  if (!isBrowser()) return null

  try {
    const raw = window.sessionStorage.getItem(LEAD_TRACKING_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isLeadTrackingRecord(parsed)) return null

    if (Date.now() - parsed.createdAt > LEAD_RECORD_MAX_AGE_MS) {
      window.sessionStorage.removeItem(LEAD_TRACKING_KEY)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function writeLeadTrackingRecord(record: LeadTrackingRecord) {
  if (!isBrowser()) return false

  try {
    window.sessionStorage.setItem(LEAD_TRACKING_KEY, JSON.stringify(record))
    return true
  } catch {
    return false
  }
}

export function createPendingLead(input: PendingLeadInput) {
  const existing = readLeadTrackingRecord()
  if (existing?.submissionId === input.submissionId) return false

  return writeLeadTrackingRecord({
    version: 2,
    status: 'pending',
    submissionId: input.submissionId,
    source: input.source,
    sourcePage: input.sourcePage,
    formId: input.formId,
    formName: input.formName,
    attribution: input.attribution,
    createdAt: Date.now(),
    attemptCount: 0,
  })
}

export function getLeadTrackingRecord(submissionId: string) {
  const record = readLeadTrackingRecord()
  return record?.submissionId === submissionId ? record : null
}

export function canQueueLead(record: LeadTrackingRecord, now = Date.now()) {
  if (record.status === 'pending') return record.attemptCount === 0
  if (record.status === 'sent') return false
  if (!record.queuedAt || record.attemptCount >= MAX_LEAD_ATTEMPTS) return false

  return now - record.queuedAt >= LEAD_QUEUE_RETRY_AFTER_MS
}

export function markLeadQueued(submissionId: string) {
  const record = getLeadTrackingRecord(submissionId)
  if (!record || !canQueueLead(record)) return null

  const queuedRecord: LeadTrackingRecord = {
    ...record,
    status: 'queued',
    queuedAt: Date.now(),
    attemptCount: record.attemptCount + 1,
  }

  return writeLeadTrackingRecord(queuedRecord) ? queuedRecord : null
}

export function markLeadSent(submissionId: string) {
  const record = getLeadTrackingRecord(submissionId)
  if (!record || record.status !== 'queued') return false

  return writeLeadTrackingRecord({
    ...record,
    status: 'sent',
    sentAt: Date.now(),
  })
}
