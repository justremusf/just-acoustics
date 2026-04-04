import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import BrandScroller from '@/components/sections/BrandScroller'
import Solutions from '@/components/sections/Solutions'
import ProductsGrid from '@/components/sections/ProductsGrid'
import Applications from '@/components/sections/Applications'
import ProcessSteps from '@/components/sections/ProcessSteps'
import ContactCTA from '@/components/sections/ContactCTA'
import {
  getSiteSettings,
  getAllProducts,
  getAllServices,
  getFeaturedTestimonials,
  getLatestPosts,
} from '@/sanity/lib/queries'

const HearTheDifference = dynamic(() => import('@/components/sections/HearTheDifference'))
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))
const FAQ = dynamic(() => import('@/components/sections/FAQ'))
const BlogPreview = dynamic(() => import('@/components/sections/BlogPreview'))

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
      <Applications services={services} />
      <HearTheDifference />
      <ProductsGrid products={products} />
      <div className="hidden md:block">
        <Solutions />
      </div>
      <ProcessSteps />
      <Testimonials testimonials={testimonials} />
      <FAQ />
      <div className="hidden md:block">
        <BlogPreview posts={posts} />
      </div>
      <ContactCTA />
    </>
  )
}
