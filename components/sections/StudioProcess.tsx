'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function StudioProcess() {
  const steps = [
    {
      id: 1,
      title: 'Site recce',
      description: 'We understand your space, goals, and budget.',
      checklist: [
        'Room measurement',
        'Acoustic assessment',
        'Discuss use + issues',
        'Budget alignment',
      ],
      image: '/assets/webflow/6964fb659de42387a7d78754_Image from TinyPNG (4).avif',
    },
    {
      id: 2,
      title: '3D studio proposal',
      description: 'We design and simulate for your room.',
      checklist: [
        '3D modelling',
        'Acoustic simulation',
        'Panel layout plan',
        'Finishes & colours',
      ],
      image: '/assets/webflow/69687c96d1feff52c5d91be4_3.avif',
    },
    {
      id: 3,
      title: 'Quote + install',
      description: 'Transparent quote. Professional installation.',
      checklist: [
        'Transparent pricing',
        'Quality materials',
        'Expert installation',
        'Aftercare support',
      ],
      image: '/assets/webflow/696a4efb0907dcf8dacbcd54_2.png',
    },
  ]

  return (
    <section className="px-4 py-16 md:px-6 lg:px-8 bg-white text-black">
      <div className="mx-auto max-w-[1200px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="soft-pill">Our process</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)] font-bold">
              Our process. Simple, practical, proven.
            </h2>
          </div>
          <Link href="/about" className="home-link inline-flex items-center gap-2 text-sm font-bold text-[var(--color-brand-orange-dark)]">
            Learn more about our process <span>→</span>
          </Link>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="glass-card overflow-hidden rounded-[32px] border border-black/8 bg-[#faf9f6]/40 p-0 shadow-[0_16px_36px_rgba(0,0,0,0.03)] flex flex-col justify-between"
            >
              {/* Responsive columns: left content, right image */}
              <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_0.85fr] items-stretch h-full">
                
                {/* Left content panel */}
                <div className="p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    {/* Orange step number badge */}
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-black text-xs font-black mb-4">
                      {step.id}
                    </span>
                    
                    <h3 className="text-xl font-bold text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-black/60 font-semibold mt-2 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Checklist */}
                    <ul className="mt-5 space-y-2.5 pl-0 list-none">
                      {step.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-bold text-black/75">
                          <span className="text-[var(--color-brand-orange-dark)] text-sm">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right image panel */}
                <div className="relative min-h-[180px] sm:min-h-full bg-black/5 border-t sm:border-t-0 sm:border-l border-black/5 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 15vw"
                    className="object-cover"
                  />
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
