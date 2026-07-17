import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { getAllPosts } from '@/sanity/lib/queries'
import type { Post } from '@/lib/types'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'
import { canonicalPath } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { type, search } = await searchParams
  const isFiltered = Boolean(type || search)
  return {
    title: 'Acoustic Education',
    description:
      'Read acoustic treatment guides, buying advice, room-specific tips, comparisons, videos, and case studies from the Just Acoustics team.',
    alternates: { canonical: canonicalPath('/blog') },
    robots: isFiltered ? { index: false, follow: true } : undefined,
  }
}

const CONTENT_TYPES = [
  { value: 'article', label: 'Articles' },
  { value: 'guide', label: 'Guides' },
  { value: 'comparison', label: 'Comparisons' },
  { value: 'video', label: 'Videos' },
  { value: 'case-study', label: 'Case Studies' },
] as const

const SEARCH_STOP_WORDS = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'or', 'the', 'to', 'with'])

interface BlogPageProps {
  searchParams: Promise<{ topic?: string; type?: string; search?: string }>
}

const selectArrowStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L7 7L13 1' stroke='%230D2233' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundPosition: 'right 1.25rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '14px 8px',
} satisfies CSSProperties

function normaliseSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function getSearchTerms(value: string) {
  return normaliseSearchText(value)
    .split(/\s+/)
    .filter((term) => term.length > 1 && !SEARCH_STOP_WORDS.has(term))
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [{ type, search }, posts]: [{ topic?: string; type?: string; search?: string }, Post[]] = await Promise.all([
    searchParams,
    getAllPosts().catch(() => [] as Post[]),
  ])

  const activeType = CONTENT_TYPES.find((ct) => ct.value === type)
  const searchQuery = search?.trim().toLowerCase() || ''

  let filteredPosts = posts
  if (activeType) filteredPosts = filteredPosts.filter((post) => post.contentType === activeType.value)
  if (searchQuery) {
    const searchTerms = getSearchTerms(searchQuery)
    filteredPosts = filteredPosts.filter(
      (post) => {
        const topicTitle = RESOURCE_TOPICS.find((item) => item.value === post.category)?.title ?? ''
        const contentTypeLabel = CONTENT_TYPES.find((ct) => ct.value === post.contentType)?.label ?? ''
        const searchableText = normaliseSearchText([
          post.title,
          post.excerpt ?? '',
          topicTitle,
          contentTypeLabel,
        ].join(' '))

        return searchTerms.length > 0
          ? searchTerms.some((term) => searchableText.includes(term))
          : searchableText.includes(normaliseSearchText(searchQuery))
      }
    )
  }

  const hasActiveFilter = activeType || searchQuery

  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Resource Center</span>
        <h1 className="page-title">Acoustic Education</h1>
        <p className="page-subtitle">
          Browse the questions people usually have before treating a room, then go deeper into the articles that match your space and use-case.
        </p>
      </section>

      <section className="home-shell page-hero-shell">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="page-kicker">Find the right guide</p>
              <h2 className="page-card-title">Choose a format or search the library.</h2>
            </div>
            {hasActiveFilter && (
              <Link href="/blog" className="page-link">
                Clear filter <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          <div>
            <form method="get" action="/blog" className="grid w-full gap-3 md:grid-cols-[minmax(180px,0.45fr)_minmax(280px,1fr)_auto] md:items-center">
              <label className="sr-only" htmlFor="blog-type">Format</label>
              <select
                id="blog-type"
                name="type"
                defaultValue={activeType?.value ?? ''}
                className="glass-card h-12 min-w-0 appearance-none rounded-full py-0 pl-5 pr-12 text-base text-[var(--color-dark-100)] outline-none"
                style={selectArrowStyle}
              >
                <option value="">All formats</option>
                {CONTENT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="blog-search">Search articles</label>
              <input
                id="blog-search"
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search articles…"
                className="glass-card h-12 min-w-0 flex-1 rounded-full px-5 text-base outline-none placeholder:text-[var(--color-gray-100)]"
              />
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[var(--color-dark-100)] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {filteredPosts.length === 0 ? (
        <section className="glass-card page-hero-shell">
          <p className="page-card-copy">
            {hasActiveFilter
              ? 'No articles match this filter. Try a different topic or search term.'
              : 'No published articles yet for this topic. Drafts have already been added in Sanity so you can edit and publish them whenever you are ready.'}
          </p>
        </section>
      ) : (
        <section className="home-shell page-hero-shell">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="page-kicker">Articles</p>
              <h2 className="page-card-title">
                {hasActiveFilter ? `${filteredPosts.length} matching article${filteredPosts.length === 1 ? '' : 's'}` : 'Latest acoustic guides'}
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group grid gap-4 rounded-[24px] border border-black/6 bg-white/72 p-5 text-left no-underline shadow-[0_14px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_54px_rgba(0,0,0,0.07)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6"
              >
                <div className="min-w-0">
                  <p className="page-kicker text-[var(--color-brand-orange)]">
                    {RESOURCE_TOPICS.find((item) => item.value === post.category)?.title || 'Acoustic Education'}
                  </p>
                  <h2 className="mt-2 m-0 text-[clamp(22px,2.4vw,32px)] leading-[1.04] font-medium tracking-[-0.8px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="page-card-copy mt-3 max-w-[78ch] line-clamp-2">{post.excerpt}</p>}
                </div>
                <span className="page-link self-start md:self-center">Read article <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
