# Just Acoustics: organic enquiries and ranking plan

13 September 2026. Preserve existing design, URLs and customer flows. Implementation below is local, not deployed. No measured ranking improvement is claimed.

## Priority decision

Focus on Singapore buyers looking for treatment, installation and costs. Existing service, product and project pages are the foundation. There are already 82 articles in the live crawl; volume alone is not the next priority. Acoustic treatment controls reflections within rooms; do not position it as structural soundproofing.

## Existing page ownership

These are proposed query themes, not measured search volumes or current Google positions. Confirm against production Search Console before merging, redirecting or deindexing any overlapping pages.

| Search intent | Existing primary page | Role and next evidence to strengthen |
|---|---|---|
| Acoustic panels and treatment Singapore | `/` | Main company and service introduction; retain navigation to spaces, products and consultation |
| Acoustic panel selection and installation | `/acoustic-panels-singapore` | Buyer guidance; compare search-query overlap with homepage before further optimisation |
| Office acoustics, meeting-room echo | `/spaces/offices` | Comprehensive office service and existing related projects |
| Office consultation | `/office-acoustic-treatment` | Existing focused landing page; retain until actual query/conversion data supports consolidation |
| Church acoustic treatment | `/spaces/churches` | Speech and worship-room treatment, with actual church projects |
| Restaurant echo reduction | `/spaces/restaurants` | Dining-room reflections, installation constraints and actual restaurant projects |
| Studio acoustic treatment | `/spaces/studios` | Recording/listening-room use cases and relevant completed work |
| Acoustic treatment price Singapore | `/pricing` | Existing budget guidance; substantiate inclusions, scope assumptions and installation factors |
| Buy acoustic panels | `/shop` and relevant product pages | Product specifications, current options and prices; keep service and purchase intent distinct |
| Installation examples | `/projects/*` | First-hand proof: existing problem, solution, result, photographs and permitted client details |
| Informational questions | Relevant existing `/blog/*` | Review correctness and link contextually to the matching existing service/product; avoid blanket links |

## Implemented in this pass

- Dynamic service, product, project and article pages now emit their own Open Graph URL, title, description and Twitter metadata. This fixes inherited homepage URLs/images in previews; it is not presented as a direct ranking boost.
- Existing product SEO descriptions take precedence over generic short descriptions, with the existing product-profile fallback retained.
- Project search titles explicitly identify acoustic treatment projects. CMS service SEO titles remain respected; missing titles have a descriptive Singapore acoustic-treatment fallback.
- Article previews use the Article type and recorded publication date. Removed the unsupported assumption that publication date was also the latest modification date.
- No visible body copy, layout, URL structure, pricing, forms or tracking contracts changed in this pass.

Earlier local fixes remain: nine legacy URL redirects, narrower Studio robots exclusions, genuine CMS sitemap timestamps, three accessory descriptions, organisation image/social alignment, JSON-LD safety, and first-load animation/performance corrections. See `seo-ai/REPORT.md` for evidence and limitations.

## Commercial evidence to improve next

Use the existing CMS sections. Each item needs source material, not invented claims.

| Priority | Existing content to improve | Source required | Completion check |
|---|---|---|---|
| 1 | One office case study | Approved photographs, room use, actual treatment and installation scope | Clear problem → treatment → outcome; link from office page |
| 2 | One church case study | Approved client details, speech/music problem and installed treatment | Distinguish measured results from client feedback |
| 3 | One restaurant case study | Actual dining-room constraints, finish choice and completed installation | Explain practical customer problem and solution |
| 4 | Pricing explanations | Confirmed scope, inclusions and exclusions | Existing price ranges reconcile with current offering |
| 5 | Product trust details | Valid test reports and confirmed shipping/return policy | Claims and schema match published facts; no fabricated ratings |
| 6 | Existing articles | Accurate author/reviewer attribution and relevant original imagery | Prioritise articles earning impressions or assisting enquiries |

Do not fill the 82 missing article images with unrelated stock photos solely to satisfy a markup warning. Review the articles' actual subjects and available source photography first.

## Competitive context

Public search discovery surfaced these relevant competitors. This is an opportunity sample, not a controlled Singapore SERP ranking or backlink audit.

- [Aural-Aid](https://auralaid.com/services/): consultation, supply, installation and testing support. Implication: make Just Acoustics' actual service scope and technical evidence clear.
- [Pepperwall](https://www.pepperwall.net/): customisation, installation and named project proof. Implication: strengthen existing completed-project content.
- [NoiseStop](https://www.noisestopsystems.sg/acoustic_panels_diffusers.php): technical acoustic-product positioning. Implication: support material/performance statements with actual documentation.
- [AV Intelligence](https://av-intelligence.com/pages/office-acoustic-treatment-singapore): dedicated office treatment content. Implication: office pages should address buyer-specific meeting-room problems.
- [B-Acoustics](https://b-acoustics.com/services/office-acoustics-singapore.html): dedicated office acoustics service. Implication: differentiate with actual project experience and process rather than repeating generic advice.

No domain-authority estimates, keyword volumes or competitor traffic estimates were available or invented.

## Delivery order and measurement

1. **Release foundation:** complete the blocked local browser verification, then deploy the reviewed patch; verify production redirects, robots, sitemap and metadata. Local work cannot affect public rankings before deployment.
2. **Establish the baseline:** verify `justacoustics.co` in Search Console. The accessible Vercel-hostname property is not a substitute. Export the latest 90 days by query/page, filtered to Singapore, with device split and branded/non-branded views.
3. **First four weeks after release:** inspect priority URLs and sitemap processing; fix actual indexing exclusions and Google-selected canonical mismatches. Prioritise relevant queries already receiving impressions, particularly pages near page one. Record organic enquiries alongside clicks.
4. **Weeks 5–8:** strengthen the office/church/restaurant proof above within existing CMS sections. Review related article links, avoiding repetitive keyword anchors. Evaluate actual query overlap before any consolidation.
5. **Weeks 9–12:** compare 28-day periods and the pre-release baseline. Review click-through rate at comparable query/position/device mix. Continue what earns qualified enquiries. Audit Google Business Profile ownership, accurate services and genuine reviews separately; no profile mutations or outreach were performed here.

| KPI | Baseline | Operational target |
|---|---|---|
| Relevant non-brand organic clicks from Singapore | Unavailable until production Search Console access | Set a growth target after baseline; do not promise a percentage now |
| Organic qualified enquiries / booked visits | Attribution needs reconciliation | Track monthly alongside clicks; exclude spam and duplicates |
| Priority page impressions, clicks, CTR, position | Unavailable | Weekly page/query review; monthly decisions |
| Known broken legacy links | 10 live 404 destinations in audit | All known affected destinations resolve correctly after release |
| Priority URL indexability and canonical alignment | HTML verified; actual Google indexing unavailable | Inspect each core service/product/pricing page after release |
| Mobile Core Web Vitals | No valid field baseline collected | Aim for p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 once sufficient data is available |
| AI answer citations | Not measured; authenticated test blocked | Repeat a fixed set of commercial prompts and record dated answers/sources; no visibility score from bot probes |

## AI search and ranking expectations

Search crawlers could fetch sampled content, but that does not prove indexing, rankings or citations. Google states that generative search uses the same foundational SEO principles and requires no special AI schema. Useful original project evidence, clear service descriptions, crawlable pages and trustworthy business information are the priorities. [Google guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

Search titles should describe the actual page concisely; Google can still generate a different title. [Google title guidance](https://developers.google.com/search/docs/appearance/title-link).

Higher rankings cannot be guaranteed. The measurable objective is more relevant Singapore organic enquiries, with rankings tracked as a supporting signal.
