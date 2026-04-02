const painPoints = [
  {
    title: 'Noisy shared rooms',
    body: 'Too many voices stack up at once, so the room feels loud and tiring instead of lively.',
    spaces: ['Restaurants', 'Offices'],
  },
  {
    title: 'Echo that will not settle',
    body: 'Hard walls, ceilings, and glass keep throwing sound back into the room.',
    spaces: ['Churches', 'Meeting Rooms'],
  },
  {
    title: 'Speech that does not carry clearly',
    body: 'People hear sound, but not words, so teaching, service, and discussion feel less clear.',
    spaces: ['Worship', 'Hospitality'],
  },
  {
    title: 'Calls, streams, and playback sound off',
    body: 'Video calls, livestreams, and monitoring feel harsher, boxier, or less controlled than they should.',
    spaces: ['Home Studios', 'Offices'],
  },
]

export default function HowWeSolve() {
  return (
    <section className="px-4 py-8 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]">
          <div className="max-w-[500px]">
            <span className="soft-pill">Acoustic pain points</span>
            <h2 className="home-heading mt-4 max-w-[10ch] text-[var(--color-dark-100)]">
              What usually sounds wrong in the room.
            </h2>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-6 text-[var(--color-gray-100)]">
              These are the problems we solve most often across churches, offices, restaurants, and home studios.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {painPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-black/6 bg-white/84 p-5 shadow-[0_14px_38px_rgba(0,0,0,0.05)] sm:p-6"
              >
                <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                  Pain point
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
                  {item.title}
                </h3>
                <p className="mt-4 mb-0 text-[14px] leading-6 text-[var(--color-gray-100)]">
                  {item.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.spaces.map((space) => (
                    <span
                      key={space}
                      className="inline-flex rounded-full border border-black/8 bg-[rgba(255,165,0,0.08)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-dark-100)]/72"
                    >
                      {space}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
