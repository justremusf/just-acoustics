import Hero from '@/components/sections/Hero'
import BrandScroller from '@/components/sections/BrandScroller'
import HowWeSolve from '@/components/sections/HowWeSolve'
import Solutions from '@/components/sections/Solutions'
import ProductsGrid from '@/components/sections/ProductsGrid'
import HearTheDifference from '@/components/sections/HearTheDifference'
import Applications from '@/components/sections/Applications'
import ProcessSteps from '@/components/sections/ProcessSteps'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import BlogPreview from '@/components/sections/BlogPreview'
import ContactCTA from '@/components/sections/ContactCTA'
import FadeUp from '@/components/ui/FadeUp'
import {
  getSiteSettings,
  getAllProducts,
  getAllServices,
  getFeaturedTestimonials,
  getLatestPosts,
} from '@/sanity/lib/queries'

export const revalidate = 60

export default async function HomePage() {
  const [settings, products, services, testimonials, posts] = await Promise.all([
    getSiteSettings().catch(() => null),
    getAllProducts().catch(() => []),
    getAllServices().catch(() => []),
    getFeaturedTestimonials().catch(() => []),
    getLatestPosts(3).catch(() => []),
  ])

  return (
    <>
      <Hero />
      <FadeUp delay={20}><BrandScroller logos={settings?.brandLogos} /></FadeUp>
      <FadeUp delay={40}><HowWeSolve /></FadeUp>
      <FadeUp delay={60}><Applications services={services} /></FadeUp>
      <FadeUp delay={80}><ProductsGrid products={products} /></FadeUp>
      <FadeUp delay={100}><HearTheDifference /></FadeUp>
      <FadeUp delay={120}><Solutions /></FadeUp>
      <FadeUp delay={140}><ProcessSteps /></FadeUp>
      <FadeUp delay={160}><Testimonials testimonials={testimonials} /></FadeUp>
      <FadeUp delay={180}><FAQ /></FadeUp>
      <FadeUp delay={200}><BlogPreview posts={posts} /></FadeUp>
      <FadeUp delay={220}><ContactCTA /></FadeUp>
    </>
  )
}
