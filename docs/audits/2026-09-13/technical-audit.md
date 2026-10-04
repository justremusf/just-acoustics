# Technical, structured-data and backend audit

Audited 13 September 2026. Evidence combines a read-only crawl of the existing live deployment at https://www.justacoustics.co with source inspection of this repository. No form submissions, emails, checkout actions, database queries or database writes were performed. The raw snapshot is `crawl.json` alongside this report. Findings describe the **live baseline**, not a claim that concurrently edited local improvements are already deployed.

## Coverage and verified results

| Check | Result |
|---|---:|
| Sitemap URLs discovered | 142 |
| Sitemap URLs returning HTTP 200 | 141 |
| Sitemap URLs skipped because robots disallows them | 1 (`/studio-lander`) |
| Additional one-hop internal targets checked | 12 |
| Additional targets returning HTTP 200 | 3 |
| Additional targets returning HTTP 404 | 9 |
| Total successful HTML responses | 144 |
| Invalid JSON syntax in JSON-LD scripts | 0 |
| Successful sitemap pages missing or disagreeing with self-canonical | 0 |
| Product / Article / Service schemas | 8 / 82 / 7 |
| BreadcrumbList / FAQPage schemas | 129 / 99 |

Every successful page includes the global Organization/LocalBusiness and WebSite graph. Breadcrumb positions checked were sequential. All eight live Product offers included SGD prices, absolute offer URLs and availability. The three accessory pages have no description metadata and their Product descriptions are null. Privacy and terms pages are deliberately `noindex` and omit canonicals; these were not counted as indexable canonical failures.

The crawl obeyed robots, limited requests to five concurrent GETs and stayed under 500 URLs. It covered the sitemap and one-hop internal HTML links. It did not crawl external sites, media files, unlinked routes, every recursive link depth, Sanity Studio, blocked paths or API routes. HTML fetch duration is not a browser performance measurement. Rich Results Test, Google URL Inspection and live backend delivery were not executed, so parsing success does not establish rich-result eligibility, indexing or operational health.

## Priority findings

### High: checkout accepts client-supplied product prices and can acknowledge an undelivered order

`app/api/cart-checkout/route.ts:148` calculates a subtotal from submitted unit prices, rather than looking up products and options from the catalogue. Checking two client-controlled totals against each other does not validate price. The submitted `lineTotal` is independently used in the email and is never compared with quantity × unitPrice. Integer rounding also permits sub-dollar disagreement.

`sendOrderEmails` returns `skipped` when the mail key is absent and `failed` when the provider reports an error; the route still returns HTTP 200 and PayNow instructions. This route contains no durable order save. `app/(site)/checkout/CheckoutClient.tsx:143` treats either response as a received order and fires `generate_lead`. Consequently a customer can be asked to pay even when the team did not receive the order. This is a confirmed code path, **not evidence of an actual lost order or a missing production key**.

Recommended implementation: send SKU/slug plus stable selected option IDs; resolve the same configuration on the server; calculate amounts and line totals server-side; acknowledge receipt only after a durable order record or verified internal delivery; use an idempotency key for retries. Keep the existing checkout design and manual PayNow flow.

### High: nine broken internal destinations interrupt enquiry/product journeys

These were HTTP 404, with their referring pages retained in `crawl.json`:

| Broken destination | Referring page(s) |
|---|---|
| `/shop/standard-flexi-acoustic-panel` | `/church-acoustics` |
| `/shop/custom-print-acoustic-panel` | `/church-acoustics` |
| `/shop/acoustic-ceiling-panels` | `/church-acoustics` |
| `/products/acoustic-ceiling-panels` | `/blog/ceiling-panels-vs-wall-panels-acoustic-treatment-singapore` |
| `/products/acoustic-wall-panels` | same ceiling-vs-wall blog |
| `/products/custom-print-acoustic-panels` | `/blog/custom-print-acoustic-panels-singapore` |
| `/services/churches-event-spaces` | same custom-print blog |
| `/services/offices-meeting-rooms` | both blogs above |
| `/services/restaurants-cafes-bars` | both blogs above |

The current live product destinations include `/shop/flexi-acoustic-panels` and `/shop/flexi-custom-print-panels`. Recommended: repair stale hrefs or add explicitly reviewed redirects to existing relevant pages; do not introduce new site sections or redirect every missing product to a generic page. Ceiling placement needs a semantically suitable existing destination. No link or CMS content was changed by this audit.

### Medium: robots blocks a public landing page

Live `robots.txt` disallows `/studio`, a prefix rule that includes `/studio-lander`; that public landing page appears in the sitemap. The audit skipped it. Google documents path matching in its [robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec). Limit the protected rules to `/studio$` and `/studio/` while retaining `/api/`. The main implementation agent is making this local correction; it requires a fresh post-deployment robots check before calling the live issue resolved.

### Medium: price sources diverge across schema, catalogue, configurator and quote API

| Live product | JSON-LD offer price | Initial visible product price/action | Interpretation |
|---|---:|---|---|
| Flexi Acoustic Panels | SGD55 | SGD100 per panel / Add to cart SGD100 | SGD55 corresponds to the smaller 600×600 variant (100 − 45); schema does not identify that variant |
| Flexi Custom Print Panels | SGD75 | From SGD75 / artwork review | Client configuration base is SGD120; smaller variant is 120 − 45 = 75 |
| Forma PET Panels | SGD100 | From SGD100 / request quote | Starting estimate, not a completed buyable configuration |
| Soothe Gobos | SGD340 | From SGD340 / request quote | Starting estimate, not a completed buyable configuration |
| Soothe Bass Traps | SGD240 | From SGD240 / Add to cart SGD240 | Initial total agrees |
| Three mounting kits | SGD15 / 10 / 10 | SGD15 / 10 / 10 | Initial totals agree |

Do **not** blindly replace SGD55 with SGD100: the lower priced size is real in the configurator. The concrete engineering issue is that `ShopItemDetail.tsx:getConfigurableItem` overrides Flexi base to 100 and custom-print base to 120 plus option lists, while page schema uses raw `item.price` and `/api/shop-quote` prices the raw CMS object. A single authoritative configuration helper should preserve current visible prices, support server validation and emit a truthful identified offer/variant. Confirm actual CMS option values before changing the quote calculation. No pricing was changed.

The Product template always emits `offers`, even for a future item without a price, and omits zero because it checks truthiness. No missing-price Offer was found in the eight current products; this is a future-data robustness risk. Prefer conditional truthful offers and correct zero handling. Google’s [Product snippet documentation](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) describes offer requirements; schema syntax alone does not mean the displayed offer has been validated.

### Medium: webhook handling needs escaping, bounded validation and safe retry behaviour

`app/api/tally-webhook/route.ts` verifies HMAC only when `TALLY_WEBHOOK_SECRET` exists. Production secret configuration was not inspected. Require configuration and fail closed for a missing secret in production. The received signature comparison is constant-time for valid lengths.

Submitted name, field labels and field values are inserted directly into HTML emails. Escape these values using the same approach already present in the quote/checkout routes. Bound and validate the payload before calling providers. This is email HTML injection exposure, not proof of browser script execution.

The route sends customer and internal emails before forwarding attribution. A later error returns 502 without recording completed stages; a webhook retry can repeat emails. Add durable response-ID deduplication and retry only incomplete stages. Add an explicit timeout to the attribution fetch. No replay or malicious payload was sent during this audit.

### Medium: analytics can silently stop recording until an instance restarts

`lib/insights/server.ts:31` memoizes schema initialization. If table/index initialization rejects once, `schemaPromise` remains rejected, so later calls on the same warm instance immediately fail. `app/api/insights/events/route.ts` swallows the failure and returns 204. Reset the promise after failure or move schema creation to a migration; retain non-blocking visitor behaviour but record a bounded operational error. The previous design requirement that unavailable analytics must not masquerade as real results remains relevant; actual production data was not queried.

The public collector accepts unbounded nested `campaign` and `properties` objects. No application-level rate limit was found for this route or the two email-submission APIs. Edge/WAF controls were not inspected, so absence of application controls does not prove absence of deployed protection. Add bounded property shapes, body limits and sensible abuse controls without changing ordinary visitor interactions.

## Structured-data refinements without changing the page design

- **Safe JSON-LD serialization:** raw CMS strings currently reach `dangerouslySetInnerHTML` through `JSON.stringify`. Escape `<` to prevent a literal closing-script sequence breaking out of the JSON-LD element. This is an input-hardening finding, not evidence of compromised CMS content. The main agent is applying a shared serializer. [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld) recommends sanitizing serialized payloads.
- **LocalBusiness address is incomplete for a physical location:** the global graph has Singapore locality, region and country, but no street address or postal code. The audit has no verified street address and does not recommend inventing one. Confirm whether the business should describe a public physical location or remain Organization/service-area oriented; retain accurate phone, email and served country. Do not present it as a fully verified LocalBusiness rich-result implementation.
- **Article images:** all 82 Article objects omit `image`; connect an existing representative CMS image when present. This is an enhancement, not a JSON syntax error, and does not justify creating or changing visible article imagery.
- **FAQ rich results:** 99 FAQPage blocks are present. The installed skill’s February guidance is stale: Google’s current changelog says FAQ rich results stopped appearing from 7 May 2026 and documentation was removed in June. Existing valid schema is not an urgent error, but adding more for Google rich results has no benefit. Keep visible FAQs unchanged. [Google documentation updates](https://developers.google.com/search/updates#may-2026).
- **Sitemap dates:** `app/sitemap.ts` uses `new Date()` for every route instead of source modification dates. This reports sitemap generation time as content modification time. Use `_updatedAt` for CMS documents and meaningful static-page change dates, or omit unavailable dates.
- **CMS outages:** query helpers often catch errors and return empty arrays/null; sitemap/page generation can then produce incomplete inventories or not-found results. Prefer preserving last good cached content and surfacing operational failures rather than caching a transient empty response. No live CMS outage was observed.

## Local work versus live verification

The main agent is implementing targeted local robots, JSON-LD serialization and front-end performance improvements separately. Backend workflow, prices, CMS content, layout, site structure and payment behaviour remain outside this read-only report's edits. Confirm each local fix with relevant tests, then distinguish local verification from a fresh production crawl. This report does not certify a deployment, mobile interactions, Core Web Vitals, email delivery, payment receipt, consent compliance or current database health.
