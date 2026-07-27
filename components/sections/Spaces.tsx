import Link from 'next/link'
import Image from 'next/image'
import type { Space } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'

const HOME_APPLICATION_ORDER = [
  'churches',
  'offices',
  'restaurants',
  'studios',
  'education',
  'gym-and-activity-spaces',
] as const

type SpaceCard = {
  title: string
  href: string
  img: string
  unoptimized: boolean
}

const FALLBACK_SPACES = [
  {
    title: 'Churches & Event Spaces',
    description: 'Crystal-clear speech in every corner for worship, teaching, and live events.',
    href: '/spaces/churches',
    img: '/assets/pricing/church.jpg',
  },
  {
    title: 'Offices & Meeting Rooms',
    description: 'Reduce distractions and make meetings easier to follow in busy workspaces.',
    href: '/spaces/offices',
    img: '/assets/pricing/office.jpg',
  },
  {
    title: 'Restaurants, Cafes, Bars',
    description: 'Create a dining experience where guests can enjoy the atmosphere and still talk comfortably.',
    href: '/spaces/restaurants',
    img: '/assets/pricing/restaurant.jpg',
  },
  {
    title: 'Cinema & Music Studios',
    description: 'Bring focus and listening precision to recording, playback, and cinematic environments.',
    href: '/spaces/studios',
    img: '/assets/pricing/home-studio.jpg',
  },
]

interface Props {
  spaces?: Space[]
}

export default function Spaces({ spaces }: Props) {
  const serviceMap = new Map(
    spaces?.map((space) => [
      space.slug.current,
      {
        title: space.title,
        href: `/spaces/${space.slug.current}`,
        img: space.mainImage ? urlFor(space.mainImage).width(700).height(560).fit('crop').url() : '',
        unoptimized: false,
      },
    ]),
  )

  const mappedItems = HOME_APPLICATION_ORDER.map((slug) => serviceMap.get(slug)).filter(
    (item): item is SpaceCard => Boolean(item),
  )

  const fallbackBySlug = new Map<string, (typeof FALLBACK_SPACES)[number]>([
    ['churches', FALLBACK_SPACES[0]],
    ['offices', FALLBACK_SPACES[1]],
    ['restaurants', FALLBACK_SPACES[2]],
    ['studios', FALLBACK_SPACES[3]],
  ])

  const items = mappedItems.length > 0
    ? mappedItems
    : HOME_APPLICATION_ORDER.flatMap((slug) => {
        const fallback = fallbackBySlug.get(slug)
        return fallback ? [{ ...fallback, unoptimized: true }] : []
      })

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1580px]">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[886px]">
              <h2
              className="home-heading text-[var(--color-dark-100)]"
              style={{ width: 'min(100%, 886px)' }}
            >
              Acoustic Treatment For Every Space
            </h2>
            <p className="home-copy mt-5 max-w-[54ch]">
              Different rooms create different acoustic problems. These are some of the environments we most often help transform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group relative block min-h-[220px] overflow-hidden rounded-[18px] border border-white/55 bg-white/35 no-underline shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:min-h-[320px] sm:rounded-[24px]"
            >
              {app.img && (
                <Image
                  src={app.img}
                  alt={app.title}
                  fill
                  sizes="(max-width: 639px) calc(50vw - 26px), (max-width: 1279px) calc(50vw - 28px), calc(33vw - 32px)"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  quality={70}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.02),rgba(1,1,1,0.34)_55%,rgba(1,1,1,0.52))]" />
              <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3.5 md:p-5">
                <div className="flex min-h-[58px] items-center justify-between gap-2 rounded-[14px] border border-white/12 bg-[rgba(20,18,16,0.28)] p-3 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1 sm:min-h-[76px] sm:gap-4 sm:rounded-[20px] sm:p-4 md:p-5">
                  <h3 className="m-0 text-[15px] leading-[1.04] font-medium tracking-[-0.4px] text-white sm:text-[26px] sm:tracking-[-0.8px]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {app.title}
                  </h3>
                  <span className="shrink-0 text-base text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-brand-orange)] sm:text-xl" aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex justify-end md:mt-6">
          <Link href="/spaces" className="home-link inline-flex items-center gap-2">
            See all spaces <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
