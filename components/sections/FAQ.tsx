'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import ShimmerButton from '@/components/ui/shimmer-button'

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

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div className="glass-card mb-3 p-5 md:p-6">
      <button className="flex w-full items-center justify-between gap-4 border-0 bg-transparent p-0 text-left" onClick={() => setOpen(!open)}>
        <span className="text-[22px] leading-[1.1] font-medium tracking-[-0.8px] text-[var(--color-dark-100)] md:text-[28px]" style={{ fontFamily: 'var(--font-heading)' }}>
          {q}
        </span>
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white">
          <span className="absolute h-0.5 w-4 bg-[var(--color-dark-100)]" />
          <span className="absolute h-4 w-0.5 bg-[var(--color-dark-100)] transition-all duration-300" style={{ opacity: open ? 0 : 1, transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} />
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
  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.78fr_1fr] md:gap-10">
          <div>
            <span className="soft-pill">FAQ</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">Questions we usually answer before people decide to treat the room.</h2>
            <p className="home-copy mt-4 max-w-[40ch]">If you still want help after reading these, the consultation is the easiest next step.</p>
          </div>
          <div>
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-black/6 pt-8 sm:flex-row sm:flex-wrap sm:items-center md:mt-10">
          <Link href="/contact" className="w-full no-underline sm:w-auto">
            <ShimmerButton className="h-auto w-full px-7 py-4 text-sm sm:w-auto">
              Free Consultation
            </ShimmerButton>
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-black/8 bg-white/82 px-6 py-3.5 text-sm font-semibold text-[var(--color-dark-100)] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-black/14 hover:text-[var(--color-brand-orange)]"
          >
            Visit resource center
          </Link>
        </div>
      </div>
    </section>
  )
}
