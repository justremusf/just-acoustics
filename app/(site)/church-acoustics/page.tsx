import type { Metadata } from 'next'
import { pageMetadata, serializeJsonLd, serviceJsonLd } from '@/lib/seo'
import { minPriceForService } from '@/lib/serviceLinks'
import ChurchLanderClient from './ChurchLanderClient'
import { CHURCH_FAQS } from './churchFaqs'

const PAGE_PATH = '/church-acoustics'

export const metadata: Metadata = pageMetadata({
  title: 'Church Acoustic Treatment Singapore',
  description:
    'Acoustic panels, ceiling clouds and custom print panels for churches, worship halls and event spaces in Singapore, so every word of the sermon is clear.',
  path: PAGE_PATH,
})

const jsonLd = [
  serviceJsonLd({
    name: 'Church acoustic treatment in Singapore',
    description:
      'Acoustic panels, ceiling clouds and custom print panels for churches, worship halls and event spaces in Singapore.',
    path: PAGE_PATH,
    minPrice: minPriceForService('church'),
  }),
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CHURCH_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  },
]

export default function ChurchLanderPage() {
  return (
    <>
      {jsonLd.map((item) => (
        <script key={item['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }} />
      ))}
      <ChurchLanderClient />
    </>
  )
}
