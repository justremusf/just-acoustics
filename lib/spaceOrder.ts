// Order spaces by won revenue (Bigin, 102 Closed Won deals, checked 12 Oct 2026): studios S$44.7k,
// offices S$42.0k, churches S$38.7k, schools/academies S$33.5k, homes S$30.3k, restaurants S$23.3k.
// The price estimator (lib/estimatorQuiz.ts) uses the same order. Smaller verticals follow.
export const SPACE_PRIORITY = [
  'studios',
  'offices',
  'churches',
  'education',
  'homes',
  'restaurants',
  'gym-and-activity-spaces',
  'event-venues',
  'hotels-and-hospitality',
  'clinics-and-healthcare',
  'retail-and-showrooms',
] as const

export function spaceRank(slug: string) {
  const index = (SPACE_PRIORITY as readonly string[]).indexOf(slug)
  return index === -1 ? SPACE_PRIORITY.length : index
}

/** Stable sort by SPACE_PRIORITY; unknown slugs keep their original order at the end. */
export function sortBySpacePriority<T>(items: T[], getSlug: (item: T) => string | undefined) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => spaceRank(getSlug(a.item) ?? '') - spaceRank(getSlug(b.item) ?? '') || a.index - b.index)
    .map(({ item }) => item)
}
