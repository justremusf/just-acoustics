import type { Metadata } from 'next'
import PayNowClient from './PayNowClient'

export const metadata: Metadata = {
  title: 'Pay by PayNow',
  description: 'Complete your Just Acoustics order by PayNow.',
  robots: { index: false, follow: false },
}

export default function PayNowPage() {
  return <PayNowClient />
}
