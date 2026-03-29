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
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <Link
        href="/projects"
        className="text-[var(--color-gray-200)] text-sm no-underline hover:text-[var(--color-dark-100)] transition-colors inline-flex items-center gap-1 mb-10"
      >
        ← All Projects
      </Link>

      {project.mainImage && (
        <div className="rounded-[20px] overflow-hidden mb-10 h-[420px]">
          <Image
            src={urlFor(project.mainImage).width(990).height(420).url()}
            alt={project.mainImage.alt || project.title}
            width={990}
            height={420}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.4fr] gap-12 items-start">
        <div>
          <h1
            className="text-[var(--color-dark-100)] m-0 mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
              lineHeight: '124%',
              fontWeight: 500,
              letterSpacing: '-1.04px',
            }}
          >
            {project.title}
          </h1>

          {project.description && (
            <p className="text-[var(--color-gray-100)] text-base m-0 mb-8 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-8">
              {project.gallery.map((img, i) => (
                <div key={i} className="rounded-[12px] overflow-hidden aspect-[4/3]">
                  <Image
                    src={urlFor(img).width(480).height(360).url()}
                    alt={img.alt || `${project.title} ${i + 1}`}
                    width={480}
                    height={360}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sticky top-12 flex flex-col gap-4">
          {/* Project info */}
          <div className="bg-[var(--color-white-200)] rounded-[16px] p-6">
            {project.clientName && (
              <div className="mb-4 pb-4 border-b border-[var(--color-gray-600)]">
                <span className="text-[var(--color-gray-200)] text-xs uppercase tracking-wide block mb-1">Client</span>
                <span className="text-[var(--color-dark-100)] font-semibold">{project.clientName}</span>
              </div>
            )}
            {project.location && (
              <div className="mb-4 pb-4 border-b border-[var(--color-gray-600)]">
                <span className="text-[var(--color-gray-200)] text-xs uppercase tracking-wide block mb-1">Location</span>
                <span className="text-[var(--color-dark-100)] font-semibold">{project.location}</span>
              </div>
            )}
            {project.completionDate && (
              <div>
                <span className="text-[var(--color-gray-200)] text-xs uppercase tracking-wide block mb-1">Completed</span>
                <span className="text-[var(--color-dark-100)] font-semibold">
                  {new Date(project.completionDate).toLocaleDateString('en-SG', { year: 'numeric', month: 'long' })}
                </span>
              </div>
            )}
          </div>

          {/* Testimonial */}
          {project.testimonial?.quote && (
            <div className="bg-[var(--color-white-200)] rounded-[16px] p-6">
              <p className="text-[var(--color-gray-100)] text-sm m-0 mb-4 italic leading-relaxed">
                &ldquo;{project.testimonial.quote}&rdquo;
              </p>
              {project.testimonial.authorName && (
                <p className="text-[var(--color-dark-100)] text-sm font-semibold m-0">
                  — {project.testimonial.authorName}
                  {project.testimonial.authorRole && (
                    <span className="text-[var(--color-gray-200)] font-normal">, {project.testimonial.authorRole}</span>
                  )}
                </p>
              )}
            </div>
          )}

          <Link
            href="/contact"
            className="block w-full bg-[var(--color-brand-orange)] text-white text-center rounded-[100px] px-6 py-3.5 text-base no-underline hover:bg-[var(--color-gray-100)] transition-colors"
          >
            Get a Similar Solution
          </Link>
        </div>
      </div>
    </div>
  )
}
