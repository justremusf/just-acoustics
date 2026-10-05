# Site performance and technical cleanup

13 September 2026 · Just Acoustics · Local implementation, not deployed

## Implementation follow-up

The user authorised browser access and implementation. The app still rejected the local preview because a saved permission setting blocks it. No alternate browser or indirect browser workaround was attempted. Browser/mobile verification remains pending; this is a saved-setting blocker, not a request for another verbal approval.

Additional fixes are implemented locally:

- Nine exact permanent redirects preserve retired product/service URLs and point to existing pages. The build manifest confirms all nine destinations are prerendered.
- Church product links now use current slugs, including a stale bass-trap link present in interactive source content. All four resulting product destinations were successful in the audit crawl.
- Analytics schema initialisation resets its cached promise after failure, allowing subsequent requests to recover without changing event definitions or visitor responses.
- Tally email templates escape submitted names, field labels and values as text. Email recipients, wording and delivery sequence remain unchanged.
- Three isolated regression tests cover JSON-LD script breakout protection, email HTML escaping and analytics recovery/concurrent setup. No test uses a real database or email provider. Run `node --test scripts/site-hardening.test.cjs`.

Checkout price authority, durable order acknowledgement, webhook deduplication and other operational changes remain documented rather than implemented; they require separate end-to-end work to preserve the current payment and sales contracts. No deployment has been attempted.

## Original audit result

Targeted loading, transition and structured-data improvements are implemented locally. The existing design, text, page structure, pricing, tracking contract and checkout flow were preserved. Existing uncommitted changes were retained. GPT-6 Astra performed the technical/schema crawl and backend review in a specialist task.

Build, lint, TypeScript and whitespace checks pass. Visual/mobile verification is incomplete: the local browser preview was denied by the browser permission system. PageSpeed Insights returned HTTP 429. No Core Web Vitals score, Lighthouse score, mobile usability pass or measured speed increase is claimed.

## Implemented

| Change | Purpose | Verification |
|---|---|---|
| Hero decodes the same responsive Next Image resource that it displays | Avoid the original-image download followed by a separate optimised download during a fade | Source/build checked; browser network and animation checks pending |
| Hero waits two animation frames before the fade; guards overlapping loads and cancels scheduled work on unmount | Preserve the transparent starting frame and avoid stale transition callbacks | Source/build checked; slow-network navigation testing pending |
| Header batches passive scroll events into animation frames | Avoid multiple React update batches before one paint | Source/build checked; device testing pending |
| Section reveal reads positions together before writing classes | Avoid interleaved layout reads and DOM writes | Source/build checked |
| Pricing FadeUp wrapper renders on the server without redundant observers | Remove hydration/effect work that only re-adds an already-present visible class | Markup/classes retained; build checked |
| Removed unused League Spartan and external Google font preconnect | Stop preloading a font that has no consumers; active fonts are self-hosted | Search found no font consumers; built homepage has two font preloads |
| Shared safe JSON-LD serializer across all six emitting files | Keep CMS text from terminating script elements | Malicious closing-script string stays escaped and round-trips unchanged; generated JSON parses |
| Robots rules use `/studio$` and `/studio/` | Keep Studio excluded while allowing `/studio-lander` | Generated robots output checked |

The responsive image technique follows the documented [Next.js getImageProps API](https://nextjs.org/docs/pages/api-reference/components/image#getimageprops). The serializer follows [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld).

## Measurements and coverage

Both builds used the current local working tree, before and after this pass. Values below are Next.js's rounded first-load JavaScript estimates, not network speed or user experience measurements.

| Route | Before | After |
|---|---:|---:|
| Homepage | 166 kB | 166 kB |
| Pricing | 125 kB | 125 kB |
| Product detail | 194 kB | 195 kB |
| Shared JavaScript | 102 kB | 102 kB |

The homepage route-specific code increased from 9.13 to 9.34 kB with image decoding/lifecycle safeguards; pricing route code decreased from 5.79 to 5.67 kB after redundant observer removal. The product first-load total increased by roughly 1 kB at displayed rounding precision with shared chunk changes. This pass primarily targets redundant downloads, unused font loading and scheduling, not a general JavaScript size reduction. Reassess the trade-off with browser measurements before production release.

Static output: **153 HTML pages, 473 valid JSON-LD blocks, zero parse errors**. Syntax validation does not establish Google's rich-result eligibility. Live crawl: **142 sitemap URLs, 141 successful responses and one robots exclusion**; an additional 12 linked destinations included **nine 404s**. See [technical-audit.md](technical-audit.md) for exact paths, evidence and backend risks; [build-validation.json](build-validation.json) and [SUMMARY.json](SUMMARY.json) contain machine-readable results.

## Remaining work

1. Allow browser access to the local production preview, then verify 360/390/768/1440 px layouts, first load under mobile throttling, two carousel rotations, navigation during image loading, reduced motion, menu/submenu/back/close, cart and consultation navigation without submitting orders.
2. Run comparable mobile/desktop Lighthouse samples and capture screenshots; investigate the product bundle increase and any regressions. No first-load speed target can be certified from the current evidence.
3. Nine broken-link redirects and direct church link repairs are implemented locally; verify them after deployment. Review checkout price validation and reliable order receipt before modifying those operational behaviours.
4. Email escaping and analytics recovery are implemented and isolated-test verified; webhook deduplication/retry work remains. Confirm public business address details before adding LocalBusiness properties; do not invent them.
5. After browser verification, deploy the reviewed change set and recheck live robots, generated schema, route responses and loading. Nothing from this pass has been deployed.

The browser permission rejection was not bypassed. No production forms, emails, payments, database writes or deployment were triggered by this pass.
