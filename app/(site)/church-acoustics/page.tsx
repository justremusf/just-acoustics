import type { Metadata } from 'next'
import PaidSearchLandingPage, { type PaidSearchPageConfig } from '@/components/ads/PaidSearchLandingPage'
import PriceEstimator from '@/components/estimator/LazyPriceEstimator'
import { getPaidSearchData } from '@/lib/paidSearchData'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService, SPACE_LINKS_BY_SERVICE } from '@/lib/serviceLinks'

export const revalidate = 86400

const PAGE_PATH = '/church-acoustics'

export const metadata: Metadata = pageMetadata({
  title: 'Church Acoustic Panels Singapore: Clear Sermons, Less Echo',
  description: 'Hard to hear the sermon? We install acoustic panels in churches, chapels and worship halls across Singapore so every word is clear. Free quote.',
  path: PAGE_PATH,
})

const config: PaidSearchPageConfig = {
  eyebrow: 'Churches & Worship Halls',
  title: 'Hard to hear the sermon? Clear up the echo in your church.',
  summary: 'We install acoustic panels on the walls and ceilings of Singapore churches, chapels and worship halls, so every word reaches the back row. Installed around your services.',
  projectCategory: 'churches',
  projectSlugs: ['leng-kwang-baptist-church', 'pasir-pajang-church-of-christ'],
  preferReviewsFrom: ['Church of Christ'],
  spaceLabel: 'church or hall',
  whatsappText: 'Hi Just Acoustics, I would like a free quote to fix the echo in our church / hall.',
  heroImage: '/assets/process/installation.webp',
  heroAlt: 'Just Acoustics team installing fabric wall panels on site',
  soundproofing: {
    fixes: 'echo inside the hall, so the sermon, singing and the sound system are clear in every row.',
    doesNot: 'worship music reaching the neighbours, or traffic noise getting in. That needs building work.',
  },
  problemTitle: 'High ceilings and hard walls make words run together.',
  problems: [
    'People at the back miss parts of the sermon.',
    'Turning up the sound system only makes it louder, not clearer.',
    'Worship music sounds muddy and harsh.',
    'Speakers and pastors feel tired from pushing their voice.',
  ],
  approachTitle: 'How we fix your hall, start to finish.',
  approach: [
    { title: 'Send photos or a video', copy: 'A short clip of someone speaking in the hall tells us a lot. For big halls we come and look.' },
    { title: 'Panels that suit your hall', copy: 'Wall and ceiling panels in colours that match your interior, or printed with your own artwork or verses.' },
    { title: 'We install around your services', copy: 'We plan the install around your services and events, so they go ahead as normal.' },
  ],
  pricing: 'Small halls and chapels start from about S$1,500. Many worship halls fall around S$4,000–S$6,000+. Large sanctuaries usually range from S$15,000–S$40,000+ and are quoted after a site visit.',
  proof: ['Sanctuaries, chapels and fellowship halls', 'Wall and ceiling panels', 'Colour-matched or printed panels', 'Site visit for large halls'],
  faq: [
    { q: 'Why is our church so echoey?', a: 'Most halls have high ceilings and hard walls, floors and glass. Sound bounces off them for a long time, so words run into each other.' },
    { q: 'Will members still feel the worship?', a: 'Yes. Panels soak up the extra echo but leave the room lively. You get clear words, not a dead room.' },
    { q: 'Will panels stop our music reaching the neighbours?', a: 'No. Panels fix the echo inside the hall. Keeping sound in needs work on walls, doors and windows.' },
    { q: 'How long does it take?', a: 'Panels are made to order, usually 4 to 6 weeks. Most installs take one to two days, and we work around your services.' },
  ],
}

export default async function Page() {
  const data = await getPaidSearchData()
  const jsonLd = serviceJsonLd({
    name: 'Church acoustic treatment in Singapore',
    description: config.summary,
    path: PAGE_PATH,
    minPrice: minPriceForService('church'),
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PaidSearchLandingPage
        config={config}
        {...data}
        relatedLinks={SPACE_LINKS_BY_SERVICE.church}
        estimator={<PriceEstimator defaultSpace="church" compact id="estimator" />}
      />
    </>
  )
}
