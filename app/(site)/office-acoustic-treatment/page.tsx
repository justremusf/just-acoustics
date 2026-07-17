import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Office Acoustic Treatment Singapore',
  description: 'Reduce meeting-room and office echo with practical wall and ceiling acoustic treatment designed for Singapore workplaces.',
  alternates: { canonical: canonicalPath('/office-acoustic-treatment') },
}

const config: PaidSearchPageConfig = {
  eyebrow: 'Office & Meeting Rooms',
  title: 'Clear meetings without fighting the room.',
  summary: 'Targeted acoustic treatment improves speech and video-call clarity while fitting the finishes and practical constraints of your office.',
  heroImage: '/assets/pricing/office.jpg',
  heroAlt: 'Modern office meeting space',
  problemTitle: 'Glass, concrete and open layouts make speech harder to follow.',
  problems: ['Voices overlap in meeting rooms after every sentence.', 'Video calls sound hollow or distant to remote participants.', 'Open collaboration areas become tiring when occupancy rises.', 'Privacy and echo are different problems and need different solutions.'],
  approachTitle: 'A focused treatment plan for how the office is used.',
  approach: [
    { title: 'Identify priority rooms', copy: 'Start with meeting rooms, call rooms and collaboration areas causing the most friction.' },
    { title: 'Design around the fit-out', copy: 'Place wall or ceiling absorption where it produces useful acoustic coverage without disrupting services.' },
    { title: 'Install around operations', copy: 'Plan access and installation to minimise disruption to staff and scheduled meetings.' },
  ],
  pricing: 'Regular offices, meeting rooms and call rooms commonly fall around S$1,000–S$3,000. Multi-room or high-ceiling projects are quoted by scope.',
  proof: ['Meeting-room and video-call focus', 'Colour and finish options', 'Wall and ceiling treatment', 'Site assessment when required'],
  faq: [
    { question: 'Will panels improve meeting-room privacy?', answer: 'They reduce reverberation, which can improve clarity and comfort. Confidential speech privacy may also require sealing, partitions or sound masking.' },
    { question: 'Can work happen after office hours?', answer: 'Yes. Access timing and installation constraints are included when scoping the project.' },
    { question: 'Can you treat several rooms?', answer: 'Yes. We can prioritise rooms and phase a multi-room rollout around budget and operational impact.' },
  ],
}

export default function Page() { return <PaidSearchLandingPage config={config} /> }

