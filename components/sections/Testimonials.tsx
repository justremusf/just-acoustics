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
    <section className="py-20 md:py-28 bg-[var(--color-white-100)]">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="text-center mb-20 md:mb-24 max-w-[640px] mx-auto">
          <h2
            className="text-[var(--color-dark-100)] m-0 mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
              lineHeight: '124%',
              fontWeight: 500,
              letterSpacing: '-1.04px',
            }}
          >
            We&apos;ll let our clients do the talking
          </h2>
          <p className="text-[var(--color-gray-100)] text-base m-0">
            Trusted by businesses and homeowners across Singapore
          </p>
        </div>

        {/* YouTube video — replace YOUR_VIDEO_ID_HERE with the actual YouTube video ID */}
        <div className="mb-20 md:mb-24 rounded-[20px] overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/-1WDATPou2Y"
              title="Client Testimonial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((t, i) => (
            <div
              key={'_id' in t ? (t._id as string) : i}
              className="bg-[var(--color-white-200)] rounded-[16px] p-5 md:p-6 flex flex-col gap-4"
            >
              <Stars rating={t.rating} />
              <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed italic">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto">
                {'image' in t && t.image ? (
                  <Image
                    src={urlFor(t.image).width(48).height(48).url()}
                    alt={t.authorName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[var(--color-gray-600)] flex items-center justify-center text-white font-semibold text-lg shrink-0">
                    {t.authorName[0]}
                  </div>
                )}
                <div>
                  <p className="text-[var(--color-dark-100)] font-semibold m-0 text-base">
                    {t.authorName}
                  </p>
                  {t.company && (
                    <p className="text-[var(--color-gray-200)] text-base m-0">{t.company}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
