// Deposit step for Studio in a Box: DESIGN + STUB. No provider is called and no money moves.
//
// What the business already runs (checked 26 Oct 2026):
//   - PayNow to the Aspire account, auto-matched by lib/orders (shop checkout, live since 15 Sep 2026). No fees.
//   - A Stripe account exists (one 2025 invoice adjustment, "business info" reminders) but the site has no
//     Stripe code and no test keys. No HitPay merchant account for sales.
//
// Proposed flow once Remus approves:
//   1. Buyer sends "Request booking" (no payment).                         ← built, live on preview
//   2. Remus confirms the slot and room fit on the board.
//   3. 'paynow': create a ja_orders row for the 50% deposit (reference SIB-…) and send the buyer the existing
//      private order page (PayNow QR, exact amount, Aspire matching). Same code path as the shop.
//      'stripe': Stripe Checkout Session (mode=payment, PayNow + cards, SGD) with STRIPE_SECRET_KEY, webhook
//      checkout.session.completed → mark deposit paid. Card fees ~3.4% + 50¢; PayNow via Stripe ~1.3%.
//   4. Deposit paid → orders autopilot drafts the Ivy order (JA Assistant/orders/orders.py).

import type { PaymentMode } from './flags'

export type DepositRequest = { reference: string; amountSgd: number; customerEmail: string; description: string }
export type DepositResult =
  | { status: 'not_configured'; message: string }
  | { status: 'created'; url: string }

export async function createDepositLink(mode: PaymentMode, request: DepositRequest): Promise<DepositResult> {
  void request
  if (mode === 'paynow') {
    // TODO(go-live): reuse saveOrder() from lib/orders/store with a single "Studio in a Box deposit" item.
    return { status: 'not_configured', message: 'PayNow deposits are designed but switched off in this draft.' }
  }
  if (mode === 'stripe') {
    if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
      return { status: 'not_configured', message: 'No Stripe test key is configured, so Stripe stays a stub.' }
    }
    return { status: 'not_configured', message: 'Stripe Checkout is not wired in this draft.' }
  }
  return { status: 'not_configured', message: 'Requests are confirmed by our team before any payment.' }
}
