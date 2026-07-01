import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllShopItems, getSiteSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { ShopItem } from "@/lib/types";
import FAQ from "@/components/sections/FAQ";
import type { FaqItem } from "@/components/sections/FAQ";
import { canonicalPath } from "@/lib/seo";
import { getShopPriceLabel } from "@/lib/shopDisplay";
import ShopFilters from "@/components/sections/ShopFilters";
import { ArrowRight } from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

const SHOP_FAQS: FaqItem[] = [
  {
    q: "What is the typical lead time for panels?",
    a: "Standard panels are usually ready within 5–7 business days. Custom panels and made-to-order sizes take 2–3 weeks from confirmation.",
  },
  {
    q: "Do you deliver and install, or is this self-install?",
    a: "Both options are available. You can purchase panels for self-installation, or we can quote delivery and professional installation as a service.",
  },
  {
    q: "How many panels do I need for my room?",
    a: "As a guide, treating 20–30% of wall surface area gives a noticeable improvement. We are happy to help you calculate coverage for your specific room.",
  },
  {
    q: "Do you work on commercial projects?",
    a: "Yes. Our shop panels are used in offices, restaurants, churches, and studios. For larger commercial projects, reach out for a project consultation.",
  },
];

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    title: "Shop",
    description:
      "Shop acoustic panels and soundproofing products from Just Acoustics, Singapore.",
    alternates: { canonical: canonicalPath("/shop") },
    robots: category ? { index: false, follow: true } : undefined,
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  "acoustic-panels": "Acoustic Panels",
  accessories: "Accessories",
};

const ACOUSTIC_PRODUCT_LINES = new Set([
  "flexi-panel",
  "custom-print-panels",
  "gobo",
  "bass-trap",
  "pet-panel",
]);
const SHOP_PRODUCT_ORDER = [
  "flexi-panel",
  "custom-print-panels",
  "gobo",
  "bass-trap",
  "pet-panel",
  "accessory",
];
const FLEXI_HOVER_IMAGE =
  "/assets/shop/standard-flexi/gallery/flexi-gallery-1.png";
const SOOTHE_8080_CHART = "/assets/shop/soothe/source/soothe-8080-series.png";
const SOOTHE_LISTING_SWATCHES = [
  { name: "Steel 8080-11", x: 145, y: 175 },
  { name: "Aqua 8080-03", x: 622, y: 175 },
  { name: "Winter 8080-25", x: 145, y: 400 },
  { name: "Carbon 8080-17", x: 622, y: 1275 },
  { name: "Cherry 8080-09", x: 861, y: 1275 },
];

function getShopCategory(item: ShopItem) {
  if (item.productLine === "accessory" || item.category === "accessories")
    return "accessories";
  if (item.productLine && ACOUSTIC_PRODUCT_LINES.has(item.productLine))
    return "acoustic-panels";
  return item.category;
}

function getSootheListingSwatchStyle(x: number, y: number) {
  const width = 280;
  const height = 420;
  const center = 8;
  return {
    backgroundImage: `url("${SOOTHE_8080_CHART}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${width}px ${height}px`,
    backgroundPosition: `${center - (x * width) / 1024}px ${center - (y * height) / 1536}px`,
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [allItems, settings]: [
    ShopItem[],
    Awaited<ReturnType<typeof getSiteSettings>>,
  ] = await Promise.all([
    getAllShopItems().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const orderedItems = [...allItems].sort((a, b) => {
    const aIndex = SHOP_PRODUCT_ORDER.indexOf(a.productLine || "");
    const bIndex = SHOP_PRODUCT_ORDER.indexOf(b.productLine || "");
    if (aIndex !== bIndex)
      return (
        (aIndex === -1 ? SHOP_PRODUCT_ORDER.length : aIndex) -
        (bIndex === -1 ? SHOP_PRODUCT_ORDER.length : bIndex)
      );
    return a.title.localeCompare(b.title);
  });
  const filtered = category
    ? orderedItems.filter((item) => getShopCategory(item) === category)
    : orderedItems;
  const populatedCategories = Object.entries(CATEGORY_LABELS).filter(
    ([value]) => orderedItems.some((item) => getShopCategory(item) === value),
  );
  const categoryImages = new Map(
    populatedCategories.flatMap(([value]) => {
      const image = orderedItems.find(
        (item) => getShopCategory(item) === value && item.mainImage,
      )?.mainImage;
      return image ? [[value, image] as const] : [];
    }),
  );
  const shopPage = settings?.shopPage;
  const consultationTitle =
    shopPage?.consultationTitle || "Not sure where to start?";
  const consultationDescription =
    shopPage?.consultationDescription ||
    "Share your room and goals with our team for a practical treatment recommendation.";
  const consultationImage = shopPage?.consultationImage;

  return (
    <main className="px-4 pb-16 pt-6 sm:px-5 sm:pb-20 lg:pt-8">
      <section className="site-container rounded-[32px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(245,245,245,0.76))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.09),0_8px_24px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-2xl sm:p-9 lg:p-12">
        <div className="max-w-[820px]">
          <h1
            className="m-0 text-[clamp(42px,6vw,76px)] font-semibold leading-[0.94] tracking-[-0.05em] text-[var(--color-dark-100)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shop Acoustic Panels
          </h1>
          <p className="mb-0 mt-5 max-w-[62ch] text-[16px] leading-7 text-[var(--color-gray-100)] sm:text-[18px]">
            Browse acoustic panels, custom solutions, and quote-led products
            designed for clearer, more comfortable rooms.
          </p>
        </div>
      </section>

      <section className="site-container mt-8 sm:mt-10">
        <div className="rounded-[28px] border border-black/7 bg-white/72 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-xl sm:p-6">
          <ShopFilters
            category={category}
            categories={populatedCategories.map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="m-0 py-16 text-center text-[var(--color-gray-100)]">
            No products in this category yet.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.flatMap((item, index) => {
              const primaryImage =
                item.mainImage ||
                (item.category ? categoryImages.get(item.category) : undefined);
              const hoverImage = item.gallery?.find(
                (image) => image.asset?._ref !== primaryImage?.asset?._ref,
              );
              const hoverImageSrc =
                item.productLine === "flexi-panel"
                  ? FLEXI_HOVER_IMAGE
                  : hoverImage
                    ? urlFor(hoverImage)
                        .ignoreImageParams()
                        .width(1200)
                        .height(1500)
                        .fit("crop")
                        .url()
                    : null;
              const isSoothe =
                item.productLine === "bass-trap" || item.productLine === "gobo";
              const availableColours =
                item.colourOptions?.filter(
                  (option) => option.available !== false,
                ) || [];
              const productCard = (
                <article
                  key={item._id}
                  className="deferred-card group overflow-hidden rounded-[26px] border border-white/80 bg-white/82 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.96)_inset] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white hover:shadow-[0_30px_72px_rgba(0,0,0,0.13),0_1px_0_rgba(255,255,255,1)_inset]"
                >
                  <Link
                    href={`/shop/${item.slug.current}`}
                    className="block h-full no-underline"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[linear-gradient(145deg,rgba(248,246,242,0.96),rgba(226,224,220,0.9))]">
                      {primaryImage ? (
                        <Image
                          src={urlFor(primaryImage)
                            .ignoreImageParams()
                            .width(1200)
                            .height(1500)
                            .fit("crop")
                            .url()}
                          alt={item.mainImage?.alt || item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
                          priority={index < 2}
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          quality={72}
                          className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${hoverImageSrc ? "group-hover:scale-[1.01] group-hover:opacity-0" : "group-hover:scale-[1.015]"}`}
                        />
                      ) : null}
                      {hoverImageSrc ? (
                        <Image
                          src={hoverImageSrc}
                          alt=""
                          fill
                          unoptimized
                          sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          quality={72}
                          className="object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015] group-hover:opacity-100"
                        />
                      ) : null}
                    </div>
                    <div className="flex min-h-[150px] flex-col border-t border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(239,237,232,0.9))] p-5 text-[#171717] backdrop-blur-2xl">
                      <div className="flex min-h-[48px] items-start justify-between gap-3">
                        <h2
                          className="m-0 line-clamp-2 text-[19px] font-semibold leading-[1.22] tracking-[-0.02em]"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {item.title}
                        </h2>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
                      </div>
                      <span className="mt-1 block text-sm font-semibold text-black/72">
                        {getShopPriceLabel(item)}
                      </span>
                      {isSoothe || availableColours.length ? (
                        <span
                          className="mt-auto flex min-h-5 items-center gap-1.5"
                          aria-label="Available colour previews"
                        >
                          {(isSoothe
                            ? SOOTHE_LISTING_SWATCHES
                            : availableColours.slice(0, 5)
                          ).map((option, colourIndex) => (
                            <span
                              key={
                                "id" in option
                                  ? option.id || option.name || colourIndex
                                  : option.name
                              }
                              title={option.name || "Colour option"}
                              className="relative h-4 w-4 overflow-hidden rounded-[4px] border border-black/8 shadow-[0_0_0_1px_rgba(255,255,255,0.72)]"
                              style={
                                isSoothe && "x" in option
                                  ? getSootheListingSwatchStyle(
                                      option.x,
                                      option.y,
                                    )
                                  : "hex" in option && option.hex
                                    ? { backgroundColor: option.hex }
                                    : undefined
                              }
                            >
                              {"swatchImage" in option && option.swatchImage ? (
                                <Image
                                  src={urlFor(option.swatchImage)
                                    .width(48)
                                    .height(48)
                                    .fit("crop")
                                    .url()}
                                  alt=""
                                  fill
                                  unoptimized
                                  sizes="16px"
                                  placeholder="blur"
                                  blurDataURL={IMAGE_BLUR_DATA_URL}
                                  quality={72}
                                  className="object-cover"
                                />
                              ) : null}
                            </span>
                          ))}
                          {(isSoothe ? 54 : availableColours.length) > 5 ? (
                            <span className="ml-1 text-[12px] font-medium text-black/62">
                              + {(isSoothe ? 54 : availableColours.length) - 5}{" "}
                              more
                            </span>
                          ) : null}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </article>
              );

              if (index !== 2) return [productCard];

              return [
                productCard,
                <Link
                  key="consultation-card"
                  href="/contact"
                  className="group relative isolate min-h-[420px] overflow-hidden rounded-[26px] border border-white/60 bg-white/30 p-6 text-white no-underline shadow-[0_18px_46px_rgba(0,0,0,0.10)] backdrop-blur-xl sm:min-h-0"
                >
                  {consultationImage ? (
                    <Image
                      src={urlFor(consultationImage)
                        .width(760)
                        .height(960)
                        .fit("crop")
                        .url()}
                      alt={consultationImage.alt || consultationTitle}
                      fill
                      unoptimized
                      sizes="(max-width: 1279px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      quality={72}
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/assets/pricing/office.jpg"
                      alt="A completed acoustic project"
                      fill
                      sizes="(max-width: 1279px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      quality={72}
                      className="object-cover"
                    />
                  )}
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.06),rgba(5,5,5,0.82))]" />
                  <span className="relative z-10 flex h-full min-h-[330px] flex-col justify-end">
                    <span
                      className="text-[32px] font-medium leading-[0.95]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {consultationTitle}
                    </span>
                    <span className="mt-4 text-sm leading-6 text-white/72">
                      {consultationDescription}
                    </span>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                      Free Consultation{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>,
              ];
            })}
          </div>
        )}
      </section>

      <FAQ
        items={SHOP_FAQS}
        title="Shop Questions"
        subtitle="Everything you need to know before ordering."
      />
    </main>
  );
}
