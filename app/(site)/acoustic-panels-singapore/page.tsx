import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/PriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 60

const PAGE_PATH = '/acoustic-panels-singapore'

export const metadata: Metadata = pageMetadata({
  title: 'Acoustic Panels Singapore: Supply & Install',
  description: 'Acoustic wall and ceiling panels supplied and installed in Singapore, from S$185 per panel installed. Get product, layout and installation advice for your room.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Homes & Home Studios',
  title: 'Room sounds echoey? Get the right panels, placed properly.',
  summary: 'Acoustic panels for HDB and condo rooms, home studios and home offices in Singapore. Supply only, or supply and install.',
  projectCategory: 'studios-homes',
  spaceLabel: 'room',
  whatsappText: 'Hi Just Acoustics, I would like a free consultation on acoustic panels for my home / home studio.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  problemTitle: 'Panels only work when coverage and placement suit the room.',
  problems: [
    'Your voice sounds hollow on calls, podcasts or recordings.',
    'Mixes sound different in your room than everywhere else.',
    'Bare walls, tiles and windows keep sound bouncing around.',
    'A few panels bought online made little audible change.',
  ],
  approachTitle: 'From room photos to a treatment layout.',
  approach: [
    { title: 'Review the room', copy: 'We look at size, surfaces, how you use the room and the sound problem you notice.' },
    { title: 'Select treatment', copy: 'We recommend wall panels, ceiling treatment or bass control in suitable sizes and finishes.' },
    { title: 'Supply or install', copy: 'Install it yourself with our guidance, or let our team install it to a set layout.' },
  ],
  pricing: 'Home studios and rooms in HDB flats and condos commonly fall around S$1,000–S$3,000. Larger spaces and ceiling installations are scoped separately.',
  proof: ['Acoustic panels and bass traps', 'Self-install option when useful', 'Room-specific coverage guidance', 'Professional Singapore installation'],
  faq: [
    { q: 'How many acoustic panels do I need?', a: 'It depends on room size, hard surfaces and how the room is used. Photos and dimensions are enough for a first coverage recommendation.' },
    { q: 'Do acoustic panels soundproof a room?', a: 'No. They reduce echo inside the room. Soundproofing needs changes to walls, doors, windows or ceilings.' },
    { q: 'Can the panels match my interior?', a: 'Yes. Fabric colours, sizes, print finishes and ceiling formats can be chosen to suit the interior.' },
    { q: 'How long does it take?', a: 'Panels are made to order, with a standard lead time of 4 to 6 weeks. Most installs are completed in one to two days.' },
  ],
}

export default async function Page() {
  const data = await getPaidSearchData()
  const jsonLd = serviceJsonLd({
    name: 'Acoustic panel supply and installation in Singapore',
    description: config.summary,
    path: PAGE_PATH,
    minPrice: minPriceForService('panels'),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PaidSearchLandingPage
        config={config}
        {...data}
        relatedLinks={SPACE_LINKS_BY_SERVICE.panels}
        estimator={<PriceEstimator defaultSpace="home" compact id="estimator" />}
      />
    </>
  )
}
