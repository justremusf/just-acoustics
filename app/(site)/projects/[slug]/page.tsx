import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProjects, getProjectBySlug, getAllProjectSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { toProjectCard, toProjectView } from '@/sanity/lib/views'
import { canonicalPath, SITE_PREVIEW_IMAGE, SITE_URL } from '@/lib/seo'
import { buildProjectNav } from '@/lib/contentView'
import type { Project } from '@/lib/types'
import ProjectDetail from '@/components/projects/ProjectDetail'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllProjectSlugs().catch(() => [])
  return slugs.map((s) => ({ slug: s.slug }))
}

function describe(project: Project) {
  return (
    project.description ||
    `${project.title}${project.location ? ` in ${project.location}` : ''} — acoustic panel installation and echo control project by Just Acoustics, Singapore.`
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project: Project | null = await getProjectBySlug(slug).catch(() => null)
  if (!project) return {}
  const description = describe(project)
  return {
    title: project.title,
    description,
    alternates: { canonical: canonicalPath(`/projects/${slug}`) },
    openGraph: {
      title: project.title,
      description,
      url: canonicalPath(`/projects/${slug}`),
      siteName: 'Just Acoustics',
      locale: 'en_SG',
      images: [{ url: project.mainImage ? urlFor(project.mainImage).width(1200).height(630).url() : SITE_PREVIEW_IMAGE, width: 1200, height: 630 }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, allProjects]: [Project | null, Project[]] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getAllProjects().catch(() => [] as Project[]),
  ])
  if (!project) notFound()

  const cards = (Array.isArray(allProjects) ? allProjects : []).filter((p) => p?.slug?.current).map(toProjectCard)
  const nav = buildProjectNav(cards, slug, project.category)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: canonicalPath('/projects') },
      { '@type': 'ListItem', position: 3, name: project.title, item: canonicalPath(`/projects/${slug}`) },
    ],
  }

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: describe(project),
    url: canonicalPath(`/projects/${slug}`),
    ...(project.mainImage && { image: urlFor(project.mainImage).width(1200).height(630).url() }),
    ...(project.completionDate && { dateCreated: project.completionDate }),
    ...(project.location && { locationCreated: { '@type': 'Place', name: project.location } }),
    creator: { '@type': 'Organization', name: 'Just Acoustics', url: SITE_URL },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />
      <ProjectDetail project={toProjectView(project)} nav={nav} />
    </>
  )
}
