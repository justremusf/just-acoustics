import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/types'
import { urlFor } from '@/sanity/lib/image'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'

interface Props {
  projects?: Project[]
}

export default function RecentProjects({ projects }: Props) {
  const recent = (projects ?? [])
    .filter((project) => project.mainImage?.asset && project.slug?.current)
    .slice(0, 3)

  if (recent.length < 3) return null

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1580px]">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <h2 className="home-heading text-[var(--color-dark-100)]">Recent projects</h2>
          <Link href="/projects" className="home-link inline-flex shrink-0 items-center gap-2">
            All projects <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {recent.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project.slug.current}`}
              className="group flex flex-col gap-3 no-underline"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[var(--color-white-200)]">
                <Image
                  src={urlFor(project.mainImage!).width(800).height(600).fit('crop').url()}
                  alt={project.mainImage?.alt || project.title}
                  fill
                  sizes="(min-width: 640px) 31vw, calc(100vw - 64px)"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  quality={70}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <span className="px-1 text-[15px] font-semibold text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]">
                {project.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
