# SEO Action Plan: justacoustics.co

## Recommendation

Fix canonical/indexation consistency first. That is the highest-leverage track because it affects every page, every crawler, and every downstream signal.

## Critical: Fix This First

1. Standardize the canonical host.
Why:
The live site resolves to `https://www.justacoustics.co`, but sitemap, canonicals, and `llms.txt` still advertise `https://justacoustics.co`.

2. Add canonical tags to all core pages.
Why:
Homepage and main listing pages sampled are missing canonicals.

3. Remove or replace the broken `/pricing` page reference from `llms.txt`.
Why:
It currently returns `404`, which lowers trust for AI crawlers and users.

## High: Next 7 Days

1. Add `/shop` to the XML sitemap if it should be indexed.
2. Tighten metadata on money pages.
3. Add sitewide `Organization` or `LocalBusiness` schema to homepage, about, and contact.

## Metadata Priorities

- Short titles to rewrite:
  - `/about`
- Short metas to rewrite:
  - `/contact`
  - `/products`
  - `/services`
  - `/blog`
- Overlong titles to trim:
  - `/services/offices-meeting-rooms`
  - `/services/education-spaces`
  - `/blog/why-singapore-restaurants-need-acoustic-treatment`
- Overlong metas to trim:
  - `/products/custom-print-acoustic-panels`

## Recommended Order

1. Host + canonical cleanup
2. `llms.txt` cleanup
3. Sitemap coverage cleanup
4. Schema consistency
5. Metadata rewrites
6. Security headers and cache review

## Expected Outcome

- Cleaner canonical consolidation
- Better crawl/index trust
- Fewer mixed signals for Google and AI crawlers
- Better CTR potential on service and product pages

## Next Step

Best next move is to implement the host/canonical/`llms.txt` fixes in one pass, then regenerate the sitemap and re-run the audit.

