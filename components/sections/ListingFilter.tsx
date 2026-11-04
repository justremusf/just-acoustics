'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface FilterOption {
  value: string
  label: string
  /** No items in this category, so the page's [data-listing-empty] message shows instead. */
  empty?: boolean
}

interface ListingFilterProps {
  basePath: string
  allLabel: string
  ariaLabel: string
  options: FilterOption[]
  className: string
  linkClassName: string
  activeClassName: string
  inactiveClassName: string
}

function Filters({ category, basePath, allLabel, ariaLabel, options, className, linkClassName, activeClassName, inactiveClassName }: ListingFilterProps & { category: string | null }) {
  const active = options.find((option) => option.value === category)
  const linkClass = (isActive: boolean) => `${linkClassName} ${isActive ? activeClassName : inactiveClassName}`

  return (
    <>
      {active ? (
        <style>
          {`[data-listing-item]:not([data-category="${active.value}"]){display:none!important}[data-listing-promo]{order:1}${active.empty ? '[data-listing-empty]{display:block!important}' : ''}`}
        </style>
      ) : null}
      <nav aria-label={ariaLabel} className={className}>
        <Link href={basePath} className={linkClass(!active)}>
          {allLabel}
        </Link>
        {options.map((option) => (
          <Link
            key={option.value}
            href={`${basePath}?category=${encodeURIComponent(option.value)}`}
            className={linkClass(option.value === active?.value)}
          >
            {option.label}
          </Link>
        ))}
      </nav>
    </>
  )
}

function FiltersFromUrl(props: ListingFilterProps) {
  return <Filters {...props} category={useSearchParams().get('category')} />
}

// The listing pages are cached, so the server renders every item and the filter hides the rest in
// the browser. Reading the URL on the server would re-render the page on every request.
export default function ListingFilter(props: ListingFilterProps) {
  return (
    <Suspense fallback={<Filters {...props} category={null} />}>
      <FiltersFromUrl {...props} />
    </Suspense>
  )
}
