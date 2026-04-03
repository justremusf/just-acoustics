import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/sanity/lib/queries'
import type { Post } from '@/lib/types'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Resource Center',
  description: 'Acoustic education, buying guides, and room-specific advice from the Just Acoustics team.',
}

interface BlogPageProps {
  searchParams: Promise<{ topic?: string }>
}

function topicCount(posts: Post[], value: string) {
  return posts.filter((post) => post.category === value).length
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [{ topic }, posts]: [{ topic?: string }, Post[]] = await Promise.all([
    searchParams,
    getAllPosts().catch(() => [] as Post[]),
  ])

  const activeTopic = RESOURCE_TOPICS.find((item) => item.value === topic)
  const filteredPosts = activeTopic ? posts.filter((post) => post.category === activeTopic.value) : posts
  const [featuredPost, ...restPosts] = filteredPosts

  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Resource Center</span>
        <h1 className="page-title">Acoustic education, buying guidance, and room-specific advice.</h1>
        <p className="page-subtitle">
          Browse the questions people usually have before treating a room, then go deeper into the articles that match your space and use-case.
        </p>
      </section>

      <section className="home-shell page-hero-shell">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="page-kicker">Browse by topic</p>
              <h2 className="page-card-title">Start with the acoustic problem you are trying to solve.</h2>
            </div>
            {activeTopic && (
              <Link href="/blog" className="page-link">
                Clear filter <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto overflow-y-hidden px-1 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3">
            {RESOURCE_TOPICS.map((resourceTopic) => {
              const count = topicCount(posts, resourceTopic.value)
              const isActive = activeTopic?.value === resourceTopic.value

              return (
                <Link
                  key={resourceTopic.value}
                  href={`/blog?topic=${resourceTopic.value}`}
                  className={`page-card glass-card w-[min(84vw,320px)] shrink-0 p-6 transition-all duration-300 hover:-translate-y-1 md:w-auto ${isActive ? 'border-[rgba(255,165,0,0.3)] shadow-[0_18px_45px_rgba(255,165,0,0.12)]' : ''}`}
                >
                  <p className="page-kicker text-[var(--color-brand-orange)]">
                    {count > 0 ? `${count} article${count === 1 ? '' : 's'}` : 'More coming soon'}
                  </p>
                  <h2 className="page-card-title">{resourceTopic.title}</h2>
                  <p className="page-card-copy hidden md:block">{resourceTopic.description}</p>
                  <span className="page-link mt-2">Browse topic <span aria-hidden="true">→</span></span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {filteredPosts.length === 0 ? (
        <section className="glass-card page-hero-shell">
          <p className="page-card-copy">
            No published articles yet for this topic. Drafts have already been added in Sanity so you can edit and publish them whenever you are ready.
          </p>
        </section>
      ) : (
        <>
          {featuredPost && (
            <section className="home-shell page-hero-shell">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end">
                <div>
                  <p className="page-kicker text-[var(--color-brand-orange)]">
                    {RESOURCE_TOPICS.find((item) => item.value === featuredPost.category)?.title || 'Featured article'}
                  </p>
                  <h2 className="page-title text-[clamp(26px,3.6vw,44px)]">
                    {featuredPost.title}
                  </h2>
                </div>
                <div>
                  {featuredPost.excerpt && (
                    <p className="page-subtitle max-w-none">{featuredPost.excerpt}</p>
                  )}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link href={`/blog/${featuredPost.slug.current}`} className="page-cta">
                      Read featured article
                    </Link>
                    <Link href="/contact" className="page-link">
                      Free Consultation <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {restPosts.length > 0 && (
            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {restPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="page-card glass-card group p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="page-kicker text-[var(--color-brand-orange)]">
                    {RESOURCE_TOPICS.find((item) => item.value === post.category)?.title || 'Acoustic Education'}
                  </p>
                  <h2 className="page-card-title transition-colors group-hover:text-[var(--color-brand-orange)]">{post.title}</h2>
                  {post.excerpt && <p className="page-card-copy line-clamp-4">{post.excerpt}</p>}
                  <span className="page-link mt-1">Read article <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
