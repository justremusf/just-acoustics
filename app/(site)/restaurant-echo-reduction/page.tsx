import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/LazyPriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 3600

const PAGE_PATH = '/restaurant-echo-reduction'

export const metadata: Metadata = pageMetadata({
  title: 'Restaurant Echo Reduction Singapore: Acoustic Panels',
  description: 'Restaurant or café too loud? We install acoustic ceiling and wall panels across Singapore to cut the echo and keep the buzz. Free quote, reply within 1 hour.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Restaurants, Cafés & Bars',
  title: 'Restaurant too loud? Bring the noise down, keep the buzz.',
  summary: 'We install acoustic panels on the ceiling and walls of Singapore restaurants, cafés and bars, outside your opening hours. Guests can talk without shouting.',
  projectCategory: 'restaurants',
  spaceLabel: 'restaurant',
  whatsappText: 'Hi Just Acoustics, I would like a free quote to bring down the echo and noise in our restaurant / café.',
  heroImage: '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
  heroAlt: 'Acoustic ceiling clouds installed by Just Acoustics in a Singapore café',
  soundproofing: {
    fixes: 'the echo that makes a full room loud, so guests can talk across the table.',
    doesNot: 'noise from the street or the shop next door getting in, or your music getting out. That needs building work.',
  },
  problemTitle: 'A full room gets loud when every voice bounces around.',
  problems: [
    'Guests talk louder and louder to be heard over each other.',
    'Concrete, glass, tiles and open ceilings bounce sound everywhere.',
    'Music and chatter turn harsh instead of lively.',
    'Guests leave early or do not come back because it is too loud.',
  ],
  approachTitle: 'Cut the echo, keep your interior design.',
  approach: [
    { title: 'Look at your venue', copy: 'Send photos or a short video at a busy time. We look at the layout, the finishes and the ceiling.' },
    { title: 'Panels that blend in', copy: 'Ceiling panels, wall panels or printed panels in your colours, so they soak up echo without spoiling the look.' },
    { title: 'We install outside service', copy: 'Our team puts the panels up before or after opening hours, so you do not lose a service.' },
  ],
  pricing: 'Restaurant and hospitality projects commonly range from S$2,000–S$6,000. Larger venues, custom finishes and difficult access are quoted separately.',
  proof: ['Ceiling and wall options that blend in', 'Custom colours and prints', 'Installed outside opening hours', 'Planned for a full room'],
  faq: [
    { q: 'Will panels make the restaurant silent?', a: 'No. They cut the harsh echo so the room stays lively but guests can hear each other.' },
    { q: 'Can the panels be hidden?', a: 'Often. Ceiling panels, colour-matched panels and printed panels can blend into your interior.' },
    { q: 'Can you install outside opening hours?', a: 'Yes. We agree the install time with you when we quote.' },
    { q: 'How long does it take?', a: 'Panels are made to order, usually 4 to 6 weeks. Most installs take one to two days.' },
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
