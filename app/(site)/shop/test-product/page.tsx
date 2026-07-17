import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShopItemBySlug } from '@/sanity/lib/queries'
import type { ShopItem } from '@/lib/types'
import TestProductClient from './TestProductClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Test Product',
  robots: { index: false, follow: false },
}

export default async function TestProductPage() {
  const item: ShopItem | null = await getShopItemBySlug('standard-flexi-acoustic-panel').catch(() => null)
  if (!item) notFound()

  return <TestProductClient item={item} />
}
