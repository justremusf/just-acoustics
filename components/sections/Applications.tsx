import Link from 'next/link'
import Image from 'next/image'
import type { Service } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

const FALLBACK_APPLICATIONS = [
  {
    title: 'Churches & Event Spaces',
    description: 'Crystal-clear speech in every corner for worship, teaching, and live events.',
    href: '/services/churches-event-spaces',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a459f805f921445e4427e_9.avif',
  },
  {
    title: 'Offices & Meeting Rooms',
    description: 'Reduce distractions and make meetings easier to follow in busy workspaces.',
    href: '/services/offices-meeting-rooms',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6964fb659de42387a7d78754_Image%20from%20TinyPNG%20(4).avif',
  },
  {
    title: 'Restaurants, Cafes, Bars',
    description: 'Create a dining experience where guests can enjoy the atmosphere and still talk comfortably.',
    href: '/services/restaurants-cafes-bars',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
  },
  {
    title: 'Education Spaces',
    description: 'Support concentration and speech clarity in classrooms, studios, and learning environments.',
    href: '/services/education-spaces',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb30cf5a46b9a7edd3_4.png',
  },
  {
    title: 'Gym & Leisure Spaces',
    description: 'Manage the energy of active spaces without letting noise overwhelm the room.',
    href: '/services/gym-leisure-spaces',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efbd62acdbb9d45cd3d_5.png',
  },
  {
    title: 'Cinema & Music Studios',
    description: 'Bring focus and listening precision to recording, playback, and cinematic environments.',
    href: '/services/cinema-music-studios',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a4efb255645d4686056e2_7.png',
  },
]

interface Props {
  services?: Service[]
}

export default function Applications({ services }: Props) {
  const items =
    services && services.length > 0
      ? services.map((s) => ({
          title: s.title,
          description: s.shortDescription || '',
          href: `/services/${s.slug.current}`,
          img: s.mainImage ? urlFor(s.mainImage).width(700).url() : '',
          unoptimized: false,
        }))
      : FALLBACK_APPLICATIONS.map((a) => ({ ...a, unoptimized: true }))

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <span className="soft-pill">Space Applications</span>
            <h2 className="home-heading mt-5 max-w-[14ch] text-[var(--color-dark-100)]">
              Why acoustics matter in your space
            </h2>
            <p className="home-copy mt-5 max-w-[54ch]">
              Different rooms create different acoustic problems. These are some of the environments we most often help transform.
            </p>
          </div>
          <Link href="/services" className="home-link inline-flex items-center gap-2 self-start md:self-auto">
            See all applications <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group relative block min-h-[280px] overflow-hidden rounded-[24px] border border-white/55 bg-white/35 no-underline shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:min-h-[320px]"
            >
              {app.img && (
                <Image
                  src={app.img}
                  alt={app.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized={'unoptimized' in app ? app.unoptimized : false}
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.02),rgba(1,1,1,0.34)_55%,rgba(1,1,1,0.52))]" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-5">
                <div className="rounded-[20px] border border-white/12 bg-[rgba(20,18,16,0.24)] p-4 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="m-0 text-[22px] leading-[1.04] font-medium tracking-[-0.8px] text-white sm:text-[24px]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {app.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-5.5 text-white/78 md:text-[14px]">{app.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-[var(--color-brand-orange)]">
                    View application <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
