import Image from '@/components/ui/Image'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react'
import ProjectGallery from '@/components/projects/ProjectGallery'
import { whatsappLink, type ProjectCardView, type ProjectNavView, type ProjectView, type ViewImage } from '@/lib/contentView'

const headingFont = { fontFamily: 'var(--font-heading)' }

function Photo({ image, sizes, priority, className = '' }: { image: ViewImage; sizes: string; priority?: boolean; className?: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      style={{ objectPosition: image.position ?? 'center' }}
      className={`object-cover ${className}`}
    />
  )
}

function StoryStep({ step, label, value }: { step: string; label: string; value: PortableTextBlock[] }) {
  return (
    <div className="grid gap-3 border-t border-black/8 pt-6 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10 md:pt-8">
      <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
        <span className="text-sm font-semibold tabular-nums text-[var(--color-brand-orange)]">{step}</span>
        <h2 className="m-0 text-[clamp(22px,2.2vw,30px)] font-medium leading-[1.05] tracking-[-0.8px] text-[var(--color-dark-100)]" style={headingFont}>
          {label}
        </h2>
      </div>
      <div className="rich-content max-w-[68ch] text-base [&>*:last-child]:mb-0">
        <PortableText value={value} />
      </div>
    </div>
  )
}

function ProjectTile({ project }: { project: ProjectCardView }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative isolate block aspect-[4/3] overflow-hidden rounded-[24px] bg-[#1d1d1d] no-underline shadow-[0_18px_48px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.16)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-orange)]"
    >
      {project.image ? (
        <Photo image={project.image} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(160deg,#2a2a2a,#151515)]" />
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_35%,rgba(5,5,5,0.78))]" />
      <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 text-white">
        <span className="min-w-0">
          {(project.categoryLabel || project.location) && (
            <span className="mb-2 block truncate text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              {[project.categoryLabel, project.location].filter(Boolean).join(' · ')}
            </span>
          )}
          <span className="block text-[21px] font-medium leading-[1.06] tracking-[-0.025em]" style={headingFont}>
            {project.title}
          </span>
        </span>
        <ArrowRight size={20} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

export default function ProjectDetail({ project, nav }: { project: ProjectView; nav: ProjectNavView }) {
  const facts = [
    { label: 'Client', value: project.clientName },
    { label: 'Location', value: project.location },
    { label: 'Space', value: project.spaceType },
    { label: 'Size', value: project.spaceSize },
    { label: 'Completed', value: project.completed },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))

  const story = [
    { label: 'The problem', value: project.problem },
    { label: 'What we installed', value: project.solution },
    { label: 'The result', value: project.result },
  ].filter((s): s is { label: string; value: PortableTextBlock[] } => Boolean(s.value))

  const hasComparison = Boolean(project.before && project.after)
  const waMessage = `Hi Just Acoustics, I saw the "${project.title}" project on your website and would like advice for my space.`

  return (
    <div className="page-wrap page-stack !gap-[clamp(40px,6vw,72px)]">
      {/* Hero */}
      <section className="flex flex-col gap-6 md:gap-8">
        <Link href="/projects" className="page-link w-fit">
          <ArrowLeft size={16} aria-hidden="true" /> All projects
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-end lg:gap-12">
          <div className="flex flex-col gap-4">
            {project.categoryLabel && project.category ? (
              <Link href={`/projects?category=${project.category}`} className="soft-pill w-fit no-underline hover:text-[var(--color-dark-100)]">
                {project.categoryLabel}
              </Link>
            ) : (
              <span className="soft-pill w-fit">Project</span>
            )}
            <h1 className="page-title max-w-[20ch]">{project.title}</h1>
            {project.description && <p className="page-subtitle text-base">{project.description}</p>}
          </div>

          {facts.length > 0 && (
            <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-black/10 pt-5 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0">
                  <dt className="page-kicker">{fact.label}</dt>
                  <dd className="m-0 mt-1 text-[15px] font-semibold leading-snug text-[var(--color-dark-100)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {project.mainImage && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[var(--color-white-200)] sm:aspect-[16/9] lg:aspect-[21/9]">
            <Photo image={project.mainImage} priority sizes="(min-width: 1580px) 1540px, calc(100vw - 32px)" />
          </div>
        )}
      </section>

      {/* Quick facts */}
      {project.metrics.length > 0 && (
        <section aria-label="Project results" className="home-shell page-hero-shell">
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-6 md:flex md:flex-wrap md:justify-around">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex min-w-0 flex-col-reverse items-center text-center">
                <dt className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gray-200)]">{m.label}</dt>
                <dd className="m-0 text-[clamp(28px,3.6vw,44px)] font-medium leading-none tracking-tight text-[var(--color-dark-100)]" style={headingFont}>
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Story */}
      {story.length > 0 && (
        <section className="flex flex-col gap-6 md:gap-8" aria-label="Project story">
          {story.map((s, i) => (
            <StoryStep key={s.label} step={String(i + 1).padStart(2, '0')} label={s.label} value={s.value} />
          ))}
        </section>
      )}

      {/* Before / after */}
      {hasComparison && project.before && project.after && (
        <section className="flex flex-col gap-5">
          <h2 className="page-card-title">Before and after</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: 'Before', image: project.before },
              { label: 'After', image: project.after },
            ].map(({ label, image }) => (
              <figure key={label} className="m-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--color-white-200)]">
                  <Photo image={image} sizes="(min-width: 768px) 50vw, 100vw" />
                  <figcaption className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-dark-100)]">
                    {label}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Testimonial */}
      {project.testimonial && (
        <section className="glass-card mx-auto w-full max-w-[920px] p-[clamp(24px,4vw,44px)]">
          <figure className="m-0">
            <blockquote className="m-0 text-[clamp(20px,2.2vw,28px)] font-medium leading-[1.3] tracking-[-0.4px] text-[var(--color-dark-100)]" style={headingFont}>
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>
            {project.testimonial.authorName && (
              <figcaption className="mt-5 text-sm text-[var(--color-gray-100)]">
                <strong className="text-[var(--color-dark-100)]">{project.testimonial.authorName}</strong>
                {project.testimonial.authorRole && <>, {project.testimonial.authorRole}</>}
              </figcaption>
            )}
          </figure>
        </section>
      )}

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="page-card-title">Photos</h2>
            <p className="m-0 text-sm text-[var(--color-gray-200)]">
              {project.gallery.length} {project.gallery.length === 1 ? 'photo' : 'photos'} · tap to enlarge
            </p>
          </div>
          <ProjectGallery images={project.gallery} />
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden rounded-[var(--section-radius)] bg-[var(--color-dark-100)] p-[clamp(24px,4vw,48px)] text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[46ch]">
            <p className="page-kicker !text-[var(--color-brand-orange)]">Similar room?</p>
            <h2 className="m-0 mt-2 text-[clamp(26px,3vw,40px)] font-medium leading-[1.05] tracking-[-1px] text-white" style={headingFont}>
              Tell us about your space and we&rsquo;ll suggest what it needs.
            </h2>
            <p className="m-0 mt-3 text-[15px] leading-relaxed text-white/70">Free advice, no obligation. Send a few photos and the room size to get started.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-orange)] px-7 text-sm font-semibold text-[var(--color-dark-100)] no-underline transition-colors hover:bg-[#ffb52e]"
            >
              Get free advice <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* More projects */}
      {(nav.more.length > 0 || nav.prev || nav.next) && (
        <section className="flex flex-col gap-6">
          {(nav.prev || nav.next) && (
            <nav aria-label="Project navigation" className="grid gap-3 sm:grid-cols-2">
              {nav.prev ? (
                <Link href={`/projects/${nav.prev.slug}`} className="glass-card group flex flex-col gap-1 p-5 no-underline">
                  <span className="page-kicker inline-flex items-center gap-1.5">
                    <ArrowLeft size={13} aria-hidden="true" /> Previous project
                  </span>
                  <span className="text-[17px] font-semibold leading-snug text-[var(--color-dark-100)] group-hover:text-[var(--color-brand-orange)]">{nav.prev.title}</span>
                </Link>
              ) : null}
              {nav.next && (
                <Link href={`/projects/${nav.next.slug}`} className="glass-card group flex sm:col-start-2 flex-col gap-1 p-5 text-right no-underline sm:items-end">
                  <span className="page-kicker inline-flex items-center justify-end gap-1.5">
                    Next project <ArrowRight size={13} aria-hidden="true" />
                  </span>
                  <span className="text-[17px] font-semibold leading-snug text-[var(--color-dark-100)] group-hover:text-[var(--color-brand-orange)]">{nav.next.title}</span>
                </Link>
              )}
            </nav>
          )}

          {nav.more.length > 0 && (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="page-card-title">More projects</h2>
                <Link href="/projects" className="page-link shrink-0">
                  View all <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {nav.more.map((p) => (
                  <ProjectTile key={p.slug} project={p} />
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}
