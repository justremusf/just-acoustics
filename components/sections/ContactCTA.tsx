import Link from 'next/link'
import ShimmerButton from '@/components/ui/shimmer-button'

export default function ContactCTA() {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[26px] border border-white/16 py-20 shadow-[0_28px_80px_rgba(0,0,0,0.22)] md:rounded-[30px] md:py-[112px]">
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

        <div className="relative z-10 mx-auto max-w-[920px] px-6 text-center md:px-8">
          <span className="inline-flex rounded-[100px] border border-white/16 bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            Let&apos;s get started.
          </span>
          <h2 className="mt-7 text-white home-heading">
            We are ready to transform your space.
          </h2>
          <p className="mx-auto mt-6 max-w-[30ch] text-[15px] leading-7 text-white/78 sm:max-w-[56ch] sm:text-base">
            Our acoustic engineers and team are on standby.
          </p>
          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="w-full no-underline sm:w-auto">
              <ShimmerButton className="h-auto w-full px-8 py-4 text-sm">Free Consultation</ShimmerButton>
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-white no-underline transition-colors duration-300 hover:text-white/78">
              See All Projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
