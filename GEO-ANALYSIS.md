# Just Acoustics GEO Analysis

**Audited:** 31 August 2026  
**Primary host:** `https://www.justacoustics.co`  
**Scope:** live crawler surfaces, source code, structured data, content architecture, and AI-search citability.

## GEO readiness: 76/100

| Platform | Score | What matters next |
| --- | ---: | --- |
| Google AI Overviews | 78 | Consolidate overlapping articles, earn authoritative Singapore references, and strengthen project proof. |
| ChatGPT search | 72 | Build clear entity signals beyond the site: verified profiles, reputable third-party mentions, and cited expert content. |
| Perplexity | 74 | Publish practical, source-backed answers and earn credible discussions or features rather than creating more near-duplicate posts. |

The site has a sound technical base: it is server-rendered, uses `www` consistently, returns a sitemap, and exposes organisation, product, service, article, breadcrumb, and FAQ structured data. The biggest limiter is not crawler access. It is whether a page is the most useful, distinct, evidenced answer for a query.

## What was verified

| Area | Status | Evidence |
| --- | --- | --- |
| Canonical host | Good | `www.justacoustics.co` is used by the app metadata, sitemap, and live crawler endpoints. |
| AI-crawler access | Good after this change is deployed | The prior catch-all robots rule already allowed all crawlers. Named rules now preserve access for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, and PerplexityBot. |
| `llms.txt` | Improved | It existed, but its service links used old redirect URLs. It now points directly to live `/spaces/*` pages and includes core answer pages and bounded claims. |
| Rendering | Good | Next.js pages render primary text, headings, FAQs, and links on the server. Do not move article bodies or core service explanations behind client-only interfaces. |
| Entity schema | Improved | The root now creates stable Organisation and WebSite IDs so articles and services can refer to the same publisher entity. |
| Blog schema | Good after this change is deployed | Articles use canonical URLs, author/publisher entity IDs, language, dates, breadcrumb markup, and visible FAQs. |
| Product schema | Good | Shop pages expose Product, Offer, and BreadcrumbList markup. Keep prices, availability, and specifications current. |

## Citability assessment

The home page contains concise, extractable answers for acoustic panels, cost, installation time, customisation, and the treatment-versus-soundproofing distinction. This is a strong starting point.

The Resource Center has extensive coverage, but several pages pursue the same intent: broad treatment guides, room-specific guides, cost guides, panel-count guides, and short buying questions. AI systems reward a definitive answer with helpful supporting evidence, not several pages that slightly rephrase it.

### Content rule for every new or revised article

1. Answer the primary question in the first 40–60 words.
2. Follow it with one self-contained 134–167-word answer block that can stand alone in a citation.
3. Use question-led H2s, a small decision table, visible FAQs, original photos or diagrams, and 2–4 relevant internal links.
4. Cite primary or official material when making technical, fire-safety, regulatory, or performance claims. Do not use generic claims such as “best”, “fire-rated”, or a specific NRC figure unless the product documentation proves it.
5. Include a named Just Acoustics reviewer, role, publish date, and honest “last reviewed” date only when editorial review actually occurs.

## Highest-impact work, in order

1. **Consolidate before adding volume.** Choose one canonical page for each major intent: acoustic treatment vs soundproofing, acoustic panels in Singapore, office treatment, restaurant treatment, church treatment, residential treatment, RT60, panel placement, and pricing. Redirect or de-index weaker overlaps only after checking Search Console impressions and links.
2. **Turn projects into evidence pages.** Each finished installation should document the room type, starting problem, constraints, treatment category, installation approach, client-approved quote, and measured outcome where available. Do not invent RT60 improvements or performance figures.
3. **Add author and reviewer fields to Sanity.** Use a real expert name, role, bio, and LinkedIn profile where available. Article schema should reference that Person. This is more credible than an anonymous company byline.
4. **Build independent entity proof.** Maintain accurate Google Business Profile, Apple Business Connect, Bing Places, LinkedIn, Facebook, Instagram, and relevant Singapore architecture/interior directories. Seek useful editorial mentions and project features; do not buy links or manufacture forum posts.
5. **Create one original tool or dataset.** A transparent acoustic-panel budget planner, room measurement checklist, or anonymised annual “Singapore Room Acoustics” survey can earn citations that product pages cannot.

## Schema roadmap

| Page type | Keep / add | Constraint |
| --- | --- | --- |
| Site root | Organisation, LocalBusiness, WebSite | Keep name, contact data, service area, and social profiles identical to verified profiles. |
| Blog post | Article, BreadcrumbList, visible FAQPage | Add Person schema only for genuine authors/reviewers. |
| Space page | Service, BreadcrumbList, FAQPage | Describe the actual service and refer to the root organisation ID. |
| Shop item | Product, Offer, BreadcrumbList | Use only real prices, availability, GTINs, reviews, and technical documentation. |
| Project | Case-study style Article/CreativeWork, BreadcrumbList | Use measurements and testimonial claims only with approval and evidence. |

## Delivery notes

The code and `llms.txt` changes in this checkout are not live until deployed. `llms.txt` is an emerging convention, not a ranking switch; it makes the site easier to understand but does not replace crawlability, ranking, authority, or third-party brand proof.

## Limits of this audit

- No Google Search Console, Bing Webmaster Tools, Google Business Profile, AI mention-tracking, or paid keyword database was connected.
- No assertion has been made about current ranking, AI citations, reviews, or third-party directory listings.
- The live crawler endpoint checked was the production `www` host; the source changes still require normal build, deployment, and post-deploy smoke tests.

