import Hero from '@/components/sections/Hero'
import BrandScroller from '@/components/sections/BrandScroller'
import Solutions from '@/components/sections/Solutions'
import ProductsGrid from '@/components/sections/ProductsGrid'
import HearTheDifference from '@/components/sections/HearTheDifference'
import Applications from '@/components/sections/Applications'
import ProcessSteps from '@/components/sections/ProcessSteps'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import ContactCTA from '@/components/sections/ContactCTA'
import FadeUp from '@/components/ui/FadeUp'
import {
  getSiteSettings,
  getAllProducts,
  getAllServices,
  getFeaturedTestimonials,
} from '@/sanity/lib/queries'

export const revalidate = 60

export default async function HomePage() {
  const [settings, products, services, testimonials] = await Promise.all([
    getSiteSettings().catch(() => null),
    getAllProducts().catch(() => []),
    getAllServices().catch(() => []),
    getFeaturedTestimonials().catch(() => []),
  ])

  return (
    <>
      <Hero />
      <FadeUp><BrandScroller logos={settings?.brandLogos} /></FadeUp>
      <FadeUp delay={50}><Applications services={services} /></FadeUp>
      <FadeUp delay={50}><ProductsGrid products={products} /></FadeUp>
      <FadeUp delay={50}><HearTheDifference /></FadeUp>
      <FadeUp delay={50}><Solutions /></FadeUp>
<FadeUp delay={50}><ProcessSteps /></FadeUp>
      <FadeUp delay={50}><Testimonials testimonials={testimonials} /></FadeUp>
      <FadeUp delay={50}><FAQ /></FadeUp>
      <FadeUp delay={50}><ContactCTA /></FadeUp>
    </>
  )
}
