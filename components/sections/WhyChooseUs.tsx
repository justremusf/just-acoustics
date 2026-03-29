const stats = [
  { number: '500+', label: 'Projects Completed' },
  { number: '4.9★', label: 'Google Rating' },
  { number: '10+', label: 'Years Experience' },
  { number: '100%', label: 'Satisfaction Guarantee' },
]

const reasons = [
  {
    title: 'Expert Consultation',
    description: 'Free site assessment by our acoustic specialists with tailored recommendations for your space.',
  },
  {
    title: 'Custom Solutions',
    description: 'Every acoustic treatment is designed specifically for your space, budget, and aesthetic preferences.',
  },
  {
    title: 'Premium Materials',
    description: 'Industry-grade acoustic panels tested in the lab, delivering excellent noise reduction and echo control.',
  },
  {
    title: 'Clean Installation',
    description: 'Professional installation with minimal disruption. We work around your schedule, including weekends.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5">
        {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 md:gap-16 items-start mb-14">
          <h2
            className="text-[var(--color-dark-100)] m-0"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, var(--fs-h4))',
              lineHeight: '132%',
              fontWeight: 500,
              letterSpacing: '-0.96px',
            }}
          >
            Why Choose Just Acoustics?
          </h2>
          <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed">
            We combine deep acoustic expertise with a practical, client-first approach — so your space gets the right treatment, not just any treatment.
          </p>
        </div>

        {/* Stats + reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stats card */}
          <div className="bg-[var(--color-white-200)] rounded-[16px] p-8 relative overflow-hidden">
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-[var(--color-dark-100)] font-semibold"
                    style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: '112%' }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-[var(--color-gray-200)] text-base mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reasons */}
          <div className="grid grid-cols-1 gap-4">
            {reasons.map((r) => (
              <div key={r.title} className="bg-[var(--color-white-200)] rounded-[16px] px-6 py-5">
                <h3 className="text-[var(--color-dark-100)] m-0 mb-2 font-semibold" style={{ fontSize: '1.0625rem' }}>{r.title}</h3>
                <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
