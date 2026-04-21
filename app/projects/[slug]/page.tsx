import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://justacoustics.co' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://justacoustics.co/projects' },
      { '@type': 'ListItem', position: 3, name: project.title, item: `https://justacoustics.co/projects/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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

      {project.metrics && project.metrics.length > 0 && (
        <section className="home-shell page-hero-shell">
          <span className="soft-pill">Outcome</span>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {project.metrics.map((m) => (
              <div key={m.label} className="glass-card p-5 text-center">
                <p className="text-[clamp(28px,4vw,44px)] font-bold leading-none tracking-tight text-[var(--color-brand-orange)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {m.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[var(--color-gray-100)]">{m.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(project.problem || project.solution || project.result) && (
        <section className="home-shell page-hero-shell">
          <div className="grid gap-8 md:grid-cols-3">
            {project.problem && (
              <div className="glass-card p-5 sm:p-6">
                <p className="page-kicker text-[var(--color-brand-orange)]">Problem</p>
                <div className="rich-content mt-4 text-sm">
                  <PortableText value={project.problem as Parameters<typeof PortableText>[0]['value']} />
                </div>
              </div>
            )}
            {project.solution && (
              <div className="glass-card p-5 sm:p-6">
                <p className="page-kicker text-[var(--color-brand-orange)]">Solution</p>
                <div className="rich-content mt-4 text-sm">
                  <PortableText value={project.solution as Parameters<typeof PortableText>[0]['value']} />
                </div>
              </div>
            )}
            {project.result && (
              <div className="glass-card p-5 sm:p-6">
                <p className="page-kicker text-[var(--color-brand-orange)]">Result</p>
                <div className="rich-content mt-4 text-sm">
                  <PortableText value={project.result as Parameters<typeof PortableText>[0]['value']} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {(project.beforeImage || project.afterImage) && (
        <section className="home-shell page-hero-shell">
          <span className="soft-pill">Before &amp; After</span>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {project.beforeImage && (
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-gray-100)]">Before</p>
                <div className="glass-card overflow-hidden rounded-[28px]">
                  <Image
                    src={urlFor(project.beforeImage).width(900).height(680).url()}
                    alt={project.beforeImage.alt || 'Before treatment'}
                    width={900}
                    height={680}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
            {project.afterImage && (
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-gray-100)]">After</p>
                <div className="glass-card overflow-hidden rounded-[28px]">
                  <Image
                    src={urlFor(project.afterImage).width(900).height(680).url()}
                    alt={project.afterImage.alt || 'After treatment'}
                    width={900}
                    height={680}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
    </>
  )
}
