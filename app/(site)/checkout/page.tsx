import type { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Review your Just Acoustics cart and complete payment by PayNow.',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
