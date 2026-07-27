import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import BrandScroller from '@/components/sections/BrandScroller'
import ProductsGrid from '@/components/sections/ProductsGrid'
import Spaces from '@/components/sections/Spaces'
import ProcessSteps from '@/components/sections/ProcessSteps'
import ContactCTA from '@/components/sections/ContactCTA'
import ScrollToTopOnMount from '@/components/ScrollToTopOnMount'
import LazyInteractiveVSL from '@/components/LazyInteractiveVSL'
import { landingVslConfig } from '@/data/vslConfig'
import {
  getSiteSettings,
  getAllShopItems,
  getAllSpaces,
  getFeaturedTestimonials,
} from '@/sanity/lib/queries'
import { canonicalPath } from '@/lib/seo'

const HearTheDifference = dynamic(() => import('@/components/sections/HearTheDifference'))
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))
const FAQ = dynamic(() => import('@/components/sections/FAQ'))
export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: canonicalPath('/') },
}

export default async function HomePage() {
  const [settings, products, spaces, testimonials] = await Promise.all([
    getSiteSettings().catch(() => null),
    getAllShopItems().catch(() => []),
    getAllSpaces().catch(() => []),
    getFeaturedTestimonials().catch(() => []),
  ])

  return (
    <>
      <ScrollToTopOnMount />
      <Hero />
      <div data-home-reveal><BrandScroller logos={settings?.brandLogos} /></div>
      <div data-home-reveal><Spaces spaces={spaces} /></div>
      <div data-home-reveal>
        <LazyInteractiveVSL
          config={landingVslConfig}
          pageLocation="/"
        />
      </div>
      <div data-home-reveal><ProductsGrid products={products} /></div>
      <div data-home-reveal><HearTheDifference /></div>
      <div data-home-reveal><ProcessSteps /></div>
      <div data-home-reveal><Testimonials testimonials={testimonials} /></div>
      <div data-home-reveal><FAQ showLabel={false} /></div>
      <div data-home-reveal><ContactCTA showBadge={false} /></div>
    </>
  )
}
