'use client'

const RECENT_LEAD_TRACKING_KEY = 'ja_recent_lead_tracking_v1'
const RECENT_LEAD_TRACKING_WINDOW_MS = 10 * 60 * 1000

type RecentLeadTrackingState = {
  trackedAt: number
  submissionId?: string
  source?: string
}

function isBrowser() {
  return typeof window !== 'undefined'
}

function readRecentLeadTracking(): RecentLeadTrackingState | null {
  if (!isBrowser()) return null

  try {
    const raw = window.sessionStorage.getItem(RECENT_LEAD_TRACKING_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as RecentLeadTrackingState
    if (!parsed?.trackedAt) return null

    return parsed
  } catch {
    return null
  }
}

export function hasRecentLeadTracking() {
  const state = readRecentLeadTracking()
  if (!state) return false

  return Date.now() - state.trackedAt < RECENT_LEAD_TRACKING_WINDOW_MS
}

export function wasSubmissionTracked(submissionId?: string) {
  if (!submissionId) return false

  const state = readRecentLeadTracking()
  if (!state) return false

  if (Date.now() - state.trackedAt >= RECENT_LEAD_TRACKING_WINDOW_MS) return false

  return state.submissionId === submissionId
}

export function markLeadTracked(source: string, submissionId?: string) {
  if (!isBrowser()) return

  try {
    window.sessionStorage.setItem(
      RECENT_LEAD_TRACKING_KEY,
      JSON.stringify({
        trackedAt: Date.now(),
        submissionId,
        source,
      } satisfies RecentLeadTrackingState)
    )
  } catch {
    // Ignore storage errors; dedupe is best-effort only.
  }
}
