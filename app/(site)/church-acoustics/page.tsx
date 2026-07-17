import type { Metadata } from 'next'
import { canonicalPath } from '@/lib/seo'
import ChurchLanderClient from './ChurchLanderClient'

export const metadata: Metadata = {
  title: 'Church Acoustic Treatment Singapore | Just Acoustics',
  description:
    'Custom acoustic panels, ceiling clouds, and custom print panels for churches, houses of worship, and event halls in Singapore. Maximise speaker clarity & speech intelligibility.',
  alternates: { canonical: canonicalPath('/church-acoustics') },
}

export default function ChurchLanderPage() {
  return <ChurchLanderClient />
}
