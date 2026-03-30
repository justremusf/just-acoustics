import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShopItemBySlug, getAllShopItemSlugs } from '@/sanity/lib/queries'
import ShopItemDetail from './ShopItemDetail'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllShopItemSlugs().catch(() => [])
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = await getShopItemBySlug(slug).catch(() => null)
  if (!item) return {}
  return {
    title: item.seo?.metaTitle || `${item.title} — Just Acoustics Shop`,
    description: item.seo?.metaDescription || item.shortDescription,
  }
}

export default async function ShopItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getShopItemBySlug(slug).catch(() => null)
  if (!item) notFound()
  return <ShopItemDetail item={item} />
}
