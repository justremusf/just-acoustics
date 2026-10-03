"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ShopItem } from "@/lib/types";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import { getProductProfile } from "@/lib/shopProductProfiles";
import {
  calculateShopPrice,
  formatSgd,
  getDefaultSelection,
  normaliseQuantity,
  resolveShopSelection,
  type ShopQuoteSelection,
} from "@/lib/shopPricing";
import {
  SOOTHE_FABRIC_CHARTS,
  STANDARD_FLEXI_COLOUR_CHART_SRC,
  STANDARD_FLEXI_IN_USE_IMAGES,
} from "./productData";
import {
  getConfigurableItem,
  getImageSrc,
  getSizePreviewSrc,
  isFlexiProduct,
  isSootheProduct,
} from "./productHelpers";
import { ProductBeforeAfterSection } from "./ProductBeforeAfterSection";
import { ProductConfigurator } from "./ProductConfigurator";
import { ProductDetailAccordions } from "./ProductDetailAccordions";
import { ProductPerformanceSection } from "./ProductPerformance";
import {
  CustomPrintWorkflow,
  ProductFeatureCards,
  ProductInfoFaqSection,
  ProductInstallationDownloads,
  ProductInUseGallery,
  ProductReviewsSection,
  ProductStorySections,
} from "./ProductSections";
import { useSwipe } from "./useSwipe";

const ProductPanelCalculator = dynamic(
  () => import("@/components/shop/ProductPanelCalculator"),
  {
    loading: () => (
      <div className="min-h-[420px] animate-pulse rounded-[28px] bg-black/[0.03]" />
    ),
  },
);

export default function ShopItemDetail({ item }: { item: ShopItem }) {
  const isStandardFlexi = isFlexiProduct(item);
  const isSoothe = isSootheProduct(item);
  const profile = getProductProfile(item);
  const configurableItem = useMemo(() => getConfigurableItem(item), [item]);
  const [selection, setSelection] = useState<ShopQuoteSelection>(() =>
    getDefaultSelection(configurableItem),
  );
  const [imageMode, setImageMode] = useState<"size" | "colour">("size");
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbRowRef = useRef<HTMLDivElement | null>(null);
  const lightboxThumbRowRef = useRef<HTMLDivElement | null>(null);
  const resolved = resolveShopSelection(configurableItem, selection);
  const price = calculateShopPrice(configurableItem, selection);
  const quantity = normaliseQuantity(configurableItem, selection.quantity);
  const unitPrice = price.total / quantity;
  const selectedSizeSrc =
    getSizePreviewSrc(configurableItem, selection) ||
    getImageSrc(item.mainImage, 1200, 1500);
  const selectedFabricSeries = resolved.colourOption?.fabricSeries;
  const selectedSootheChart = selectedFabricSeries
    ? SOOTHE_FABRIC_CHARTS[selectedFabricSeries]
    : null;
  const primarySrc =
    imageMode === "colour"
      ? isStandardFlexi
        ? STANDARD_FLEXI_COLOUR_CHART_SRC
        : selectedSootheChart || selectedSizeSrc
      : selectedSizeSrc;
  const localGalleryImages = isStandardFlexi
    ? STANDARD_FLEXI_IN_USE_IMAGES.map((src, index) => ({
        src,
        alt: `${item.title} installed project photo ${index + 1}`,
      }))
    : isSoothe
      ? (
          Object.entries(SOOTHE_FABRIC_CHARTS) as Array<
            [keyof typeof SOOTHE_FABRIC_CHARTS, string]
          >
        )
          .sort(([series]) => (series === selectedFabricSeries ? -1 : 1))
          .map(([series, src]) => ({
            src,
            alt: `${item.title} ${series} Series fabric chart`,
          }))
      : [];
  const baseImages = [item.mainImage, ...(item.gallery || [])]
    .map((image, index) => {
      const src = getImageSrc(image, 1200, 1500);
      return src ? { src, alt: `${item.title} ${index + 1}` } : null;
    })
    .filter((image): image is { src: string; alt: string } => Boolean(image));
  const orderedGalleryImages =
    isStandardFlexi || isSoothe
      ? [...localGalleryImages, ...baseImages]
      : baseImages;
  const displayImages = primarySrc
    ? [
        {
          src: primarySrc,
          alt:
            imageMode === "colour" && resolved.colourOption?.name
              ? `${item.title} fabric chart for ${resolved.colourOption.name}`
              : `${item.title} ${resolved.sizeOption?.label || "product image"}`,
        },
        ...orderedGalleryImages.filter((image) => image.src !== primarySrc),
      ]
    : orderedGalleryImages;
  const mainSrc = displayImages[selectedImage]?.src;

  const selectImage = (index: number) => {
    if (index < 0 || index >= displayImages.length || index === selectedImage)
      return;
    setSelectedImage(index);
  };

  const selectNextImage = useCallback(
    () => setSelectedImage((current) => (current + 1) % displayImages.length),
    [displayImages.length],
  );
  const selectPreviousImage = useCallback(
    () =>
      setSelectedImage(
        (current) => (current - 1 + displayImages.length) % displayImages.length,
      ),
    [displayImages.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") selectNextImage();
      if (event.key === "ArrowLeft") selectPreviousImage();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    document.body.dataset.galleryExpanded = "true";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      delete document.body.dataset.galleryExpanded;
    };
  }, [lightboxOpen, selectNextImage, selectPreviousImage]);

  useEffect(() => {
    setSelectedImage(0);
  }, [primarySrc]);

  useEffect(() => {
    const activeThumb = thumbRowRef.current?.querySelector<HTMLButtonElement>(
      `[data-thumb-index="${selectedImage}"]`,
    );
    activeThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    const activeLightboxThumb =
      lightboxThumbRowRef.current?.querySelector<HTMLButtonElement>(
        `[data-lightbox-thumb-index="${selectedImage}"]`,
      );
    activeLightboxThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedImage]);

  const mainSwipeHandlers = useSwipe(
    selectNextImage,
    selectPreviousImage,
    () => mainSrc && setLightboxOpen(true)
  );

  const lightboxSwipeHandlers = useSwipe(
    selectNextImage,
    selectPreviousImage
  );

  return (
    <div className="page-wrap page-stack">
      <Link href="/shop" className="page-link">
        ← Back to all products
      </Link>
 
      <section className="product-detail-hero home-shell page-hero-shell">
        <div className="mx-auto grid w-full max-w-[1380px] gap-8 lg:grid-cols-[minmax(0,640px)_minmax(430px,600px)] lg:items-start lg:justify-center lg:gap-16 xl:gap-24">
          <div className="grid w-full max-w-[640px] min-w-0 justify-self-center gap-2 lg:sticky lg:top-28 lg:self-start">
            <div className="product-media-card glass-card w-full min-w-0 overflow-hidden rounded-[28px]">
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(238,240,240,0.92))]">
                <button
                  type="button"
                  onTouchStart={mainSwipeHandlers.onTouchStart}
                  onTouchMove={mainSwipeHandlers.onTouchMove}
                  onTouchEnd={mainSwipeHandlers.onTouchEnd}
                  onClick={(e) => {
                    // Prevent click handler from triggering twice on touch devices
                    if (e.detail === 0) return;
                    if (mainSrc) setLightboxOpen(true);
                  }}
                  className="absolute inset-0 block w-full overflow-hidden text-left"
                  aria-label="Open image gallery"
                >
                  {displayImages.length > 0 ? (
                    <div
                      className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        transform: `translateX(-${selectedImage * 100}%)`,
                      }}
                    >
                      {displayImages.map((image, index) => {
                        const isSootheFabricChart = Object.values(
                          SOOTHE_FABRIC_CHARTS,
                        ).includes(
                          image.src as (typeof SOOTHE_FABRIC_CHARTS)[keyof typeof SOOTHE_FABRIC_CHARTS],
                        );
                        return (
                          <div
                            key={`${image.src}-${index}`}
                            className="relative h-full w-full shrink-0"
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 1023px) calc(100vw - 48px), 640px"
                              priority={index === 0}
                              placeholder="blur"
                              blurDataURL={IMAGE_BLUR_DATA_URL}
                              quality={72}
                              loading={index === 0 ? "eager" : "lazy"}
                              className={
                                isSootheFabricChart
                                  ? "object-contain bg-white"
                                  : "object-cover"
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-gray-200)]">
                      No image
                    </div>
                  )}
                </button>

                {displayImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={selectPreviousImage}
                      className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/72 text-2xl text-[var(--color-dark-100)] opacity-100 shadow-[0_14px_32px_rgba(15,23,42,0.16)] backdrop-blur-md transition-all duration-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={selectNextImage}
                      className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/72 text-2xl text-[var(--color-dark-100)] opacity-100 shadow-[0_14px_32px_rgba(15,23,42,0.16)] backdrop-blur-md transition-all duration-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </div>

            {displayImages.length > 1 && (
              <div
                ref={thumbRowRef}
                className="no-scrollbar flex w-full min-w-0 max-w-full gap-1.5 overflow-x-auto px-0.5 pb-1"
              >
                {displayImages.map((image, index) => {
                  return (
                    <button
                      key={`${image.src}-thumb-${index}`}
                      type="button"
                      data-thumb-index={index}
                      onClick={() => selectImage(index)}
                      className={
                        selectedImage === index
                          ? "glass-card relative h-[70px] w-[68px] shrink-0 overflow-hidden rounded-[14px] ring-2 ring-[var(--color-brand-orange)] transition-transform duration-300 ease-out"
                          : "glass-card relative h-[70px] w-[68px] shrink-0 overflow-hidden rounded-[14px] opacity-72 transition-all duration-300 ease-out hover:scale-[1.02] hover:opacity-100"
                      }
                    >
                      <Image
                        src={image.src}
                        alt={`${image.alt} thumbnail`}
                        width={240}
                        height={300}
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        quality={72}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="product-buy-panel flex flex-col gap-4 lg:pt-1">
            <div>
              <h1
                className="m-0 max-w-[684px] text-[31px] text-[var(--color-dark-100)] sm:text-[42px]"
                style={{
                  fontFamily: "var(--font-heading)",
                  lineHeight: "1.06",
                  fontWeight: 500,
                  letterSpacing: "-0.5px",
                }}
              >
                {item.title}
              </h1>
              {item.price != null && (
                <p
                  className="mt-4 mb-0 font-semibold text-[clamp(22px,1.6vw,26px)] leading-none tracking-[-0.3px] text-[var(--color-dark-100)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {profile.pricePrefix === "From"
                    ? `From ${formatSgd(item.price)}`
                    : profile.pricePrefix === "Fixed"
                      ? formatSgd(item.price)
                      : `${formatSgd(unitPrice)} Per Panel`}
                </p>
              )}
            </div>
            <div id="product-configurator" className="scroll-mt-28">
              <ProductConfigurator
                item={configurableItem}
                selection={selection}
                setSelection={setSelection}
                price={price}
                resolved={resolved}
                onImageModeChange={setImageMode}
              />
            </div>
            <ProductDetailAccordions item={configurableItem} />
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8">
        <ProductFeatureCards item={item} />
        {isStandardFlexi && <ProductInUseGallery />}
        {profile.line !== "accessory" && (
          <>
            <ProductPanelCalculator
              line={profile.line}
              productTitle={item.title}
              productSlug={item.slug.current}
            />
            <ProductPerformanceSection item={item} />
          </>
        )}
        {isStandardFlexi && <ProductBeforeAfterSection />}
        {profile.line === "custom-print-panels" && <CustomPrintWorkflow />}
        <ProductStorySections item={item} />
        {isStandardFlexi && <ProductInstallationDownloads />}
        <ProductReviewsSection item={item} />
        <ProductInfoFaqSection item={item} />
      </div>

      {lightboxOpen && displayImages.length > 0 && (
        <div
          className="fixed inset-0 z-[1200] bg-black/92 px-4 py-6 backdrop-blur-md sm:px-6"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="mx-auto flex h-full max-w-[1400px] flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="m-0 text-sm font-medium text-white/72">
                {selectedImage + 1} / {displayImages.length}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/10 text-xl text-white transition-colors hover:bg-white/16"
                aria-label="Close gallery"
              >
                ×
              </button>
            </div>

            <div
              onTouchStart={lightboxSwipeHandlers.onTouchStart}
              onTouchMove={lightboxSwipeHandlers.onTouchMove}
              onTouchEnd={lightboxSwipeHandlers.onTouchEnd}
              className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-black"
            >
              <div
                className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${selectedImage * 100}%)` }}
              >
                {displayImages.map((image, index) => {
                  return (
                    <div
                      key={`${image.src}-lightbox-${index}`}
                      className="relative h-full w-full shrink-0"
                    >
                      <Image
                        src={image.src}
                        alt={`${image.alt} enlarged`}
                        fill
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        quality={72}
                        className="object-contain"
                      />
                    </div>
                  );
                })}
              </div>

              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={selectPreviousImage}
                    className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/35 text-2xl text-white transition-colors hover:bg-black/55"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={selectNextImage}
                    className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/35 text-2xl text-white transition-colors hover:bg-black/55"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {displayImages.length > 1 && (
              <div
                ref={lightboxThumbRowRef}
                className="no-scrollbar mt-4 flex justify-start gap-3 overflow-x-auto pb-1"
              >
                {displayImages.map((image, index) => {
                  return (
                    <button
                      key={`${image.src}-lightbox-thumb-${index}`}
                      type="button"
                      data-lightbox-thumb-index={index}
                      onClick={() => selectImage(index)}
                      className={
                        selectedImage === index
                          ? "relative h-[90px] w-[72px] shrink-0 overflow-hidden rounded-[16px] ring-2 ring-[var(--color-brand-orange)]"
                          : "relative h-[90px] w-[72px] shrink-0 overflow-hidden rounded-[16px] opacity-72 transition-opacity hover:opacity-100"
                      }
                    >
                      <Image
                        src={image.src}
                        alt={`${image.alt} thumbnail`}
                        fill
                        sizes="72px"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                        quality={72}
                        loading="lazy"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
