# Localhost verification — 15 September 2026

Server: http://localhost:3333 (`npm run dev`, Next.js 15.5.14). Browser access now succeeds. This is a development-server check, not a production performance benchmark or deployment.

## Verified

- Desktop homepage renders with loaded hero imagery and visible primary call to action.
- Mobile viewport explicitly measured at 390 × 844. Homepage, product, pricing and contact document widths are 390px: no horizontal document overflow in those checks.
- Mobile navigation: opened menu, opened Shop submenu, followed the Flexi product link; menu closed after route navigation.
- Product configuration: changing Standard to Square 60 × 60cm updated the price from $100 to $55 for the selected 25mm white panel.
- Cart: selected configuration persisted into the cart and checkout; increasing quantity to two produced $110; removing the item restored the empty-cart state. No order or payment submitted.
- Pricing: Church accordion opens and displays its image and pricing at mobile width.
- Full local sitemap crawl: 142/142 HTTP 200, one H1 per page, matching production canonical URLs, nonempty descriptions; 466 JSON-LD blocks parsed. See `localhost-crawl.json`.
- Nine retired URL redirects: 9/9 return HTTP 308 with the intended destination. See `localhost-redirects.json`.
- robots.txt serves the narrowed `/studio$` and `/studio/` exclusions and the production sitemap URL.
- No browser console error entries observed in the tested in-app-browser journey. Warnings are listed below.
- Lint, TypeScript, three hardening regression tests and whitespace checks pass after the small fixes below.

## Small fixes made

- Added `data-scroll-behavior="smooth"` to the root HTML element to acknowledge the existing smooth scrolling for Next.js route handling.
- Removed the repeated brand suffix from the checkout metadata title; the root title template supplies it.

No layout, pricing, form submission workflow or customer-facing body copy was changed.

## Open issues and limitations

The consultation iframe remains blank in the Codex in-app browser, with an iframe-resizer no-response warning. The same Tally form renders Name, Email, Phone Number, Type of Space and message controls when opened directly, both with and without the exact site attribution parameters. This narrows the issue to embedded loading in the tested context; it does not establish whether ordinary customer browsers are affected. No form was submitted.

Meta Pixel warns that localhost is unavailable under its traffic permission settings. Production tracking was not tested or modified.

The homepage displays successive loaded hero images, but no frame-time trace, throttled cold-load benchmark or production Core Web Vitals was collected. Do not interpret the visual checks as proof of a measured speed improvement. Reduced-motion behaviour and every interactive widget were not exhaustively tested.

The site should not receive a complete all-clear until the embedded consultation form is verified in a normal customer browser. All changes remain local.

Chrome comparison was attempted through the browser runtime but timed out before producing a page snapshot. It therefore does not resolve the iframe issue.
