import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getShopItemBySlug,
  getAllShopItemSlugs,
  getAllShopItems,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { fitTitle, ORGANIZATION_ID, pageMetadata, serializeJsonLd, canonicalPath, SITE_URL, stripBrand } from "@/lib/seo";
import type { ShopItem } from "@/lib/types";
import { getShopPriceLabel } from "@/lib/shopDisplay";
import { getProductProfile } from "@/lib/shopProductProfiles";
import ShopItemDetail from "./ShopItemDetail";
import RelatedProductsCarousel from "@/components/shop/RelatedProductsCarousel";

export const revalidate = 60;

// Override for the flagship product's meta / JSON-LD description.
const STANDARD_FLEXI_DESCRIPTION =
  "Best-selling broadband acoustic panels built to reduce echo and improve clarity in any type of space.";

export async function generateStaticParams() {
  const slugs = await getAllShopItemSlugs().catch(() => []);
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getShopItemBySlug(slug).catch(() => null);
  if (!item) return {};
  const description =
    slug === "standard-flexi-acoustic-panel"
      ? STANDARD_FLEXI_DESCRIPTION
      : item.seo?.metaDescription || item.shortDescription || getProductProfile(item).shortDescription;
  return pageMetadata({
    title: fitTitle(stripBrand(item.seo?.metaTitle), `${item.title} Singapore`, item.title),
    description,
    path: `/shop/${slug}`,
    image: item.mainImage ? urlFor(item.mainImage).width(1200).height(630).url() : undefined,
    imageAlt: item.mainImage?.alt || item.title,
  });
}

export default async function ShopItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, allItems]: [ShopItem | null, ShopItem[]] = await Promise.all([
    getShopItemBySlug(slug).catch(() => null),
    getAllShopItems().catch(() => [] as ShopItem[]),
  ]);
  if (!item) notFound();

  const relatedPriority = [
    "standard-flexi-acoustic-panel",
    "soothe-studio-bass-trap",
  ];
  const relatedItems = allItems
    .filter(
      (other) =>
        other.slug.current !== slug &&
        other.category !== "accessories" &&
        Boolean(other.mainImage),
    )
    .sort((a, b) => {
      const aBuyable =
        a.checkoutMode !== "quote-only" ||
        a.configuratorEnabled ||
        a.price != null;
      const bBuyable =
        b.checkoutMode !== "quote-only" ||
        b.configuratorEnabled ||
        b.price != null;
      if (aBuyable !== bBuyable) return aBuyable ? -1 : 1;
      const aIndex = relatedPriority.indexOf(a.slug.current);
      const bIndex = relatedPriority.indexOf(b.slug.current);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      return a.title.localeCompare(b.title);
    })
    .slice(0, 8)
    .map((related) => ({
      id: related._id,
      title: related.title,
      slug: related.slug.current,
      image: related.mainImage
        ? urlFor(related.mainImage).width(720).height(900).fit("crop").url()
        : undefined,
      imageAlt: related.mainImage?.alt || related.title,
      priceLabel: getShopPriceLabel(related),
    }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description:
      slug === "standard-flexi-acoustic-panel"
        ? STANDARD_FLEXI_DESCRIPTION
        : item.shortDescription || item.seo?.metaDescription || getProductProfile(item).shortDescription,
    ...(item.mainImage && {
      image: urlFor(item.mainImage).width(1200).height(900).url(),
    }),
    brand: { "@type": "Brand", name: "Just Acoustics" },
    url: canonicalPath(`/shop/${slug}`),
    // Google only accepts an Offer with a price; quote-only items list no Offer.
    ...(item.price != null &&
      item.price > 0 && {
        offers: {
          "@type": "Offer",
          priceCurrency: "SGD",
          price: item.price,
          itemCondition: "https://schema.org/NewCondition",
          availability:
            item.inStock !== false
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: canonicalPath(`/shop/${slug}`),
          seller: { "@id": ORGANIZATION_ID },
        },
      }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: canonicalPath("/shop"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: canonicalPath(`/shop/${slug}`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ShopItemDetail item={item} />
      {relatedItems.length > 0 && (
        <section className="page-shell home-shell page-hero-shell my-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">Related acoustic panels</p>
              <h2 className="page-card-title">
                More acoustic panels you might like
              </h2>
            </div>
            <Link href="/shop" className="page-link">
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          <RelatedProductsCarousel items={relatedItems} />
        </section>
      )}
    </>
  );
}
