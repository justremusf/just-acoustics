import Link from "next/link";
import Image from "next/image";
import type { ShopItem } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import { getShopPriceLabel } from "@/lib/shopDisplay";

interface Props {
  products?: ShopItem[];
}

const FEATURED_PRODUCT_PRIORITY = [
  "flexi-acoustic-panels",
  "flexi-custom-print-panels",
  "soothe-gobos",
  "soothe-tm-bass-trap-panel",
];

const SOOTHE_8080_CHART = "/assets/shop/soothe/source/soothe-8080-series.png";
const SOOTHE_LISTING_SWATCHES = [
  { name: "Steel 8080-11", x: 145, y: 175 },
  { name: "Aqua 8080-03", x: 622, y: 175 },
  { name: "Winter 8080-25", x: 145, y: 400 },
  { name: "Carbon 8080-17", x: 622, y: 1275 },
  { name: "Cherry 8080-09", x: 861, y: 1275 },
];

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

export default function ProductsGrid({ products }: Props) {
  const productList = (products || []).filter((item) => item.mainImage);
  const items = [...productList]
    .sort((a, b) => {
      const aIndex = FEATURED_PRODUCT_PRIORITY.indexOf(a.slug.current);
      const bIndex = FEATURED_PRODUCT_PRIORITY.indexOf(b.slug.current);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      const aBuyable =
        a.checkoutMode !== "quote-only" ||
        a.configuratorEnabled ||
        a.price != null;
      const bBuyable =
        b.checkoutMode !== "quote-only" ||
        b.configuratorEnabled ||
        b.price != null;
      if (aBuyable !== bBuyable) return aBuyable ? -1 : 1;
      return a.title.localeCompare(b.title);
    })
    .slice(0, 4);

  return (
    <section className="px-4 py-10 md:px-5 md:py-12">
      <div className="home-shell section-shell-pad mx-auto max-w-[1580px]">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[870px]">
            <h2
              className="home-heading mt-5 text-[var(--color-dark-100)]"
              style={{ width: "min(100%, 870px)" }}
            >
              Best Sellers
            </h2>
            <p className="home-copy mt-5 max-w-[54ch]">
              Trusted by the pros to solve all of your acoustic issues.
            </p>
          </div>
          <Link
            href="/shop"
            className="home-link inline-flex items-center gap-2 self-start md:self-auto"
          >
            Shop all products <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 xl:grid-cols-4">
          {items.map((item) => {
            const imgSrc = item.mainImage
              ? urlFor(item.mainImage).width(720).height(900).fit("crop").url()
              : "/placeholder.jpg";
            const availableColours =
              item.colourOptions?.filter(
                (option) => option.available !== false,
              ) || [];
            const isSoothe =
              item.productLine === "bass-trap" || item.productLine === "gobo";

            return (
              <Link
                key={item._id}
                href={`/shop/${item.slug.current}`}
                className="group h-full overflow-hidden rounded-[18px] border border-white/72 bg-white/72 no-underline shadow-[0_18px_50px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.94)_inset] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white hover:shadow-[0_28px_64px_rgba(0,0,0,0.13)] sm:rounded-[24px]"
              >
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[linear-gradient(145deg,rgba(248,246,242,0.96),rgba(226,224,220,0.9))]">
                    <Image
                      src={imgSrc}
                      alt={item.mainImage?.alt || item.title}
                      fill
                      sizes="(max-width: 639px) calc(50vw - 26px), (max-width: 1279px) calc(50vw - 28px), calc(25vw - 32px)"
                      placeholder={item.mainImage ? "blur" : undefined}
                      blurDataURL={
                        item.mainImage ? IMAGE_BLUR_DATA_URL : undefined
                      }
                      quality={72}
                      loading="lazy"
                      className="object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex min-h-[138px] flex-1 flex-col border-t border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(237,235,230,0.86))] p-3 text-[#171717] backdrop-blur-2xl sm:min-h-[164px] sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="m-0 text-[15px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[20px] md:text-[22px]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {item.title}
                      </h3>
                      <span
                        className="shrink-0 text-sm transition-transform duration-500 group-hover:translate-x-1 sm:mt-1 sm:text-base"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                    <p className="m-0 mt-2 text-xs font-semibold text-black/64 sm:text-sm">
                      {getShopPriceLabel(item)}
                    </p>
                    {isSoothe || availableColours.length ? (
                      <span
                        className="mt-auto flex min-h-5 items-center gap-1 pt-3 sm:gap-1.5 sm:pt-5"
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
                            className="relative h-3 w-3 overflow-hidden rounded-[3px] border border-black/8 shadow-[0_0_0_1px_rgba(255,255,255,0.72)] sm:h-4 sm:w-4 sm:rounded-[4px]"
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
                                quality={70}
                                className="object-cover"
                              />
                            ) : null}
                          </span>
                        ))}
                        {(isSoothe ? 54 : availableColours.length) > 5 ? (
                          <span className="ml-0.5 text-[10px] font-medium text-black/56 sm:ml-1 sm:text-[12px]">
                            + {(isSoothe ? 54 : availableColours.length) - 5}{" "}
                            more
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
