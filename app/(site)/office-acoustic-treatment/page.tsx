import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/LazyPriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 86400

const PAGE_PATH = '/office-acoustic-treatment'

export const metadata: Metadata = pageMetadata({
  title: 'Office Acoustic Panels Singapore: Stop Meeting Room Echo',
  description: 'Echoey meeting room or office? We install acoustic wall and ceiling panels across Singapore so calls and meetings sound clear. Free quote, reply within 1 hour.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Offices & Meeting Rooms',
  title: 'Echoey meeting room? Make calls and meetings clear again.',
  summary: 'We install acoustic panels on the walls and ceiling of Singapore offices. Voices stop bouncing around, so people hear each other in the room and on video calls.',
  projectCategory: 'office-spaces',
  preferReviewsFrom: ['Mortgage Hub'],
  spaceLabel: 'office',
  whatsappText: 'Hi Just Acoustics, I would like a free quote to fix the echo in our office / meeting room.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  soundproofing: {
    fixes: 'echo inside the meeting room or office, so voices are clear and the room feels calmer.',
    doesNot: 'people outside the room hearing your meeting. Keeping talk private needs sealed doors, walls or partitions.',
  },
  problemTitle: 'Glass, concrete and open ceilings make voices bounce.',
  problems: [
    'Voices overlap and blur in meeting rooms.',
    'People on video calls say you sound far away or hollow.',
    'Open areas get loud and tiring as more people come in.',
    'People raise their voices just to be heard across the table.',
  ],
  approachTitle: 'How we fix your office, start to finish.',
  approach: [
    { title: 'Start with the worst rooms', copy: 'Send photos or a short video. We pick the meeting rooms, call rooms and shared areas that need it most.' },
    { title: 'Plan around your fit-out', copy: 'We place wall or ceiling panels where they soak up the most echo, clear of lights, aircon and sprinklers.' },
    { title: 'We install, you keep working', copy: 'Our team puts the panels up, after office hours if you need, so meetings are not disturbed.' },
  ],
  pricing: 'Regular offices, meeting rooms and call rooms commonly fall around S$1,000–S$3,000. Multi-room or high-ceiling projects are quoted by scope.',
  proof: ['Made for meeting rooms and video calls', 'Many colours and finishes', 'Wall and ceiling panels', 'Site visit when needed'],
  faq: [
    { q: 'Will panels stop people outside hearing our meetings?', a: 'No. Panels soak up echo inside the room, so speech is clearer and the room is calmer. Keeping talk private needs sealed doors, walls or partitions.' },
    { q: 'Can you install after office hours?', a: 'Yes. We agree the install time with you when we quote.' },
    { q: 'Can you do several rooms?', a: 'Yes. We can start with the worst rooms and do the rest in stages to suit your budget.' },
    { q: 'How long does it take?', a: 'Panels are made to order, usually 4 to 6 weeks. Most installs take one to two days.' },
  ],
}

export default async function Page() {
  const data = await getPaidSearchData()
  const jsonLd = serviceJsonLd({
    name: 'Office acoustic treatment in Singapore',
    description: config.summary,
    path: PAGE_PATH,
    minPrice: minPriceForService('office'),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PaidSearchLandingPage
        config={config}
        {...data}
        relatedLinks={SPACE_LINKS_BY_SERVICE.office}
        estimator={<PriceEstimator defaultSpace="office" compact id="estimator" />}
      />
    </>
  )
}
