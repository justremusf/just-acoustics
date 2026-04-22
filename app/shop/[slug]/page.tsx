import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getShopItemBySlug, getAllShopItemSlugs, getAllShopItems } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { stripBrand } from '@/lib/seo'
import type { ShopItem } from '@/lib/types'
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
    title: stripBrand(item.seo?.metaTitle) || item.title,
    description: item.seo?.metaDescription || item.shortDescription,
    alternates: { canonical: `https://justacoustics.co/shop/${slug}` },
  }
}

export default async function ShopItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [item, allItems]: [ShopItem | null, ShopItem[]] = await Promise.all([
    getShopItemBySlug(slug).catch(() => null),
    getAllShopItems().catch(() => [] as ShopItem[]),
  ])
  if (!item) notFound()

  const relatedItems = allItems
    .filter((other) => other.slug.current !== slug && (item.category ? other.category === item.category : true))
    .slice(0, 4)

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
      {relatedItems.length > 0 && (
        <section className="page-wrap home-shell page-hero-shell mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">Related products</p>
              <h2 className="page-card-title">More options you might like</h2>
            </div>
            <Link href="/shop" className="page-link">
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedItems.map((related) => (
              <Link
                key={related._id}
                href={`/shop/${related.slug.current}`}
                className="page-card glass-card group transition-transform duration-300 hover:-translate-y-1"
              >
                {related.mainImage?.asset._ref && (
                  <div className="page-card-image aspect-square bg-[var(--color-white-200)]">
                    <Image
                      src={urlFor(related.mainImage).width(480).height(480).url()}
                      alt={related.mainImage.alt || related.title}
                      width={480}
                      height={480}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="page-card-body">
                  <h3 className="page-card-title transition-colors group-hover:text-[var(--color-brand-orange)]">{related.title}</h3>
                  {related.price != null && (
                    <p className="page-card-copy">S${related.price.toLocaleString()}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
