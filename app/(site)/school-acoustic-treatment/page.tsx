import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/PriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 60

const PAGE_PATH = '/school-acoustic-treatment'

export const metadata: Metadata = pageMetadata({
  title: 'School & Classroom Acoustics Singapore',
  description: 'Reduce classroom echo so students can hear the teacher clearly. Acoustic wall and ceiling treatment for Singapore schools and tuition centres.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Schools & Classrooms',
  title: 'Noisy, echoey classrooms? Help every student hear the teacher.',
  summary: 'Acoustic wall and ceiling treatment for Singapore classrooms, tuition rooms and multipurpose halls.',
  projectCategory: 'schools',
  spaceLabel: 'classroom',
  whatsappText: 'Hi Just Acoustics, I would like a free consultation for echo in our classroom / school.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  problemTitle: 'Hard surfaces turn every lesson into a noisy room.',
  problems: [
    'Students at the back struggle to hear the teacher clearly.',
    'Teachers raise their voices all day and end up tired.',
    'Group work quickly gets loud and hard to manage.',
    'Halls and multipurpose rooms echo during talks and events.',
  ],
  approachTitle: 'A treatment plan that fits how the school runs.',
  approach: [
    { title: 'Review the rooms', copy: 'Look at the classrooms, tuition rooms or halls with the worst echo, and how each one is used.' },
    { title: 'Design durable coverage', copy: 'Place wall or ceiling panels where they cut echo the most, in finishes that suit a busy learning space.' },
    { title: 'Install around lessons', copy: 'Schedule work around timetables and school holidays, and phase multi-room rollouts.' },
  ],
  pricing: 'Classrooms, tuition rooms and learning spaces start from about S$1,000. Larger rooms or multi-room rollouts are quoted based on room count and treatment scope.',
  proof: ['Classroom and hall treatment', 'Wall and ceiling options', 'Colour and finish options', 'Multi-room rollouts phased by priority'],
  faq: [
    { q: 'Will panels stop noise from the next classroom?', a: 'No. Panels reduce echo inside the room, which makes speech clearer. Blocking sound between rooms needs changes to walls, doors or ceilings.' },
    { q: 'Can you work during school holidays or after lessons?', a: 'Yes. Access timing and installation constraints are agreed when we scope the project.' },
    { q: 'Can you treat several classrooms?', a: 'Yes. We can prioritise rooms and phase the rollout around budget and the school calendar.' },
    { q: 'How long does installation take?', a: 'Most installs are completed in one to two days. Panels are made to order, with a standard lead time of 4 to 6 weeks.' },
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
