import Hero from '@/components/sections/Hero'
import BrandScroller from '@/components/sections/BrandScroller'
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
      <FadeUp delay={40}><Applications services={services} /></FadeUp>
      <FadeUp delay={60}><HearTheDifference /></FadeUp>
      <FadeUp delay={80}><ProductsGrid products={products} /></FadeUp>
      <div className="hidden md:block">
        <FadeUp delay={100}><Solutions /></FadeUp>
      </div>
      <FadeUp delay={120}><ProcessSteps /></FadeUp>
      <FadeUp delay={140}><Testimonials testimonials={testimonials} /></FadeUp>
      <FadeUp delay={160}><FAQ /></FadeUp>
      <div className="hidden md:block">
        <FadeUp delay={180}><BlogPreview posts={posts} /></FadeUp>
      </div>
      <FadeUp delay={200}><ContactCTA /></FadeUp>
    </>
  )
}
