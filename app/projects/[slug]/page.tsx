import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProjectBySlug, getAllProjectSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/lib/types'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllProjectSlugs().catch(() => [])
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project: Project | null = await getProjectBySlug(slug).catch(() => null)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: project.mainImage
      ? { images: [{ url: urlFor(project.mainImage).width(1200).height(630).url() }] }
      : undefined,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project: Project | null = await getProjectBySlug(slug).catch(() => null)
  if (!project) notFound()

  return (
    <div className="page-wrap page-stack">
      <Link href="/projects" className="page-link">← All Projects</Link>

      <section className="home-shell page-hero-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="flex flex-col gap-4">
            <span className="soft-pill">Project</span>
            <h1 className="page-title">{project.title}</h1>
            {project.description && <p className="page-subtitle">{project.description}</p>}
            <Link href="/contact" className="page-cta mt-2 w-fit">Get a Similar Solution</Link>
          </div>

          <div className="grid gap-4">
            <div className="glass-card p-5 sm:p-6">
              <p className="page-kicker">Project Details</p>
              <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-[var(--color-gray-100)]">
                {project.clientName && <div><strong className="text-[var(--color-dark-100)]">Client:</strong> {project.clientName}</div>}
                {project.location && <div><strong className="text-[var(--color-dark-100)]">Location:</strong> {project.location}</div>}
                {project.completionDate && (
                  <div>
                    <strong className="text-[var(--color-dark-100)]">Completed:</strong>{' '}
                    {new Date(project.completionDate).toLocaleDateString('en-SG', { year: 'numeric', month: 'long' })}
                  </div>
                )}
              </div>
            </div>
            {project.testimonial?.quote && (
              <div className="dark-glass rounded-[28px] p-5 text-white sm:p-6">
                <p className="page-kicker text-white/60">Client Feedback</p>
                <p className="mt-4 text-base leading-7 text-white/88">&ldquo;{project.testimonial.quote}&rdquo;</p>
                {project.testimonial.authorName && (
                  <p className="mt-4 text-sm font-semibold text-white">
                    {project.testimonial.authorName}
                    {project.testimonial.authorRole && <span className="font-normal text-white/65">, {project.testimonial.authorRole}</span>}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {project.mainImage && (
        <section className="glass-card overflow-hidden rounded-[32px]">
          <Image
            src={urlFor(project.mainImage).width(1400).height(760).url()}
            alt={project.mainImage.alt || project.title}
            width={1400}
            height={760}
            className="aspect-[4/3] h-full w-full object-cover sm:aspect-[16/9]"
            priority
          />
        </section>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {project.gallery.map((img, index) => (
            <div key={index} className="glass-card overflow-hidden rounded-[28px]">
              <Image
                src={urlFor(img).width(900).height(680).url()}
                alt={img.alt || project.title + ' ' + (index + 1)}
                width={900}
                height={680}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
