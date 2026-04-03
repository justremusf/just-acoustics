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
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <span className="soft-pill">Projects</span>
        <h1 className="page-title">Spaces that now sound better</h1>
        <p className="page-subtitle">
          Browse acoustic installations across hospitality, worship, education, office, and lifestyle spaces in Singapore.
        </p>
      </section>

      <section className="home-shell page-hero-shell overflow-hidden">
        <div className="no-scrollbar flex gap-3 overflow-x-auto overflow-y-hidden pb-1 md:flex-wrap md:pb-0">
          <Link href="/projects" className={`page-filter whitespace-nowrap ${!category ? 'active' : ''}`}>All</Link>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <Link key={value} href={'/projects?category=' + value} className={`page-filter whitespace-nowrap ${category === value ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="glass-card page-hero-shell">
          <p className="page-card-copy">No projects yet. Check back soon.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((project) => (
            <Link
              key={project._id}
              href={'/projects/' + project.slug.current}
              className="page-card glass-card group transition-transform duration-300 hover:-translate-y-1"
            >
              {project.mainImage && (
                <div className="page-card-image aspect-[4/3]">
                  <Image
                    src={urlFor(project.mainImage).width(720).height(540).url()}
                    alt={project.mainImage.alt || project.title}
                    width={720}
                    height={540}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="page-card-body">
                {project.category && <p className="page-kicker">{CATEGORY_LABELS[project.category] || project.category}</p>}
                <h2 className="page-card-title transition-colors group-hover:text-[var(--color-brand-orange)]">{project.title}</h2>
                {project.location && <p className="page-card-copy">{project.location}</p>}
                <span className="page-link mt-1">View project <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}
