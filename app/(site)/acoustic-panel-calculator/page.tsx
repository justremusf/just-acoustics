import type { Metadata } from 'next'
import FAQ, { type FaqItem } from '@/components/sections/FAQ'
import ContactCTA from '@/components/sections/ContactCTA'
import FadeUp from '@/components/ui/FadeUp'
import { canonicalPath, ORGANIZATION_ID, pageMetadata, serializeJsonLd } from '@/lib/seo'
import AcousticPanelCalculator from './AcousticPanelCalculator'

const PAGE_PATH = '/acoustic-panel-calculator'

export const metadata: Metadata = pageMetadata({
  title: 'Acoustic Panel Calculator Singapore',
  description:
    'How many acoustic panels do you need? Enter your room size and type for a panel range, S$165 installed pricing and where to put panels first.',
  path: PAGE_PATH,
})

const CALCULATOR_FAQS: FaqItem[] = [
  {
    q: 'How many acoustic panels do I need for my room?',
    a: 'Start by covering about 20–30% of your wall area, which is around 9–14 panels for a 6 × 4 m meeting room.',
  },
  {
    q: 'How does the calculator work out the panel count?',
    a: 'It takes your usable wall area, covers 20–30% of it, adjusts for room type and echo, then divides by panel size.',
  },
  {
    q: 'How much do acoustic panels cost in Singapore?',
    a: 'Panels are S$120 each plus S$45 to install, so S$165 per panel installed, with accessories quoted separately.',
  },
  {
    q: 'Do I need ceiling panels as well as wall panels?',
    a: 'Busy, hard rooms like restaurants and classrooms usually need ceiling panels too, while small offices and bedrooms often do not.',
  },
  {
    q: 'Will acoustic panels stop noise from my neighbours?',
    a: 'No, panels cut echo inside your room, while blocking neighbour noise needs heavy, airtight construction work.',
  },
  {
    q: 'How accurate is this estimate?',
    a: 'It is a ballpark, so send 2–3 photos on WhatsApp and we will confirm the exact count and price for free.',
  },
]

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Acoustic Panel Calculator',
  url: canonicalPath(PAGE_PATH),
  description:
    'Estimate how many acoustic panels a room needs from its size, type and echo level, with installed pricing in Singapore dollars.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'SGD' },
  provider: { '@id': ORGANIZATION_ID },
}

export default function AcousticPanelCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(webApplicationJsonLd) }} />
      <div className="page-wrap page-stack gap-10 md:gap-14">
        <section className="home-shell page-hero-shell flex flex-col gap-7 p-[clamp(30px,4.6vw,52px)]">
          <span className="soft-pill">Acoustic Panel Calculator</span>
          <h1 className="page-title max-w-[17ch]">How many acoustic panels do I need?</h1>
          <p className="page-subtitle max-w-[64ch]">
            Enter your room size and type. You get a panel count range, an installed price, and where to put the panels
            first. It&apos;s an estimate; we confirm the exact count free from your photos.
          </p>
        </section>

        <section className="home-shell page-hero-shell p-[clamp(18px,3vw,36px)]">
          <AcousticPanelCalculator />
        </section>
      </div>

      <FadeUp>
        <FAQ items={CALCULATOR_FAQS} title="Panel Calculator Questions" subtitle="How the estimate works and what it costs." />
      </FadeUp>

      <FadeUp>
        <ContactCTA />
      </FadeUp>
    </>
  )
}
