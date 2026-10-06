# Tracking

Every custom event goes through `trackEvent()` in `components/analytics/trackEvent.ts`, which sends it to all destinations at once:

| Destination | When | Notes |
| --- | --- | --- |
| GA4 (`gtag`) | Always | `analytics_storage` is granted by default. Consent mode controls ad storage. |
| Vercel Web Analytics `track()` | Always | Cookieless. Sends only flat props: `source, method, space, size, cta, calculator, product_slug, value, currency, form_name, page_path`. Custom events need a Pro or Enterprise plan. |
| First-party insights (`/api/insights/events`) | Unless the visitor is in an opt-in region and hasn't chosen yet | Event names must be on `ALLOWED_EVENTS` in `app/api/insights/events/route.ts`. |
| Google Ads conversion | Ad consent allowed **and** a label env var is set | `send_to: AW-…/<label>`, SGD value, `transaction_id` when there is one. |
| Meta pixel | Ad consent allowed | Standard events where Meta has one, otherwise `trackCustom`. `eventID` is set for deduplication. |

Ad consent comes from `readAnalyticsConsent() === 'all'` (`lib/analyticsConsent.ts`). It is on by default in Singapore and other standard regions. In the EEA, UK and CH it stays off until the visitor taps OK (`middleware.ts` sets `ja_consent_region`).

## Events

| Event | Fires when | Key params | GA4 | Ads label env | Meta | Vercel | 1st-party |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `generate_lead` | Once per Tally submission, on `/thank-you?submitted=tally&submission_id=…` (`LeadConversionTracker`). The Tally `FormSubmitted` message only records the submission and redirects. | `source=tally_form`, `form_name`, `source_page`, `value=1 SGD`, attribution (utm_*, gclid, lead_ref…) | ✓ | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD` (`transaction_id` = submission id) | `Lead` (eventID `generate_lead:<id>`) | ✓ | ✓ |
| `whatsapp_click` | Any WhatsApp link | `source`, `method=whatsapp`, `link_url`, attribution | ✓ | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP` | `Contact` | ✓ | ✓ |
| `phone_click` | Any `tel:` link | `source`, `method=phone` | ✓ | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE` | `Contact` | ✓ | ✓ |
| `email_click` | Any `mailto:` link | `source`, `method=email` | ✓ | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_EMAIL` | `Contact` | ✓ | ✓ |
| `price_estimate_view` | Estimator shows a price (space + size picked) | `space`, `size`, `price_low`, `price_high`, `price_label` | ✓ | – | custom | ✓ | ✓ |
| `price_estimate_cta_click` | Estimator "Get my exact quote" / "Ask on WhatsApp" | `cta` (`exact_quote`/`whatsapp`), `space`, `size` | ✓ | – | custom | ✓ | ✓ |
| `calculator_used` | Panel calculator: first input change (`/acoustic-panel-calculator`) or "show results" (product page calculator) | `calculator` (`panel_calculator`/`product_calculator`), `room_type`, `panels_low/high` | ✓ | – | custom | ✓ | ✓ |
| `product_view` | Product page load | `product_slug`, `product_name`, `product_line` | ✓ | – | `ViewContent` | ✓ | ✓ |
| `product_option_selected` | Product option change | `product_slug`, `option`, `option_value` | ✓ | – | – | ✓ | ✓ |
| `add_to_cart` | Add to cart | `product_slug`, `quantity`, `value`, `currency`, `items[]` (built automatically) | ✓ | – | `AddToCart` | ✓ | ✓ |
| `cart_opened` | Cart drawer opened | `item_count` | ✓ | – | – | ✓ | ✓ |
| `begin_checkout` | `/checkout` with a non-empty cart, once per visit | `value`, `currency`, `items[]` | ✓ | – | `InitiateCheckout` | ✓ | ✓ |
| `purchase` | Only once the PayNow transfer is matched and the order page shows "paid" (`/orders/<ref>`), once per reference per device. Unpaid orders never count. | `transaction_id`=order ref, `value`=total incl. delivery, `shipping`, `items[]` | ✓ | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE` | `Purchase` | ✓ | ✓ |
| `vsl_space_type_selected` | Interactive video space picker | `space_type` | ✓ | – | custom | ✓ | ✓ |

Page views: GA4 uses its own `config` hit, plus enhanced-measurement history events for client-side navigation. Meta gets `PageView` on load and on every route change (`FirstPartyInsights`). Vercel tracks routes automatically. First-party insights records `page_view`, `pricing_view`, `blog_view`, `landing_page_view`, `page_engaged`, `page_deep_read`, `page_cta_clicked` and `pricing_range_opened`; these go to insights only.

### `source` values (contact clicks)

`floating_button`, `mobile_bar`, `footer`, `contact_page`, `thank_you`, `lander_hero`, `lander_footer`, `church_lander`, `price_estimator`, `panel_calculator`, `product_calculator`, `inline_link` (anything else: blog, project, checkout help, order page, `/link`).

Links rendered with `TrackedAnchor` or `WhatsAppLink` track themselves (`data-ja-tracked`). `ContactClickTracker` catches every other `wa.me` / `tel:` / `mailto:` link on the site. If an ancestor has `data-track-source`, that sets `source`. Each click fires exactly once.

## WhatsApp messages

The message is built by `lib/whatsappContext.ts` (pure logic) and `hooks/useWhatsAppHref.ts`, and rendered through `components/analytics/WhatsAppLink.tsx`. It uses only what this session already knows (sessionStorage `ja_browsing_context_v1`):

- **Space:** `/spaces/<slug>`, the ad landers (`/office-acoustic-treatment` → office, `/restaurant-echo-reduction` → restaurant, `/school-acoustic-treatment` → school, `/acoustic-panels-singapore` → home, `/church-acoustics` → church) and estimator picks (weighted ×2). The current page wins; otherwise the most-viewed space, with ties going to the most recent.
- **Estimate:** the last estimator result, e.g. "I saw the S$2,500–4,000 estimate for a medium room."
- **Product:** the name, on that product's page only.
- **Lead source block:** underneath the message: `Lead ref`, `Source` (utm source/medium, or google / cpc from a gclid, meta / paid social from an fbclid, a referring site, or direct), then `Campaign`, `Ad`, `Keyword` and `Landing page` when known.

The server HTML always has the generic text (or the lander's own text). The contextual message replaces it after mount. Installation-enquiry and order messages in the cart, checkout and order pages are left as they are.

## Attribution

`AttributionProvider` captures `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `ttclid`, `campaign_id`, `ad_group_id`, `ad_id`, the landing page, the referrer and `lead_ref` on every route (`lib/tallyAttribution.ts`). These values reach:

- **Tally:** every captured key is added to the embed URL as a URL parameter, plus `space` / `size` when `/contact` is opened from the estimator. **Tally only keeps the ones that exist as Hidden fields in the form.**
- **Orders:** `CheckoutClient` sends an `attribution` object with the checkout POST.
- **Every event:** contact clicks and `generate_lead` carry them as params.

## Owner to-dos (dashboards)

1. **Vercel → Project → Analytics → Enable** (Web Analytics) and **Speed Insights → Enable**, then redeploy. The `<Analytics/>` and `<SpeedInsights/>` components are already in `app/layout.tsx` and render in production builds. "Web Analytics not found" only means the dashboard toggle is off. Custom events (`track()`) appear under Analytics → Events on Pro plans.
2. **Google Ads → Goals → Conversions → New conversion action → Website → manual (gtag)**. Create these actions and copy the label part of each `send_to` (`AW-XXXXXXX/<label>`) into Vercel env vars:
   - "Lead form submitted": category *Submit lead form*, Primary, value 1 SGD, count *One* → `NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD`
   - "WhatsApp click": *Contact*, Primary (or Secondary if you only bid on forms), count *One* → `NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP`
   - "Phone click": *Phone call lead* → `NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE`
   - "Email click": *Contact*, Secondary → `NEXT_PUBLIC_GOOGLE_ADS_LABEL_EMAIL`
   - "Online order": *Purchase*, use transaction-specific values, count *Every* → `NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE`
   - Also set `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXX`. All `NEXT_PUBLIC_*` vars are baked in at build time, so redeploy after changing them.
3. **GA4 → Admin → Events:** mark `generate_lead`, `whatsapp_click`, `phone_click` and `purchase` as **Key events** (optionally `email_click`). Check that Admin → Data streams → Enhanced measurement has "Page changes based on browser history events" on. Link GA4 to Google Ads (Admin → Product links).
4. **Meta Events Manager:** confirm the pixel in `NEXT_PUBLIC_META_PIXEL_ID` receives `PageView`, `Lead`, `Contact`, `ViewContent`, `AddToCart`, `InitiateCheckout` and `Purchase`. Create custom conversions from `Lead` (form) and `Contact` (WhatsApp/phone) for ad optimisation. The custom events `price_estimate_view` and `calculator_used` are good audience seeds.
5. **Tally → form → Hidden fields:** add `space`, `size`, `lead_ref`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `campaign_id`, `ad_group_id`, `ad_id`, `landing_page`, `referrer`, `consent_state`. The names must match exactly. The webhook (`app/api/tally-webhook`) forwards them to Make as `attribution.*`.
6. **WhatsApp Business:** chats start with the contextual message and end with the usual "Lead ref / Source / Campaign / Keyword / Landing page" block.
