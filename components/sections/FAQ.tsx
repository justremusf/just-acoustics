'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'How long does installation take?',
    a: 'Most installations are completed within 1–2 days, depending on the project size and complexity.',
  },
  {
    q: 'What materials are used?',
    a: "We use industry-standard acoustic and soundproofing materials tailored for Singapore's climate.",
  },
  {
    q: 'Can you customise solutions?',
    a: 'Absolutely, we design acoustic treatments to fit your specific space and sound needs perfectly.',
  },
  {
    q: 'What is included in the consultation?',
    a: 'Our acoustic specialist will assess your needs, explain how acoustic treatment works for your specific space, and provide expert recommendations — all with no obligation.',
  },
  {
    q: 'Is installation disruptive?',
    a: 'We work efficiently to minimise disruption and keep your space clean throughout.',
  },
  {
    q: 'What is your availability like?',
    a: "We're flexible to accommodate your schedule, including weekends and after-hours installations to minimise disruption to your business operations or home life.",
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-[10px] p-5 md:p-6 mb-4">
      <button
        className="w-full flex items-center justify-between gap-2.5 cursor-pointer bg-transparent border-0 text-left"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-[var(--color-dark-100)] text-base md:text-xl font-semibold"
          style={{ letterSpacing: '-0.48px' }}
        >
          {q}
        </span>
        <span className="flex items-center justify-center w-6 h-6 shrink-0 relative">
          <span className="absolute bg-[var(--color-dark-100)] h-0.5 w-3.5" />
          {!open && <span className="absolute bg-[var(--color-dark-100)] w-0.5 h-3" />}
        </span>
      </button>
      <div className={`accordion-body${open ? ' open' : ''}`}>
        <p className="text-[var(--color-gray-100)] text-base pt-2.5 m-0 leading-[171%]">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="py-16 md:py-[120px] bg-[var(--color-white-200)]">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-[0.75fr_1fr] gap-6 items-start">
          {/* Left */}
          <div className="flex flex-col gap-5">
            <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm">
              FAQ
            </span>
            <h2
              className="text-[var(--color-dark-100)] m-0"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
                lineHeight: '124%',
                fontWeight: 500,
                letterSpacing: '-1.04px',
              }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--color-gray-100)] text-base m-0 leading-relaxed">
              Can&apos;t find an answer? Contact us and we&apos;ll be happy to help.
            </p>
          </div>

          {/* Right — accordion */}
          <div>
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
