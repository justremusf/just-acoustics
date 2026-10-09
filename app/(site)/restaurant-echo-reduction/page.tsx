import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/PriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 60

const PAGE_PATH = '/restaurant-echo-reduction'

export const metadata: Metadata = pageMetadata({
  title: 'Restaurant Echo Reduction Singapore',
  description: 'Reduce harsh restaurant and venue echo with discreet acoustic wall and ceiling treatment in Singapore.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Restaurants, Cafés & Bars',
  title: 'Restaurant too loud? Bring the noise down, keep the buzz.',
  summary: 'Discreet ceiling and wall acoustic treatment for Singapore restaurants, cafés and bars, installed around your service hours.',
  projectCategory: 'restaurants',
  spaceLabel: 'restaurant',
  whatsappText: 'Hi Just Acoustics, I would like a free consultation for echo and noise in our restaurant / café.',
  heroImage: '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
  heroAlt: 'Acoustic ceiling clouds installed by Just Acoustics in a Singapore café',
  problemTitle: 'Noise builds when every conversation bounces around the room.',
  problems: [
    'Guests talk louder and louder to be heard over each other.',
    'Concrete, glass, tile and exposed ceilings reflect sound everywhere.',
    'Music and chatter turn harsh instead of adding atmosphere.',
    'Guests leave early or do not come back because it is too loud.',
  ],
  approachTitle: 'Cut the echo while keeping your interior design.',
  approach: [
    { title: 'Review the venue', copy: 'Look at the layout, finishes, ceiling access and the times when noise is worst.' },
    { title: 'Find discreet coverage', copy: 'Use ceiling clouds, wall panels or custom prints that absorb enough sound without dominating the space.' },
    { title: 'Install outside service', copy: 'Coordinate access, protection and work timing around your opening hours.' },
  ],
  pricing: 'Restaurant and hospitality projects commonly range from S$2,000–S$6,000. Larger venues, custom finishes and difficult access are quoted separately.',
  proof: ['Discreet ceiling and wall options', 'Custom colours and prints', 'After-hours installation planning', 'Coverage designed around occupancy'],
  faq: [
    { q: 'Will acoustic panels make the restaurant silent?', a: 'No, panels cut the harsh echo but keep the buzz, so guests can talk without shouting.' },
    { q: 'Can the treatment be hidden?', a: 'Often, ceiling clouds, colour-matched fabric or printed artwork can blend panels right into your interior.' },
    { q: 'Can you install outside operating hours?', a: 'Yes, we install before opening or after closing so service is never interrupted.' },
    { q: 'How long does installation take?', a: 'Most installs take one to two days, after a 4 to 6 week lead time to make your panels.' },
  ],
}

export default async function Page() {
  const data = await getPaidSearchData()
  const jsonLd = serviceJsonLd({
    name: 'Restaurant echo reduction in Singapore',
    description: config.summary,
    path: PAGE_PATH,
    minPrice: minPriceForService('restaurant'),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PaidSearchLandingPage
        config={config}
        {...data}
        relatedLinks={SPACE_LINKS_BY_SERVICE.restaurant}
        estimator={<PriceEstimator defaultSpace="restaurant" compact id="estimator" />}
      />
    </>
  )
}
