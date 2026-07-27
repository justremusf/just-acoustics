import Image from 'next/image'
import type { SanityImage } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'

const FALLBACK_LOGOS = [
  { src: '/assets/webflow/6987425eeaa3c0b1b8e1f078_4.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425e28c744e5908bc3d8_2.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425ee946da6b4ca8ef31_5.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425ece94e3df9257d5b0_10.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425edf801a5d999fb496_8.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425e6d6f97df75c68604_6.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425efdd0e2c6bcb9b18e_11.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425e5fc7b7c1f3b95be8_12.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425e65e679ade375ee17_13.png', alt: 'Brand' },
  { src: '/assets/webflow/6987425e54111c126a709545_14.png', alt: 'Brand' },
]

interface Props {
  logos?: SanityImage[]
}

export default function BrandScroller({ logos }: Props) {
  const items =
    logos && logos.length > 0
      ? logos.map((logo) => ({ src: urlFor(logo).width(360).url(), alt: logo.alt || 'Brand' }))
      : FALLBACK_LOGOS

  const doubled = [...items, ...items]

  return (
    <section className="py-3 md:py-5">
      <div className="brand-scroll-wrap w-full">
        <div className="brand-scroll-inner flex w-max px-1.5 sm:px-3 md:px-4">
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="mr-2 flex h-[82px] min-w-[160px] flex-none items-center justify-center rounded-[14px] border border-black/4 bg-[var(--color-white-200)] px-4 py-2.5 transition-all duration-500 hover:-translate-y-0.5 hover:opacity-95 sm:mr-3 sm:h-[123px] sm:min-w-[320px] sm:px-10 sm:py-4"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={63}
                sizes="(max-width: 639px) 112px, 180px"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                quality={70}
                loading="lazy"
                className="h-[38px] w-auto object-contain sm:h-[63px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
