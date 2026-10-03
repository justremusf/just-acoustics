import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react'
import { getAllProjects, getAllSpaces } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project, Space } from '@/lib/types'
import { canonicalPath } from '@/lib/seo'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Acoustic Treatment by Space',
  description:
    'Find acoustic treatment for your type of space in Singapore: homes, studios, offices, churches, restaurants, schools and activity spaces.',
  alternates: { canonical: canonicalPath('/spaces') },
}

/** Widen the first card(s) so a 2-column (sm) and 3-column (xl) grid never leaves a lone card on the last row. */
function spanClasses(index: number, count: number) {
  const smWide = count % 2 === 1 && index === 0
  const xlWide = (count % 3 === 1 && index < 2) || (count % 3 === 2 && index === 0)
  return {
    card: [smWide ? 'sm:col-span-2' : '', xlWide ? 'xl:col-span-2' : smWide ? 'xl:col-span-1' : ''].join(' '),
    image: [smWide ? 'sm:aspect-[21/9]' : '', xlWide ? 'xl:aspect-[21/9]' : smWide ? 'xl:aspect-[16/10]' : ''].join(' '),
  }
}

export default async function SpacesPage() {
  const [spaces, projects]: [Space[], Project[]] = await Promise.all([getAllSpaces().catch(() => []), getAllProjects().catch(() => [])])
  const recentProjects = projects.filter((project) => project.mainImage?.asset && project.slug?.current).slice(0, 3)

  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-4 md:!p-8">
        <span className="soft-pill self-start">Spaces</span>
        <h1 className="page-title">Which space are you treating?</h1>
        <p className="page-subtitle m-0 max-w-[62ch]">
          Every room behaves differently. Pick yours to see the common problems, what we recommend and the work we have done in spaces like it.
        </p>
      </section>

      {spaces.length === 0 ? (
        <section className="glass-card page-hero-shell flex flex-col items-start gap-3">
          <p className="page-card-copy m-0">Space guides are being prepared. Tell us about your room and we will point you in the right direction.</p>
          <Link href="/contact" className="page-link">
            Get free advice <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-flow-dense xl:grid-cols-3">
          {spaces.map((space, index) => (
            <Link
              key={space._id}
              href={`/spaces/${space.slug.current}`}
              className={`${spanClasses(index, spaces.length).card} deferred-card group flex flex-col overflow-hidden rounded-[24px] border border-black/6 bg-white/80 no-underline shadow-[0_14px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_56px_rgba(0,0,0,0.09)]`}
            >
              <div className={`relative aspect-[16/10] overflow-hidden bg-[var(--color-dark-100)] ${spanClasses(index, spaces.length).image}`}>
                {space.mainImage?.asset && (
                  <Image
                    src={urlFor(space.mainImage).width(900).height(563).fit('crop').url()}
                    alt={space.mainImage.alt || space.title}
                    fill
                    priority={index < 3}
                    sizes="(min-width: 1280px) 32vw, (min-width: 640px) 48vw, 100vw"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="page-card-title m-0 transition-colors group-hover:text-[var(--color-brand-orange)]">{space.title}</h2>
                {(space.shortDescription || space.heroTagline) && (
                  <p className="page-card-copy m-0 line-clamp-3 text-[14px]">{space.shortDescription || space.heroTagline}</p>
                )}
                <span className="page-link mt-auto pt-2">
                  Explore {space.title.toLowerCase()} <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="relative overflow-hidden rounded-[var(--section-radius)] bg-[var(--color-dark-100)] p-[clamp(24px,4vw,44px)] text-white">
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="page-kicker !text-[var(--color-brand-orange)]">Not sure which fits?</p>
            <h2 className="m-0 mt-2 max-w-[26ch] text-[clamp(24px,2.8vw,36px)] font-medium leading-[1.05] tracking-[-0.8px] text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Tell us about the room. We will tell you what it needs.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-brand-orange)] px-6 text-sm font-semibold text-[var(--color-dark-100)] no-underline transition-transform duration-200 hover:-translate-y-0.5"
            >
              Get free advice <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href="https://wa.me/6589301905"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {recentProjects.length === 3 && (
        <section className="home-shell page-hero-shell flex flex-col gap-5 md:!p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">Recent work</p>
              <h2 className="page-card-title mt-1.5 !text-[clamp(24px,2.4vw,32px)]">Rooms we have treated</h2>
            </div>
            <Link href="/projects" className="page-link whitespace-nowrap">
              All projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentProjects.map((project) => (
              <Link key={project._id} href={`/projects/${project.slug.current}`} className="group flex flex-col gap-2 no-underline">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[var(--color-white-200)]">
                  <Image
                    src={urlFor(project.mainImage!).width(700).height(525).url()}
                    alt={project.mainImage?.alt || project.title}
                    fill
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <span className="flex items-center justify-between gap-2 px-1 text-[15px] font-semibold text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]">
                  {project.title}
                  <ArrowUpRight size={15} aria-hidden="true" className="shrink-0" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
