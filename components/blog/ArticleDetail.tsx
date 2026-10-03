import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { ArrowLeft, ArrowRight, Clock, MessageCircle } from 'lucide-react'
import FAQ from '@/components/sections/FAQ'
import ArticleToc from '@/components/blog/ArticleToc'
import ReadingProgress from '@/components/blog/ReadingProgress'
import RelatedPostCard from '@/components/blog/RelatedPostCard'
import { blockText, extractHeadings, slugify, whatsappLink, type ArticleNavView, type ArticleView, type ViewImage } from '@/lib/contentView'

const BODY_ID = 'article-body'
const headingFont = { fontFamily: 'var(--font-heading)' }

function bodyComponents(headingIds: Map<string, string>): PortableTextComponents {
  return {
    block: {
      h2: ({ children, value }) => (
        <h2 id={(value._key && headingIds.get(value._key)) || slugify(blockText(value))}>{children}</h2>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const href: string = value?.href ?? ''
        const external = /^https?:\/\//i.test(href) && !href.includes('justacoustics.co')
        return (
          <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </a>
        )
      },
    },
    types: {
      inlineImage: ({ value }: { value: ViewImage }) => (
        <figure className="my-8">
          {value.width && value.height ? (
            <Image
              src={value.src}
              alt={value.alt}
              width={value.width}
              height={value.height}
              sizes="(min-width: 800px) 720px, 100vw"
              className="h-auto w-full rounded-[20px]"
            />
          ) : (
            <span className="relative block aspect-[16/10] overflow-hidden rounded-[20px]">
              <Image src={value.src} alt={value.alt} fill sizes="(min-width: 800px) 720px, 100vw" className="object-cover" />
            </span>
          )}
        </figure>
      ),
    },
  }
}

/** Long reads get a quiet nudge halfway through: split the body just before the middle h2. */
function splitForMidCta(body: PortableTextBlock[], headingCount: number, readingTime: number) {
  if (headingCount < 4 || readingTime < 5) return [body]
  const target = Math.floor(headingCount / 2)
  let seen = -1
  const index = body.findIndex((block) => block._type === 'block' && block.style === 'h2' && blockText(block).trim() && ++seen === target)
  return index > 0 ? [body.slice(0, index), body.slice(index)] : [body]
}

function MidCta() {
  return (
    <aside className="my-10 flex flex-col gap-3 rounded-[20px] border border-black/8 bg-[var(--color-white-200)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="m-0 text-[15px] leading-snug text-[var(--color-dark-100)]">
        <strong>Not sure what your room needs?</strong>{' '}
        <span className="text-[var(--color-gray-100)]">Send us a photo and we&rsquo;ll tell you.</span>
      </p>
      <Link href="/contact" className="page-link shrink-0">
        Get free advice <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </aside>
  )
}

export default function ArticleDetail({ article, nav }: { article: ArticleView; nav: ArticleNavView }) {
  const { headings, byBlock } = extractHeadings(article.body)
  const showToc = headings.length >= 3
  const components = bodyComponents(byBlock)
  const parts = splitForMidCta(article.body, headings.length, article.readingTime)
  const width = showToc ? 'max-w-[1120px]' : 'max-w-[760px]'

  return (
    <>
      <ReadingProgress targetId={BODY_ID} />
      <div className="page-wrap page-stack !gap-[clamp(40px,6vw,64px)]">
        <article className={`mx-auto flex w-full flex-col gap-8 md:gap-10 ${width}`}>
          <header className="flex flex-col gap-4">
            <Link href="/blog" className="page-link w-fit">
              <ArrowLeft size={16} aria-hidden="true" /> Resource Centre
            </Link>
            <Link
              href={article.topic ? `/blog?topic=${article.topic}` : '/blog'}
              className="page-kicker mt-2 w-fit no-underline !text-[var(--color-brand-orange)] hover:underline"
            >
              {article.topicLabel}
            </Link>
            <h1 className="page-title max-w-[22ch]">{article.title}</h1>
            {article.excerpt && <p className="page-subtitle text-[17px]">{article.excerpt}</p>}
            <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[var(--color-gray-200)]">
              <span className="font-semibold text-[var(--color-dark-100)]">{article.typeLabel}</span>
              {article.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{article.date}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} aria-hidden="true" /> {article.readingTime} min read
              </span>
            </p>
          </header>

          {article.image && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-[var(--color-white-200)] sm:aspect-[16/9]">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                fill
                priority
                sizes={showToc ? '(min-width: 1180px) 1120px, 100vw' : '(min-width: 800px) 760px, 100vw'}
                style={{ objectPosition: article.image.position ?? 'center' }}
                className="object-cover"
              />
            </div>
          )}

          <div className={showToc ? 'grid gap-8 lg:grid-cols-[minmax(0,70ch)_240px] lg:justify-between lg:gap-12' : ''}>
            <div className="min-w-0 max-w-[70ch]">
              {showToc && (
                <div className="mb-8 lg:hidden">
                  <ArticleToc headings={headings} variant="inline" />
                </div>
              )}

              {article.body.length > 0 && (
                <div id={BODY_ID} className="rich-content article-body">
                  {parts.map((part, i) => (
                    <div key={i}>
                      {i > 0 && <MidCta />}
                      <PortableText value={part} components={components} />
                    </div>
                  ))}
                </div>
              )}

              <aside className="glass-card mt-12 flex flex-col gap-4 p-[clamp(20px,3vw,32px)]">
                <p className="page-kicker !text-[var(--color-brand-orange)]">Free advice</p>
                <h2 className="m-0 text-[clamp(24px,2.6vw,32px)] font-medium leading-[1.08] tracking-[-0.8px] text-[var(--color-dark-100)]" style={headingFont}>
                  Not sure what your room needs?
                </h2>
                <p className="page-card-copy m-0 max-w-[52ch]">
                  Tell us the room size and what bothers you about the sound. We&rsquo;ll recommend a sensible next step, even if that&rsquo;s doing nothing.
                </p>
                <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-dark-100)] px-7 text-sm font-semibold text-white no-underline transition-colors hover:bg-black"
                  >
                    Get free advice <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <a
                    href={whatsappLink(`Hi Just Acoustics, I just read "${article.title}" and have a question about my room.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="page-link justify-center px-3 py-2"
                  >
                    <MessageCircle size={16} aria-hidden="true" /> WhatsApp us
                  </a>
                </div>
              </aside>
            </div>

            {showToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-[184px]">
                  <ArticleToc headings={headings} variant="sidebar" />
                </div>
              </aside>
            )}
          </div>
        </article>

        {article.faqs.length > 0 && (
          <div className={`mx-auto w-full ${width}`}>
            <FAQ items={article.faqs} title="Questions on this topic" subtitle="" flush />
          </div>
        )}

        {(nav.prev || nav.next || nav.related.length > 0) && (
          <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8">
            {(nav.prev || nav.next) && (
              <nav aria-label="More articles" className="grid gap-3 sm:grid-cols-2">
                {nav.prev && (
                  <Link href={`/blog/${nav.prev.slug}`} className="group flex flex-col gap-1 rounded-[20px] border border-black/8 bg-white p-5 no-underline hover:border-black/20">
                    <span className="page-kicker inline-flex items-center gap-1.5">
                      <ArrowLeft size={13} aria-hidden="true" /> Previous
                    </span>
                    <span className="text-[16px] font-semibold leading-snug text-[var(--color-dark-100)] group-hover:text-[var(--color-brand-orange)]">{nav.prev.title}</span>
                  </Link>
                )}
                {nav.next && (
                  <Link
                    href={`/blog/${nav.next.slug}`}
                    className="group flex flex-col gap-1 rounded-[20px] border border-black/8 bg-white p-5 text-right no-underline hover:border-black/20 sm:col-start-2 sm:items-end"
                  >
                    <span className="page-kicker inline-flex items-center justify-end gap-1.5">
                      Next <ArrowRight size={13} aria-hidden="true" />
                    </span>
                    <span className="text-[16px] font-semibold leading-snug text-[var(--color-dark-100)] group-hover:text-[var(--color-brand-orange)]">{nav.next.title}</span>
                  </Link>
                )}
              </nav>
            )}

            {nav.related.length > 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="page-card-title">Keep reading</h2>
                  <Link href="/blog" className="page-link shrink-0">
                    All articles <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {nav.related.map((post) => (
                    <RelatedPostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  )
}
