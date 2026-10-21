import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/LazyPriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 86400

const PAGE_PATH = '/school-acoustic-treatment'

export const metadata: Metadata = pageMetadata({
  title: 'School, Classroom & Dance Studio Acoustics Singapore',
  description: 'Echoey classroom, music school or dance studio? We install acoustic panels across Singapore so students hear clearly. Free quote, reply within 1 hour.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Schools, Academies & Dance Studios',
  title: 'Echoey classroom or studio? Help every student hear clearly.',
  summary: 'We install acoustic panels in Singapore classrooms, tuition centres, music schools and dance studios, around your lesson times.',
  projectCategory: 'schools',
  projectSlugs: ['the-nuggets-academy', 'pei-school-of-dance', 'vibratone-academy', 'bhaskars-arts-academy', 'concentricheal'],
  preferReviewsFrom: ['Concentricheal'],
  spaceLabel: 'classroom or studio',
  whatsappText: 'Hi Just Acoustics, I would like a free quote to fix the echo in our classroom / studio.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  soundproofing: {
    fixes: 'echo inside the classroom or studio, so the teacher is clear and music sounds clean.',
    doesNot: 'sound from the next room or your neighbours. Blocking that needs changes to walls, doors or ceilings.',
  },
  problemTitle: 'Hard walls, mirrors and floors make every lesson loud.',
  problems: [
    'Students at the back struggle to hear the teacher.',
    'Teachers raise their voices all day and go home tired.',
    'Music in dance and music rooms sounds harsh and boomy.',
    'Group work and halls get loud very quickly.',
  ],
  approachTitle: 'How we fix your rooms, start to finish.',
  approach: [
    { title: 'Look at your rooms', copy: 'Send photos or a short video. We look at the rooms with the worst echo and how you use each one.' },
    { title: 'Tough panels in the right spots', copy: 'Wall or ceiling panels placed where they soak up the most echo, in finishes that suit a busy space.' },
    { title: 'We install around lessons', copy: 'Our team works around your timetable or the school holidays, room by room if needed.' },
  ],
  pricing: 'Classrooms, tuition rooms and music rooms start from about S$1,000. Dance studios, halls and multi-room projects are quoted on the number of rooms and their size.',
  proof: ['Classrooms, music rooms and dance studios', 'Wall and ceiling options', 'Many colours and finishes', 'Several rooms done in stages'],
  faq: [
    { q: 'Will panels stop noise from the next room?', a: 'No. Panels soak up echo inside the room, which makes speech and music clearer. Blocking sound between rooms needs changes to walls, doors or ceilings.' },
    { q: 'Can you work in the school holidays or after lessons?', a: 'Yes. We agree the install time with you when we quote.' },
    { q: 'Can you do several rooms?', a: 'Yes. We can start with the worst rooms and do the rest in stages to suit your budget.' },
    { q: 'How long does it take?', a: 'Panels are made to order, usually 4 to 6 weeks. Most installs take one to two days.' },
  ],
}

export default async function Page() {
  const data = await getPaidSearchData()
  const jsonLd = serviceJsonLd({
    name: 'School and classroom acoustic treatment in Singapore',
    description: config.summary,
    path: PAGE_PATH,
    minPrice: minPriceForService('school'),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PaidSearchLandingPage
        config={config}
        {...data}
        relatedLinks={SPACE_LINKS_BY_SERVICE.school}
        estimator={<PriceEstimator defaultSpace="school" compact id="estimator" />}
      />
    </>
  )
}
