# Full SEO Audit: justacoustics.co

Analyzed: 2026-05-01T10:00:23Z
Scope: live crawl of homepage, robots.txt, sitemap.xml, llms.txt, HTTP headers, and representative template pages from the XML sitemap.

## Executive Summary

- Overall SEO Health Score: 65/100
- Business type detected: Local service business, Singapore acoustic treatment and installation
- Primary risk: the site has mixed host signals across redirects, sitemap, canonicals, and `llms.txt`
- Strongest positives: indexable HTML content, clean robots rules, good image alt coverage on sampled pages, and useful service/blog depth

## Top 5 Critical Issues

1. Host consistency is broken. `https://justacoustics.co/*` 308-redirects to `https://www.justacoustics.co/*`, but `robots.txt`, `sitemap.xml`, and many canonicals still use the non-`www` host.
2. Canonical tags are missing on several core pages sampled, including `/`, `/about`, `/contact`, `/products`, and `/services`.
3. `llms.txt` contains a dead URL: `https://justacoustics.co/pricing` returned `404` on 2026-05-01.
4. `llms.txt` references `/shop`, but `/shop` is missing from `sitemap.xml`, which creates a discoverability/indexation gap.
5. Several key titles and meta descriptions are outside good SEO ranges, especially on service and product pages.

## Top 5 Quick Wins

1. Pick one canonical host, then align redirects, sitemap URLs, canonicals, structured data URLs, and `llms.txt` to it.
2. Add canonical tags to all listing and core pages through shared metadata.
3. Remove or fix the broken `/pricing` reference in `llms.txt`.
4. Add `/shop` to the XML sitemap if it should rank and be indexed.
5. Rewrite short or overlong titles and meta descriptions on key commercial pages.

## Technical SEO

### What is working

- `robots.txt` is reachable and simple:
  - `Allow: /`
  - `Disallow: /studio`
  - `Disallow: /api/`
- `sitemap.xml` is reachable and returned `200`.
- HTML pages render server-side and return `200`.
- HTTPS is enforced and `Strict-Transport-Security` is present.
- `llms.txt` exists and is machine-readable.

### Findings

#### 1. Mixed canonical host across the site

- Requesting `https://justacoustics.co` returned `308` to `https://www.justacoustics.co/`.
- `robots.txt` declares `Sitemap: https://justacoustics.co/sitemap.xml`.
- `sitemap.xml` lists non-`www` URLs.
- Sample canonicals on deeper pages also point to non-`www`, for example:
  - `/projects` -> `https://justacoustics.co/projects`
  - `/blog` -> `https://justacoustics.co/blog`
  - `/services/education-spaces` -> `https://justacoustics.co/services/education-spaces`

Impact:
- Search engines can reconcile this, but it is still a trust and consolidation leak.
- It increases the chance of inconsistent canonicalization and diluted signals.

Recommendation:
- Standardize on either `www` or apex. Given the current redirect behavior, `www` appears to be the intended canonical host.

#### 2. Missing canonical tags on important core pages

Sampled pages missing canonical tags:

- `/`
- `/about`
- `/contact`
- `/products`
- `/services`

Impact:
- Core commercial pages rely only on redirects and internal consistency rather than explicit canonical signals.

Recommendation:
- Add explicit canonicals to every indexable page via shared metadata generation.

#### 3. Important security headers are missing

Present:
- `Strict-Transport-Security`

Not observed on the homepage response:
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

Impact:
- This is more security than ranking, but weak security posture is still a technical quality issue.

Recommendation:
- Add a baseline header policy at the framework or edge level.

#### 4. No-cache HTML responses

- Homepage HTML returned `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`.

Impact:
- This can increase repeat-request latency and make the site feel slower than necessary.
- It is not a direct ranking penalty, but it can compound performance issues.

Recommendation:
- Review whether fully dynamic caching is necessary for all marketing pages.

## Sitemap & Indexation

### Findings

#### 1. XML sitemap is present but misaligned with the live canonical host

- `sitemap.xml` returned `200`.
- It contains 55 URLs.
- URLs are listed on `https://justacoustics.co/...` while the site redirects to `https://www.justacoustics.co/...`.

#### 2. Important live page omitted from sitemap

- `https://www.justacoustics.co/shop` returned `200`.
- `/shop` is referenced in `llms.txt`.
- `/shop` is not present in `sitemap.xml`.

Impact:
- If `/shop` is intended to rank, sitemap omission weakens discovery and indexation confidence.

#### 3. Broken AI-surface reference

- `https://www.justacoustics.co/pricing` returned `404`.
- `llms.txt` currently advertises that URL as a core page.

Impact:
- AI crawlers and downstream systems get stale, low-trust guidance.

Recommendation:
- Keep `llms.txt` consistent with real, indexable URLs only.

## On-Page SEO

### Metadata sample findings

Good:
- Homepage title length: 57
- Homepage meta description length: 146

Weak examples:
- `/about` title length: 22
- `/contact` meta description length: 99
- `/products` meta description length: 101
- `/services` meta description length: 107
- `/blog` meta description length: 89
- `/products/custom-print-acoustic-panels` meta description length: 198
- `/blog/why-singapore-restaurants-need-acoustic-treatment` title length: 66
- `/services/education-spaces` title length: 80
- `/services/offices-meeting-rooms` title length: 88

Impact:
- Some pages are under-explaining the offer in SERPs.
- Some pages are too long and risk truncation.

Recommendation:
- Target title tags around 50-60 characters.
- Target meta descriptions around 140-155 characters.
- Prioritize service and product detail pages first.

### Heading structure

- Sampled pages consistently had one `H1`.
- This is a positive signal and should be preserved.

## Content Quality

### Strengths

- The site has dedicated pages for verticals like offices, churches, education, restaurants, gyms, studios, and products.
- Blog content exists for commercial-relevant use cases in Singapore.
- Portfolio/projects content is present.

### Gaps

- Core listing pages appear commercially useful but metadata is often weak.
- Trust/E-E-A-T signals are lighter on the top-level pages than they should be for a local service business.
- There is no obvious pricing page, despite `llms.txt` suggesting one exists.

Recommendation:
- Strengthen homepage, about, and contact with clearer proof elements:
  - founder/company credibility
  - project counts
  - named client categories
  - review/testimonial proof
  - clearer service-area trust copy

## Schema / Structured Data

### What is present

- Homepage sample included:
  - `PostalAddress`
  - `Country`
  - `ContactPoint`
  - `FAQPage`
  - `Question`
  - `Answer`
- Service detail pages included stronger schema patterns:
  - `Service`
  - `LocalBusiness`
  - `BreadcrumbList`
- Blog article sample included:
  - `Article`
  - `Organization`
  - `ImageObject`
  - `WebPage`
  - `BreadcrumbList`

### Gaps

- Core top-level pages sampled did not expose a clear top-level `Organization` or `LocalBusiness` schema pattern.
- Schema implementation is inconsistent by template.

Recommendation:
- Add a stable sitewide `Organization` or `LocalBusiness` graph to homepage, about, and contact.
- Keep page-level schema on top of that:
  - `Service` for service pages
  - `Product` for product/shop pages where appropriate
  - `Article` for blog posts

## Images

### What is working

- Sampled pages showed strong image alt coverage.
- No missing alt text was detected on the sample set.

### Remaining opportunity

- The sample did not include image weight or next-gen format verification.
- Product and project pages should still be checked for actual byte size and responsive delivery.

## AI Search Readiness

### Positives

- `llms.txt` exists.
- The site has verticalized service pages and resource content, which is good for citation and answer retrieval.
- Contact details and service area are explicit.

### Issues

- `llms.txt` uses the non-canonical host.
- `llms.txt` references a broken `/pricing` page.
- `llms.txt` references `/shop`, but the sitemap does not.

Recommendation:
- Treat `llms.txt` like a maintained index, not a static marketing file.
- Align it with the canonical host and real indexable URLs only.

## Performance

Limitations:
- Live PageSpeed Insights data could not be pulled in this environment because the public endpoint returned a quota-exceeded `429`.
- No CrUX or Search Console credentials were available.

What can still be said from live headers:
- Marketing HTML appears to be served dynamically with no-store caching.
- That likely leaves performance headroom on repeat visits and crawl efficiency.

Recommendation:
- Run Lighthouse or PageSpeed from a dedicated quota-bearing environment.
- Check whether static generation or edge caching can be expanded for marketing pages.

## Local SEO

Detected signals:
- Singapore service area is explicit.
- WhatsApp and email are present in `llms.txt`.
- Service pages use `LocalBusiness` schema.

Gaps:
- Local business schema is not consistently visible on top-level pages sampled.
- Review and authority signals should be more prominent on core commercial pages if available.

## Prioritized Action Plan

### Critical

1. Unify host signals across redirect target, sitemap, canonicals, schema URLs, and `llms.txt`.
2. Add canonical tags to all core/indexable pages.
3. Remove or fix the broken `/pricing` URL in `llms.txt`.

### High

1. Add `/shop` to `sitemap.xml` if it should be indexed.
2. Normalize title and meta description lengths across service, product, and blog pages.
3. Add sitewide `Organization` or `LocalBusiness` schema on homepage, about, and contact.

### Medium

1. Add missing security headers.
2. Review cache strategy for marketing pages.
3. Expand visible E-E-A-T proof on top-level pages.

### Low

1. Validate image compression and responsive delivery.
2. Add richer internal linking between services, products, projects, and supporting blog content.

## Tool Limitations

- This audit used live HTTP fetching, sitemap inspection, metadata sampling, and header checks.
- No Google Search Console, GA4, CrUX, Moz, or Bing Webmaster API data was available.
- PageSpeed Insights requests returned `429 quota exceeded`, so no lab or field CWV score is included here.
- Visual/mobile screenshot verification was not run in this pass.

