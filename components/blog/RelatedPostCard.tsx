import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { ExplorerPost } from '@/lib/blogContent'
import { CONTENT_TYPES, coverRatio } from '@/lib/blogContent'
import { RESOURCE_TOPICS } from '@/lib/resourceTopics'

/** Same visual language as the /blog feed cards, without the client-side search features. */
export default function RelatedPostCard({ post }: { post: ExplorerPost }) {
  const topic = RESOURCE_TOPICS.find((t) => t.value === post.category)?.title ?? 'Acoustic Education'
  const type = CONTENT_TYPES.find((t) => t.value === post.contentType)?.singular ?? 'Article'

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col no-underline focus-visible:outline-none">
      <div style={{ aspectRatio: coverRatio(post.image) }} className="relative overflow-hidden rounded-[22px] bg-[var(--color-dark-100)] shadow-[0_18px_44px_rgba(0,0,0,0.08)] transition-shadow duration-300 group-hover:shadow-[0_26px_60px_rgba(0,0,0,0.16)] group-focus-visible:ring-4 group-focus-visible:ring-[var(--color-brand-orange)]">
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-contain"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex items-end bg-[linear-gradient(160deg,#2a2a2a,#151515)] p-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{topic}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1 pt-4">
        <p className="page-kicker !text-[var(--color-brand-orange)]">{topic}</p>
        <h3
          className="m-0 text-[clamp(19px,1.5vw,22px)] font-medium leading-[1.12] tracking-[-0.5px] text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {post.title}
        </h3>
        {post.excerpt && <p className="page-card-copy m-0 line-clamp-2 text-[14px]">{post.excerpt}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[12.5px] text-[var(--color-gray-200)]">
          <span className="font-semibold text-[var(--color-dark-100)]">{type}</span>
          {post.readingTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} aria-hidden="true" /> {Math.max(1, post.readingTime)} min
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
