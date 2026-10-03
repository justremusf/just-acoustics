// Order spaces by commercial value: higher-ticket, high-close-rate spaces first
// (CRM: schools ~S$6.1k, offices ~S$4.5k, restaurants ~S$2.8k vs homes ~S$1.6k average job).
export const SPACE_PRIORITY = ['offices', 'education', 'restaurants', 'churches', 'gym-and-activity-spaces', 'studios', 'homes'] as const

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
