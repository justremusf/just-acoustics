import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import BrandScroller from '@/components/sections/BrandScroller'
import Solutions from '@/components/sections/Solutions'
import ProductsGrid from '@/components/sections/ProductsGrid'
import Applications from '@/components/sections/Applications'
import ProcessSteps from '@/components/sections/ProcessSteps'
import ContactCTA from '@/components/sections/ContactCTA'
import ScrollToTopOnMount from '@/components/ScrollToTopOnMount'
import { landingVslConfig } from '@/data/vslConfig'
import {
  getSiteSettings,
  getAllProducts,
  getAllServices,
  getFeaturedTestimonials,
  getLatestPosts,
} from '@/sanity/lib/queries'
import { canonicalPath } from '@/lib/seo'

const HearTheDifference = dynamic(() => import('@/components/sections/HearTheDifference'))
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))
const FAQ = dynamic(() => import('@/components/sections/FAQ'))
const BlogPreview = dynamic(() => import('@/components/sections/BlogPreview'))
const InteractiveVSL = dynamic(() => import('@/components/InteractiveVSL'), {
  loading: () => <div className="py-7 md:py-9" aria-hidden="true" />,
})

export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: canonicalPath('/') },
}

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
      <ScrollToTopOnMount />
      <Hero />
      <InteractiveVSL
        config={landingVslConfig}
        pageLocation="/"
      />
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
