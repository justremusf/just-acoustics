import Link from 'next/link'
import type { Testimonial } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'

const FALLBACK_TESTIMONIALS: Omit<Testimonial, '_id' | 'image'>[] = [
  {
    authorName: 'Gerald',
    company: 'Mortgage Hub',
    review:
      'They are patient and explained the options of reducing echoes in the office space professionally. I recommend Just Acoustics for both residential and commercial projects.',
    rating: 5,
  },
  {
    authorName: 'Irvin',
    company: 'Church of Christ',
    review:
      'The Just Acoustics team were professional, efficient and detailed in their work. Highly recommended for homes and businesses!',
    rating: 5,
  },
  {
    authorName: 'Madeleine',
    company: 'Concentricheal',
    review:
      'Working with the team was very smooth! They are highly knowledgeable in elaborating on the sound treatment options and recommending the best one that fits our requirements.',
    rating: 5,
  },
]

interface Props {
  testimonials?: Testimonial[]
}

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-[var(--color-brand-orange)]' : 'text-[var(--color-gray-300)]'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function Testimonials({ testimonials }: Props) {
  const items = testimonials && testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="max-w-[620px]">
            <span className="soft-pill">Reviews</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">
              Hear from our clients
            </h2>
        </div>

        <div className="glass-card mt-10 overflow-hidden md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="section-shell-pad">
              <p className="page-kicker text-[var(--color-brand-orange)]">Client story</p>
              <h3
                className="m-0 mt-4 text-[var(--color-dark-100)]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(22px, 2.8vw, 32px)',
                  lineHeight: '1.08',
                  fontWeight: 600,
                  letterSpacing: '-0.8px',
                }}
              >
                Watch how acoustic treatment changes the experience of a room, not just the measurements.
              </h3>
              <p className="mt-4 max-w-[50ch] text-[14px] leading-6 text-[var(--color-gray-100)]">
                A quick before-and-after story helps people understand what clearer speech and lower echo actually feel like once the panels go in.
              </p>
              <div className="mt-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-100)] no-underline transition-colors hover:text-[var(--color-brand-orange)]"
                >
                  Browse completed projects
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="min-h-[220px] border-t border-black/6 lg:border-t-0 lg:border-l lg:border-black/6">
              <div className="relative h-full w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/-1WDATPou2Y"
                  title="Client Testimonial Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3">
          {items.map((t, i) => (
            <div
              key={'_id' in t ? (t._id as string) : i}
              className="glass-card flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset] md:p-6"
            >
              <Stars rating={t.rating} />
              <p className="m-0 text-base italic leading-relaxed text-[var(--color-gray-100)]">&ldquo;{t.review}&rdquo;</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                {'image' in t && t.image ? (
                  <Image
                    src={urlFor(t.image).width(48).height(48).url()}
                    alt={t.authorName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-gray-600)] text-lg font-semibold text-white">
                    {t.authorName[0]}
                  </div>
                )}
                <div>
                  <p className="m-0 text-base font-semibold text-[var(--color-dark-100)]">{t.authorName}</p>
                  {t.company && <p className="m-0 text-sm text-[var(--color-gray-200)]">{t.company}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
