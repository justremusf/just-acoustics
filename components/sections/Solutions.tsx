import Link from 'next/link'
import Image from 'next/image'

const solutions = [
  {
    icon: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69650dc85d7daca7cccae5c1_3.svg',
    title: 'Echo Control',
    benefits: ['Voice Clarity', 'Lower Stress Levels', 'Improve Productivity'],
  },
  {
    icon: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69650dccd68664f77d9ba78b_2.svg',
    title: 'Noise Control',
    benefits: ['Block Outside Sounds', 'Improve Privacy', 'Contain Noise'],
  },
  {
    icon: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69650dc89aa0f23320b10d20_1.svg',
    title: 'AV: Audio Visual Lighting',
    benefits: ['Speaker Installation', 'Lighting Installation', 'Visuals (such as TV)'],
  },
]

export default function Solutions() {
  return (
    <section
      className="relative rounded-[20px] mx-4 my-6 pt-[10px] pb-10 md:pb-14"
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 rounded-[20px] z-[99]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.36),rgba(0,0,0,0.36)),url('https://cdn.prod.website-files.com/6962571d2d02027389a12edb/696a459f805f921445e4427e_9.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-[999] max-w-[1280px] mx-auto px-5">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.5fr] gap-6 md:gap-16 mt-9">
          <div>
            <h2
              className="text-white m-0 mb-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                lineHeight: '120%',
                fontWeight: 500,
                letterSpacing: '-0.8px',
              }}
            >
              Acoustic Solutions
            </h2>
            <p className="text-white/70 m-0 text-sm md:text-base">
              Everything your space needs — from sound control to full AV installations.
            </p>
          </div>
          <div className="flex flex-col gap-5 items-start md:items-end justify-center">
            <Link
              href="/contact"
              className="inline-block bg-[var(--color-brand-orange)] text-white rounded-[100px] px-6 py-3 text-base no-underline transition-all duration-300 hover:bg-[var(--color-gray-100)] hover:tracking-wide"
            >
              Get Free Quote
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[18px] pt-8 md:pt-12">
          {solutions.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-[16px] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
            >
              <Image src={s.icon} alt={s.title} width={52} height={52} unoptimized />
              <h3
                className="text-[var(--color-dark-100)] mt-0 mb-5 pt-8 md:pt-12 pb-5 text-2xl font-semibold"
              >
                {s.title}
              </h3>
              <ul className="m-0 p-0 list-none text-[var(--color-gray-100)] text-base leading-relaxed">
                {s.benefits.map((b) => (
                  <li key={b} className="before:content-['✔_'] mb-1">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
