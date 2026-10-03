'use client'

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Clock, Search, X } from 'lucide-react'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'

export interface ExplorerPost {
  _id: string
  title: string
  slug: string
  category?: string
  contentType?: string
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  image?: { src: string; alt: string }
}

export const CONTENT_TYPES = [
  { value: 'article', label: 'Articles' },
  { value: 'guide', label: 'Guides' },
  { value: 'comparison', label: 'Comparisons' },
  { value: 'video', label: 'Videos' },
  { value: 'case-study', label: 'Case Studies' },
] as const

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'quickest', label: 'Quickest read' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

const SEARCH_STOP_WORDS = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'or', 'the', 'to', 'with'])
const PAGE_SIZE = 9

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

function topicTitle(value?: string) {
  return RESOURCE_TOPICS.find((item) => item.value === value)?.title ?? 'Acoustic Education'
}

function typeLabel(value?: string) {
  return CONTENT_TYPES.find((item) => item.value === value)?.label.replace(/s$/, '') ?? 'Article'
}

function formatDate(value?: string) {
  if (!value) return null
  return new Date(value).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  return (
    <>
      {text.split(pattern).map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="rounded-[4px] bg-[rgba(255,165,0,0.22)] px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

function Meta({ post }: { post: ExplorerPost }) {
  const date = formatDate(post.publishedAt)
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-gray-200)]">
      <span className="font-semibold text-[var(--color-dark-100)]">{typeLabel(post.contentType)}</span>
      {date && <span>{date}</span>}
      {post.readingTime ? (
        <span className="inline-flex items-center gap-1">
          <Clock size={13} aria-hidden="true" /> {Math.max(1, post.readingTime)} min read
        </span>
      ) : null}
    </div>
  )
}

function Cover({ post, sizes, priority }: { post: ExplorerPost; sizes: string; priority?: boolean }) {
  if (post.image) {
    return (
      <Image
        src={post.image.src}
        alt={post.image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,165,0,0.35),transparent_55%),linear-gradient(160deg,#151515,#2a2a2a)] transition-transform duration-500 group-hover:scale-[1.04]"
    />
  )
}

interface Props {
  posts: ExplorerPost[]
  initialTopic?: string
  initialType?: string
  initialSearch?: string
}

export default function BlogExplorer({ posts, initialTopic = '', initialType = '', initialSearch = '' }: Props) {
  const [topic, setTopic] = useState(initialTopic)
  const [type, setType] = useState(initialType)
  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState<SortValue>('newest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const deferredSearch = useDeferredValue(search)

  // Keep the URL shareable without triggering a server round-trip.
  useEffect(() => {
    const params = new URLSearchParams()
    if (topic) params.set('topic', topic)
    if (type) params.set('type', type)
    if (search.trim()) params.set('search', search.trim())
    const query = params.toString()
    window.history.replaceState(null, '', query ? `/blog?${query}` : '/blog')
  }, [topic, type, search])

  // "/" focuses search, Escape clears it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable
      if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [topic, type, deferredSearch, sort])

  const searchTerms = useMemo(() => getSearchTerms(deferredSearch), [deferredSearch])

  const searchIndex = useMemo(
    () =>
      new Map(
        posts.map((post) => [
          post._id,
          normaliseSearchText([post.title, post.excerpt ?? '', topicTitle(post.category), typeLabel(post.contentType)].join(' ')),
        ])
      ),
    [posts]
  )

  const matchesSearch = (post: ExplorerPost) => {
    const query = normaliseSearchText(deferredSearch)
    if (!query) return true
    const text = searchIndex.get(post._id) ?? ''
    return searchTerms.length > 0 ? searchTerms.every((term) => text.includes(term)) : text.includes(query)
  }

  const searched = posts.filter(matchesSearch)
  const topicCounts = new Map<string, number>()
  const typeCounts = new Map<string, number>()
  for (const post of searched) {
    if (!type || post.contentType === type) topicCounts.set(post.category ?? '', (topicCounts.get(post.category ?? '') ?? 0) + 1)
    if (!topic || post.category === topic) typeCounts.set(post.contentType ?? '', (typeCounts.get(post.contentType ?? '') ?? 0) + 1)
  }

  const filtered = searched
    .filter((post) => (!topic || post.category === topic) && (!type || post.contentType === type))
    .sort((a, b) => {
      if (sort === 'quickest') return (a.readingTime ?? 99) - (b.readingTime ?? 99)
      const diff = new Date(a.publishedAt ?? 0).getTime() - new Date(b.publishedAt ?? 0).getTime()
      return sort === 'oldest' ? diff : -diff
    })

  const hasActiveFilter = Boolean(topic || type || deferredSearch.trim())
  const showFeatured = !hasActiveFilter && sort === 'newest' && filtered.length > 3
  const featured = showFeatured ? filtered[0] : null
  const gridPosts = showFeatured ? filtered.slice(1) : filtered
  const visiblePosts = gridPosts.slice(0, visibleCount)
  const topicsInUse = RESOURCE_TOPICS.filter((item) => posts.some((post) => post.category === item.value))
  const typesInUse = CONTENT_TYPES.filter((item) => posts.some((post) => post.contentType === item.value))

  const resetAll = () => {
    setTopic('')
    setType('')
    setSearch('')
    setSort('newest')
  }

  const chipClass = (active: boolean, disabled = false) =>
    `page-filter cursor-pointer gap-2 whitespace-nowrap ${active ? 'active' : ''} ${disabled ? 'pointer-events-none opacity-40' : ''}`

  return (
    <>
      {/* Controls */}
      <section className="home-shell page-hero-shell flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search articles</span>
            <Search size={18} className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-[var(--color-gray-200)]" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearch('')
              }}
              placeholder="Search guides…"
              className="glass-card h-12 w-full rounded-full pl-12 pr-16 text-base outline-none placeholder:text-[var(--color-gray-100)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] [&::-webkit-search-cancel-button]:hidden"
            />
            {search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  searchRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-gray-200)] hover:bg-black/5 hover:text-[var(--color-dark-100)]"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-md border border-black/10 px-2 py-0.5 text-xs text-[var(--color-gray-200)] md:block">
                /
              </kbd>
            )}
          </label>

          <div className="relative flex items-center">
            <label className="sr-only" htmlFor="blog-sort">Sort articles</label>
            <select
              id="blog-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="glass-card h-12 w-[124px] cursor-pointer appearance-none rounded-full pl-4 pr-9 text-sm font-semibold text-[var(--color-dark-100)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] md:w-auto md:pl-5 md:pr-11"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-4 z-10 text-[var(--color-dark-100)]" />
          </div>
        </div>

        {topicsInUse.length > 0 && (
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by topic">
            <button type="button" onClick={() => setTopic('')} className={chipClass(!topic)} aria-pressed={!topic}>
              All topics
            </button>
            {topicsInUse.map((item) => {
              const count = topicCounts.get(item.value) ?? 0
              const active = topic === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTopic(active ? '' : item.value)}
                  className={chipClass(active, count === 0 && !active)}
                  aria-pressed={active}
                  title={item.description}
                >
                  {item.title}
                  <span className={`text-xs ${active ? 'text-white/70' : 'text-[var(--color-gray-200)]'}`}>{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {typesInUse.length > 1 && (
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by format">
            {typesInUse.map((item) => {
              const count = typeCounts.get(item.value) ?? 0
              const active = type === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setType(active ? '' : item.value)}
                  className={`${chipClass(active, count === 0 && !active)} !px-3.5 !py-1.5 !text-[13px]`}
                  aria-pressed={active}
                >
                  {item.label}
                  <span className={`text-xs ${active ? 'text-white/70' : 'text-[var(--color-gray-200)]'}`}>{count}</span>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* Status line */}
      <div className="flex items-center justify-between gap-3 px-1" aria-live="polite">
        <p className="m-0 text-sm text-[var(--color-gray-100)]">
          {hasActiveFilter ? (
            <>
              <strong className="text-[var(--color-dark-100)]">{filtered.length}</strong> of {posts.length} articles
              {topic && <> in <strong className="text-[var(--color-dark-100)]">{topicTitle(topic)}</strong></>}
              {deferredSearch.trim() && <> matching “{deferredSearch.trim()}”</>}
            </>
          ) : (
            <>{posts.length} articles in the library</>
          )}
        </p>
        {hasActiveFilter && (
          <button type="button" onClick={resetAll} className="page-link cursor-pointer border-0 bg-transparent p-0">
            Reset filters <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <section className="glass-card page-hero-shell flex flex-col items-start gap-4">
          <h2 className="page-card-title">
            {posts.length === 0 ? 'Articles are on the way.' : 'Nothing matches that combo.'}
          </h2>
          <p className="page-card-copy m-0">
            {posts.length === 0
              ? 'New guides are being written now. Check back soon, or get in touch and we will answer your question directly.'
              : 'Try fewer words, or loosen a filter. Popular starting points:'}
          </p>
          {posts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {['echo', 'office', 'restaurant', 'studio', 'panels'].map((term) => (
                <button key={term} type="button" onClick={() => { setTopic(''); setType(''); setSearch(term) }} className={chipClass(false)}>
                  {term}
                </button>
              ))}
            </div>
          )}
          <Link href="/contact" className="page-link">
            Ask us directly <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <>
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group glass-card grid overflow-hidden rounded-[var(--section-radius)] no-underline transition-all duration-300 hover:-translate-y-0.5 md:grid-cols-[1.15fr_1fr]"
            >
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[360px]">
                <Cover post={featured} sizes="(min-width: 768px) 55vw, 100vw" priority />
                <span className="absolute left-4 top-4 rounded-full bg-[var(--color-brand-orange)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-dark-100)]">
                  Latest
                </span>
              </div>
              <div className="flex flex-col gap-4 p-6 md:p-8">
                <p className="page-kicker text-[var(--color-brand-orange)]">{topicTitle(featured.category)}</p>
                <h2
                  className="m-0 text-[clamp(28px,3.2vw,44px)] font-medium leading-[1.02] tracking-[-1px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {featured.title}
                </h2>
                {featured.excerpt && <p className="page-card-copy m-0 line-clamp-4">{featured.excerpt}</p>}
                <div className="mt-auto flex flex-col gap-4 pt-2">
                  <Meta post={featured} />
                  <span className="page-link">
                    Read article <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-black/6 bg-white/80 no-underline shadow-[0_14px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_56px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Cover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <p className="page-kicker text-[var(--color-brand-orange)]">{topicTitle(post.category)}</p>
                  <h3
                    className="m-0 text-[clamp(20px,1.7vw,24px)] font-medium leading-[1.08] tracking-[-0.6px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    <Highlight text={post.title} terms={searchTerms} />
                  </h3>
                  {post.excerpt && (
                    <p className="page-card-copy m-0 line-clamp-3 text-[14px]">
                      <Highlight text={post.excerpt} terms={searchTerms} />
                    </p>
                  )}
                  <div className="mt-auto pt-2">
                    <Meta post={post} />
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {gridPosts.length > visibleCount && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-[var(--color-dark-100)] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
              >
                Show more ({gridPosts.length - visibleCount} left)
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
