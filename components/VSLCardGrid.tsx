import type { VSLCategory } from '@/data/vslConfig'

type VSLCardGridProps = {
  categories: VSLCategory[]
  selectedCategoryId?: string
  onSelect: (category: VSLCategory) => void
}

export default function VSLCardGrid({
  categories,
  selectedCategoryId,
  onSelect,
}: VSLCardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {categories.map((category) => {
        const selected = selectedCategoryId === category.id

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category)}
            aria-pressed={selected}
            className={[
              'min-h-11 rounded-[999px] border px-3 py-2 text-center text-[13px] font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] focus-visible:ring-offset-2 sm:px-4 sm:text-[14px]',
              selected
                ? 'border-[rgba(255,165,0,0.72)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,247,230,0.92))] shadow-[0_20px_48px_rgba(255,165,0,0.18)]'
                : 'border-white/44 bg-white/72 hover:-translate-y-0.5 hover:border-[rgba(255,165,0,0.42)] hover:bg-white/88',
            ].join(' ')}
          >
            <span className="block leading-tight text-[var(--color-dark-100)]">
              {category.shortLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
