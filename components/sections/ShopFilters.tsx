import Link from 'next/link'

interface FilterOption {
  value: string
  label: string
}

interface ShopFiltersProps {
  category?: string
  categories: FilterOption[]
}

export default function ShopFilters({ category, categories }: ShopFiltersProps) {
  return (
    <div>
      <nav aria-label="Shop categories" className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] font-semibold sm:gap-x-5 sm:text-[15px]">
        <Link href="/shop" className={`no-underline ${!category ? 'text-[#171717]' : 'text-black/42 hover:text-[#171717]'}`}>
          All Products
        </Link>
        {categories.map((option) => (
          <Link
            key={option.value}
            href={`/shop?category=${encodeURIComponent(option.value)}`}
            className={`no-underline ${category === option.value ? 'text-[#171717]' : 'text-black/42 hover:text-[#171717]'}`}
          >
            {option.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
