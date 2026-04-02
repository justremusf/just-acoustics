import Link from 'next/link'
import Image from 'next/image'
import ShimmerButton from '@/components/ui/shimmer-button'

const solutions = [
  {
    icon: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69650dc85d7daca7cccae5c1_3.svg',
    title: 'Echo Control',
    label: 'For clearer speech',
    summary:
      'Calm reflected sound so conversations feel easier to follow and the room stops sounding harsh.',
    benefits: [
      'Voice clarity in conversation-heavy spaces',
      'Lower listening fatigue through the day',
      'A calmer atmosphere for teams and guests',
    ],
    surfaceClass:
      'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,245,238,0.98))]',
    iconShellClass:
      'border-[rgba(255,165,0,0.18)] bg-[rgba(255,165,0,0.10)]',
  },
  {
    icon: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69650dccd68664f77d9ba78b_2.svg',
    title: 'Noise Control',
    label: 'For better privacy',
    summary:
      'Reduce spill between adjacent zones so work, conversation, and rest are less constantly interrupted.',
    benefits: [
      'Reduce spill from adjacent areas',
      'Improve privacy and concentration',
      'Keep energy without the harshness',
    ],
    surfaceClass:
      'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,244,246,0.98))]',
    iconShellClass:
      'border-[rgba(1,1,1,0.10)] bg-[rgba(1,1,1,0.04)]',
  },
  {
    icon: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69650dc89aa0f23320b10d20_1.svg',
    title: 'Acoustic Panels',
    label: 'For a cleaner finish',
    summary:
      'Treat the room with systems that perform properly while still fitting the visual language of the space.',
    benefits: [
      'A cleaner visual finish than ad hoc treatment',
      'Flexible wall and ceiling options',
      'Performance matched to the space',
    ],
    surfaceClass:
      'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,243,236,0.98))]',
    iconShellClass:
      'border-[rgba(255,165,0,0.14)] bg-[rgba(255,165,0,0.08)]',
  },
]

const outcomeChips = ['Clearer speech', 'Better privacy', 'Lower fatigue']

export default function Solutions() {
  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10">
          <div className="flex flex-col justify-between gap-6 lg:pr-4">
            <div className="max-w-[560px]">
              <span className="soft-pill px-3 py-1.5 text-[11px]">Why acoustics matter</span>
              <h2
                className="mt-4 m-0 max-w-[11ch] text-[var(--color-dark-100)]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 3.5vw, 42px)',
                  lineHeight: '1.02',
                  fontWeight: 500,
                  letterSpacing: '-1px',
                }}
              >
                Fixing sound changes how people focus, communicate, and stay in a space.
              </h2>
              <p className="home-copy mt-5 max-w-[44ch]">
                The right treatment is not just about making a room quieter. It shapes clarity,
                comfort, privacy, and the overall experience of being there.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                {outcomeChips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex rounded-full border border-black/8 bg-white/78 px-4 py-2 text-[13px] font-semibold text-[var(--color-dark-100)]/72 shadow-[0_8px_22px_rgba(0,0,0,0.04)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <Link href="/contact" className="w-full no-underline sm:w-auto">
                <ShimmerButton className="h-auto w-full px-7 py-4 text-sm sm:w-auto">
                  Free Consultation
                </ShimmerButton>
              </Link>
            </div>
          </div>

          <div className="space-y-4 md:space-y-5">
            {solutions.map((solution, index) => (
              <article
                key={solution.title}
                className={`rounded-[26px] border border-black/6 ${solution.surfaceClass} p-5 shadow-[0_18px_42px_rgba(0,0,0,0.05)] sm:p-6`}
              >
                <div className="grid gap-5 xl:grid-cols-[auto_minmax(0,1fr)_minmax(240px,0.88fr)] xl:items-start">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-[18px] border ${solution.iconShellClass} shadow-[0_10px_24px_rgba(0,0,0,0.04)]`}
                  >
                    <Image src={solution.icon} alt={solution.title} width={42} height={42} unoptimized />
                  </div>

                  <div className="max-w-[34ch]">
                    <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                      {String(index + 1).padStart(2, '0')} · {solution.label}
                    </p>
                    <h3
                      className="mt-3 m-0 text-[var(--color-dark-100)]"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(22px, 2.2vw, 28px)',
                        lineHeight: '1.04',
                        fontWeight: 600,
                        letterSpacing: '-0.7px',
                      }}
                    >
                      {solution.title}
                    </h3>
                  </div>

                  <ul className="m-0 grid gap-3 border-t border-black/6 pt-4 text-[14px] leading-6 text-[var(--color-gray-100)] xl:border-t-0 xl:border-l xl:pt-0 xl:pl-5">
                    {solution.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 list-none">
                        <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-[var(--color-brand-orange)]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
