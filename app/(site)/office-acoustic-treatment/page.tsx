import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/PriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { canonicalPath } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Office Acoustic Treatment Singapore',
  description: 'Reduce meeting-room and office echo with practical wall and ceiling acoustic treatment designed for Singapore workplaces.',
  alternates: { canonical: canonicalPath('/office-acoustic-treatment') },
}

const config: PaidSearchPageConfig = {
  eyebrow: 'Offices & Meeting Rooms',
  title: 'Echoey meeting rooms? Get clear calls and conversations.',
  summary: 'Wall and ceiling acoustic panels for Singapore offices, so speech is clear in the room and on video calls.',
  projectCategory: 'office-spaces',
  spaceLabel: 'office',
  whatsappText: 'Hi Just Acoustics, I would like a free consultation for echo in our office / meeting room.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  problemTitle: 'Glass, concrete and open layouts make speech hard to follow.',
  problems: [
    'Voices overlap and blur in meeting rooms.',
    'Video calls sound hollow or distant to people on the other end.',
    'Open areas get tiring and noisy as more people come in.',
    'People raise their voices just to be heard across the table.',
  ],
  approachTitle: 'A treatment plan built around how your office works.',
  approach: [
    { title: 'Identify priority rooms', copy: 'Start with the meeting rooms, call rooms and shared areas causing the most trouble.' },
    { title: 'Design around the fit-out', copy: 'Place wall or ceiling panels where they make a real difference, without clashing with lights, aircon or sprinklers.' },
    { title: 'Install around your schedule', copy: 'Plan access and install times so staff and meetings are disrupted as little as possible.' },
  ],
  pricing: 'Regular offices, meeting rooms and call rooms commonly fall around S$1,000–S$3,000. Multi-room or high-ceiling projects are quoted by scope.',
  proof: ['Meeting-room and video-call focus', 'Colour and finish options', 'Wall and ceiling treatment', 'Site assessment when required'],
  faq: [
    { q: 'Will panels improve meeting-room privacy?', a: 'They reduce echo, which makes speech clearer and the room more comfortable. Keeping conversations confidential may also need sealing, partitions or sound masking.' },
    { q: 'Can work happen after office hours?', a: 'Yes. Access timing and installation constraints are included when we scope the project.' },
    { q: 'Can you treat several rooms?', a: 'Yes. We can prioritise rooms and phase a multi-room rollout around budget and day-to-day operations.' },
    { q: 'How long does installation take?', a: 'Most installs are completed in one to two days. Panels are made to order, with a standard lead time of 4 to 6 weeks.' },
  ],
}

export default async function Page() {
  const data = await getPaidSearchData()
  return <PaidSearchLandingPage config={config} {...data} estimator={<PriceEstimator defaultSpace="office" compact id="estimator" />} />
}
