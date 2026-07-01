import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllSpaces } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Space } from '@/lib/types'
import { canonicalPath } from '@/lib/seo'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Spaces',
  description:
    'Explore acoustic treatment strategies for studios, offices, churches, restaurants, education, and activity spaces in Singapore.',
  alternates: { canonical: canonicalPath('/spaces') },
}

export default async function SpacesPage() {
  const spaces: Space[] = await getAllSpaces().catch(() => [])

  return (
    <main className="px-4 pb-16 pt-6 sm:px-5 sm:pb-20 lg:pt-8">
      <section className="site-container rounded-[32px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(245,245,245,0.76))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.09),0_8px_24px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-2xl sm:p-9 lg:p-12">
        <div className="max-w-[820px]">
          <h1 className="m-0 text-[clamp(42px,6vw,76px)] font-semibold leading-[0.94] tracking-[-0.05em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Spaces
          </h1>
          <p className="mb-0 mt-5 max-w-[62ch] text-[16px] leading-7 text-[var(--color-gray-100)] sm:text-[18px]">
            Every room behaves differently. Explore acoustic strategies designed around how your space is used, how it should feel, and what people need to hear.
          </p>
        </div>
      </section>

      <section className="site-container mt-8 rounded-[32px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,245,245,0.8))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.09),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-2xl sm:mt-10 sm:p-7 lg:p-10">
        {spaces.length === 0 ? (
          <p className="m-0 p-8 text-center text-[var(--color-gray-100)]">Spaces are being prepared.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {spaces.map((space, index) => (
              <Link
                key={space._id}
                href={`/spaces/${space.slug.current}`}
                className="deferred-card group relative isolate aspect-[4/3] overflow-hidden rounded-[24px] bg-[#171717] no-underline"
              >
                {space.mainImage ? (
                  <Image
                    src={urlFor(space.mainImage).width(900).height(675).fit('crop').url()}
                    alt={space.mainImage.alt || space.title}
                    fill
                    unoptimized
                    priority={index === 0}
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) 48vw, 32vw"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.05),rgba(5,5,5,0.76))]" />
                <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 text-white sm:p-6">
                  <span className="block text-[24px] font-medium leading-none tracking-[-0.03em] sm:text-[28px]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {space.title}
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
