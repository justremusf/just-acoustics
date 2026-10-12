/*
 * Wording, icons and case-study photos for the price estimator quiz
 * (components/estimator/PriceEstimator.tsx). Prices stay in lib/priceGuide.ts: each answer here
 * maps onto one of its size bands, so the estimate is unchanged; only the questions speak the
 * visitor's language ("4–8 seat meeting room" instead of "15–40 m²").
 *
 * Space order follows won revenue in Bigin (102 Closed Won deals, checked 12 Oct 2026):
 * studios S$44.7k, offices S$42.0k, churches S$38.7k, schools/academies S$33.5k,
 * homes S$30.3k, restaurants S$23.3k. Keep SPACE_TYPES in lib/priceGuide.ts in the same order.
 *
 * Case photos are each project's main image in Sanity, picked to match the answer.
 */
import type { SizeBandSlug } from '@/lib/priceGuide'

export type QuizIcon =
  | 'mic' | 'headphones' | 'music' | 'drum'
  | 'briefcase' | 'phone' | 'users' | 'presentation' | 'building'
  | 'church' | 'landmark'
  | 'graduation' | 'book' | 'school'
  | 'sofa' | 'house' | 'theater'
  | 'utensils' | 'coffee' | 'store'

export type QuizCase = {
  /** /projects/[slug] */
  slug: string
  title: string
  image: string
}

export type QuizSizeOption = {
  band: SizeBandSlug
  label: string
  detail: string
  icon: QuizIcon
  example: QuizCase
}

export type QuizSpace = {
  /** Space slug in lib/priceGuide.ts */
  slug: string
  label: string
  icon: QuizIcon
  sizeQuestion: string
  sizes: QuizSizeOption[]
}

const SANITY = 'https://cdn.sanity.io/images/8h1saua8/production/'
const project = (slug: string, title: string, file: string): QuizCase => ({ slug, title, image: SANITY + file })

const CASES = {
  podcast: project('podcast-studio', 'Podcast Studio', 'd32b28ab79bc8105b17cd63e2a61e0318fccaf79-768x527.jpg'),
  guitar: project('guitar-practice-studio', 'Guitar Practice Studio', '508fc3c6c13fb4960780eedc6586f39d87f44b08-768x527.jpg'),
  jam: project('jam-studio', 'Jam Studio', 'd9f0d1e90efb9253c2a256ba5655a3cf7ee7ca76-768x527.jpg'),
  mixing: project('mixing-recording-studio', 'Mixing & Recording Studio', '192cc24cf041ebe95de42cef7283bc5bd05e4c96-768x527.jpg'),
  hoogwegt: project('hoogwegt', 'Hoogwegt', '67d18e588e7a99c5cab1f13d83f7a218799b32e8-768x527.jpg'),
  wsg: project('workforce-singapore', 'Workforce Singapore', 'd7e5d53f362aa6391f3a364b7ff722e6c248d659-768x527.jpg'),
  cai: project('capital-asia-investments', 'Capital Asia Investments', '2743400b3e143a2a60027e73eb8f65e104100c7e-768x527.png'),
  mortgageHub: project('mortgage-hub', 'Mortgage Hub', 'de240ce037da350cae1bb48f07e94ab00e114ea3-768x527.png'),
  ppcoc: project('pasir-pajang-church-of-christ', 'Pasir Panjang Church of Christ', 'ed9cd13ccc7df02cd21c23044fc683aeed5bde1d-6000x3376.jpg'),
  lengKwang: project('leng-kwang-baptist-church', 'Leng Kwang Baptist Church', '7bb3fc81daef1cb90b641a37ee344a8ff770a4ab-768x527.jpg'),
  vibratone: project('vibratone-academy', 'Vibratone Academy', 'dac8942a647eabb1ec0ef733999cc45e2a5d55f2-768x527.jpg'),
  nuggets: project('the-nuggets-academy', 'The Nuggets Academy', '6231458231bf3d7d3a1f919eafb1c2812a1e9e24-768x527.jpg'),
  pei: project('pei-school-of-dance', 'Pei School of Dance', '8522c015e02c624d3f4358b8e44f1a0bd1785546-768x527.jpg'),
  bhaskar: project('bhaskars-arts-academy', "Bhaskar's Arts Academy", 'e3990704489bcf68cae80ab8aac5c8fc2840d928-768x527.jpg'),
  homeOffice: project('home-office', 'Home Office', '3e57d2c3aed1060ea62036bc02a37e28f97287de-768x527.jpg'),
  livingRoom: project('home-theatre-2', 'Living Room & Home Theatre', '62756dbe1851d9c2ed90108011d2cd98b2c26525-768x527.jpg'),
  homeTheatre: project('home-theatre', 'Home Theatre', '8bdecdf57d9018dd2b0b21f7c0cecfe307de9ce1-768x527.jpg'),
  acqua: project('acqua-e-farina', 'Acqua E Farina', '34c04a15d9638790ce16ac028132f9d5d8d60813-768x527.jpg'),
  dough: project('dough-cafe', 'Dough Cafe', '5ff312559126f72a7ba8a9942cdcbe6efd921576-768x527.jpg'),
  ppp: project('ppp-coffee-new-bahru', 'PPP Coffee (New Bahru)', '55eb414f74ed1508cc5c689dcd9fa354136b32e4-768x527.jpg'),
} satisfies Record<string, QuizCase>

export const QUIZ_SPACES: QuizSpace[] = [
  {
    slug: 'home-studio',
    label: 'Studio',
    icon: 'mic',
    sizeQuestion: 'What kind of studio is it?',
    sizes: [
      { band: 'small', label: 'Vocal booth or podcast corner', detail: 'One person, small room', icon: 'mic', example: CASES.podcast },
      { band: 'medium', label: 'Bedroom studio or music room', detail: 'HDB or condo bedroom', icon: 'headphones', example: CASES.guitar },
      { band: 'large', label: 'Band or drum room', detail: 'Full kit, rehearsals, jamming', icon: 'drum', example: CASES.jam },
      { band: 'very-large', label: 'Commercial studio', detail: 'Live room, control room or several rooms', icon: 'music', example: CASES.mixing },
    ],
  },
  {
    slug: 'office',
    label: 'Office',
    icon: 'briefcase',
    sizeQuestion: 'Which room needs fixing?',
    sizes: [
      { band: 'small', label: 'Phone booth or 1–2 person room', detail: 'Calls, focus room, small office', icon: 'phone', example: CASES.hoogwegt },
      { band: 'medium', label: 'Meeting room, 4–8 seats', detail: 'Video calls, team meetings', icon: 'users', example: CASES.wsg },
      { band: 'large', label: 'Boardroom, 10–20 seats', detail: 'Or a training room', icon: 'presentation', example: CASES.cai },
      { band: 'very-large', label: 'Open office or whole floor', detail: 'Or several rooms at once', icon: 'building', example: CASES.mortgageHub },
    ],
  },
  {
    slug: 'church',
    label: 'Church or hall',
    icon: 'church',
    sizeQuestion: 'How many people does it seat?',
    sizes: [
      { band: 'small', label: 'Up to 50 people', detail: 'Youth room, chapel, fellowship room', icon: 'users', example: CASES.ppcoc },
      { band: 'medium', label: '50–150 people', detail: 'Multi-purpose or worship hall', icon: 'church', example: CASES.lengKwang },
      { band: 'large', label: '150–400 people', detail: 'Main sanctuary', icon: 'landmark', example: CASES.lengKwang },
      { band: 'very-large', label: '400+ people', detail: 'Large sanctuary or auditorium', icon: 'landmark', example: CASES.ppcoc },
    ],
  },
  {
    slug: 'school',
    label: 'School or academy',
    icon: 'graduation',
    sizeQuestion: 'What kind of room is it?',
    sizes: [
      { band: 'small', label: 'Music or tuition room, 1–6 students', detail: 'Lessons, practice, small groups', icon: 'music', example: CASES.vibratone },
      { band: 'medium', label: 'Classroom, 20–30 students', detail: 'Standard classroom', icon: 'book', example: CASES.nuggets },
      { band: 'large', label: 'Dance, pilates or activity studio', detail: 'Large open room, mirrors, hard floors', icon: 'graduation', example: CASES.pei },
      { band: 'very-large', label: 'School hall or several rooms', detail: 'Auditorium, canteen or a whole centre', icon: 'school', example: CASES.bhaskar },
    ],
  },
  {
    slug: 'home',
    label: 'Home',
    icon: 'sofa',
    sizeQuestion: 'Which part of your home?',
    sizes: [
      { band: 'small', label: 'Bedroom or study', detail: 'Home office, WFH calls', icon: 'briefcase', example: CASES.homeOffice },
      { band: 'medium', label: 'Living room', detail: 'HDB or condo living area', icon: 'sofa', example: CASES.livingRoom },
      { band: 'large', label: 'Home theatre or living + dining', detail: 'Hi-fi, cinema, open-plan', icon: 'theater', example: CASES.homeTheatre },
      { band: 'very-large', label: 'Whole home or landed property', detail: 'Several rooms at once', icon: 'house', example: CASES.livingRoom },
    ],
  },
  {
    slug: 'restaurant',
    label: 'Restaurant or café',
    icon: 'utensils',
    sizeQuestion: 'How many diners does it seat?',
    sizes: [
      { band: 'small', label: 'Up to 20 seats', detail: 'Café, kiosk, small eatery', icon: 'coffee', example: CASES.acqua },
      { band: 'medium', label: '20–50 seats', detail: 'Neighbourhood restaurant or café', icon: 'utensils', example: CASES.dough },
      { band: 'large', label: '50–100 seats', detail: 'Busy restaurant or bar', icon: 'store', example: CASES.ppp },
      { band: 'very-large', label: '100+ seats', detail: 'Large venue, food hall or event space', icon: 'store', example: CASES.ppp },
    ],
  },
]

export function findQuizSpace(slug: string | null | undefined) {
  return QUIZ_SPACES.find((space) => space.slug === slug)
}
