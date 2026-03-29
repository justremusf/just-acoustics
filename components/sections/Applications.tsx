import Link from 'next/link'
import Image from 'next/image'
import type { Service } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'

const FALLBACK_APPLICATIONS = [
  {
    title: 'Office Spaces',
    description: 'Boost productivity with better sound. Reduce distracting noise and echo.',
    href: '/services/office-spaces',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6964fb659de42387a7d78754_Image%20from%20TinyPNG%20(4).avif',
  },
  {
    title: 'Hospitality & Retail',
    description: 'Create comfortable dining experiences. Reduce echo in restaurants and cafes.',
    href: '/services/hospitality-retail',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
  },
  {
    title: 'Church & Event Spaces',
    description: 'Crystal-clear speech in every corner. Improve sound clarity in places of worship.',
    href: '/services/church-event-spaces',
    img: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a459f805f921445e4427e_9.avif',
  },
  {
    title: 'Cinema & Music Studios',
    description: 'Experience high-quality sound. Eliminate echo for recording studios and home theatres.',
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
      ? services.slice(0, 4).map((s) => ({
          title: s.title,
          description: s.shortDescription || '',
          href: `/services/${s.slug.current}`,
          img: s.mainImage ? urlFor(s.mainImage).width(600).url() : '',
          unoptimized: false,
        }))
      : FALLBACK_APPLICATIONS.map((a) => ({ ...a, unoptimized: true }))

  return (
    <section className="py-20 bg-[var(--color-white-100)]">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="text-center mb-14">
          <h2
            className="text-[var(--color-dark-100)] m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
              lineHeight: '124%',
              fontWeight: 500,
              letterSpacing: '-1.04px',
            }}
          >
            Space Applications
          </h2>
          <p className="text-[var(--color-gray-100)] text-base m-0 max-w-xl mx-auto">
            Whether you need to soundproof an office or create a unique ambience for your venue, we can help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="relative block rounded-[16px] overflow-hidden no-underline group min-h-[260px] sm:min-h-[280px]"
            >
              {app.img && (
                <Image
                  src={app.img}
                  alt={app.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={'unoptimized' in app ? app.unoptimized : false}
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-7">
                <h3
                  className="text-white m-0 mb-2 font-semibold"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 2.5vw, 26px)', letterSpacing: '-0.3px' }}
                >
                  {app.title}
                </h3>
                <p className="text-white/80 text-base m-0 leading-relaxed">
                  {app.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link
            href="/services"
            className="inline-block border border-[var(--color-dark-100)] text-[var(--color-dark-100)] rounded-[100px] px-8 py-4 text-base no-underline transition-all duration-300 hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)]"
          >
            View All Applications
          </Link>
        </div>
      </div>
    </section>
  )
}
