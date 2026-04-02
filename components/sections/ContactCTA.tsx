import Link from 'next/link'
import ShimmerButton from '@/components/ui/shimmer-button'

export default function ContactCTA() {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[26px] border border-white/16 py-16 shadow-[0_28px_80px_rgba(0,0,0,0.22)] md:rounded-[30px] md:py-[112px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(1,1,1,0.74), rgba(1,1,1,0.46)), url('https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a459f805f921445e4427e_9.avif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,165,0,0.20),transparent_28%)]" />

        <div className="relative z-10 mx-auto max-w-[920px] px-5 text-center md:px-8">
          <span className="inline-flex rounded-[100px] border border-white/16 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            Ready for a recommendation
          </span>
          <h2 className="mt-6 text-white home-heading">
            Tell us what the room sounds like now and we&apos;ll show you the clearest next step.
          </h2>
          <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-7 text-white/78 sm:text-base">
            Share a few details, photos, or a floorplan and we&apos;ll recommend the most suitable acoustic treatment before you commit.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="w-full no-underline sm:w-auto">
              <ShimmerButton className="h-auto w-full px-8 py-4 text-sm">Free Consultation</ShimmerButton>
            </Link>
            <Link href="/projects" className="inline-flex min-h-[54px] w-full items-center justify-center rounded-[100px] border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-medium text-white no-underline backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/16 sm:w-auto">
              See All Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
