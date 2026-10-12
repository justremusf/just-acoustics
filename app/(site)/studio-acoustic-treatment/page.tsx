import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/LazyPriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 3600

const PAGE_PATH = '/studio-acoustic-treatment'

export const metadata: Metadata = pageMetadata({
  title: 'Studio Acoustic Panels Singapore: Recording, Podcast & Music',
  description: 'Recordings sound echoey or boxy? We install acoustic panels in recording, podcast, music and home studios across Singapore. Free quote, reply within 1 hour.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Recording, Podcast & Music Studios',
  title: 'Recordings sound echoey? Fix the room, not just the mic.',
  summary: 'We install acoustic panels in recording studios, podcast rooms, music practice rooms and home studios across Singapore, so what you hear is what you record.',
  projectCategory: 'studios-homes',
  // Studio jobs only: the 'studios-homes' category also holds living rooms and home theatres.
  projectSlugs: [
    'mixing-recording-studio',
    'podcast-studio',
    'music-studio',
    'jam-studio',
    'mixing-studio',
    'drum-practice-room',
    'guitar-practice-studio',
    'podcast-office',
    'home-office-studio',
  ],
  spaceLabel: 'studio',
  whatsappText: 'Hi Just Acoustics, I would like a free quote for acoustic panels in my studio.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  soundproofing: {
    fixes: 'echo and boomy bass inside your studio, so voices and instruments sound clean on the recording.',
    doesNot: 'drums or amps reaching the neighbours, or outside noise getting onto your track. That needs a room built for it.',
  },
  problemTitle: 'Small rooms with bare walls make every take sound boxy.',
  problems: [
    'Vocals and podcasts sound echoey, like you are in a bathroom.',
    'Mixes sound fine in the room but wrong everywhere else.',
    'Bass booms in some spots and vanishes in others.',
    'Drums and guitars sound harsh and ring after every hit.',
  ],
  approachTitle: 'From room photos to a studio that sounds right.',
  approach: [
    { title: 'Tell us about your room', copy: 'Send photos or a short video and tell us what you record or play. Rough room sizes are enough to start.' },
    { title: 'We plan the panels', copy: 'We choose wall, ceiling and thick corner panels and where they go, so they soak up the echo where it matters.' },
    { title: 'We install them', copy: 'Our team puts the panels up neatly, so you can get back to recording.' },
  ],
  pricing: 'Podcast corners and bedroom studios commonly fall around S$1,000–S$3,500. Band and drum rooms start from about S$3,500. Commercial studios are quoted after a site visit.',
  proof: ['Recording, podcast and music rooms', 'Wall, ceiling and corner panels', 'Many colours and finishes', 'Site visit for larger studios'],
  faq: [
    { q: 'Will panels stop my drums bothering the neighbours?', a: 'No. Panels soak up echo inside the room so it sounds better. Keeping sound in needs a room built for it, with heavy walls and sealed doors.' },
    { q: 'Is foam from the internet enough?', a: 'Thin foam takes out some high echo but leaves the boomy bass. Thicker panels in the right spots fix more of the problem. We plan and install them for you.' },
    { q: 'Can you do a podcast or video room in an office?', a: 'Yes. We have done podcast rooms in offices and homes. Send us photos and we will tell you what it needs.' },
    { q: 'How long does it take?', a: 'Panels are made to order, usually 4 to 6 weeks. Most installs take one to two days.' },
  ],
}

export default async function Page() {
  const data = await getPaidSearchData()
  const jsonLd = serviceJsonLd({
    name: 'Studio acoustic treatment in Singapore',
    description: config.summary,
    path: PAGE_PATH,
    minPrice: minPriceForService('studio'),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PaidSearchLandingPage
        config={config}
        {...data}
        relatedLinks={SPACE_LINKS_BY_SERVICE.studio}
        estimator={<PriceEstimator defaultSpace="home-studio" compact id="estimator" />}
      />
    </>
  )
}
