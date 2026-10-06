/*
 * Internal links between the service landing pages, the /spaces pages and blog articles.
 * Plain module (no 'use client') so server and client components can both import it.
 */

import { findSpaceType } from '@/lib/priceGuide'

export type ServiceLink = {
  href: string
  label: string
}

export type ServicePage = ServiceLink & {
  /** Estimator space type in lib/priceGuide.ts, used for the "from" price in Service schema. */
  priceSpace?: string
}

export const SERVICE_PAGES = {
  office: { href: '/office-acoustic-treatment', label: 'Office acoustic treatment in Singapore', priceSpace: 'office' },
  restaurant: { href: '/restaurant-echo-reduction', label: 'Restaurant echo reduction in Singapore', priceSpace: 'restaurant' },
  school: { href: '/school-acoustic-treatment', label: 'School and classroom acoustics in Singapore', priceSpace: 'school' },
  church: { href: '/church-acoustics', label: 'Church acoustic treatment in Singapore', priceSpace: 'church' },
  panels: { href: '/acoustic-panels-singapore', label: 'Acoustic panels in Singapore', priceSpace: 'home' },
} satisfies Record<string, ServicePage>

export type ServiceKey = keyof typeof SERVICE_PAGES

/** Footer "Services" group. */
export const FOOTER_SERVICE_LINKS: ServiceLink[] = [
  { href: SERVICE_PAGES.panels.href, label: 'Acoustic Panels Singapore' },
  { href: SERVICE_PAGES.office.href, label: 'Office Acoustics' },
  { href: SERVICE_PAGES.restaurant.href, label: 'Restaurant Echo Reduction' },
  { href: SERVICE_PAGES.school.href, label: 'School Acoustics' },
  { href: SERVICE_PAGES.church.href, label: 'Church Acoustics' },
  { href: '/acoustic-panel-calculator', label: 'Panel Calculator' },
]

/** /spaces/[slug] → matching service landing page. */
const SERVICE_BY_SPACE_SLUG: Record<string, ServiceKey> = {
  offices: 'office',
  restaurants: 'restaurant',
  education: 'school',
  churches: 'church',
  homes: 'panels',
  studios: 'panels',
}

export function serviceForSpace(spaceSlug: string): ServicePage | null {
  const key = SERVICE_BY_SPACE_SLUG[spaceSlug]
  return key ? SERVICE_PAGES[key] : null
}

/** Service landing page → matching /spaces pages. */
export const SPACE_LINKS_BY_SERVICE: Record<ServiceKey, ServiceLink[]> = {
  office: [{ href: '/spaces/offices', label: 'Offices and meeting rooms' }],
  restaurant: [{ href: '/spaces/restaurants', label: 'Restaurants, cafés and bars' }],
  school: [{ href: '/spaces/education', label: 'Education spaces' }],
  church: [{ href: '/spaces/churches', label: 'Churches and event spaces' }],
  panels: [
    { href: '/spaces/homes', label: 'Homes' },
    { href: '/spaces/studios', label: 'Music and home studios' },
  ],
}

/** Lowest typical installed price for a service page, from the owner-confirmed price guide. */
export function minPriceForService(key: ServiceKey): number | undefined {
  const space = findSpaceType(SERVICE_PAGES[key].priceSpace)
  if (!space) return undefined
  return Math.min(...Object.values(space.prices).map((entry) => entry.low))
}

/** Topic (lib/resourceTopics.ts) → service page. */
const SERVICE_BY_TOPIC: Record<string, ServiceKey> = {
  'office-acoustics': 'office',
  'restaurant-noise': 'restaurant',
  'worship-spaces': 'church',
}

/** Slug keywords take precedence over the broad topic so e.g. a classroom guide links to schools. */
const SERVICE_BY_SLUG_KEYWORD: Array<[RegExp, ServiceKey]> = [
  [/church|worship|sanctuar/, 'church'],
  [/home-office|hdb|condo|home-studio|podcast|piano/, 'panels'],
  [/classroom|school|tuition|training-room/, 'school'],
  [/restaurant|cafe|f-and-b|bar-/, 'restaurant'],
  [/office|meeting-room|conference/, 'office'],
]

/** The one commercial page a blog article should point to. */
export function serviceForArticle(slug: string, topic?: string): ServicePage {
  const byKeyword = SERVICE_BY_SLUG_KEYWORD.find(([pattern]) => pattern.test(slug))?.[1]
  const key = byKeyword ?? (topic ? SERVICE_BY_TOPIC[topic] : undefined) ?? 'panels'
  return SERVICE_PAGES[key]
}
