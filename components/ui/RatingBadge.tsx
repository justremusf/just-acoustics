import type { GoogleRating } from '@/lib/rating'

/** "★ 4.9 · 48 Google reviews". Renders nothing until a rating is set in Sanity. */
export default function RatingBadge({ rating, tone = 'light', className = '' }: { rating?: GoogleRating | null; tone?: 'light' | 'dark'; className?: string }) {
  if (!rating) return null
  const text = tone === 'dark' ? 'text-white/85' : 'text-[var(--color-gray-100)]'
  const strong = tone === 'dark' ? 'text-white' : 'text-[var(--color-dark-100)]'
  const content = (
    <>
      <span className="text-[var(--color-brand-orange)]" aria-hidden="true">
        ★★★★★
      </span>
      <span>
        <strong className={strong}>{rating.value.toFixed(1)}</strong> from {rating.count} Google reviews
      </span>
    </>
  )
  const base = `inline-flex items-center gap-2 text-[13px] ${text} ${className}`
  return rating.url ? (
    <a href={rating.url} target="_blank" rel="noopener noreferrer" className={`${base} no-underline hover:underline`}>
      {content}
    </a>
  ) : (
    <span className={base}>{content}</span>
  )
}
