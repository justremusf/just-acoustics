'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface FilterOption {
  value: string
  label: string
}

interface ShopFiltersProps {
  category?: string
  sort?: string
  categories: FilterOption[]
}

export default function ShopFilters({ category, sort, categories }: ShopFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [selectedCategory, setSelectedCategory] = useState(category ?? '')
  const [selectedSort, setSelectedSort] = useState(sort ?? '')

  useEffect(() => {
    setSelectedCategory(category ?? '')
    setSelectedSort(sort ?? '')
  }, [category, sort])

  function updateFilters(nextCategory: string, nextSort: string) {
    const params = new URLSearchParams()

    if (nextCategory) params.set('category', nextCategory)
    if (nextSort) params.set('sort', nextSort)

    const query = params.toString()

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname)
    })
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
      <label className="relative">
        <span className="sr-only">Filter by category</span>
        <select
          value={selectedCategory}
          onChange={(event) => {
            const nextCategory = event.target.value
            setSelectedCategory(nextCategory)
            updateFilters(nextCategory, selectedSort)
          }}
          disabled={isPending}
          className="w-full appearance-none rounded-[100px] border border-black/8 bg-white/88 px-5 py-3 pr-10 text-sm font-medium text-[var(--color-dark-100)] shadow-[0_10px_28px_rgba(0,0,0,0.04)] outline-none transition-colors focus:border-[var(--color-brand-orange)] md:min-w-[230px]"
        >
          <option value="">All Categories</option>
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--color-gray-200)]">⌄</span>
      </label>

      <label className="relative">
        <span className="sr-only">Sort by price</span>
        <select
          value={selectedSort}
          onChange={(event) => {
            const nextSort = event.target.value
            setSelectedSort(nextSort)
            updateFilters(selectedCategory, nextSort)
          }}
          disabled={isPending}
          className="w-full appearance-none rounded-[100px] border border-black/8 bg-white/88 px-5 py-3 pr-10 text-sm font-medium text-[var(--color-dark-100)] shadow-[0_10px_28px_rgba(0,0,0,0.04)] outline-none transition-colors focus:border-[var(--color-brand-orange)] md:min-w-[210px]"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Low to High</option>
          <option value="price-desc">High to Low</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--color-gray-200)]">⌄</span>
      </label>
    </div>
  )
}
