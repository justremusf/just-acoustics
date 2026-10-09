'use client'

import { useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronDown, Clock, Search, X } from 'lucide-react'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'
import { CONTENT_TYPES, coverRatio, type ExplorerPost } from '@/lib/blogContent'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'quickest', label: 'Quickest read' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

const SEARCH_STOP_WORDS = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'or', 'the', 'to', 'with'])
const PAGE_SIZE = 12

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
  return CONTENT_TYPES.find((item) => item.value === value)?.singular ?? 'Article'
}

function formatDate(value?: string) {
  if (!value) return null
  return new Date(value).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function riseStyle(index: number): CSSProperties {
  return { animationDelay: `${Math.min(index, 8) * 55}ms` }
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  return (
    <>
      {text.split(pattern).map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="rounded-[4px] bg-[rgba(255,165,0,0.24)] px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

function ReadMeta({ post, light = false }: { post: ExplorerPost; light?: boolean }) {
  const date = formatDate(post.publishedAt)
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] ${light ? 'text-white/75' : 'text-[var(--color-gray-200)]'}`}>
      <span className={`font-semibold ${light ? 'text-white' : 'text-[var(--color-dark-100)]'}`}>{typeLabel(post.contentType)}</span>
      {post.readingTime ? (
        <span className="inline-flex items-center gap-1">
          <Clock size={12} aria-hidden="true" /> {Math.max(1, post.readingTime)} min
        </span>
      ) : null}
      {date && !light && <span>{date}</span>}
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
        className="object-contain"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,165,0,0.35),transparent_55%),linear-gradient(160deg,#151515,#2a2a2a)]"
    />
  )
}

/** Large card that leads the feed: the whole cover image on top, the title on a dark panel below it. */
function FeatureTile({ post, className = '' }: { post: ExplorerPost; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`blog-rise group relative isolate flex flex-col overflow-hidden rounded-[28px] bg-[var(--color-dark-100)] no-underline shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-shadow duration-500 hover:shadow-[0_32px_80px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-orange)] ${className}`}
    >
      <div className="relative w-full" style={{ aspectRatio: coverRatio(post.image) }}>
        <Cover post={post} priority sizes="(min-width: 1024px) 66vw, 100vw" />
      </div>

      <div className="flex w-full items-end gap-4 p-6 md:p-8">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--color-brand-orange)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-dark-100)]">
              {post.pinned ? 'Featured' : 'Latest'}
            </span>
            <p className="page-kicker m-0 !text-[var(--color-brand-orange)]">{topicTitle(post.category)}</p>
          </div>
          <h3
            className="m-0 text-[clamp(26px,3vw,40px)] font-medium leading-[1.05] tracking-[-1px] text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {post.title}
          </h3>
          {post.excerpt && <p className="mb-0 mt-3 hidden max-w-[52ch] text-[15px] leading-6 text-white/75 md:line-clamp-2">{post.excerpt}</p>}
          <div className="mt-3">
            <ReadMeta post={post} light />
          </div>
        </div>
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-[var(--color-dark-100)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-45"
        >
          <ArrowUpRight size={20} />
        </span>
      </div>
    </Link>
  )
}

/** Image-on-top card used for every post in the feed. */
function ArticleCard({ post, terms = [], index = 0, className = '' }: { post: ExplorerPost; terms?: string[]; index?: number; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={riseStyle(index)}
      className={`blog-rise group flex flex-col no-underline focus-visible:outline-none ${className}`}
    >
      <div style={{ aspectRatio: coverRatio(post.image) }} className="relative overflow-hidden rounded-[22px] bg-[var(--color-dark-100)] shadow-[0_18px_44px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_26px_60px_rgba(0,0,0,0.16)] group-focus-visible:ring-4 group-focus-visible:ring-[var(--color-brand-orange)]">
        <Cover post={post} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw" />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-dark-100)] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100"
        >
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1 pt-4">
        <p className="page-kicker !text-[var(--color-brand-orange)]">{topicTitle(post.category)}</p>
        <h3
          className="m-0 text-[clamp(19px,1.5vw,22px)] font-medium leading-[1.1] tracking-[-0.5px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Highlight text={post.title} terms={terms} />
        </h3>
        {post.excerpt && (
          <p className="page-card-copy m-0 line-clamp-2 text-[14px]">
            <Highlight text={post.excerpt} terms={terms} />
          </p>
        )}
        <div className="mt-auto pt-1">
          <ReadMeta post={post} />
        </div>
      </div>
    </Link>
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

  // "/" jumps to search from anywhere on the page.
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

  const query = normaliseSearchText(deferredSearch)
  const searched = query
    ? posts.filter((post) => {
        const text = searchIndex.get(post._id) ?? ''
        return searchTerms.length > 0 ? searchTerms.every((term) => text.includes(term)) : text.includes(query)
      })
    : posts

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
      // Pinned posts lead the default view.
      if (sort === 'newest' && Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1
      const diff = new Date(a.publishedAt ?? 0).getTime() - new Date(b.publishedAt ?? 0).getTime()
      return sort === 'oldest' ? diff : -diff
    })

  const isFiltered = Boolean(topic || type || query)
  // The newest post leads the feed as a large tile; once you filter, every result is equal.
  const featureFirst = !isFiltered && sort === 'newest' && filtered.length >= 4
  const topicsInUse = RESOURCE_TOPICS.filter((item) => posts.some((post) => post.category === item.value))
  const typesInUse = CONTENT_TYPES.filter((item) => posts.some((post) => post.contentType === item.value))
  // The feature tile fills two cells, so show one fewer post to keep the last row full.
  const visiblePosts = filtered.slice(0, featureFirst ? visibleCount - 1 : visibleCount)

  const resetAll = () => {
    setTopic('')
    setType('')
    setSearch('')
    setSort('newest')
  }

  const chipClass = (active: boolean, disabled = false) =>
    `page-filter cursor-pointer gap-2 whitespace-nowrap ${active ? 'active' : ''} ${disabled ? 'pointer-events-none opacity-40' : ''}`

  // Changing this key re-runs the entrance animation whenever the results change.
  const resultsKey = `${topic}|${type}|${query}|${sort}`

  return (
    <div data-site-reveal className="flex flex-col gap-[clamp(28px,4vw,48px)]">
      {/* Masthead + controls */}
      <section className="home-shell page-hero-shell relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,165,0,0.28),transparent_70%)] blur-2xl"
        />
        <div className="relative flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <span className="soft-pill">Resource Center</span>
              <h1 className="page-title mt-3">Acoustic Education</h1>
            </div>
            <p className="page-subtitle m-0 max-w-[44ch] md:text-right">
              Scroll what catches your eye, or narrow it down below. Every guide comes from real rooms we have treated.
            </p>
          </div>

          <label className="relative block">
            <span className="sr-only">Search articles</span>
            <Search size={19} className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-[var(--color-gray-200)]" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearch('')
              }}
              placeholder="Search a problem… try “echo” or “office”"
              className="h-14 w-full rounded-full border border-black/8 bg-white pl-[52px] pr-16 text-base text-[var(--color-dark-100)] shadow-[0_14px_36px_rgba(0,0,0,0.06)] outline-none transition-shadow placeholder:text-[var(--color-gray-200)] focus-visible:shadow-[0_0_0_3px_rgba(255,165,0,0.45),0_14px_36px_rgba(0,0,0,0.06)] [&::-webkit-search-cancel-button]:hidden"
            />
            {search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  searchRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[var(--color-gray-200)] hover:bg-black/5 hover:text-[var(--color-dark-100)]"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-md border border-black/10 px-2 py-0.5 text-xs text-[var(--color-gray-200)] md:block">
                /
              </kbd>
            )}
          </label>

          {topicsInUse.length > 0 && (
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by topic">
              <button type="button" onClick={() => setTopic('')} className={chipClass(!topic)} aria-pressed={!topic}>
                Everything
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

          <div className="flex items-center justify-between gap-3">
            {typesInUse.length > 1 ? (
              <div className="no-scrollbar -mx-1 flex min-w-0 gap-2 overflow-x-auto px-1" role="group" aria-label="Filter by format">
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
            ) : (
              <span />
            )}
            <div className="relative flex shrink-0 items-center">
              <label className="sr-only" htmlFor="blog-sort">
                Sort articles
              </label>
              <select
                id="blog-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortValue)}
                className="h-9 cursor-pointer appearance-none rounded-full border border-black/10 bg-white pl-3.5 pr-8 text-[13px] font-semibold text-[var(--color-dark-100)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute right-3 text-[var(--color-dark-100)]" />
            </div>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="glass-card page-hero-shell flex flex-col items-start gap-4">
          <h2 className="page-card-title">Articles are on the way.</h2>
          <p className="page-card-copy m-0">New guides are being written now. In the meantime, ask us your question directly.</p>
          <Link href="/contact" className="page-link">
            Ask us directly <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <section className="flex flex-col gap-6">
          {isFiltered && (
            <p className="m-0 px-1 text-sm text-[var(--color-gray-100)]" aria-live="polite">
              <strong className="text-[var(--color-dark-100)]">{filtered.length}</strong> of {posts.length} articles
              {topic && (
                <>
                  {' '}
                  in <strong className="text-[var(--color-dark-100)]">{topicTitle(topic)}</strong>
                </>
              )}
              {query && <> matching “{deferredSearch.trim()}”</>}
              <button type="button" onClick={resetAll} className="page-link ml-3 cursor-pointer border-0 bg-transparent p-0 align-baseline">
                Show everything <X size={14} aria-hidden="true" />
              </button>
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="glass-card page-hero-shell flex flex-col items-start gap-4">
              <h2 className="page-card-title">Nothing matches that one.</h2>
              <p className="page-card-copy m-0">Try fewer words, or one of these:</p>
              <div className="flex flex-wrap gap-2">
                {['echo', 'office', 'restaurant', 'studio', 'panels'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setTopic('')
                      setType('')
                      setSearch(term)
                    }}
                    className={chipClass(false)}
                  >
                    {term}
                  </button>
                ))}
              </div>
              <Link href="/contact" className="page-link">
                Or ask us directly <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div key={resultsKey} className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post, index) =>
                  featureFirst && index === 0 ? (
                    <FeatureTile key={post._id} post={post} className="sm:col-span-2" />
                  ) : (
                    <ArticleCard key={post._id} post={post} terms={searchTerms} index={index} />
                  )
                )}
              </div>

              {filtered.length > visiblePosts.length && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-[var(--color-dark-100)] px-7 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
                  >
                    Show more ({filtered.length - visiblePosts.length} left)
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {posts.length > 0 && (
        <section className="relative overflow-hidden rounded-[var(--section-radius)] bg-[var(--color-dark-100)] p-[clamp(24px,4vw,48px)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,165,0,0.45),transparent_70%)] blur-2xl"
          />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="page-kicker !text-[var(--color-brand-orange)]">Still not sure?</p>
              <h2
                className="m-0 mt-2 max-w-[22ch] text-[clamp(26px,3vw,40px)] font-medium leading-[1.04] tracking-[-1px] text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Tell us about your room. We will tell you what it needs.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[var(--color-brand-orange)] px-7 text-sm font-semibold text-[var(--color-dark-100)] no-underline transition-transform duration-200 hover:-translate-y-0.5 md:self-center"
            >
              Get free advice <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
