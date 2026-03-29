import Link from 'next/link'
import ShimmerButton from '@/components/ui/shimmer-button'

export default function ContactCTA() {
  return (
    <section
      className="relative mx-4 md:mx-6 rounded-[20px] py-20 md:py-[120px] my-10 md:my-16 overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 rounded-[20px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a459f805f921445e4427e_9.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 text-center">
        <h2
          className="text-white m-0 mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
            lineHeight: '124%',
            fontWeight: 500,
            letterSpacing: '-1.04px',
          }}
        >
          Acoustic Solutions for your space is just a click away
        </h2>
        <p className="text-white/80 text-base m-0 mb-8">
          Complete the form to get your free acoustic consultation!
        </p>
        <Link href="/contact" className="no-underline inline-block">
          <ShimmerButton className="text-base px-8 py-4 h-auto">
            Get Free Consultation
          </ShimmerButton>
        </Link>
      </div>
    </section>
  )
}
