# Tracking

Every custom event goes through `trackEvent()` in `components/analytics/trackEvent.ts`, which sends it to all destinations at once:

| Destination | When | Notes |
| --- | --- | --- |
| GA4 (`gtag`) | Always | `analytics_storage` is granted by default. Consent mode controls ad storage. |
| Vercel Web Analytics `track()` | Always | Cookieless. Sends only flat props: `source, method, space, size, cta, calculator, product_slug, value, currency, form_name, page_path`. Custom events need a Pro or Enterprise plan. |
| First-party insights (`/api/insights/events`) | Unless the visitor is in an opt-in region and hasn't chosen yet | Event names must be on `ALLOWED_EVENTS` in `app/api/insights/events/route.ts`. |
| Google Ads conversion | Ad consent allowed **and** a label env var is set | `send_to: AW-…/<label>`, SGD value, `transaction_id` when there is one. |
| Meta pixel | Ad consent allowed | Standard events where Meta has one, otherwise `trackCustom`. Every event gets an `eventID` (`<event>:<Tally id / order ref>`, or `<event>:<random uuid>`) for deduplication. |
| Meta Conversions API (`/api/meta-capi`) | Ad consent allowed **and** `META_CAPI_ACCESS_TOKEN` is set | Server copy of the standard Meta events (`Lead`, `Contact`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) with the **same** `event_id` as the pixel. Not `PageView` or custom events. See [Meta Conversions API](#meta-conversions-api). |
| Microsoft Clarity | Clarity has loaded (analytics consent) | `clarity('event', name)` for every event, plus session tags for `source, method, space, size, cta, calculator, product_slug`. Conversions (`generate_lead`, `whatsapp_click`, `phone_click`, `email_click`, `purchase`) also set the `conversion` tag and call `clarity('upgrade')` so the recording is kept. Filter recordings and heatmaps by *Custom events* or *Custom tags*. |

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

## Meta Conversions API

Server-side copy of the Meta standard events, so Meta still gets conversions when the pixel library is blocked and gets better match keys (IP, user agent, `fbp`/`fbc`) for low-volume events like `Contact`.

**Flow.** `trackEvent()` fires the pixel (`fbq('track', <Standard>, params, { eventID })`) and, in the same branch, `sendMetaServerEvent()` (`lib/metaCapi/client.ts`) posts `{ event_name, event_id, event_source_url, fbclid?, external_id?, custom_data }` to `/api/meta-capi` with `navigator.sendBeacon` (fallback `fetch` keepalive). It is fire-and-forget, so it never delays the page or a WhatsApp/`tel:` redirect. The route (`app/api/meta-capi/route.ts`) answers 204 at once and calls `https://graph.facebook.com/v21.0/<pixel>/events` after the response (`after()`).

**Deduplication.** The browser and server events carry the same `event_name` + `event_id` (`whatsapp_click:<uuid>`, `generate_lead:<Tally submission id>`, `purchase:<order ref>`), so Meta keeps one and marks it *Browser + Server, deduplicated*.

**What the server adds (`user_data`).** `client_ip_address` (first hop of `x-forwarded-for`), `client_user_agent`, `fbp` (the `_fbp` cookie), `fbc` (the `_fbc` cookie, or built as `fb.1.<capture ms>.<fbclid>` from the URL or stored attribution when the cookie is missing) and `external_id` (SHA-256 of the anonymous first-party visitor id). No email, phone or name is collected or sent; `hashUserData()` in `lib/metaCapi/server.ts` normalises and SHA-256-hashes PII if any is ever added. `custom_data` is limited to `value`, `currency`, `content_name`, `content_ids`/`content_type`, `method`, `source` and `space`.

**Consent.** Same rule as the pixel, checked again on the server from the request cookies: `ja_analytics_consent` if the visitor chose; otherwise allowed unless `ja_consent_region=strict` (EEA/UK/CH, or `x-vercel-ip-country` when the cookie is absent). Blocked events get a silent 204.

**Abuse limits.** Same-origin only (`Origin` / `Sec-Fetch-Site`), body ≤ 2 KB, event names allow-listed (the six above), `event_id` must match `<event>:<id>`, `event_source_url` must be on this site's host, a user agent is required, 20 requests per IP per minute per instance (429 after), and a repeated `event_id` is dropped. Limits are in memory per serverless instance, so they are best-effort; add a Vercel Firewall rate-limit rule on `/api/meta-capi` if it is ever abused.

**Env vars (server only, never `NEXT_PUBLIC_`).**

| Var | Required | Notes |
| --- | --- | --- |
| `META_CAPI_ACCESS_TOKEN` | Yes, to switch it on | Without it the route is a no-op (204). Never logged; sent in the request body, not the URL. |
| `META_CAPI_TEST_EVENT_CODE` | No | Adds `test_event_code` so events appear under Events Manager → Test events. **Remove it after testing**: test events are not used for optimisation. |
| `META_PIXEL_ID` | No | Defaults to `NEXT_PUBLIC_META_PIXEL_ID` (343390444711453). |

Errors from Meta are logged as `[meta-capi] Graph API rejected event <status> <code> <message>` in Vercel runtime logs.

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
5. **Meta Conversions API (switch on server events):**
   1. Events Manager → Data sources → dataset **343390444711453** → **Settings** → **Conversions API** → *Set up manually* / **Generate access token**. Copy the token (it is shown once).
   2. Vercel → just-acoustics → Settings → Environment Variables → add `META_CAPI_ACCESS_TOKEN` = the token, environment **Production** only (mark it Sensitive).
   3. Events Manager → dataset → **Test events** tab → copy the test code (e.g. `TEST12345`) → add `META_CAPI_TEST_EVENT_CODE` = that code in Vercel (Production).
   4. Redeploy production (Deployments → latest → Redeploy), since env vars only apply to new deployments.
   5. Open the live site with the Test events tab open, tap a WhatsApp button. `Contact` should appear twice (Browser and Server) and then show as **deduplicated**. In Overview, the `Contact` row should read *Browser • Server* within ~20 minutes.
   6. Delete `META_CAPI_TEST_EVENT_CODE` from Vercel and redeploy again, so live events count for optimisation.
   7. After a few days, check Events Manager → `Contact` → *Event match quality* and *Deduplication* (aim for "Good" or better).
6. **Tally → form → Hidden fields:** add `space`, `size`, `lead_ref`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `campaign_id`, `ad_group_id`, `ad_id`, `landing_page`, `referrer`, `consent_state`. The names must match exactly. The webhook (`app/api/tally-webhook`) forwards them to Make as `attribution.*`.
7. **WhatsApp Business:** chats start with the contextual message and end with the usual "Lead ref / Source / Campaign / Keyword / Landing page" block.
