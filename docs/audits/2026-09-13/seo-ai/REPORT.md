# SEO and AI-search verification

13 September 2026. Public evidence collected live during this pass; fixes described below are local and not deployed. Existing design, copy, page structure, prices and customer flows were preserved.

## Findings first

| Area | Verified result | Remaining limitation |
|---|---|---|
| Crawl inventory | 142 sitemap URLs; 156 total URLs checked including linked destinations and llms.txt targets | One public Studio route blocked by live robots; 10 live 404s |
| HTML content | 144 successful HTML pages, each with one H1; no canonical mismatches among indexable pages | This does not prove every page is indexed |
| Structured data | No JSON-LD parse failures in the refreshed live crawl | Google eligibility tested on one representative product page |
| Google Rich Results Test | Flexi product: five valid items; successfully crawled by Google's smartphone inspection tool | Optional warnings listed below; rich results are not guaranteed |
| AI/search header probes | All 21 probes returned HTTP 200, recognizable site content and no detected challenge page | These requests did not originate from verified crawler IPs |
| Search Console | Remus account has verified `https://just-acoustics.vercel.app/`; production domain appears under **Not verified** | Actual production indexing, selected canonicals, impressions/clicks and submitted sitemap processing remain unavailable |
| AI answer visibility | Perplexity test attempted with a generic commercial query | Returned “Sign up and repeat your request”; no valid answer or citation result |
| Public search presence | Site About page, Flexi product and acoustic articles surfaced in public search | Not an exhaustive Google index or Singapore rank report |

Raw HTTP evidence: [live-check.json](live-check.json). This includes timestamps, headers, schema, canonical tags, server-rendered text, links, and crawler-header probes. The live production deployment reported by Vercel is `dpl_3omp7JXkvcYMrVpcNX9J93DuBXHp`, READY, with the production custom domains attached. Vercel runtime logs corroborated HTTP 200/cache HIT on sampled requests; they were predominantly this audit's requests and are not proof of historical bot traffic.

## Crawl and robots

The 156 fetched/skipped URLs comprise 145 HTTP 200 responses (144 HTML pages plus the sitemap target), 10 HTTP 404 responses and one robots exclusion. The ten broken paths are the nine in the earlier technical report plus `/spaces/cinema`, linked by llms.txt. The local implementation already includes redirects for the nine retired URLs. The llms.txt reference now uses the existing `/spaces/studios` page.

The live prefix exclusion `/studio` incorrectly covers `/studio-lander`. The local `/studio$` and `/studio/` exclusions fix that while retaining the API exclusion. Robots controls crawling, not authentication.

Seven user-agent probes, each against homepage, pricing and Flexi product:

| User agent | Current public robots policy | HTTP sample |
|---|---|---|
| Googlebot | Allowed outside excluded paths | 3/3 HTTP 200 |
| bingbot | Allowed outside excluded paths | 3/3 HTTP 200 |
| OAI-SearchBot | Allowed outside excluded paths | 3/3 HTTP 200 |
| PerplexityBot | Allowed outside excluded paths | 3/3 HTTP 200 |
| Claude-SearchBot | Allowed through the general rule | 3/3 HTTP 200 |
| GPTBot | Allowed; existing training preference retained | 3/3 HTTP 200 |
| ClaudeBot | Allowed; existing training preference retained | 3/3 HTTP 200 |

The successful real Google Rich Results fetch gives stronger evidence for Google access than a user-agent probe alone. Vercel's full firewall configuration and verified OpenAI/Perplexity source-IP traffic were not available through the exposed read-only tools, so those platform-wide access claims remain unverified. No firewall protections were weakened.

## Google's actual structured-data test

Tested `https://www.justacoustics.co/shop/flexi-acoustic-panels` on 13 September 2026 at 14:49:02 Singapore time using Google's smartphone inspection tool. [Google test result](https://search.google.com/test/rich-results/result?id=AxyTt5rYJ3ItgLnofBvX7Q) (results may expire).

Five valid items: Product snippets, Merchant listings, Breadcrumbs, Local businesses and Organization. No critical item errors were shown.

Exact optional warnings inspected:

- Product snippets: missing `aggregateRating` and `review`. Do not manufacture ratings or treat general company testimonials as product reviews.
- Merchant listings: missing `shippingDetails` and `hasMerchantReturnPolicy`. These need confirmed commercial policies; no invented policies were added.
- Local business: missing `image`. The local global graph now uses the existing public site-preview/project photograph.
- Organization: the overview indicated a non-critical issue; its detailed issue was not expanded in this sample.

The production LocalBusiness is considered valid by Google's test despite the incomplete street/postal details noted in the earlier audit. That is an eligibility result, not independent verification of a public business location. No unconfirmed street address was added.

Three mounting-accessory pages had no description metadata and null Product descriptions. Local metadata/schema now fall back to the existing product-profile description. Social `sameAs` URLs now match the visible footer's Instagram, Facebook and YouTube destinations. Other existing schema and visible page content remain intact.

All 82 live Article objects lacked images. The local template already conditionally emits an image when a CMS main image exists, so this requires content/source-image review rather than automatically inventing images. Product starting-price/variant ambiguity remains documented in the earlier audit; prices were not changed.

## Sitemap accuracy and llms.txt fixes

The live sitemap emits generation time as `lastmod` for every page. The local queries now include Sanity `_updatedAt` for posts, products, spaces and projects; the sitemap uses those timestamps. Static routes omit `lastmod` because a reliable content modification timestamp is unavailable. URLs and page architecture are preserved.

The local llms.txt repairs the old Cinema route to the actual Studios route. This file is an optional navigation aid, not proof of AI-search inclusion. Google explicitly states that llms.txt does not improve or harm its search rankings, including generative features. [Official Google guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## Search Console and AI visibility

The connected tools initially had no Search Console or Peec AI connection. A Search Console connection was initiated, but remained inactive when rechecked. Separately, the authenticated Google browser revealed:

- The Just Acoustics account cannot access the production domain property and has no listed properties.
- The Remus account has a verified **Vercel-hostname URL-prefix property**, but `sc-domain:justacoustics.co` is explicitly **not verified**.
- No DNS records, ownership changes or sitemap submissions were performed.

This is a monitoring/access gap; Search Console verification is not a prerequisite for being indexed. Verify the production domain through its DNS provider, or use an account with an existing verified production property. Then inspect homepage, pricing, Flexi product, one Space page, one Article, and Studio landing page, and review the submitted sitemap and organic performance. Never present statistics from the Vercel property as production-domain performance.

A real Perplexity search for “Which companies supply and install acoustic panels in Singapore?” returned “Sign up and repeat your request.” It did not yield a meaningful assistant answer, source list or brand visibility result. ChatGPT/Google AI Overview answer inclusion was not measured. Public search results and llms.txt presence cannot substitute for that measurement.

## Current platform guidance

- [OpenAI](https://developers.openai.com/api/docs/bots): OAI-SearchBot controls search crawling; GPTBot is for potential training; ChatGPT-User handles user-directed fetching.
- [Anthropic](https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): Claude-SearchBot is for search, ClaudeBot for potential training, Claude-User for user-directed retrieval. The installed skill's older classification was not used.
- [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): PerplexityBot is for search, with published IP ranges relevant to WAF checks.
- [Google](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): ordinary SEO and useful original content remain the foundation; no special AI schema, mandatory answer-block length or llms.txt is required.

## Local validation

Final lint, TypeScript, production build and whitespace checks passed. All 473 generated JSON-LD blocks parse. The sitemap retains 142 URLs: 129 CMS lastmod values (118 distinct timestamps) and 13 static routes without invented dates. All three accessory pages now have non-empty metadata and Product descriptions; the organization image and footer-aligned social URLs are present. See [local-validation.json](local-validation.json). The three hardening regression tests also pass.

## Release status

All changes remain local. Public browser access now works, but localhost preview access is still rejected by a saved permission rule. No alternate host, browser tool or deployment was used to bypass that rejection. Local visual/mobile/animation verification and production deployment are still pending. This pass does not claim a speed increase or an AI visibility score.

Highest-value next steps: establish production Search Console access, complete local browser verification, deploy the reviewed fixes, recrawl the production sitemap/redirects/schema, and collect real AI-answer samples from authenticated platforms. Content strategy and the site's structure were not expanded.
