import Link from 'next/link'
import Image from 'next/image'
import ShimmerButton from '@/components/ui/shimmer-button'

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Top row: pill tag + heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center mb-10 md:mb-12">
          <div>
            <span className="inline-block border border-[var(--color-dark-100)] text-[var(--color-dark-100)] rounded-[100px] px-5 py-2 text-sm">
              Why choose us
            </span>
          </div>
          <h2
            className="text-[var(--color-dark-100)] m-0"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              lineHeight: '110%',
              fontWeight: 600,
              letterSpacing: '-1.2px',
            }}
          >
            Experts in Noise Reduction.
          </h2>
        </div>

        {/* Bottom row: left stats card + right image card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left card */}
          <div className="bg-[var(--color-white-200)] rounded-[20px] p-8 flex flex-col gap-6 min-h-[360px]">
            {/* Google badge */}
            <div className="flex items-center gap-4">
              <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--color-dark-100)] leading-none" style={{ fontSize: '28px' }}>4.9</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[var(--color-brand-orange)] text-xl">★</span>
                    ))}
                  </div>
                </div>
                <span className="text-[var(--color-gray-200)] text-sm mt-0.5 block">Google Reviews</span>
              </div>
            </div>

            <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed">
              Be it an office or a home studio, we have helped improve sound in spaces all over Singapore.
            </p>

            <div className="mt-auto">
              <Link href="/contact" className="no-underline inline-block">
                <ShimmerButton className="text-base px-8 py-4 h-auto">
                  Get in touch
                </ShimmerButton>
              </Link>
            </div>
          </div>

          {/* Right image card */}
          <div className="relative rounded-[20px] overflow-hidden min-h-[360px]">
            <Image
              src="https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a459f805f921445e4427e_9.avif"
              alt="Just Acoustics installation team at work"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/45" />
            {/* Stat overlay bottom-left */}
            <div className="absolute bottom-8 left-8">
              <div
                className="text-white font-semibold leading-none"
                style={{ fontSize: 'clamp(52px, 7vw, 80px)', fontFamily: 'var(--font-heading)' }}
              >
                100+
              </div>
              <div className="text-white text-lg font-medium mt-1">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
