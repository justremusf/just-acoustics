import Link from 'next/link'
import ShimmerButton from '@/components/ui/shimmer-button'


export default function Hero() {
  return (
    <section
      className="relative mx-4 mt-[-66px] overflow-hidden rounded-[24px] px-0 pt-[188px] pb-12 sm:mx-4 sm:pt-[198px] md:mt-[-76px] md:pt-[246px] md:pb-20"
      style={{ fontSize: 16, lineHeight: '1.5em' }}
    >
      <div
        className="absolute inset-0 z-0 rounded-[24px]"
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(1,1,1,0.80) 0%, rgba(1,1,1,0.62) 44%, rgba(1,1,1,0.42) 100%), url('https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(255,165,0,0.22),transparent_32%),linear-gradient(to_top,rgba(1,1,1,0.22),transparent_24%)]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-5">
        <div className="grid grid-cols-1 gap-10">
          <div className="max-w-[760px]">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-[100px] border border-white/18 bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/84 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-[12px] sm:tracking-[0.18em]">
              Acoustic Panels Singapore
            </span>
            <h1
              className="m-0 max-w-[15ch] text-white sm:max-w-[18ch]"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(30px, 7.2vw, 54px)',
                lineHeight: '0.99',
                fontWeight: 500,
                letterSpacing: '-1.4px',
              }}
            >
              Reduce Echo and Make Your Space Easier To Hear
            </h1>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-7 text-white/82 sm:text-[16px] sm:leading-7 md:text-[17px]">
              We design and install acoustic panels for offices, restaurants, churches, schools, and studios.
            </p>

            <div className="mt-12 mb-4 flex flex-col gap-3 sm:mt-14 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/contact" className="no-underline">
                <ShimmerButton className="h-auto w-full px-7 py-4 text-[14px] font-semibold sm:min-w-[212px] sm:w-auto">
                  Free Acoustic Consultation
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
