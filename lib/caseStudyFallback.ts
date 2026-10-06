import drafts from '@/content/case-study-drafts.json'
import type { Project } from '@/lib/types'

/**
 * Written case-study copy for each project (content/case-study-drafts.json). Anything filled in
 * Sanity always wins; this only fills fields that are empty there, so editing a project in
 * /studio takes over from the file field by field.
 */
type Draft = {
  slug: string
  displayTitle?: string
  fields?: { description?: string; problem?: string; solution?: string; result?: string; metrics?: { label?: string; value?: string }[] }
}

const BY_SLUG = new Map((drafts as Draft[]).map((draft) => [draft.slug, draft]))

function toBlocks(text: string | undefined, key: string) {
  if (!text?.trim()) return undefined
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => ({
      _type: 'block',
      _key: `${key}${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `${key}${i}s`, text: p, marks: [] }],
    }))
}

function hasText(value: unknown) {
  if (typeof value === 'string') return value.trim() !== ''
  return Array.isArray(value) && value.some((b) => (b as { children?: { text?: string }[] })?.children?.some((c) => c?.text?.trim()))
}

export function withCaseStudy<T extends Partial<Project> | null | undefined>(project: T): T {
  const slug = project?.slug?.current
  const draft = slug ? BY_SLUG.get(slug) : undefined
  if (!project || !draft) return project
  const f = draft.fields ?? {}
  return {
    ...project,
    title: draft.displayTitle || project.title,
    description: hasText(project.description) ? project.description : f.description || project.description,
    problem: hasText(project.problem) ? project.problem : toBlocks(f.problem, 'p') ?? project.problem,
    solution: hasText(project.solution) ? project.solution : toBlocks(f.solution, 's') ?? project.solution,
    result: hasText(project.result) ? project.result : toBlocks(f.result, 'r') ?? project.result,
    metrics: project.metrics?.some((m) => m?.label && m?.value) ? project.metrics : f.metrics ?? project.metrics,
  }
}
