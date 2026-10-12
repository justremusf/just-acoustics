import PriceEstimator from '@/components/estimator/LazyPriceEstimator'

/**
 * Homepage pricing section, placed after Spaces: once visitors see we handle their kind of space,
 * they can check what it typically costs (the hero's "See prices" jumps here). It sits above the
 * DIY shop so the page reads as an installer with honest prices rather than a panel store.
 */
export default function HomeEstimator() {
  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto grid max-w-[1580px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="home-heading m-0 text-[var(--color-dark-100)]">What will it cost?</h2>
          <p className="home-copy m-0 max-w-[44ch]">
            See what similar projects typically cost in Singapore, supplied and installed. No sign-up needed.
          </p>
        </div>
        <PriceEstimator id="estimator" />
      </div>
    </section>
  )
}
