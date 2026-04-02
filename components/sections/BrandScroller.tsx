import Link from 'next/link'
import Image from 'next/image'
import type { SanityImage } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

const FALLBACK_LOGOS = [
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425eeaa3c0b1b8e1f078_4.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425e28c744e5908bc3d8_2.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425ee946da6b4ca8ef31_5.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425ece94e3df9257d5b0_10.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425edf801a5d999fb496_8.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425e6d6f97df75c68604_6.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425efdd0e2c6bcb9b18e_11.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425e5fc7b7c1f3b95be8_12.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425e65e679ade375ee17_13.png', alt: 'Brand' },
  { src: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6987425e54111c126a709545_14.png', alt: 'Brand' },
]

interface Props {
  logos?: SanityImage[]
}

export default function BrandScroller({ logos }: Props) {
  const items =
    logos && logos.length > 0
      ? logos.map((logo) => ({ src: urlFor(logo).width(234).url(), alt: logo.alt || 'Brand' }))
      : FALLBACK_LOGOS

  const doubled = [...items, ...items]

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="mx-auto max-w-[1280px] rounded-[24px] border border-[var(--color-white-300)] bg-[var(--color-white-100)] px-4 py-6 shadow-[0_16px_50px_rgba(0,0,0,0.05)] md:px-6 md:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[620px]">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-orange)]">
              Trusted by teams who need quieter rooms
            </p>
            <h2
              className="m-0 mt-3 text-[var(--color-dark-100)]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(22px, 2.8vw, 32px)',
                fontWeight: 600,
                lineHeight: '1.08',
                letterSpacing: '-0.8px',
              }}
            >
              Successfully tranformed spaces all over Singapore
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-dark-100)] no-underline transition-colors hover:text-[var(--color-brand-orange)]"
          >
            See project examples
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="brand-scroll-wrap">
          <div className="brand-scroll-inner flex">
            {doubled.map((logo, i) => (
              <div
                key={i}
                className="mr-3 flex min-w-[176px] flex-none items-center justify-center rounded-[14px] border border-black/4 bg-[var(--color-white-200)] px-5 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:opacity-90 sm:min-w-[203px] sm:px-6"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={132}
                  height={63}
                  className="max-h-[63px] object-contain sm:max-h-[73px]"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
