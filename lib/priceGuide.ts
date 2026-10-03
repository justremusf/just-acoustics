/*
 * PRICES TO CONFIRM BY OWNER
 * ==========================
 * Typical price ranges shown by the instant price estimator (components/estimator/PriceEstimator.tsx).
 * Every number below is seeded from a figure the site already publishes, or is an extrapolation
 * marked `confirm: true` for the owner to check. All amounts are SGD, supply + installation.
 *
 * Published sources on the site:
 *   [FAQ]    components/sections/FAQ.tsx + app/(site)/contact/page.tsx:
 *            "Smaller spaces usually start from around $1,000; office and home-studio projects
 *            commonly range from $1,000 to $3,000."
 *   [PRICE]  app/(site)/pricing/page.tsx PRICING_RANGES:
 *            Office $1,000–$3,000 · Home studio $1,000–$3,000 · Church from $1,500 ("many hall
 *            projects range from $4,000–$6,000+") · School from $1,000 · Restaurant $2,000–$6,000.
 *   [VSL]    data/vslConfig.ts pricingSnippet: meeting rooms from $2,500 · home studio / listening
 *            room packages from $3,500 · church and hall treatments $15,000–$40,000+ · classrooms
 *            and restaurants quoted by scope.
 *   [REST]   app/(site)/restaurant-echo-reduction/page.tsx: restaurants S$2,000–S$6,000, larger
 *            venues quoted separately.
 *   [OFFICE] app/(site)/office-acoustic-treatment/page.tsx: offices / meeting rooms / call rooms
 *            S$1,000–S$3,000, multi-room or high-ceiling quoted by scope.
 *
 * NOTE conflicting published figures the owner should reconcile:
 *   - Church: [PRICE] says from $1,500 / halls $4,000–$6,000+, [VSL] says $15,000–$40,000+.
 *     The estimator uses [PRICE] for small/medium rooms and [VSL] for very large halls.
 *   - Home studio: [PRICE]/[FAQ] say $1,000–$3,000, [VSL] says packages from $3,500.
 *     The estimator uses $1,000–$3,500 across small/medium and "from $3,500" for large studios.
 *
 * Internal CRM averages were used only to sanity-check the extrapolations (not published):
 * residential ~S$1.6k, offices ~S$4.5k, schools ~S$6.1k, restaurants ~S$2.8k.
 *
 * Table (low – high, or "from"):
 *   Office / meeting room  small   1,000–2,000   [OFFICE]/[PRICE] low; high split       confirm
 *                          medium  2,500–4,000   [VSL] "meeting rooms from 2,500"; high  confirm
 *                          large   4,000–8,000   extrapolated                             confirm
 *                          v.large from 8,000    extrapolated, site visit                 confirm
 *   Restaurant / café      small   1,000–2,000   [FAQ] "smaller spaces from ~1,000"       confirm
 *                          medium  2,000–4,000   [REST]/[PRICE] low 2,000; high split     confirm
 *                          large   4,000–6,000   [REST]/[PRICE] high 6,000
 *                          v.large from 6,000    [REST] "larger venues quoted separately", site visit
 *   School / classroom     small   1,000–2,000   [PRICE] "from 1,000"; high               confirm
 *                          medium  2,000–3,500   extrapolated                             confirm
 *                          large   3,500–6,500   extrapolated                             confirm
 *                          v.large from 6,500    extrapolated, site visit                 confirm
 *   Church / hall          small   from 1,500    [PRICE] "smaller rooms around 1,500"
 *                          medium  from 4,000    [PRICE] "many hall projects 4,000–6,000+"
 *                          large   from 6,000    [PRICE] "6,000+"                         confirm
 *                          v.large from 15,000   [VSL] "15,000–40,000+", site visit
 *   Home / living room     small   1,000–1,800   [FAQ] "from ~1,000"; high               confirm
 *                          medium  1,500–3,000   extrapolated                             confirm
 *                          large   3,000–5,000   extrapolated                             confirm
 *                          v.large from 5,000    extrapolated, site visit                 confirm
 *   Home studio            small   1,000–2,000   [PRICE]/[FAQ] low 1,000; high split      confirm
 *                          medium  2,000–3,500   [PRICE] high 3,000 / [VSL] 3,500         confirm
 *                          large   from 3,500    [VSL] "packages from 3,500"
 *                          v.large from 6,000    extrapolated, site visit                 confirm
 */

export type PriceDisplay = 'range' | 'from'

export type PriceEntry = {
  low: number
  /** Present for `display: 'range'`. */
  high?: number
  display: PriceDisplay
  /** True when the final scope is normally only set after a site visit. */
  siteVisit?: boolean
  /** True when the figure is an extrapolation the owner still needs to confirm. */
  confirm?: boolean
}

export type SizeBandSlug = 'small' | 'medium' | 'large' | 'very-large'

export type SizeBand = {
  slug: SizeBandSlug
  label: string
  area: string
  examples: string
}

export type SpaceType = {
  slug: string
  label: string
  prices: Record<SizeBandSlug, PriceEntry>
}

export const SIZE_BANDS: SizeBand[] = [
  { slug: 'small', label: 'Small', area: 'under 15 m²', examples: 'bedroom, call room' },
  { slug: 'medium', label: 'Medium', area: '15–40 m²', examples: 'meeting room, classroom, living room' },
  { slug: 'large', label: 'Large', area: '40–100 m²', examples: 'open office, café, small hall' },
  { slug: 'very-large', label: 'Very large', area: '100 m²+', examples: 'restaurant floor, church, auditorium' },
]

export const SPACE_TYPES: SpaceType[] = [
  {
    slug: 'office',
    label: 'Office / meeting room',
    prices: {
      small: { low: 1000, high: 2000, display: 'range', confirm: true },
      medium: { low: 2500, high: 4000, display: 'range', confirm: true },
      large: { low: 4000, high: 8000, display: 'range', confirm: true },
      'very-large': { low: 8000, display: 'from', siteVisit: true, confirm: true },
    },
  },
  {
    slug: 'restaurant',
    label: 'Restaurant / café',
    prices: {
      small: { low: 1000, high: 2000, display: 'range', confirm: true },
      medium: { low: 2000, high: 4000, display: 'range', confirm: true },
      large: { low: 4000, high: 6000, display: 'range' },
      'very-large': { low: 6000, display: 'from', siteVisit: true },
    },
  },
  {
    slug: 'school',
    label: 'School / classroom',
    prices: {
      small: { low: 1000, high: 2000, display: 'range', confirm: true },
      medium: { low: 2000, high: 3500, display: 'range', confirm: true },
      large: { low: 3500, high: 6500, display: 'range', confirm: true },
      'very-large': { low: 6500, display: 'from', siteVisit: true, confirm: true },
    },
  },
  {
    slug: 'church',
    label: 'Church / hall',
    prices: {
      small: { low: 1500, display: 'from' },
      medium: { low: 4000, display: 'from' },
      large: { low: 6000, display: 'from', siteVisit: true, confirm: true },
      'very-large': { low: 15000, display: 'from', siteVisit: true },
    },
  },
  {
    slug: 'home',
    label: 'Home / living room',
    prices: {
      small: { low: 1000, high: 1800, display: 'range', confirm: true },
      medium: { low: 1500, high: 3000, display: 'range', confirm: true },
      large: { low: 3000, high: 5000, display: 'range', confirm: true },
      'very-large': { low: 5000, display: 'from', siteVisit: true, confirm: true },
    },
  },
  {
    slug: 'home-studio',
    label: 'Home studio',
    prices: {
      small: { low: 1000, high: 2000, display: 'range', confirm: true },
      medium: { low: 2000, high: 3500, display: 'range', confirm: true },
      large: { low: 3500, display: 'from' },
      'very-large': { low: 6000, display: 'from', siteVisit: true, confirm: true },
    },
  },
]

export const DEFAULT_SIZE_BAND: SizeBandSlug = 'medium'

export function formatPriceSgd(amount: number) {
  return `S$${amount.toLocaleString('en-SG', { maximumFractionDigits: 0 })}`
}

/** Short human-readable price, e.g. "S$1,000 – S$2,000" or "From S$15,000". */
export function formatPriceEntry(entry: PriceEntry) {
  if (entry.display === 'range' && entry.high != null) {
    return `${formatPriceSgd(entry.low)} – ${formatPriceSgd(entry.high)}`
  }
  return `From ${formatPriceSgd(entry.low)}`
}

export function findSpaceType(slug: string | null | undefined) {
  return SPACE_TYPES.find((space) => space.slug === slug)
}

export function findSizeBand(slug: string | null | undefined) {
  return SIZE_BANDS.find((band) => band.slug === slug)
}
