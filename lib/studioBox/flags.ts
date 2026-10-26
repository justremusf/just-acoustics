// Feature flags for Studio in a Box. Nothing here takes money.
//
// STUDIO_BOX_ENABLED            '1' shows the pages in production. Preview and local builds always show them.
// NEXT_PUBLIC_STUDIO_BOX_PAYMENT 'request' (default): "Request booking" only; the deposit is asked for after
//                               Remus confirms the slot. 'paynow' / 'stripe' are designed (lib/studioBox/payments.ts)
//                               but stay off until Remus picks a provider and real keys are added.
// STUDIO_BOX_STORE              '1' also saves each request in Neon (table ja_studio_box_requests). Default: log only.

export type PaymentMode = 'request' | 'paynow' | 'stripe'

export function studioBoxEnabled() {
  if (process.env.STUDIO_BOX_ENABLED === '1') return true
  return process.env.VERCEL_ENV !== 'production'
}

export function paymentMode(): PaymentMode {
  const mode = process.env.NEXT_PUBLIC_STUDIO_BOX_PAYMENT
  return mode === 'paynow' || mode === 'stripe' ? mode : 'request'
}
