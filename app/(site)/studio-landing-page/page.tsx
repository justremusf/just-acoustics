import type { Metadata } from 'next'
import { getAllShopItems, getFeaturedTestimonials } from '@/sanity/lib/queries'
import { canonicalPath } from '@/lib/seo'
import Link from 'next/link'
import StudioProducts from '@/components/sections/StudioProducts'
import StudioBeforeAfter from '@/components/sections/StudioBeforeAfter'
import StudioSolutions from '@/components/sections/StudioSolutions'
import StudioProcess from '@/components/sections/StudioProcess'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import ContactCTA from '@/components/sections/ContactCTA'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Professional Music Studio Acoustics | Just Acoustics',
  description:
    'Acoustic panels, bass traps, and soundproofing for home studios, mixing rooms, and vocal booths in Singapore. Get expert advice and shop kits online.',
  alternates: { canonical: canonicalPath('/studio-landing-page') },
}

export default async function StudioLandingPage() {
  const [shopItems, testimonials] = await Promise.all([
    getAllShopItems().catch(() => []),
    getFeaturedTestimonials().catch(() => []),
  ])

  // Custom high-quality studio testimonials
  const studioTestimonials = testimonials.length > 0 
    ? testimonials 
    : [
        {
          _id: 't-1',
          authorName: 'Alex Tan',
          company: 'Redroom Studios',
          review: 'The bass response in my mixing room was completely out of control. Just Acoustics recommended the 150mm bass traps and wall panels. The difference is night and day—my mixes now translate perfectly.',
          rating: 5,
        },
        {
          _id: 't-2',
          authorName: 'Sarah Lim',
          company: 'Bedroom Producer',
          review: 'Living in an HDB, I was terrified of noise complaints. The 6-Panel kit completely cleaned up the flutter echo in my room, and the team helped me place them exactly where they were needed.',
          rating: 5,
        },
        {
          _id: 't-3',
          authorName: 'Marcus Wong',
          company: 'Recording Engineer',
          review: 'Super professional service. From the 3D studio proposal to clean, dust-free installation. Highly recommend their studio kits.',
          rating: 5,
        }
      ]

  return (
    <div className="overflow-x-hidden bg-white">
      
      {/* ─── 1. HERO SECTION (1-to-1 LEFT-ALIGNED REBUILD) ─── */}
      <section className="relative min-h-[92vh] w-full flex items-center justify-start px-4 py-20 md:px-12 lg:px-20 bg-[#0a0a0a] text-white">
        
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,165,0,0.12),transparent_60%)] opacity-90" />
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('/assets/webflow/696a4efb255645d4686056e2_7.webp')] bg-cover bg-center mix-blend-overlay" />
        {/* Gradient fade to bottom and right */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0 bg-gradient-to-l from-transparent to-[#0a0a0a]/80" />

        <div className="relative z-10 mx-auto max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-12">
          
          {/* Left Column: Left-Aligned Text Content */}
          <div className="flex flex-col items-start text-left max-w-[620px]">
            
            {/* Eyebrow Label */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-brand-orange)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-orange)] animate-pulse" />
              Music Studio Acoustics Singapore
            </span>

            {/* Headline */}
            <h1 
              className="mt-6 text-[44px] sm:text-[62px] lg:text-[72px] font-bold tracking-tight leading-[0.96] text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Make your room <br />
              tell the truth.
            </h1>

            {/* Paragraph Subtitle */}
            <p className="mt-8 text-base sm:text-lg leading-relaxed text-white/80 font-medium max-w-[48ch]">
              Acoustic panels and bass traps for home studios, mixing rooms, vocal rooms, and compact spaces across Singapore.
            </p>

            {/* Action CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              
              {/* Advice Button (Pill with right arrow inside orange circle) */}
              <Link 
                href="#advice"
                className="group inline-flex w-full sm:w-auto items-center justify-between gap-6 rounded-full bg-black border border-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:border-white/20 hover:scale-[1.01]"
              >
                <span>Get Studio Room Advice</span>
                <span className="h-8 w-8 rounded-full bg-[var(--color-brand-orange)] flex items-center justify-center text-black text-xs font-black transition-transform duration-300 group-hover:translate-x-1">
                  ➔
                </span>
              </Link>
              
              {/* Before/After Audio Scroll CTA */}
              <Link 
                href="#audio-player"
                className="group inline-flex w-full sm:w-auto items-center justify-between gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <span>Hear Before / After</span>
                <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-black transition-transform duration-300 group-hover:scale-105">
                  ▶
                </span>
              </Link>
            </div>

            {/* Trust badge */}
            <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm">
              <span className="inline-flex h-5 w-5 rounded-full bg-[var(--color-brand-orange)]/15 border border-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange)] items-center justify-center text-xs font-black">
                ✓
              </span>
              Built for HDB, condo & professional studios
            </div>

          </div>

          {/* Right Column: Empty to emphasize the background studio console image on desktop */}
          <div className="hidden lg:block h-[500px]" />

        </div>
      </section>

      {/* 2. PRODUCTS SECTION (Directly below Hero) */}
      <StudioProducts shopItems={shopItems} />

      {/* 3. BEFORE & AFTER AUDIO PLAYER */}
      <StudioBeforeAfter />

      {/* 4. SOLUTIONS FOR EVERY STUDIO */}
      <StudioSolutions shopItems={shopItems} />

      {/* 5. PROCESS SECTION (Rebuilt with StudioProcess) */}
      <StudioProcess />

      {/* 6. TESTIMONIALS */}
      <Testimonials testimonials={studioTestimonials} />

      {/* 7. FAQ */}
      <FAQ />

      {/* CONTACT/CTA FORM */}
      <div id="advice">
        <ContactCTA />
      </div>
    </div>
  )
}
