import Hero from '@/components/sections/Hero'
import BrandScroller from '@/components/sections/BrandScroller'
import Solutions from '@/components/sections/Solutions'
import ProductsGrid from '@/components/sections/ProductsGrid'
import HearTheDifference from '@/components/sections/HearTheDifference'
import Applications from '@/components/sections/Applications'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import ProcessSteps from '@/components/sections/ProcessSteps'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import BlogPreview from '@/components/sections/BlogPreview'
import ContactCTA from '@/components/sections/ContactCTA'
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
      <BrandScroller logos={settings?.brandLogos} />
      <Solutions />
      <ProductsGrid products={products} />
      <HearTheDifference />
      <Applications services={services} />
      <WhyChooseUs />
      <ProcessSteps />
      <Testimonials testimonials={testimonials} />
      <FAQ />
      {posts.length > 0 && <BlogPreview posts={posts} />}
      <ContactCTA />
    </>
  )
}
