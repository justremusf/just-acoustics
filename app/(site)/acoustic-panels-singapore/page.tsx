import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/LazyPriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 86400

const PAGE_PATH = '/acoustic-panels-singapore'

export const metadata: Metadata = pageMetadata({
  title: 'Acoustic Panels Singapore: Supply & Install from S$185',
  description: 'Acoustic panel supplier and installer in Singapore for offices, studios, restaurants, churches and homes. From S$185 per panel installed. Free quote.',
  path: PAGE_PATH,
})

// This is the page we want ranking for "acoustic panel(s) singapore" and "acoustic panel supplier"
// (Search Console, Aug–Nov 2026: ~3,200 impressions a quarter, all landing on the homepage). It covers
// every space type; the space-specific pages (offices, studios…) stay the deeper option.
const config: PaidSearchPageConfig = {
  eyebrow: 'Acoustic Panels Singapore',
  title: 'Acoustic panels, supplied and installed for you.',
  summary: 'We plan, make and install fabric acoustic panels for offices, studios, restaurants, churches, schools and homes across Singapore. You tell us what bothers you; we handle the rest.',
  projectCategory: 'office-spaces',
  projectSlugs: ['amazon-office-meeting-room', 'schola-pilates-studio', 'acqua-e-farina', 'leng-kwang-baptist-church', 'mixing-studio', 'home-theatre-2'],
  spaceLabel: 'space',
  whatsappText: 'Hi Just Acoustics, I would like a free quote for acoustic panels.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  soundproofing: {
    fixes: 'echo inside the room, so speech, calls and music sound clear instead of hollow.',
    doesNot: 'noise coming in from neighbours, the next room or traffic. That needs work on walls, doors or windows.',
  },
  problemTitle: 'Hard walls, glass and tiles keep sound bouncing.',
  problems: [
    'Meetings and calls sound hollow, and people repeat themselves.',
    'Diners or customers have to raise their voices to be heard.',
    'Music, sermons or lessons sound muddy at the back of the room.',
    'A few panels bought online made little difference.',
  ],
  approachTitle: 'From room photos to panels on your wall.',
  approach: [
    { title: 'Send photos of the space', copy: 'Tell us how the room is used and what bothers you. Photos and rough sizes are enough to start.' },
    { title: 'We plan the panels', copy: 'We choose the number, size, colour and spots for the panels so they take out the most echo and suit the space.' },
    { title: 'We make and install them', copy: 'Panels are made to order in your sizes and colours, and our team installs them neatly and cleans up after.' },
  ],
  pricing: 'Panels are from S$185 each, supplied and installed. Most home rooms fall around S$1,000–S$3,000 and meeting rooms start from about S$2,500. Larger spaces and ceiling panels are quoted after we see the room.',
  proof: ['Panels sized and placed for your room', 'Wall and ceiling panels', 'Many colours, sizes and prints', 'Installed across Singapore'],
  faq: [
    { q: 'How much do acoustic panels cost in Singapore?', a: 'Our fabric panels start from S$185 each, supplied and installed. The total depends on how many panels the room needs, the sizes and whether any go on the ceiling. The estimator above gives a typical range for your space in a minute.' },
    { q: 'Are you an acoustic panel supplier or an installer?', a: 'Both. We make the panels to order in your sizes and colours, then install them. Businesses and contractors can also order panels supply-only.' },
    { q: 'What types of acoustic panels do you have?', a: 'Fabric-wrapped wall panels with straight or bevelled edges, ceiling panels and clouds, white melamine ceiling panels, printed art panels and bass traps for studios.' },
    { q: 'How many acoustic panels do I need?', a: 'It depends on the room size, the hard surfaces and how the space is used. Photos and rough sizes are enough for us to give you a first answer.' },
    { q: 'Do acoustic panels soundproof a room?', a: 'No. They take out echo inside the room. Stopping noise from neighbours or the next room needs work on walls, doors or windows.' },
    { q: 'How long does it take?', a: 'Panels are made to order, usually 4 to 6 weeks. Most installs take one to two days, and we can work after hours for offices and restaurants.' },
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
        estimator={<PriceEstimator compact id="estimator" />}
      />
    </>
  )
}
