import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Restaurant Echo Reduction Singapore',
  description: 'Reduce harsh restaurant and venue echo with discreet acoustic wall and ceiling treatment in Singapore.',
  alternates: { canonical: canonicalPath('/restaurant-echo-reduction') },
}

const config: PaidSearchPageConfig = {
  eyebrow: 'Restaurants & Venues',
  title: 'A lively room should not feel exhausting.',
  summary: 'Acoustic treatment reduces reflections so guests can hold a conversation without the room becoming harsh as occupancy increases.',
  heroImage: '/assets/pricing/restaurant.jpg',
  heroAlt: 'Restaurant dining space with hard reflective finishes',
  problemTitle: 'Noise builds when every conversation reflects around the venue.',
  problems: ['Sound levels rise as guests speak over the existing noise.', 'Concrete, glass, tile and exposed ceilings reflect energy.', 'Music and speech become harsh instead of adding atmosphere.', 'Decorative fixes often lack enough coverage to change the room.'],
  approachTitle: 'Control reflections while protecting the venue design.',
  approach: [
    { title: 'Review operating conditions', copy: 'Assess layout, occupancy, finishes, ceiling access and the times when noise is worst.' },
    { title: 'Find discreet coverage', copy: 'Use ceiling, wall or custom-print treatments that contribute enough absorption without dominating the interior.' },
    { title: 'Schedule practical installation', copy: 'Coordinate access, protection and work timing around service hours.' },
  ],
  pricing: 'Restaurant and hospitality projects commonly range from S$2,000–S$6,000. Larger venues, custom finishes and difficult access are quoted separately.',
  proof: ['Discreet ceiling and wall options', 'Custom colours and prints', 'After-hours installation planning', 'Coverage designed around occupancy'],
  faq: [
    { question: 'Will acoustic panels make the restaurant silent?', answer: 'No. The aim is to reduce excessive reflections while keeping the room energetic and comfortable.' },
    { question: 'Can treatment be hidden?', answer: 'Often. Ceiling clouds, colour-matched panels and custom prints can integrate with the interior.' },
    { question: 'Can you install outside operating hours?', answer: 'Yes. Installation timing and access requirements are agreed during quoting.' },
  ],
}

export default function Page() { return <PaidSearchLandingPage config={config} /> }

