import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import Image from '@/components/ui/Image'
import FAQ from '@/components/sections/FAQ'
import Configurator from '@/components/studioBox/Configurator'
import PageEngagementTracker from '@/components/analytics/PageEngagementTracker'
import { pageMetadata } from '@/lib/seo'
import { paymentMode, studioBoxEnabled } from '@/lib/studioBox/flags'
import { EXCLUDED, estimateRt60, formatPrice, getPack, INCLUDED, PANEL_INFO, panelCount, STUDIO_PACKS } from '@/lib/studioBox/packages'
import { getPackPhotos } from '@/lib/studioBox/photos'
import { STUDIO_FAQS } from '../faqs'

export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  return STUDIO_PACKS.map((pack) => ({ pack: pack.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ pack: string }> }): Promise<Metadata> {
  const pack = getPack((await params).pack)
  if (!pack) return {}
  return pageMetadata({
    title: `${pack.name} Acoustic Panel Pack, ${formatPrice(pack.price)} Installed`,
    description: `${pack.tagline} ${panelCount(pack)} fabric wrapped panels, delivery and installation for ${formatPrice(pack.price)}. Pick your colour and install day online.`,
    path: `/studio-in-a-box/${pack.id}`,
    noindex: true,
  })
}

export default async function PackPage({ params }: { params: Promise<{ pack: string }> }) {
  if (!studioBoxEnabled()) notFound()
  const pack = getPack((await params).pack)
  if (!pack) notFound()
  const photos = (await getPackPhotos([pack]))[pack.id] ?? []
  const rt = estimateRt60(pack, pack.typicalRoom)
  const [lead, ...rest] = photos

  return (
    <>
      <PageEngagementTracker pageType="landing_page" contentName={`studio_in_a_box_${pack.id}`} />
      <div className="page-wrap page-stack gap-8 md:gap-12">
        <Link href="/studio-in-a-box" className="page-link w-fit"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All packs</Link>

        <section className="home-shell page-hero-shell grid gap-8 p-[clamp(22px,4vw,48px)] lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="flex flex-col gap-5">
            <p className="m-0 text-[15px] font-semibold text-[var(--color-brand-orange)]">Studio in a Box</p>
            <h1 className="page-title">{pack.name} pack</h1>
            <p className="page-subtitle text-base">{pack.intro}</p>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              <p className="m-0 text-[clamp(40px,5vw,56px)] font-medium leading-none text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-1.5px' }}>{formatPrice(pack.price)}</p>
              <p className="m-0 pb-1 text-[15px] text-[var(--color-gray-100)]">installed, including delivery. No GST.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#book" className="page-cta">Choose colour and install day</a>
              <a href="#whats-included" className="page-link">What’s included</a>
            </div>
            <ul className="m-0 mt-2 flex list-none flex-col gap-3 border-t border-black/5 p-0 pt-5">
              {pack.panels.map((line) => (
                <li key={line.kind} className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--color-gray-100)]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                  <span><strong className="font-semibold text-[var(--color-dark-100)]">{line.label}</strong> in your colour</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--color-gray-100)]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                <span><strong className="font-semibold text-[var(--color-dark-100)]">Delivery and installation</strong> by our team, usually done in a few hours</span>
              </li>
              <li className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--color-gray-100)]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                <span><strong className="font-semibold text-[var(--color-dark-100)]">Echo time {rt.before.toFixed(1)} s → {rt.after.toFixed(2)} s</strong> in a typical {pack.typicalRoom.label}</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            {lead && (
              <figure className="m-0">
                <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] bg-[var(--color-white-200)]">
                  <Image src={lead.src} alt={lead.alt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 text-[13px] text-[var(--color-gray-200)]">Our work: <Link className="underline" href={lead.href}>{lead.title}</Link></figcaption>
              </figure>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {rest.slice(0, 2).map((photo) => (
                  <Link key={photo.href} href={photo.href} className="group block">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-[18px] bg-[var(--color-white-200)]">
                      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <span className="mt-1.5 block text-[13px] text-[var(--color-gray-200)]">{photo.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="whats-included" className="grid scroll-mt-28 gap-5 md:grid-cols-3">
          <div className="glass-card flex flex-col gap-4 p-6 md:col-span-2 md:p-8">
            <h2 className="page-card-title">What you get</h2>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {pack.panels.map((line) => (
                <li key={line.kind} className="flex flex-col gap-0.5 border-b border-black/5 pb-4 last:border-0 last:pb-0">
                  <span className="text-[17px] font-semibold text-[var(--color-dark-100)]">{line.label}</span>
                  <span className="text-[15px] text-[var(--color-gray-100)]">{PANEL_INFO[line.kind].size}, bevel edged. {line.where[0].toUpperCase() + line.where.slice(1)}.</span>
                </li>
              ))}
            </ul>
            <div className="grid gap-5 pt-2 sm:grid-cols-2">
              <div>
                <h3 className="m-0 text-[15px] font-semibold text-[var(--color-dark-100)]">Included</h3>
                <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-5 text-[15px] text-[var(--color-gray-100)]">{INCLUDED.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
              <div>
                <h3 className="m-0 text-[15px] font-semibold text-[var(--color-dark-100)]">Not included</h3>
                <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-5 text-[15px] text-[var(--color-gray-100)]">{EXCLUDED.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            </div>
          </div>
          <div className="glass-card flex flex-col gap-4 p-6 md:p-8">
            <h2 className="page-card-title">How much quieter?</h2>
            <p className="m-0 text-[15px] leading-relaxed text-[var(--color-gray-100)]">Echo time (RT60) in a typical {pack.typicalRoom.label}, {pack.typicalRoom.heightM} m ceiling:</p>
            <div className="flex items-end gap-3">
              <div>
                <p className="m-0 text-[13px] font-semibold text-[var(--color-gray-200)]">Now</p>
                <p className="m-0 text-[40px] font-medium leading-none text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>{rt.before.toFixed(1)} s</p>
              </div>
              <span className="pb-2 text-[22px] text-[var(--color-gray-200)]" aria-hidden="true">→</span>
              <div>
                <p className="m-0 text-[13px] font-semibold text-[var(--color-gray-200)]">With the pack</p>
                <p className="m-0 text-[40px] font-medium leading-none text-[var(--color-brand-orange)]" style={{ fontFamily: 'var(--font-heading)' }}>{rt.after.toFixed(2)} s</p>
              </div>
            </div>
            <p className="m-0 text-[13px] leading-relaxed text-[var(--color-gray-200)]">
              Estimate from room size and typical finishes (tiled floor, painted walls, some furniture). Below about {pack.targetRt60.toFixed(1)} s, speech and music sound clear and close. Your own room’s figure updates as you set its size below.
            </p>
            <ul className="m-0 mt-auto flex list-disc flex-col gap-1 pl-5 text-[15px] text-[var(--color-gray-100)]">{pack.goodFor.map((g) => <li key={g}>{g}</li>)}</ul>
          </div>
        </section>

        <section id="book" className="scroll-mt-[96px]" aria-labelledby="book-heading">
          <div className="mb-5 flex flex-col gap-2 px-1">
            <h2 id="book-heading" className="page-title text-[clamp(28px,3.4vw,44px)]">Set up your {pack.name} pack</h2>
            <p className="page-subtitle">Five short steps. Nothing is charged until we confirm your room and install day.</p>
          </div>
          <Configurator pack={pack} paymentMode={paymentMode()} />
        </section>
      </div>
      <FAQ items={STUDIO_FAQS} title="Questions about the packs" subtitle="" showLabel={false} />
    </>
  )
}
