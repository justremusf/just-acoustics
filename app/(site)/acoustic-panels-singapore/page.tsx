import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import { canonicalPath } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Acoustic Panels Singapore — Supply & Installation',
  description: 'Acoustic wall and ceiling panels for echo control in Singapore. Get product, layout and installation guidance for your room.',
  alternates: { canonical: canonicalPath('/acoustic-panels-singapore') },
}

const config: PaidSearchPageConfig = {
  eyebrow: 'Acoustic Panels Singapore',
  title: 'Choose panels for the room—not just the wall.',
  summary: 'We help you select the right panel type, coverage and placement to reduce echo without making the space look improvised.',
  heroImage: '/assets/shop/standard-flexi/gallery/flexi-gallery-1.webp',
  heroAlt: 'Fabric acoustic panels installed on a wall',
  problemTitle: 'Panels work when placement and coverage match the room.',
  problems: ['Speech sounds blurred because reflections arrive after the original voice.', 'Hard walls, glass and ceilings keep sound energy circulating.', 'Buying too few decorative panels produces little audible change.', 'Treating random areas can miss the strongest reflection paths.'],
  approachTitle: 'From room photos to a treatment layout.',
  approach: [
    { title: 'Review the room', copy: 'We assess dimensions, surfaces, use case and the sound problem you actually notice.' },
    { title: 'Select treatment', copy: 'We recommend wall panels, ceiling treatment or bass control in suitable sizes and finishes.' },
    { title: 'Supply or install', copy: 'Choose self-install guidance or professional installation with a documented layout.' },
  ],
  pricing: 'Most smaller room and office projects start around S$1,000–S$3,000. Larger spaces and ceiling installations are scoped separately.',
  proof: ['Fabric, PET, custom print and ceiling options', 'Room-specific coverage guidance', 'Professional Singapore installation', 'Acoustic treatment explained separately from soundproofing'],
  faq: [
    { question: 'How many acoustic panels do I need?', answer: 'It depends on room volume, reflective surfaces and use. Photos and dimensions are enough for an initial coverage recommendation.' },
    { question: 'Do acoustic panels soundproof a room?', answer: 'No. They reduce reflections and echo inside the room. Soundproofing requires changes to walls, doors, windows or ceilings.' },
    { question: 'Can the panels match our interior?', answer: 'Yes. Fabric colours, sizes, print finishes and ceiling formats can be selected around the interior.' },
  ],
}

export default function Page() { return <PaidSearchLandingPage config={config} /> }

