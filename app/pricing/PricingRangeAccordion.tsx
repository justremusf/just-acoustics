'use client'

import { useRef, useState } from 'react'

export type PricingRange = {
  space: string
  range: string
  detail: string
  note: string
}

function PricingRangeItem({
  item,
  index,
  open,
  onToggle,
}: {
  item: PricingRange
  index: number
  open: boolean
  onToggle: () => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)

  return (
    <div className="glass-card group mb-4 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset] md:p-7">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-5 border-0 bg-transparent p-0 text-left"
        onClick={onToggle}
      >
        <span className="flex min-w-0 items-center gap-4 md:gap-5">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
            open
              ? 'bg-[var(--color-brand-orange)] text-white'
              : 'bg-[rgba(255,165,0,0.14)] text-[var(--color-brand-orange)] group-hover:bg-[var(--color-brand-orange)] group-hover:text-white'
          }`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className={`text-[24px] font-medium leading-[1.05] tracking-[-0.8px] transition-all duration-300 md:text-[32px] ${
              open
                ? 'translate-x-1 text-[var(--color-brand-orange)]'
                : 'text-[var(--color-dark-100)] group-hover:translate-x-1 group-hover:text-[var(--color-brand-orange)]'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {item.space}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className={`hidden rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-300 sm:inline-flex ${
            open
              ? 'bg-[var(--color-brand-orange)] text-white'
              : 'bg-[rgba(255,165,0,0.10)] text-[var(--color-brand-orange)] group-hover:bg-[var(--color-brand-orange)] group-hover:text-white'
          }`}>
            S$ pricing
          </span>
          <span className={`relative flex h-8 w-8 items-center justify-center rounded-full border bg-white transition-colors duration-300 ${open ? 'border-[var(--color-brand-orange)]' : 'border-black/8 group-hover:border-[var(--color-brand-orange)]'}`}>
            <span className={`absolute h-0.5 w-4 transition-colors duration-300 ${open ? 'bg-[var(--color-brand-orange)]' : 'bg-[var(--color-dark-100)] group-hover:bg-[var(--color-brand-orange)]'}`} />
            <span
              className={`absolute h-4 w-0.5 transition-all duration-300 ${open ? 'bg-[var(--color-brand-orange)]' : 'bg-[var(--color-dark-100)] group-hover:bg-[var(--color-brand-orange)]'}`}
              style={{ opacity: open ? 0 : 1, transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </span>
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
        <div className="grid gap-5 border-t border-black/8 pt-6 md:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)_minmax(0,0.75fr)] md:items-start">
          <div>
            <p className="page-kicker text-[var(--color-brand-orange)]">Typical range</p>
            <p
              className="mt-3 mb-0 text-[clamp(30px,3.1vw,42px)] font-semibold leading-[0.98] tracking-[-1px] text-[var(--color-dark-100)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {item.range}
            </p>
          </div>
          <p className="m-0 text-sm leading-7 text-[var(--color-gray-100)] md:text-[15px]">{item.detail}</p>
          <p className="m-0 rounded-[18px] border border-[var(--color-brand-orange)]/20 bg-[rgba(255,165,0,0.08)] p-4 text-sm leading-6 text-[var(--color-dark-100)]">
            {item.note}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PricingRangeAccordion({ items }: { items: PricingRange[] }) {
  const [openSpace, setOpenSpace] = useState<string | null>(null)

  return (
    <div>
      {items.map((item, index) => (
        <PricingRangeItem
          key={item.space}
          item={item}
          index={index}
          open={openSpace === item.space}
          onToggle={() => setOpenSpace((current) => (current === item.space ? null : item.space))}
        />
      ))}
    </div>
  )
}
