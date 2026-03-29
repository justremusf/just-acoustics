import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProjects } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Projects',
  description: 'View our portfolio of completed acoustic panel installations across offices, restaurants, churches and more in Singapore.',
}

const CATEGORY_LABELS: Record<string, string> = {
  restaurants: 'Restaurants',
  'office-spaces': 'Office Spaces',
  schools: 'Schools',
  'studios-homes': 'Studios & Homes',
  churches: 'Churches',
  'gym-leisure': 'Gym & Leisure',
  cinema: 'Cinema',
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const allProjects: Project[] = await getAllProjects().catch(() => [])
  const filtered = category ? allProjects.filter((p) => p.category === category) : allProjects

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <div className="mb-14">
        <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm mb-4">
          Portfolio
        </span>
        <h1
          className="text-[var(--color-dark-100)] m-0 mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 5vw, var(--fs-h2))',
            lineHeight: '112%',
            fontWeight: 500,
            letterSpacing: '-1.28px',
          }}
        >
          Our Projects
        </h1>
        <p className="text-[var(--color-gray-100)] text-base m-0 max-w-xl">
          Snapshots of spaces transformed by Just Acoustics solutions
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/projects"
          className={`rounded-[100px] px-5 py-2 text-sm no-underline transition-colors border ${
            !category
              ? 'bg-[var(--color-dark-100)] text-white border-[var(--color-dark-100)]'
              : 'border-[var(--color-gray-300)] text-[var(--color-gray-200)] hover:border-[var(--color-dark-100)] hover:text-[var(--color-dark-100)]'
          }`}
        >
          All
        </Link>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <Link
            key={value}
            href={`/projects?category=${value}`}
            className={`rounded-[100px] px-5 py-2 text-sm no-underline transition-colors border ${
              category === value
                ? 'bg-[var(--color-dark-100)] text-white border-[var(--color-dark-100)]'
                : 'border-[var(--color-gray-300)] text-[var(--color-gray-200)] hover:border-[var(--color-dark-100)] hover:text-[var(--color-dark-100)]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-gray-200)]">No projects yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project.slug.current}`}
              className="block no-underline group rounded-[16px] overflow-hidden bg-[var(--color-white-200)]"
            >
              {project.mainImage && (
                <div className="overflow-hidden h-48">
                  <Image
                    src={urlFor(project.mainImage).width(400).height(192).url()}
                    alt={project.mainImage.alt || project.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                {project.category && (
                  <span className="text-[var(--color-gray-200)] text-xs uppercase tracking-wide mb-1 block">
                    {CATEGORY_LABELS[project.category] || project.category}
                  </span>
                )}
                <h2
                  className="text-[var(--color-dark-100)] m-0 text-base font-semibold group-hover:text-[var(--color-brand-orange)] transition-colors"
                >
                  {project.title}
                </h2>
                {project.location && (
                  <p className="text-[var(--color-gray-200)] text-sm m-0 mt-1">{project.location}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
