import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/LazyPriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 86400

const PAGE_PATH = '/acoustic-panels-singapore'

export const metadata: Metadata = pageMetadata({
  title: 'Acoustic Panels Singapore: Supplied & Installed in Homes',
  description: 'Echoey HDB, condo or landed home? We supply and install acoustic wall and ceiling panels across Singapore, from S$185 per panel installed. Free quote.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Acoustic Panels for Homes',
  title: 'Echoey room at home? We install panels that soak it up.',
  summary: 'Acoustic panels for HDB flats, condos and landed homes in Singapore: living rooms, home offices and home theatres. We pick the panels, place them and install them for you.',
  projectCategory: 'studios-homes',
  projectSlugs: ['home-theatre-2', 'home-office', 'home-theatre', 'home-double-office', 'home-office-studio'],
  spaceLabel: 'room',
  whatsappText: 'Hi Just Acoustics, I would like a free quote for acoustic panels in my home.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  soundproofing: {
    fixes: 'echo inside your room, so voices, calls, TV and music sound clear instead of hollow.',
    doesNot: 'noise from neighbours, the corridor or traffic getting in. That needs work on walls, doors or windows.',
  },
  problemTitle: 'Bare walls, tiles and big windows keep sound bouncing.',
  problems: [
    'Your voice sounds hollow on work calls.',
    'The TV or music sounds harsh and you keep turning it up.',
    'Talking in the living room echoes like an empty flat.',
    'A few panels bought online made little difference.',
  ],
  approachTitle: 'From room photos to panels on your wall.',
  approach: [
    { title: 'Send photos of the room', copy: 'Tell us how you use the room and what bothers you. Photos and rough sizes are enough to start.' },
    { title: 'We plan the panels', copy: 'We choose the number, size, colour and spots for the panels so they soak up the most echo and suit your home.' },
    { title: 'We install them', copy: 'Our team puts the panels up neatly and cleans up after.' },
  ],
  pricing: 'Panels are from S$185 each, supplied and installed. Most rooms in HDB flats and condos fall around S$1,000–S$3,000. Larger spaces and ceiling panels are quoted after we see the room.',
  proof: ['Panels sized and placed for your room', 'Many colours, sizes and prints', 'Wall and ceiling panels', 'Installed across Singapore'],
  faq: [
    { q: 'How many acoustic panels do I need?', a: 'It depends on the room size, the hard surfaces and how you use it. Photos and rough sizes are enough for us to give you a first answer.' },
    { q: 'Do acoustic panels soundproof a room?', a: 'No. They soak up echo inside the room. Stopping noise from neighbours needs work on walls, doors or windows.' },
    { q: 'Can the panels match my interior?', a: 'Yes. You can choose fabric colours, sizes and printed designs to suit your home.' },
    { q: 'How long does it take?', a: 'Panels are made to order, usually 4 to 6 weeks. Most installs take one to two days.' },
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
