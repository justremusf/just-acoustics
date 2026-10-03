// Server-side data for the Google Ads landing pages. Plain module (no 'use client').
// Every fetch falls back to an empty value so a Sanity outage never breaks an ad page.
import { getAllProjects, getFeaturedTestimonials, getSiteSettings } from '@/sanity/lib/queries'
import { FALLBACK_TESTIMONIALS } from '@/lib/testimonials'
import type { Project, SanityImage, SiteSettings, Testimonial } from '@/lib/types'

export type LandingTestimonial = Pick<Testimonial, 'authorName' | 'company' | 'review' | 'rating'>

export type PaidSearchData = {
  projects: Project[]
  testimonials: LandingTestimonial[]
  brandLogos?: SanityImage[]
}

export async function getPaidSearchData(): Promise<PaidSearchData> {
  const [projects, featured, settings] = await Promise.all([
    getAllProjects().catch(() => [] as Project[]),
    getFeaturedTestimonials().catch(() => [] as Testimonial[]),
    getSiteSettings().catch(() => null),
  ])

  const realTestimonials = ((featured as Testimonial[] | null) ?? []).filter((item) => item?.review && item?.authorName)

  return {
    projects: Array.isArray(projects) ? (projects as Project[]) : [],
    testimonials: realTestimonials.length > 0 ? realTestimonials.slice(0, 3) : FALLBACK_TESTIMONIALS,
    brandLogos: (settings as SiteSettings | null)?.brandLogos,
  }
}
