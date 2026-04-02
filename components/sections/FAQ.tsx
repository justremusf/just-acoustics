'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

const faqs = [
  {
    q: 'What are acoustic panels?',
    a: 'Acoustic panels absorb sound reflections so a room feels calmer, clearer, and easier to speak in. They improve the way a space sounds rather than blocking all sound entirely.',
  },
  {
    q: 'What is the difference between acoustic treatment and soundproofing?',
    a: 'Acoustic treatment improves sound quality inside the room by managing reflections. Soundproofing is about reducing sound transfer between rooms or from outside sources.',
  },
  {
    q: 'How long does installation take?',
    a: 'Most projects are installed within one to two days, depending on the treatment type and how much area is being covered.',
  },
  {
    q: 'Can you customise solutions?',
    a: 'Yes. We recommend treatment based on the function of the room, the level of noise control needed, and the visual finish you want the space to keep.',
  },
  {
    q: 'What is included in the consultation?',
    a: 'We review the problem you are trying to solve, the way the room is used, and the likely treatment options so you have a clear next step before committing.',
  },
  {
    q: 'Is installation disruptive?',
    a: 'We plan the install to minimise disruption and keep the site clean. Many projects can be scheduled around business hours or lower-traffic periods.',
  },
]

function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div className="glass-card group mb-3 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset] md:p-6">
      <button className="flex w-full items-center justify-between gap-4 border-0 bg-transparent p-0 text-left" onClick={onToggle}>
        <span
          className={`text-[19px] leading-[1.14] font-medium tracking-[-0.6px] transition-all duration-300 md:text-[28px] ${
            open
              ? 'translate-x-1 text-[var(--color-brand-orange)]'
              : 'text-[var(--color-dark-100)] group-hover:translate-x-1 group-hover:text-[var(--color-brand-orange)]'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {q}
        </span>
        <span className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white transition-colors duration-300 ${open ? 'border-[var(--color-brand-orange)]' : 'border-black/8 group-hover:border-[var(--color-brand-orange)]'}`}>
          <span className={`absolute h-0.5 w-4 transition-colors duration-300 ${open ? 'bg-[var(--color-brand-orange)]' : 'bg-[var(--color-dark-100)] group-hover:bg-[var(--color-brand-orange)]'}`} />
          <span className={`absolute h-4 w-0.5 transition-all duration-300 ${open ? 'bg-[var(--color-brand-orange)]' : 'bg-[var(--color-dark-100)] group-hover:bg-[var(--color-brand-orange)]'}`} style={{ opacity: open ? 0 : 1, transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </span>
      </button>
      <div
        ref={bodyRef}
        style={{
          height: open ? (bodyRef.current?.scrollHeight ?? 'auto') : 0,
          overflow: 'hidden',
          transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <p className="m-0 pt-4 text-sm leading-7 text-[var(--color-gray-100)] md:text-[15px]">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.78fr_1fr] md:gap-10">
          <div>
            <span className="soft-pill">FAQ</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">Commonly Asked Questions</h2>
            <p className="home-copy mt-4 max-w-[40ch]">We make acoustics simple for you.</p>
          </div>
          <div>
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.q}
                q={faq.q}
                a={faq.a}
                open={openQuestion === faq.q}
                onToggle={() =>
                  setOpenQuestion((current) => (current === faq.q ? null : faq.q))
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-black/6 pt-8 md:mt-10">
          <div className="grid grid-cols-1 md:grid-cols-[0.78fr_1fr] md:gap-10">
            <div className="hidden md:block" />
            <Link
              href="/contact"
              className="glass-card group flex flex-col items-start gap-5 p-5 no-underline transition-transform duration-300 hover:-translate-y-0.5 md:flex-row md:items-center md:justify-between md:gap-4 md:p-6"
            >
              <div>
                <p className="page-kicker text-[var(--color-brand-orange)]">Still need help</p>
                <h3
                  className="mt-3 mb-0 text-[var(--color-dark-100)]"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(22px, 2.2vw, 28px)',
                    lineHeight: '1.04',
                    fontWeight: 600,
                    letterSpacing: '-0.7px',
                  }}
                >
                  Your question not answered?
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-100)] transition-colors group-hover:text-[var(--color-brand-orange)]">
                Contact Us
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
