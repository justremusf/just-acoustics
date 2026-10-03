// Shared checkout + PayNow helpers used by the checkout page, the PayNow page
// and the /api/cart-checkout route. Keep this file free of React so it can be
// imported on the server too.

export const PAYNOW_VPA = 'UEN202336944WA00#XNAP'
export const PAYNOW_QR_SRC = '/assets/paynow/just-acoustics-paynow-qr.png'
export const PAYNOW_QR_URL = `https://www.justacoustics.co${PAYNOW_QR_SRC}`

export const CONTACT_PHONE_DISPLAY = '+65 8930 1905'
export const CONTACT_PHONE_HREF = 'tel:+6589301905'
export const CONTACT_EMAIL = 'info@justacoustics.co'

/** localStorage key for the most recently placed order (read by /checkout/paynow). */
export const LAST_ORDER_STORAGE_KEY = 'just-acoustics-last-order'

export type CheckoutFields = {
  fullName: string
  email: string
  phone: string
  company: string
  addressLine1: string
  addressLine2: string
  postalCode: string
  deliveryNotes: string
}

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutFields, string>>

export type PlacedOrder = {
  reference: string
  amount: number
  currency: 'SGD'
  placedAt: string
  email: string
  customerEmailSent: boolean
  teamNotified: boolean
  items: {
    id: string
    title: string
    quantity: number
    lineTotal: number
    options: { label: string; value?: string }[]
  }[]
}

/** Round to whole cents to avoid floating point drift (e.g. 333.333 * 3). */
export function roundCents(amount: number) {
  return Math.round(amount * 100) / 100
}

export function lineTotal(unitPrice: number, quantity: number) {
  return roundCents(unitPrice * quantity)
}

/** Exact payable amount: shows cents only when there are any. */
export function formatPayable(amount: number) {
  const value = roundCents(amount)
  const hasCents = Math.round(value * 100) % 100 !== 0
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(value)
}

/** Plain number for bank apps' amount field, e.g. "1250" or "1249.99". */
export function plainAmount(amount: number) {
  const value = roundCents(amount)
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

export function createPaymentReference() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(5)
  globalThis.crypto.getRandomValues(bytes)
  const randomPart = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
  return `JA-${datePart}-${randomPart}`
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Singapore mobile/landline (8 digits starting 3/6/8/9, optional +65) or an international number with +. */
export function isValidPhone(value: string) {
  const compact = value.replace(/[\s().-]/g, '')
  if (/^(\+?65)?[3689]\d{7}$/.test(compact)) return true
  return /^\+(?!65)\d{7,15}$/.test(compact)
}

export function isValidPostalCode(value: string) {
  return /^\d{6}$/.test(value.trim())
}

export function validateCheckoutFields(fields: CheckoutFields): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {}
  if (!fields.fullName.trim()) errors.fullName = 'Please enter your name.'
  if (!fields.email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_PATTERN.test(fields.email.trim())) errors.email = 'Please check your email address.'
  if (!fields.phone.trim()) errors.phone = 'Please enter a phone number.'
  else if (!isValidPhone(fields.phone)) errors.phone = 'Enter an 8-digit Singapore number, e.g. 9123 4567.'
  if (!fields.addressLine1.trim()) errors.addressLine1 = 'Please enter the delivery address.'
  if (!fields.postalCode.trim()) errors.postalCode = 'Please enter a postal code.'
  else if (!isValidPostalCode(fields.postalCode)) errors.postalCode = 'Singapore postal codes have 6 digits.'
  return errors
}
