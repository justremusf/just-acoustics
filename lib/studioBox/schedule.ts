// Install-slot rules for Studio in a Box. Plain module, used by the picker and re-checked by the booking API.
//
// Lead time (memory ja-supplier-lead-times, JA Assistant/orders/orders.py DEFAULT_CONFIG):
//   deposit (allow 2 days after the request) → 15 working days production → sea freight, late case 18 + 2 days
//   → 7 days buffer → rounded up to the next half-month (under-promise). The earliest slot is the first
//   install day after that half-month.
// Days (HRD rate card + HDB rules): no Sundays or public holidays. HDB flats: weekdays only, morning start so
// the drilling is done before noon. Condos and landed homes: Mon–Sat, Saturday mornings only. Offices:
// weekdays, or after hours (6:30 pm) for a per-panel surcharge.
// Every slot is a request: Remus (or the assistant) confirms it before any deposit is asked for.

export type PropertyType = 'hdb' | 'condo' | 'landed' | 'office'
export type SlotTime = 'morning' | 'afternoon' | 'evening'

export const PROPERTY_TYPES: { id: PropertyType; label: string; note: string }[] = [
  { id: 'hdb', label: 'HDB flat', note: 'Weekday mornings. HDB limits drilling to weekdays, so we start at 9:30 am.' },
  { id: 'condo', label: 'Condo', note: 'Weekdays or Saturday morning, subject to your condo’s renovation hours.' },
  { id: 'landed', label: 'Landed home', note: 'Weekdays or Saturday morning.' },
  { id: 'office', label: 'Office', note: 'Weekdays, or after 6:30 pm if the room is busy in the day.' },
]

export const SLOT_LABELS: Record<SlotTime, string> = {
  morning: 'Morning, from 9:30 am',
  afternoon: 'Afternoon, from 2 pm',
  evening: 'After hours, from 6:30 pm',
}

// Singapore public holidays (MOM), Nov 2026 – Jun 2027. Extend yearly.
export const SG_PUBLIC_HOLIDAYS: Record<string, string> = {
  '2026-11-09': 'Deepavali (observed)',
  '2026-12-25': 'Christmas Day',
  '2027-01-01': 'New Year’s Day',
  '2027-02-06': 'Chinese New Year',
  '2027-02-08': 'Chinese New Year (observed)',
  '2027-03-10': 'Hari Raya Puasa',
  '2027-03-26': 'Good Friday',
  '2027-05-01': 'Labour Day',
  '2027-05-17': 'Hari Raya Haji',
  '2027-05-20': 'Vesak Day',
}

const PRODUCTION_WORKING_DAYS = 15
const SEA_LATE_DAYS = 20
const BUFFER_DAYS = 7
const DEPOSIT_DAYS = 2
/** How far ahead buyers may pick. */
export const BOOKING_WINDOW_DAYS = 56

const DAY = 86_400_000

/** Today in Singapore as YYYY-MM-DD. */
export function sgToday(now = new Date()) {
  return new Date(now.getTime() + 8 * 3_600_000).toISOString().slice(0, 10)
}

export function parseIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function toIso(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY)
}

function addWorkingDays(date: Date, days: number) {
  let day = date
  let left = days
  while (left > 0) {
    day = addDays(day, 1)
    const wd = day.getUTCDay()
    if (wd !== 0 && wd !== 6) left -= 1
  }
  return day
}

/** First day buyers can pick, from a request made on `todayIso`. */
export function earliestInstall(todayIso = sgToday()) {
  const deposit = addDays(parseIso(todayIso), DEPOSIT_DAYS)
  const produced = addWorkingDays(deposit, PRODUCTION_WORKING_DAYS)
  const promise = addDays(produced, SEA_LATE_DAYS + BUFFER_DAYS)
  const y = promise.getUTCFullYear()
  const m = promise.getUTCMonth()
  return promise.getUTCDate() <= 15 ? new Date(Date.UTC(y, m, 16)) : new Date(Date.UTC(y, m + 1, 1))
}

export function slotsForDay(iso: string, property: PropertyType): SlotTime[] {
  if (SG_PUBLIC_HOLIDAYS[iso]) return []
  const wd = parseIso(iso).getUTCDay()
  if (wd === 0) return []
  if (wd === 6) return property === 'hdb' ? [] : ['morning']
  if (property === 'hdb') return ['morning']
  if (property === 'office') return ['morning', 'afternoon', 'evening']
  return ['morning', 'afternoon']
}

export type InstallDay = { iso: string; slots: SlotTime[] }

export function installDays(property: PropertyType, todayIso = sgToday()): InstallDay[] {
  const start = earliestInstall(todayIso)
  const days: InstallDay[] = []
  for (let i = 0; i < BOOKING_WINDOW_DAYS; i += 1) {
    const iso = toIso(addDays(start, i))
    const slots = slotsForDay(iso, property)
    if (slots.length) days.push({ iso, slots })
  }
  return days
}

export function isValidSlot(iso: string, time: SlotTime, property: PropertyType, todayIso = sgToday()) {
  return installDays(property, todayIso).some((day) => day.iso === iso && day.slots.includes(time))
}

export function formatDay(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) {
  return parseIso(iso).toLocaleDateString('en-SG', { ...opts, timeZone: 'UTC' })
}
