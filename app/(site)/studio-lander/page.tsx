import type { Metadata } from 'next'
import { canonicalPath } from '@/lib/seo'
import StudioLanderClient from './StudioLanderClient'

export const metadata: Metadata = {
  title: 'Music Studio Acoustics Singapore | Just Acoustics',
  description:
    'Acoustic panels, bass traps, ceiling clouds, and studio kits for HDB, condo, and professional music rooms in Singapore.',
  alternates: { canonical: canonicalPath('/studio-lander') },
}

export default function StudioLanderPage() {
  return <StudioLanderClient />
}
