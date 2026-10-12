import PriceEstimator from '@/components/estimator/PriceEstimator'

/**
 * Homepage pricing section. Shows installed project prices up front (the hero's "See prices"
 * jumps here), so visitors see Just Acoustics as an installer with honest prices rather than a
 * panel store. The DIY shop sits further down the page.
 */
export default function HomeEstimator() {
  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1580px]">
        <div className="mx-auto max-w-[920px]">
          <PriceEstimator id="estimator" />
        </div>
      </div>
    </section>
  )
}
