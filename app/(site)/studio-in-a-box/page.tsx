import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CalendarCheck, Palette, Ruler } from 'lucide-react'
import Image from '@/components/ui/Image'
import FAQ from '@/components/sections/FAQ'
import PageEngagementTracker from '@/components/analytics/PageEngagementTracker'
import { pageMetadata } from '@/lib/seo'
import { studioBoxEnabled } from '@/lib/studioBox/flags'
import { EXCLUDED, estimateRt60, formatPrice, INCLUDED, panelCount, ROOM_TYPES, STUDIO_PACKS } from '@/lib/studioBox/packages'
import { getPackPhotos } from '@/lib/studioBox/photos'
import { STUDIO_FAQS } from './faqs'

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: 'Studio in a Box: Fixed-Price Acoustic Panel Packs',
  description: 'Installed acoustic panel packs for home studios, podcast rooms, home offices and small meeting rooms in Singapore. One price, your colour, pick your install day.',
  path: '/studio-in-a-box',
  noindex: true,
})

const STEPS = [
  { icon: Ruler, title: 'Pick a pack and your room size', body: 'Tell us roughly how big the room is, or send photos. We show the layout and the echo time before and after.' },
  { icon: Palette, title: 'Choose your colour', body: 'Pick from our fabric chart, or mix two colours. Every panel is made to order.' },
  { icon: CalendarCheck, title: 'Request an install day', body: 'Choose a day that suits you. We confirm it, you pay a 50% deposit, and our team installs in a few hours.' },
]

export default async function StudioInABoxPage() {
  if (!studioBoxEnabled()) notFound()
  const photos = await getPackPhotos(STUDIO_PACKS)

  return (
    <>
      <PageEngagementTracker pageType="landing_page" contentName="studio_in_a_box" />
      <div className="page-wrap page-stack gap-10 md:gap-14">
        <section className="home-shell page-hero-shell grid gap-8 p-[clamp(26px,4.4vw,52px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <p className="m-0 text-[15px] font-semibold text-[var(--color-brand-orange)]">Studio in a Box</p>
            <h1 className="page-title max-w-[15ch]">Small room, fixed price, installed.</h1>
            <p className="page-subtitle max-w-[56ch] text-base">
              Packs for home studios, podcast rooms, home offices and small meeting rooms. One price that includes the panels, delivery and installation. Pick your colour and your install day online, no site visit needed.
            </p>
            <nav aria-label="Find your pack" className="flex flex-col gap-3">
              <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">What’s the room for?</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.map((t) => (
                  <Link key={t.id} href={`/studio-in-a-box/${t.packId}#book`} className="page-filter">{t.label}</Link>
                ))}
              </div>
            </nav>
          </div>
          {photos['home-office']?.[1] && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[var(--color-white-200)]">
              <Image src={photos['home-office'][1].src} alt={photos['home-office'][1].alt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
          )}
        </section>

        <section aria-labelledby="packs-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 px-1">
            <h2 id="packs-heading" className="page-title text-[clamp(28px,3.4vw,44px)]">Choose your pack</h2>
            <p className="page-subtitle">Prices include panels, delivery and installation. No GST. Echo times are estimates for the typical room shown.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {STUDIO_PACKS.map((pack) => {
              const photo = photos[pack.id]?.[0]
              const rt = estimateRt60(pack, pack.typicalRoom)
              return (
                <Link key={pack.id} href={`/studio-in-a-box/${pack.id}`} className="glass-card group flex flex-col overflow-hidden no-underline transition-transform duration-300 hover:-translate-y-0.5">
                  <div className="relative aspect-[3/2] overflow-hidden bg-[var(--color-white-200)]">
                    {photo && <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="page-card-title">{pack.name}</h3>
                      <p className="m-0 whitespace-nowrap text-[22px] font-medium text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>{formatPrice(pack.price)}</p>
                    </div>
                    <p className="page-card-copy">{pack.tagline}</p>
                    <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[14px] text-[var(--color-gray-100)]">
                      <li>{panelCount(pack)} panels, rooms up to about {pack.maxFloorM2} m²</li>
                      <li>Echo time {rt.before.toFixed(1)} s → {rt.after.toFixed(2)} s in a {pack.typicalRoom.label}</li>
                    </ul>
                    <span className="page-link mt-auto pt-2">See the pack <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                  </div>
                </Link>
              )
            })}
            <div className="glass-card flex flex-col justify-center gap-4 p-6 md:p-8">
              <h3 className="page-card-title">Bigger room, or something different?</h3>
              <p className="page-card-copy">Churches, restaurants, classrooms and larger studios are planned and quoted for the room. Send us photos and we’ll come back with a layout and price.</p>
              <Link href="/contact" className="page-link">Get a tailored quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="home-shell page-hero-shell p-[clamp(26px,4vw,42px)]" aria-labelledby="how-heading">
          <h2 id="how-heading" className="page-title text-[clamp(28px,3.4vw,40px)]">How it works</h2>
          <ol className="mt-8 grid gap-5 p-0 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="glass-card flex list-none flex-col gap-4 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,165,0,0.12)] text-[var(--color-brand-orange)]"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <h3 className="m-0 text-[22px] font-medium leading-tight text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-[var(--color-gray-100)]">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white/60 p-6">
              <h3 className="m-0 text-[18px] font-semibold text-[var(--color-dark-100)]">Every pack includes</h3>
              <ul className="m-0 mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-[var(--color-gray-100)]">{INCLUDED.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/60 p-6">
              <h3 className="m-0 text-[18px] font-semibold text-[var(--color-dark-100)]">Not included</h3>
              <ul className="m-0 mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-[var(--color-gray-100)]">{EXCLUDED.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
        </section>
      </div>

      <FAQ items={STUDIO_FAQS} title="Questions about the packs" subtitle="" showLabel={false} />
    </>
  )
}
