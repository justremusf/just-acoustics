import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShopItemBySlug, getAllShopItemSlugs } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
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

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: item.shortDescription,
    ...(item.mainImage && { image: urlFor(item.mainImage).width(1200).height(900).url() }),
    ...(item.sku && { sku: item.sku }),
    brand: { '@type': 'Brand', name: 'Just Acoustics' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SGD',
      ...(item.price && { price: item.price }),
      availability: item.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://justacoustics.co/shop/${slug}`,
      seller: { '@type': 'Organization', name: 'Just Acoustics' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://justacoustics.co' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://justacoustics.co/shop' },
      { '@type': 'ListItem', position: 3, name: item.title, item: `https://justacoustics.co/shop/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ShopItemDetail item={item} />
    </>
  )
}
