# Online orders — 15 September 2026

## Customer contract

- Supply-only product pricing, validated against the shared catalogue on the server.
- S$50 delivery once per order, added after a valid Singapore address and six-digit postal code. No GST added (business is not GST registered).
- Made to order; standard lead time is 4 to 6 weeks from payment confirmation to delivery (matches the site-wide copy from 3 October).
- Sales follow-up within one business day after confirmation, address confirmation and progress updates.
- Installation is a separate WhatsApp enquiry with cart/order selections prefilled. The customer reviews and sends the message; no installation price or automatic booking.

## Payment and email lifecycle

1. Checkout validates options, quantity and current prices. Browser-supplied names/totals are not authoritative.
2. Persist the order and a stable, server-generated reference. An idempotency key makes retries return the same order.
3. Queue separate customer and team payment-instruction emails. Email failure never loses a saved order.
4. A secret email link exchanges its access token for an HttpOnly cookie and redirects to the non-secret order reference before rendering the page. It is not a public order lookup.
5. Show PayNow QR, VPA, exact total, copy buttons, lead time and installation enquiry.
6. VPS checks the protected reconcile endpoint every five minutes. The authenticated status page also triggers throttled checks while open. Vercel has a daily backup at 06:00 Singapore time.
7. Mark an order paid only after a qualifying Aspire transaction. A unique transaction constraint prevents reuse. Persist paid status before email delivery.
8. Send customer payment confirmation and team confirmation through a durable, deduplicated email queue. If the browser cart is unchanged, clear it after confirmation.

## Matching rules and practical limits

- Confirmed receiving account: SGD account ending 1314.
- Only settled, positive SGD bank-transfer credits in that account, excluding FX.
- Read all pages before matching. Invalid/incomplete responses fail the run without matching partial results.
- An order reference plus exact amount takes priority. Unknown order references do not fall back to amount matching.
- Without a reference: require exactly one candidate order and exactly one candidate transfer, received after order creation and within 48 hours.
- Reference matches allow up to 30 days. Underpayment, overpayment, duplicate payments and ambiguous order totals require manual review.
- An unrelated incoming credit with the same amount can still resemble an order when the payer omits the reference. Exact-amount fallback was explicitly requested for low volume; references are strongly encouraged.
- Aspire settlement/API delay or VPS/network outages delay confirmation. Do not describe this as instant payment detection.
- No real funds are transferred by this integration. Its API calls are authentication and transaction reads only.

## Operations

`npx tsx scripts/orders-admin.ts status` lists orders, payment reviews, queued email errors and latest reconciliation health.

`npx tsx scripts/orders-admin.ts verify-aspire` performs a read-only seven-day transaction check and reports counts, not customer/bank details.

After investigating an ambiguous payment:

`npx tsx scripts/orders-admin.ts confirm ORDER_REFERENCE ASPIRE_TRANSACTION_ID`

This re-fetches Aspire and still requires a settled credit, the correct account/currency, exact amount, a time after order creation and an unused transaction ID. It records payment and sends confirmation.

Email retries use Resend idempotency keys. Ambiguous delivery attempts older than 23 hours are held for provider-log review rather than risking a duplicate after the provider's idempotency window. Delivery acceptance is not proof of inbox placement. Bounces still require checking Resend.

## VPS

Installed files:

- `/opt/just-acoustics-orders/poll-orders.py`
- `/etc/just-acoustics-orders.env` (root-readable, mode 600; endpoint secret only)
- `/etc/systemd/system/ja-order-payments.service`
- `/etc/systemd/system/ja-order-payments.timer`

Health: `systemctl status ja-order-payments.timer` and `journalctl -u ja-order-payments.service -n 20 --no-pager`.

The service returns an error for failed checks or manual-review matches. The website retains review records and last job error. No new third-party alert service is configured.

## Verification

- `npx tsx --test scripts/orders.test.ts`: matching and authoritative-pricing cases.
- `npx tsx scripts/orders-integration.ts`: real database persistence, duplicate requests, mocked Aspire reconciliation and mocked email transport; temporary fixture removed in finally.
- `npm run check`: ESLint and TypeScript.
- Build with `NEXT_OUTPUT_DIR=.next-orders-build` when local dev is running, to avoid sharing generated output.
- Customer email previews in this directory contain example data only.

A real customer payment / inbox receipt is a separate operational check; simulated tests do not prove it.

## Deployment verification

Published to https://www.justacoustics.co on 15 September 2026. Final deployment: `just-acoustics-idn4rv0d1-justremusfs-projects.vercel.app`.

- Production build, lint and TypeScript passed; 13 pricing/matching tests passed.
- Full browser flow passed against the isolated production-build test server. Both instruction emails reached Resend's test recipient (`delivered` event); no customer messages were sent by testing.
- Real database + simulated Aspire confirmed the paid transition and deduplicated confirmation email jobs.
- Final public-site browser check passed: selected colour, cart, S$50 after address, installation message and mobile layout. No public-site order was submitted.
- Live Aspire seven-day read returned 5 eligible settled credits from the confirmed account.
- VPS timer is enabled. The authenticated live reconciliation run at 20:44 Singapore time completed successfully, with zero pending orders, matches, reviews or email failures.
- All test orders and their email jobs were removed. No real payment was made during verification.
