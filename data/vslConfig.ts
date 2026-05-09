export type VSLCheckpoint = {
  label: string
  at: number
}

export type VSLIntro = {
  title: string
  eyebrow?: string
  description?: string
  panelLabel?: string
  panelCopy?: string
  videoMp4: string
  videoWebm?: string
  poster: string
  pauseAtEnd: boolean
}

export type VSLCategory = {
  id: string
  label: string
  shortLabel: string
  videoMp4: string
  videoWebm?: string
  poster: string
  pricingSnippet: string
  ctaLabel: string
  ctaHref: string
  checkpoints: VSLCheckpoint[]
}

export type InteractiveVSLConfig = {
  intro: VSLIntro
  categories: VSLCategory[]
}

const defaultCheckpoints: VSLCheckpoint[] = [
  { label: 'Intro', at: 0 },
  { label: 'Space Selected', at: 0.08 },
  { label: 'Pricing', at: 0.38 },
  { label: 'Process', at: 0.68 },
  { label: 'Quote', at: 0.92 },
]

const commonCategories: VSLCategory[] = [
  {
    id: 'office',
    label: 'Office',
    shortLabel: 'Office',
    // Replace MVP files with compressed H.264 MP4s in /public/media/vsl/.
    videoMp4: '/media/vsl/space-types/office.mp4',
    videoWebm: '/media/vsl/space-types/office.webm',
    poster: '/assets/webflow/6987425edf801a5d999fb496_8.png',
    pricingSnippet: 'Typical meeting room projects start from S$2,500.',
    ctaLabel: 'Get a free quote',
    ctaHref: '/contact',
    checkpoints: defaultCheckpoints,
  },
  {
    id: 'home-studio',
    label: 'Home studio',
    shortLabel: 'Home studio',
    videoMp4: '/media/vsl/space-types/home-studio.mp4',
    videoWebm: '/media/vsl/space-types/home-studio.webm',
    poster: '/assets/webflow/696a4efbb798931f99abbc38_1.avif',
    pricingSnippet: 'Home studio and listening room packages usually start from S$3,500.',
    ctaLabel: 'Get a free quote',
    ctaHref: '/contact',
    checkpoints: defaultCheckpoints,
  },
  {
    id: 'church',
    label: 'Church',
    shortLabel: 'Church',
    videoMp4: '/media/vsl/space-types/church.mp4',
    videoWebm: '/media/vsl/space-types/church.webm',
    poster: '/assets/webflow/69687c96d1feff52c5d91be4_3.avif',
    pricingSnippet: 'Church and hall treatments commonly range from S$15,000 to S$40,000+.',
    ctaLabel: 'Get a free quote',
    ctaHref: '/contact',
    checkpoints: defaultCheckpoints,
  },
  {
    id: 'school',
    label: 'School',
    shortLabel: 'School',
    videoMp4: '/media/vsl/space-types/school.mp4',
    videoWebm: '/media/vsl/space-types/school.webm',
    poster: '/assets/webflow/6987425e65e679ade375ee17_13.png',
    pricingSnippet: 'Classroom and education spaces are quoted by room count, finish, and install access.',
    ctaLabel: 'Get a free quote',
    ctaHref: '/contact',
    checkpoints: defaultCheckpoints,
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    shortLabel: 'Restaurant',
    videoMp4: '/media/vsl/space-types/restaurant.mp4',
    videoWebm: '/media/vsl/space-types/restaurant.webm',
    poster: '/assets/webflow/69687b1239333b922d70b26a_Title.avif',
    pricingSnippet: 'Restaurant treatments are scoped around guest comfort, speech clarity, and service flow.',
    ctaLabel: 'Get a free quote',
    ctaHref: '/contact',
    checkpoints: defaultCheckpoints,
  },
  {
    id: 'other',
    label: 'Other',
    shortLabel: 'Other',
    videoMp4: '/media/vsl/space-types/other.mp4',
    videoWebm: '/media/vsl/space-types/other.webm',
    poster: '/assets/webflow/69687d6c4e41c7a3a58f9107_Title.avif',
    pricingSnippet: 'Other acoustic projects are scoped based on use case, room size, finish, and installation access.',
    ctaLabel: 'Get a free quote',
    ctaHref: '/contact',
    checkpoints: defaultCheckpoints,
  },
]

export const landingVslConfig: InteractiveVSLConfig = {
  intro: {
    title: 'A founder-led walkthrough for choosing the right acoustic treatment.',
    eyebrow: 'Interactive VSL',
    panelLabel: 'Founder intro',
    panelCopy: 'Start with the founder overview, then choose the room closest to yours.',
    description:
      'Watch the short intro, choose your space, then get the specific treatment path, price range, process, and next step.',
    videoMp4: '/media/vsl/intro/founder-intro.mp4',
    videoWebm: '/media/vsl/intro/founder-intro.webm',
    poster: '/assets/webflow/6963a1ddcb30aae76c452853_Image%20from%20TinyPNG.webp',
    pauseAtEnd: false,
  },
  categories: commonCategories,
}

export const pricingVslConfig: InteractiveVSLConfig = {
  intro: {
    title: 'See how pricing changes by room type before you request a quote.',
    eyebrow: 'Pricing VSL',
    panelLabel: 'Pricing intro',
    panelCopy: 'Start with the quick pricing overview, then choose the room closest to yours.',
    description:
      'Choose the space closest to yours for a quick pricing explanation without using a complex calculator.',
    videoMp4: '/media/vsl/intro/founder-intro.mp4',
    videoWebm: '/media/vsl/intro/founder-intro.webm',
    poster: '/assets/webflow/6987425ee946da6b4ca8ef31_5.png',
    pauseAtEnd: true,
  },
  categories: commonCategories.map((category) => ({
    ...category,
    ctaLabel: 'Get a free quote',
  })),
}
