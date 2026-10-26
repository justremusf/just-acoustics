// Server-only: case-study photos for each pack, straight from the published Sanity projects.
// Titles only (never the client location), per memories ja-no-client-locations / ja-case-study-rules.
import { getAllProjects } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project } from '@/lib/types'
import type { StudioPack } from './packages'

export type PackPhoto = { src: string; alt: string; title: string; href: string }

export async function getPackPhotos(packs: StudioPack[]): Promise<Record<string, PackPhoto[]>> {
  const projects = ((await getAllProjects().catch(() => [])) ?? []) as Project[]
  const bySlug = new Map(projects.map((p) => [p.slug?.current, p]))
  return Object.fromEntries(
    packs.map((pack) => [
      pack.id,
      pack.projectSlugs
        .map((slug) => bySlug.get(slug))
        .filter((p): p is Project => Boolean(p?.mainImage?.asset))
        .map((p) => ({
          src: urlFor(p.mainImage!).width(1200).height(800).fit('crop').url(),
          alt: p.mainImage?.alt || `${p.title}: fabric wrapped acoustic panels installed by Just Acoustics`,
          title: p.title,
          href: `/projects/${p.slug.current}`,
        })),
    ]),
  )
}
