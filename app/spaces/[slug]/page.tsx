import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { getAllProjects, getAllSpaceSlugs, getSpaceBySlug } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Project, Space } from '@/lib/types'
import FAQ from '@/components/sections/FAQ'
import { canonicalPath, SITE_URL, stripBrand } from '@/lib/seo'
import { formatSgd } from '@/lib/shopPricing'
import { IMAGE_BLUR_DATA_URL } from '@/lib/imagePlaceholder'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllSpaceSlugs().catch(() => [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const space: Space | null = await getSpaceBySlug(slug).catch(() => null)
  if (!space) return {}

  return {
    title: stripBrand(space.seo?.metaTitle) || space.title,
    description: space.seo?.metaDescription || space.shortDescription,
    alternates: { canonical: canonicalPath(`/spaces/${slug}`) },
  }
}

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [space, allProjects]: [Space | null, Project[]] = await Promise.all([
    getSpaceBySlug(slug).catch(() => null),
    getAllProjects().catch(() => [] as Project[]),
  ])
  if (!space) notFound()

  const projectCategoryBySpace: Record<string, string> = {
    studios: 'studios-homes',
    offices: 'office-spaces',
    churches: 'churches',
    restaurants: 'restaurants',
    education: 'schools',
    'gym-and-activity-spaces': 'gym-leisure',
    cinema: 'cinema',
  }
  const matchingProjectCategory = projectCategoryBySpace[slug]
  const projectCandidates = [
    ...(space.featuredProjects || []),
    ...allProjects.filter((project) => matchingProjectCategory && project.category === matchingProjectCategory),
  ]
  const projectsForSpace = Array.from(
    new Map(projectCandidates.map((project) => [project._id, project])).values()
  )

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${space.title} acoustic treatment`,
    description: space.shortDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Just Acoustics',
      url: SITE_URL,
      telephone: '+65 8930 1905',
      areaServed: { '@type': 'Country', name: 'Singapore' },
    },
    areaServed: { '@type': 'Country', name: 'Singapore' },
    url: canonicalPath(`/spaces/${slug}`),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Spaces', item: canonicalPath('/spaces') },
      { '@type': 'ListItem', position: 3, name: space.title, item: canonicalPath(`/spaces/${slug}`) },
    ],
  }

  const faqItems = (space.faqs || []).flatMap((item) =>
    item.question && item.answer ? [{ q: item.question, a: item.answer }] : []
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="space-page px-4 pb-16 pt-6 sm:px-5 sm:pb-20 lg:pt-8">
        <section className="site-container relative min-h-[480px] overflow-hidden rounded-[32px] bg-[#151515] sm:min-h-[560px]">
          {space.mainImage ? (
            <Image
              src={urlFor(space.mainImage).width(1900).height(1100).fit('crop').url()}
              alt={space.mainImage.alt || space.title}
              fill
              unoptimized
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.86),rgba(5,5,5,0.34)_64%,rgba(5,5,5,0.2))]" />
          <div className="relative z-10 flex min-h-[480px] max-w-[820px] flex-col justify-end p-6 text-white sm:min-h-[560px] sm:p-8 lg:p-12">
            <Link href="/spaces" className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/76 no-underline hover:text-white">
              ← All Spaces
            </Link>
            {space.heroTagline ? (
              <p className="m-0 max-w-[48ch] text-[15px] font-semibold uppercase tracking-[0.12em] text-white/72">
                {space.heroTagline}
              </p>
            ) : null}
            <h1 className="mb-0 mt-4 text-[clamp(46px,7vw,88px)] font-medium leading-[0.9] tracking-[-0.05em]" style={{ fontFamily: 'var(--font-heading)' }}>
              {space.title}
            </h1>
            {space.shortDescription ? (
              <p className="mb-0 mt-6 max-w-[60ch] text-[16px] leading-7 text-white/82 sm:text-[18px]">
                {space.shortDescription}
              </p>
            ) : null}
            <Link href="/contact" className="page-cta mt-7 w-fit text-sm">
              Free Acoustic Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {space.audiences?.length ? (
          <section className="site-container mt-10 rounded-[32px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,245,245,0.8))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.09),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-2xl sm:mt-12 sm:p-8 lg:p-12">
            <div className="max-w-[760px]">
              <h2 className="m-0 text-[clamp(34px,5vw,62px)] font-medium leading-[0.94] tracking-[-0.045em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Designed around how the space is actually used.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {space.audiences.map((item, index) => (
                <article key={item._key || item.title || index} className="rounded-[24px] border border-black/7 bg-white/72 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] backdrop-blur-lg sm:p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mb-0 mt-6 text-[22px] font-medium leading-[1.05] tracking-[-0.025em]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p className="mb-0 mt-3 text-sm leading-6 text-[var(--color-gray-100)]">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {space.editorialSections?.length ? (
          <section className="site-container mt-16 flex flex-col gap-8 sm:mt-20 lg:gap-12">
            {space.editorialSections.map((section, index) => (
              <article key={section._key || section.title || index} className="grid overflow-hidden rounded-[30px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,245,245,0.92))] shadow-[0_22px_64px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:grid-cols-2">
                <div className={`relative min-h-[300px] sm:min-h-[420px] ${index % 2 ? 'lg:order-2' : ''}`}>
                  {section.image ? (
                    <Image
                      src={urlFor(section.image).width(1000).height(800).fit('crop').url()}
                      alt={section.image.alt || section.title || space.title}
                      fill
                      unoptimized
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                  {section.eyebrow ? <p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">{section.eyebrow}</p> : null}
                  <h2 className="mb-0 mt-4 text-[clamp(34px,4.5vw,62px)] font-medium leading-[0.94] tracking-[-0.045em]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {section.title}
                  </h2>
                  <p className="mb-0 mt-6 max-w-[58ch] text-[15px] leading-7 text-[var(--color-gray-100)] sm:text-[16px]">
                    {section.description}
                  </p>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {space.benefits?.length ? (
          <section className="site-container mt-16 grid gap-8 rounded-[32px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,245,245,0.8))] p-6 text-[var(--color-dark-100)] shadow-[0_24px_60px_rgba(0,0,0,0.09),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-2xl sm:mt-20 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <h2 className="m-0 text-[clamp(36px,5vw,64px)] font-medium leading-[0.94] tracking-[-0.045em]" style={{ fontFamily: 'var(--font-heading)' }}>
                A practical treatment strategy for your room.
              </h2>
              <p className="mb-0 mt-5 max-w-[54ch] text-[15px] leading-7 text-[var(--color-gray-100)]">
                We assess the room, identify the dominant acoustic problems, and specify treatment where it will produce a meaningful result.
              </p>
            </div>
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {space.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 rounded-[20px] border border-black/7 bg-white/72 p-4 text-sm leading-6 text-[var(--color-gray-100)] shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-orange)]" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {space.recommendedShopItems?.length ? (
          <section className="site-container mt-16 rounded-[32px] border border-black/8 bg-white/72 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.07)] backdrop-blur-2xl sm:mt-20 sm:p-8 lg:p-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="m-0 text-[clamp(36px,5vw,64px)] font-medium leading-[0.94] tracking-[-0.045em]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Recommended treatment
                </h2>
                <p className="mb-0 mt-4 text-[15px] leading-7 text-[var(--color-gray-100)]">
                  Useful starting points for this kind of space.
                </p>
              </div>
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#171717] no-underline">
                Browse Shop <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {space.recommendedShopItems.map((item, index) => (
                <Link key={item._id} href={`/shop/${item.slug.current}`} className="group overflow-hidden rounded-[26px] border border-black/7 bg-white/88 no-underline shadow-[0_18px_50px_rgba(0,0,0,0.07)]">
                  <div className="relative aspect-[4/3] bg-[#f3f3f1]">
                    {item.mainImage ? (
                      <Image
                        src={urlFor(item.mainImage).width(800).height(600).fit('crop').url()}
                        alt={item.mainImage.alt || item.title}
                        fill
                        unoptimized
                        sizes="(max-width: 767px) 100vw, 33vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="m-0 text-[22px] font-medium leading-tight text-[#171717]" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                    <p className="mb-0 mt-3 flex items-center justify-between gap-3 text-sm text-[var(--color-gray-100)]">
                      <span>{item.price != null ? `From ${formatSgd(item.price)}` : 'Request a Quote'}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {projectsForSpace.length ? (
          <section className="site-container mt-16 rounded-[32px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,245,245,0.8))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:mt-20 sm:p-8 lg:p-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="m-0 text-[clamp(34px,5vw,60px)] font-medium leading-[0.94] tracking-[-0.045em]" style={{ fontFamily: 'var(--font-heading)' }}>
                Real spaces, treated by Just Acoustics
              </h2>
              <Link href="/projects" className="hidden shrink-0 items-center gap-2 text-sm font-bold text-[#171717] no-underline sm:inline-flex">
                See Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projectsForSpace.slice(0, 6).map((project) => (
                <Link key={project._id} href={`/projects/${project.slug.current}`} className="group relative isolate aspect-[4/3] overflow-hidden rounded-[22px] bg-[#171717] no-underline">
                  {project.mainImage ? (
                    <Image src={urlFor(project.mainImage).width(800).height(600).fit('crop').url()} alt={project.mainImage.alt || project.title} fill unoptimized sizes="(max-width: 767px) 100vw, 33vw" placeholder="blur" blurDataURL={IMAGE_BLUR_DATA_URL} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                    <span className="text-[20px] font-medium leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>{project.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {faqItems.length ? (
          <div className="site-container mt-16 sm:mt-20">
            <FAQ items={faqItems} title={`${space.title} Questions`} subtitle="Practical answers before planning your treatment." />
          </div>
        ) : null}

        <section className="site-container mt-16 overflow-hidden rounded-[32px] border border-black/8 bg-[radial-gradient(circle_at_top_right,rgba(255,165,0,0.22),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,245,245,0.82))] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.09),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-2xl sm:mt-20 sm:p-10 lg:p-12">
          <div className="max-w-[900px]">
            <h2 className="m-0 text-[clamp(38px,5vw,66px)] font-medium leading-[0.92] tracking-[-0.045em] text-[#171717]" style={{ fontFamily: 'var(--font-heading)' }}>
              {space.cta?.title || `Plan a better-sounding ${space.title.toLowerCase()}`}
            </h2>
            <p className="mb-0 mt-6 max-w-[62ch] text-[16px] leading-7 text-[#171717]/72">
              {space.cta?.body || 'Tell us about your room and goals. We will recommend a practical treatment direction.'}
            </p>
            <Link href={space.cta?.href || '/contact'} className="mt-7 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#171717] px-6 text-sm font-bold text-white no-underline">
              {space.cta?.label || 'Book a Free Consultation'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
