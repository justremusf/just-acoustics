/*
 * Typical price ranges shown by the instant price estimator (components/estimator/PriceEstimator.tsx).
 * All amounts are SGD, supply + installation.
 *
 * The owner confirmed this table on 3 October 2026 (every range as drafted; churches/halls priced
 * by size, from about S$1,500 for small halls to S$15,000–40,000+ for large sanctuaries).
 * Keep the rest of the site's published prices consistent with it.
 *
 * Published sources the numbers were seeded from:
 *   [FAQ]    components/sections/FAQ.tsx + app/(site)/contact/page.tsx:
 *            "Smaller spaces usually start from around $1,000; office and home-studio projects
 *            commonly range from $1,000 to $3,000."
 *   [PRICE]  app/(site)/pricing/page.tsx PRICING_RANGES:
 *            Office $1,000–$3,000 · Home studio $1,000–$3,000 · Church from $1,500 ("many hall
 *            projects range from $4,000–$6,000+") · School from $1,000 · Restaurant $2,000–$6,000.
 *   [VSL]    data/vslConfig.ts pricingSnippet: meeting rooms from $2,500 · larger home studios
 *            from $3,500 · large sanctuaries $15,000–$40,000+.
 *   [REST]   app/(site)/restaurant-echo-reduction/page.tsx: restaurants S$2,000–S$6,000, larger
 *            venues quoted separately.
 *   [OFFICE] app/(site)/office-acoustic-treatment/page.tsx: offices / meeting rooms / call rooms
 *            S$1,000–S$3,000, multi-room or high-ceiling quoted by scope.
 *
 * Internal CRM averages were used only to sanity-check the extrapolations (not published):
 * residential ~S$1.6k, offices ~S$4.5k, schools ~S$6.1k, restaurants ~S$2.8k.
 *
 * Table (low – high, or "from"):
 *   Office / meeting room  small   1,000–2,000   [OFFICE]/[PRICE] low; high split
 *                          medium  2,500–4,000   [VSL] "meeting rooms from 2,500"; high
 *                          large   4,000–8,000   extrapolated
 *                          v.large from 8,000    extrapolated, site visit
 *   Restaurant / café      small   1,000–2,000   [FAQ] "smaller spaces from ~1,000"
 *                          medium  2,000–4,000   [REST]/[PRICE] low 2,000; high split
 *                          large   4,000–6,000   [REST]/[PRICE] high 6,000
 *                          v.large from 6,000    [REST] "larger venues quoted separately", site visit
 *   School / classroom     small   1,000–2,000   [PRICE] "from 1,000"; high
 *                          medium  2,000–3,500   extrapolated
 *                          large   3,500–6,500   extrapolated
 *                          v.large from 6,500    extrapolated, site visit
 *   Church / hall          small   from 1,500    [PRICE] "smaller rooms around 1,500"
 *                          medium  from 4,000    [PRICE] "many hall projects 4,000–6,000+"
 *                          large   from 6,000    [PRICE] "6,000+"
 *                          v.large from 15,000   [VSL] "15,000–40,000+", site visit
 *   Home / living room     small   1,000–1,800   [FAQ] "from ~1,000"; high
 *                          medium  1,500–3,000   extrapolated
 *                          large   3,000–5,000   extrapolated
 *                          v.large from 5,000    extrapolated, site visit
 *   Home studio            small   1,000–2,000   [PRICE]/[FAQ] low 1,000; high split
 *                          medium  2,000–3,500   [PRICE] high 3,000 / [VSL] 3,500
 *                          large   from 3,500    [VSL] "larger rooms from 3,500"
 *                          v.large from 6,000    extrapolated, site visit
 */

export type PriceDisplay = 'range' | 'from'

export type PriceEntry = {
  low: number
  /** Present for `display: 'range'`. */
  high?: number
  display: PriceDisplay
  /** True when the final scope is normally only set after a site visit. */
  siteVisit?: boolean
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
      small: { low: 1000, high: 2000, display: 'range' },
      medium: { low: 2500, high: 4000, display: 'range' },
      large: { low: 4000, high: 8000, display: 'range' },
      'very-large': { low: 8000, display: 'from', siteVisit: true },
    },
  },
  {
    slug: 'restaurant',
    label: 'Restaurant / café',
    prices: {
      small: { low: 1000, high: 2000, display: 'range' },
      medium: { low: 2000, high: 4000, display: 'range' },
      large: { low: 4000, high: 6000, display: 'range' },
      'very-large': { low: 6000, display: 'from', siteVisit: true },
    },
  },
  {
    slug: 'school',
    label: 'School / classroom',
    prices: {
      small: { low: 1000, high: 2000, display: 'range' },
      medium: { low: 2000, high: 3500, display: 'range' },
      large: { low: 3500, high: 6500, display: 'range' },
      'very-large': { low: 6500, display: 'from', siteVisit: true },
    },
  },
  {
    slug: 'church',
    label: 'Church / hall',
    prices: {
      small: { low: 1500, display: 'from' },
      medium: { low: 4000, display: 'from' },
      large: { low: 6000, display: 'from', siteVisit: true },
      'very-large': { low: 15000, display: 'from', siteVisit: true },
    },
  },
  {
    slug: 'home',
    label: 'Home / living room',
    prices: {
      small: { low: 1000, high: 1800, display: 'range' },
      medium: { low: 1500, high: 3000, display: 'range' },
      large: { low: 3000, high: 5000, display: 'range' },
      'very-large': { low: 5000, display: 'from', siteVisit: true },
    },
  },
  {
    slug: 'home-studio',
    label: 'Home studio',
    prices: {
      small: { low: 1000, high: 2000, display: 'range' },
      medium: { low: 2000, high: 3500, display: 'range' },
      large: { low: 3500, display: 'from' },
      'very-large': { low: 6000, display: 'from', siteVisit: true },
    },
  },
]

/** /spaces/[slug] page slug → estimator space type. Spaces without an entry show no estimator. */
const ESTIMATOR_SPACE_BY_PAGE_SLUG: Record<string, string> = {
  offices: 'office',
  restaurants: 'restaurant',
  education: 'school',
  churches: 'church',
  homes: 'home',
  studios: 'home-studio',
}

export function estimatorSpaceForPage(pageSlug: string) {
  return findSpaceType(ESTIMATOR_SPACE_BY_PAGE_SLUG[pageSlug])?.slug ?? null
}

/** Size band for a floor area in m², using the SIZE_BANDS boundaries (<15, 15–40, 40–100, 100+). */
export function sizeBandForArea(floorAreaM2: number): SizeBandSlug {
  if (floorAreaM2 < 15) return 'small'
  if (floorAreaM2 < 40) return 'medium'
  if (floorAreaM2 < 100) return 'large'
  return 'very-large'
}

/** Panel calculator RoomType (lib/panel-calculator.ts) → estimator space type. Gym/other have no entry. */
const ESTIMATOR_SPACE_BY_CALCULATOR_ROOM: Record<string, string> = {
  office: 'office',
  restaurant: 'restaurant',
  tuition: 'school',
  church: 'church',
  residential: 'home',
  studio: 'home-studio',
}

/** Typical installed price for a panel-calculator room, or null when the room type isn't in the guide. */
export function installedPriceForCalculatorRoom(roomType: string, floorAreaM2: number) {
  const space = findSpaceType(ESTIMATOR_SPACE_BY_CALCULATOR_ROOM[roomType])
  if (!space || !Number.isFinite(floorAreaM2) || floorAreaM2 <= 0) return null
  const size = sizeBandForArea(floorAreaM2)
  const entry = space.prices[size]
  return {
    space: space.slug,
    size,
    entry,
    href: `/contact?${new URLSearchParams({ space: space.slug, size }).toString()}`,
  }
}

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

/**
 * Typical installed range for an everyday room (small + medium bands, under 40 m²) across all
 * space types: the lowest small-band price to the highest small/medium range top.
 * Shown as the homepage hero price anchor.
 */
export function typicalRoomPriceRange() {
  const low = Math.min(...SPACE_TYPES.map((space) => space.prices.small.low))
  const high = Math.max(
    ...SPACE_TYPES.flatMap((space) =>
      (['small', 'medium'] as const).map((band) => space.prices[band].high ?? 0),
    ),
  )
  return { low, high }
}
