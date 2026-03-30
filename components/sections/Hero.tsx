import Link from 'next/link'
import ShimmerButton from '@/components/ui/shimmer-button'

export default function Hero() {
  return (
    <section
      className="relative rounded-[20px] mx-4 mt-[-86px] px-0 pt-[160px] md:pt-[260px] pb-16 md:pb-[90px]"
      style={{ fontSize: 16, lineHeight: '1.5em' }}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 rounded-[20px] z-auto"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.47),rgba(0,0,0,0.47)),url('https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-[999] max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-[1.75fr_0.5fr] items-end mt-10">
          <div className="flex flex-col gap-6 md:gap-9 mb-[-18px]">
            <h1
              className="text-white m-0"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(36px, 5vw, var(--fs-h2))',
                lineHeight: '112%',
                fontWeight: 500,
                letterSpacing: '-1.28px',
              }}
            >
              Acoustic Panels That<br />Get Rid of Echo
            </h1>
            <p className="text-white m-0 text-base">
              Acoustic Solutions for Offices, Churches, Restaurants &amp; more.
            </p>
            <Link href="/contact" className="self-start no-underline">
              <ShimmerButton className="text-base px-8 py-4 h-auto">
                Get Free Consultation
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
