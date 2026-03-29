import Image from 'next/image'
import type { SanityImage } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

// Fallback logos (from current site CDN) if Sanity isn't populated yet
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
      ? logos.map((logo) => ({ src: urlFor(logo).width(180).url(), alt: logo.alt || 'Brand' }))
      : FALLBACK_LOGOS

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <section className="py-14">
      <div className="text-center mb-10">
        <h2
          className="text-[var(--color-dark-100)] m-0"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 600,
            letterSpacing: '-0.5px',
          }}
        >
          A Trusted Acoustic Company for Superior Sound
        </h2>
      </div>
      <div className="brand-scroll-wrap">
        <div className="brand-scroll-inner flex gap-4">
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="flex-none bg-[var(--color-white-200)] rounded-[10px] flex items-center justify-center px-10 py-4 min-w-[220px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white cursor-pointer"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={90}
                className="object-contain max-h-[90px]"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
