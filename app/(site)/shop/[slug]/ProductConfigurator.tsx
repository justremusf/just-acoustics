"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HelpCircle, X } from "lucide-react";
import { useCart, type CartItemOption } from "@/components/cart/CartContext";
import type { ShopItem } from "@/lib/types";
import type { ProductProfile, ShopProductLine } from "@/lib/shopProductProfiles";
import { trackEvent } from "@/components/analytics/trackEvent";
import { DELIVERY_DISCLOSURE, ORDER_LEAD_TIME } from "@/lib/paymentCopy";
import {
  calculateShopPrice,
  formatSgd,
  normaliseQuantity,
  resolveShopSelection,
  type ShopQuoteSelection,
} from "@/lib/shopPricing";
import { colourSwatchStyle } from "@/lib/colourSwatchStyle";
import { getSizeDimensionLabel, getSizeShapeLabel } from "@/lib/shopSizeLabels";
import type { ProductMedia } from "./productHelpers";

/** The parts of the product profile the configurator needs (resolved on the server). */
export type ConfiguratorProfile = Pick<
  ProductProfile,
  "line" | "quoteOnly" | "artworkReview" | "customSizes" | "shortDescription"
>;

function optionButtonClass(active: boolean) {
  return [
    "rounded-[16px] border px-4 py-3 text-left text-sm transition-all duration-200",
    active
      ? "border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.12)] text-[var(--color-dark-100)] shadow-[0_12px_28px_rgba(255,165,0,0.08)]"
      : "border-black/8 bg-white/74 text-[var(--color-gray-100)] hover:border-black/18 hover:text-[var(--color-dark-100)]",
  ].join(" ");
}

const OPTION_SECTION_CLASS = "border-t border-black/8 pt-5";

function ProductColourSwatch({
  option,
  swatchSrc,
}: {
  option: ReturnType<typeof resolveShopSelection>["colourOption"];
  swatchSrc: string | null;
}) {
  // Soothe fabrics crop the original chart photo to the fabric cell; no recolouring.
  const sootheStyle = colourSwatchStyle(option?.swatchSrc, option?.swatchRegion);

  if (sootheStyle)
    return (
      <span className="block h-full w-full rounded-full" style={sootheStyle} />
    );
  if (swatchSrc)
    return (
      <Image
        src={swatchSrc}
        alt={option?.name || "Colour swatch"}
        width={120}
        height={120}
        className="h-full w-full rounded-full object-cover"
      />
    );
  return (
    <span
      className="block h-full w-full rounded-full"
      style={{ backgroundColor: option?.hex || "#f4f4f4" }}
    />
  );
}

function ProductColourSwatchButton({
  option,
  swatchSrc,
  selected,
  onSelect,
  showTooltip = false,
}: {
  option: NonNullable<ReturnType<typeof resolveShopSelection>["colourOption"]>;
  swatchSrc: string | null;
  selected: boolean;
  onSelect: () => void;
  showTooltip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={option.name}
      aria-label={`Select ${option.name}`}
      className={[
        "group relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border p-0 transition-all duration-200 hover:z-50 hover:-translate-y-0.5 focus-visible:z-50",
        selected
          ? "border-[var(--color-dark-100)] ring-2 ring-[var(--color-brand-orange)] ring-offset-2"
          : "border-black/10 hover:border-black/25",
      ].join(" ")}
    >
      <span className="block h-full w-full overflow-hidden rounded-full">
        <ProductColourSwatch option={option} swatchSrc={swatchSrc} />
      </span>
      {showTooltip && (
        <span className="pointer-events-none absolute left-1/2 top-full z-[90] mt-2 w-max max-w-[180px] -translate-x-1/2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] font-semibold leading-tight text-[var(--color-dark-100)] opacity-0 shadow-[0_12px_28px_rgba(15,23,42,0.14)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {option.name}
        </span>
      )}
    </button>
  );
}

function CustomSizeDialog({
  item,
  open,
  onClose,
}: {
  item: ShopItem;
  open: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const contactHref = `/contact?product=${encodeURIComponent(item.slug.current)}&request=custom-size`;
  const whatsappHref = `https://wa.me/6589301905?text=${encodeURIComponent(`Hi Just Acoustics, I need a custom size for ${item.title}.`)}`;

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
      <button
        type="button"
        data-testid="custom-size-backdrop"
        aria-label="Close custom size dialog"
        className="absolute inset-0 h-full w-full border-0 bg-black/52 p-0 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-size-title"
        className="relative z-10 w-full max-w-[560px] rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_32px_100px_rgba(0,0,0,0.28)] sm:p-8"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-black/[0.03] text-[var(--color-dark-100)] transition-colors hover:bg-black/[0.07]"
          aria-label="Close custom size information"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="page-kicker">Custom sizing available</p>
        <h2
          id="custom-size-title"
          className="m-0 mt-3 pr-12 text-[32px] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--color-dark-100)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Made to fit your space
        </h2>
        <p className="m-0 mt-5 text-sm leading-7 text-[var(--color-gray-100)]">
          We can customise {item.title} to most practical shapes and sizes. Send
          us your room dimensions, photos, and intended placement so we can
          recommend the simplest build and installation method.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={contactHref}
            className="page-cta justify-center text-center"
          >
            Contact our team
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#137e89]/25 bg-[#137e89]/10 px-5 text-sm font-semibold text-[#137e89] no-underline transition-colors hover:bg-[#137e89]/15"
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export function ProductConfigurator({
  item: configurableItem,
  profile,
  productLine,
  isSoothe,
  visibleColourIds,
  media,
  selection,
  setSelection,
  price,
  resolved,
  onImageModeChange,
}: {
  item: ShopItem;
  profile: ConfiguratorProfile;
  productLine: ShopProductLine;
  isSoothe: boolean;
  /** Curated swatch order for Flexi/Soothe; null shows the first nine colours. */
  visibleColourIds: string[] | null;
  media: ProductMedia;
  selection: ShopQuoteSelection;
  setSelection: (
    value:
      | ShopQuoteSelection
      | ((current: ShopQuoteSelection) => ShopQuoteSelection),
  ) => void;
  price: ReturnType<typeof calculateShopPrice>;
  resolved: ReturnType<typeof resolveShopSelection>;
  onImageModeChange: (mode: "size" | "colour") => void;
}) {
  const { addItem } = useCart();
  const [isColourOpen, setIsColourOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  // Stable reference so CustomSizeDialog's focus/scroll-lock effect only runs
  // when `open` changes, not on every configurator re-render.
  const closeCustomSize = useCallback(() => setIsCustomSizeOpen(false), []);
  const colourPopoverRef = useRef<HTMLDivElement | null>(null);

  // Dynamic swatch row sizing — measures the actual container width so exactly
  // one row of swatches is shown regardless of screen width.
  const swatchRowRef = useRef<HTMLDivElement | null>(null);
  const [swatchRowWidth, setSwatchRowWidth] = useState(0);
  useEffect(() => {
    const el = swatchRowRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSwatchRowWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setSwatchRowWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const configuratorEnabled = configurableItem.configuratorEnabled !== false;
  const colours = (configurableItem.colourOptions || []).filter(
    (option) => option.available !== false,
  );
  const visibleColours = visibleColourIds
    ? visibleColourIds
        .map((id) => colours.find((option) => option.id === id))
        .filter((option): option is (typeof colours)[number] => Boolean(option))
    : colours.slice(0, 9);
  const swatchSrcFor = (option: { id?: string }) =>
    (option.id && media.colourSwatches[option.id]?.button) || null;
  const hiddenColourCount = Math.max(0, colours.length - visibleColours.length);

  // Swatch = 36px (h-9), gap = 4px (gap-1). Always reserve 1 slot for the
  // overflow button so it sits in the same single row.
  const SWATCH_SIZE = 36;
  const SWATCH_GAP = 4;
  const swatchsPerRow = swatchRowWidth > 0
    ? Math.max(1, Math.floor((swatchRowWidth + SWATCH_GAP) / (SWATCH_SIZE + SWATCH_GAP)))
    : 7; // fallback until measured
  // If all swatches + overflow btn fit in one row, no need to reserve a slot.
  const totalMobileItems = colours.length;
  const mobileMaxVisible = totalMobileItems <= swatchsPerRow
    ? swatchsPerRow
    : swatchsPerRow - 1; // last slot = "+N" button
  const mobileVisibleColours = visibleColours.slice(0, mobileMaxVisible);
  const mobileHiddenColourCount = Math.max(
    0,
    colours.length - mobileVisibleColours.length,
  );
  const shortDescription =
    configurableItem.shortDescription || profile.shortDescription;
  const requiresReview =
    profile.quoteOnly ||
    profile.artworkReview ||
    (profile.line === "bass-trap" && selection.thicknessId === "300mm");
  const quoteLabel = profile.artworkReview
    ? "Start artwork review"
    : profile.line === "bass-trap" && selection.thicknessId === "300mm"
      ? "Request Maxx quote"
      : "Request a Quote";
  const quoteHref = `/contact?product=${encodeURIComponent(configurableItem.slug.current)}&request=${profile.artworkReview ? "artwork-review" : "quote"}`;

  const setSelectionValue = <K extends keyof ShopQuoteSelection>(
    key: K,
    value: ShopQuoteSelection[K],
  ) => {
    setSelection((current) => ({ ...current, [key]: value }));
    trackEvent("product_option_selected", {
      product_slug: configurableItem.slug.current,
      option: key,
      option_value: String(value),
    });
  };

  useEffect(() => {
    if (!isColourOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      // The Soothe collection is inline; collapsing on mousedown moves the clicked control.
      if (isSoothe) return;
      if (
        colourPopoverRef.current &&
        !colourPopoverRef.current.contains(event.target as Node)
      ) {
        setIsColourOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsColourOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isColourOpen, isSoothe]);

  useEffect(() => {
    trackEvent("product_view", {
      product_slug: configurableItem.slug.current,
      product_name: configurableItem.title,
      product_line: productLine,
    });
  }, [configurableItem, productLine]);

  const handleAddToCart = () => {
    const quantity = normaliseQuantity(configurableItem, selection.quantity);
    const unitPrice = price.total / quantity;
    const options: CartItemOption[] = [
      {
        label: "Shape",
        value: resolved.sizeOption
          ? getSizeShapeLabel(resolved.sizeOption)
          : undefined,
      },
      {
        label: "Size",
        value: resolved.sizeOption
          ? getSizeDimensionLabel(resolved.sizeOption)
          : undefined,
      },
      { label: "Thickness", value: resolved.thicknessOption?.label },
      {
        label: isSoothe ? "Fabric" : "Colour",
        value: profile.artworkReview ? undefined : resolved.colourOption?.name,
        swatchSrc:
          (resolved.colourOption?.id &&
            media.colourSwatches[resolved.colourOption.id]?.cart) ||
          undefined,
        hex: resolved.colourOption?.hex,
        swatchRegion: resolved.colourOption?.swatchRegion,
      },
    ].filter((option) => Boolean(option.value));

    addItem({
      slug: configurableItem.slug.current,
      title: configurableItem.title,
      imageSrc:
        (resolved.sizeOption?.id &&
          media.sizePreviews[resolved.sizeOption.id]?.cart) ||
        media.cartImageSrc,
      unitPrice,
      selection: { ...selection, installationId: "self-install", packageId: undefined },
      quantity,
      options,
    });
    trackEvent("add_to_cart", {
      product_slug: configurableItem.slug.current,
      product_name: configurableItem.title,
      quantity,
      value: price.total,
      currency: "SGD",
    });
  };

  if (!configuratorEnabled) {
    return (
      <>
        <div className="glass-card p-5 sm:p-6">
          <p className="page-kicker">Made to your requirements</p>
          <p className="page-card-copy mt-3">{profile.shortDescription}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={quoteHref} className="page-cta w-fit">
              Request a Quote
            </Link>
            {profile.customSizes && (
              <button
                type="button"
                onClick={() => setIsCustomSizeOpen(true)}
                className="inline-flex min-h-12 items-center rounded-full border border-[#137e89]/25 bg-[#137e89]/10 px-5 text-sm font-semibold text-[#137e89] transition-colors hover:bg-[#137e89]/15"
              >
                Custom sizes available
              </button>
            )}
          </div>
        </div>
        <CustomSizeDialog
          item={configurableItem}
          open={isCustomSizeOpen}
          onClose={closeCustomSize}
        />
      </>
    );
  }

  return (
    <div className="product-configurator-card glass-card overflow-hidden">
      <div className="product-configurator-inner grid gap-5 p-5 sm:p-6">
        {profile.artworkReview ? (
          <div className="rounded-[20px] border border-[#137e89]/18 bg-[#137e89]/7 p-4 sm:p-5">
            <p className="page-kicker m-0">Fully custom artwork</p>
            <p className="m-0 mt-2 text-sm leading-6 text-[var(--color-gray-100)]">
              There are no preset colours. Your uploaded PDF or image determines
              the final printed finish.
            </p>
          </div>
        ) : (
          <div className="relative" ref={colourPopoverRef}>
            <div className="flex items-center justify-between gap-4">
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-100)]">
                <span className="page-kicker m-0">
                  {isSoothe ? "Fabric" : "Colour"}
                </span>
                <span>{resolved.colourOption?.name || "Select a finish"}</span>
              </p>
            </div>

            {isSoothe ? (
              <div className="mt-3 grid items-end gap-3 sm:grid-cols-[max-content_max-content_42px] sm:gap-4">
                {(["8080", "2020"] as const).map((series) => (
                  <div key={series}>
                    <p className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-gray-200)]">
                      {series} Series
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {visibleColours
                        .filter((option) => option.fabricSeries === series)
                        .map((option) => (
                          <ProductColourSwatchButton
                            key={option.id}
                            option={option}
                            swatchSrc={swatchSrcFor(option)}
                            selected={selection.colourId === option.id}
                            onSelect={() => {
                              setSelectionValue("colourId", option.id);
                              onImageModeChange("colour");
                            }}
                          />
                        ))}
                      {series === "2020" && hiddenColourCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsColourOpen((current) => !current)}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white px-1 text-xs font-semibold text-[var(--color-dark-100)] transition-all duration-200 hover:border-black/25 sm:hidden"
                          aria-expanded={isColourOpen}
                          aria-label={`Show ${hiddenColourCount} more fabrics`}
                        >
                          +{hiddenColourCount}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {hiddenColourCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsColourOpen((current) => !current)}
                    className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white px-1 text-xs font-semibold text-[var(--color-dark-100)] transition-all duration-200 hover:-translate-y-0.5 hover:border-black/25 sm:flex"
                    aria-expanded={isColourOpen}
                    aria-label={`Show ${hiddenColourCount} more fabrics`}
                  >
                    +{hiddenColourCount}
                  </button>
                )}
              </div>
            ) : (
              <>
                <div
                  ref={swatchRowRef}
                  className="product-swatch-grid mt-3 flex flex-wrap gap-2 sm:hidden"
                >
                  {mobileVisibleColours.map((option) => (
                    <ProductColourSwatchButton
                      key={option.id}
                      option={option}
                      swatchSrc={swatchSrcFor(option)}
                      selected={selection.colourId === option.id}
                      onSelect={() => {
                        setSelectionValue("colourId", option.id);
                        onImageModeChange("colour");
                      }}
                    />
                  ))}
                  {mobileHiddenColourCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsColourOpen((current) => !current)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white px-1 text-[10px] font-semibold text-[var(--color-dark-100)] transition-all duration-200 hover:border-black/25"
                      aria-expanded={isColourOpen}
                      aria-label={`Show ${mobileHiddenColourCount} more colours`}
                    >
                      +{mobileHiddenColourCount}
                    </button>
                  )}
                </div>
                <div className="product-swatch-grid mt-3 hidden flex-wrap gap-2 sm:flex">
                  {visibleColours.map((option) => (
                    <ProductColourSwatchButton
                      key={option.id}
                      option={option}
                      swatchSrc={swatchSrcFor(option)}
                      selected={selection.colourId === option.id}
                      onSelect={() => {
                        setSelectionValue("colourId", option.id);
                        onImageModeChange("colour");
                      }}
                    />
                  ))}
                  {hiddenColourCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsColourOpen((current) => !current)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white px-1 text-xs font-semibold text-[var(--color-dark-100)] transition-all duration-200 hover:-translate-y-0.5 hover:border-black/25"
                      aria-expanded={isColourOpen}
                      aria-label={`Show ${hiddenColourCount} more colours`}
                    >
                      +{hiddenColourCount}
                    </button>
                  )}
                </div>
              </>
            )}

            {isColourOpen &&
              (hiddenColourCount > 0 || mobileHiddenColourCount > 0) && (
                <div
                  className={[
                    "z-20 mt-3 max-h-[min(70vh,680px)] w-full overflow-y-auto rounded-[22px] border border-black/8 bg-white p-4 shadow-[0_24px_48px_rgba(0,0,0,0.12)]",
                    isSoothe ? "relative" : "absolute left-0 top-full",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gray-200)]">
                      {isSoothe ? "Soothe fabric collection" : "All Colours"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsColourOpen(false)}
                      className="text-xs font-semibold text-[var(--color-gray-200)] transition-colors hover:text-[var(--color-dark-100)]"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-4 grid gap-5">
                    {(isSoothe ? (["8080", "2020"] as const) : [null]).map(
                      (series) => (
                        <div key={series || "colours"}>
                          {series && (
                            <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#137e89]">
                              {series} Series
                            </p>
                          )}
                          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                            {colours
                              .filter(
                                (option) =>
                                  !series || option.fabricSeries === series,
                              )
                              .map((option) => (
                                <ProductColourSwatchButton
                                  key={option.id}
                                  option={option}
                                  swatchSrc={swatchSrcFor(option)}
                                  selected={selection.colourId === option.id}
                                  showTooltip
                                  onSelect={() => {
                                    setSelectionValue("colourId", option.id);
                                    onImageModeChange("colour");
                                  }}
                                />
                              ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {configurableItem.sizeOptions &&
          configurableItem.sizeOptions.length > 0 && (
            <div className={OPTION_SECTION_CLASS}>
              <p className="m-0 flex items-baseline gap-3 text-sm font-semibold text-[var(--color-dark-100)]">
                <span className="page-kicker m-0">Shape</span>
                <span>
                  {resolved.sizeOption
                    ? getSizeShapeLabel(resolved.sizeOption)
                    : "Select a shape"}
                </span>
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                {configurableItem.sizeOptions
                  ?.filter((option) => option.available !== false)
                  .map((option) => {
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSelectionValue("sizeId", option.id);
                          onImageModeChange("size");
                        }}
                        className={[
                          optionButtonClass(selection.sizeId === option.id),
                          "min-h-[86px] px-2 text-center sm:min-h-[96px] sm:px-4",
                        ].join(" ")}
                      >
                        <span className="block text-[15px] font-semibold leading-tight text-[var(--color-dark-100)] sm:text-[17px]">
                          {getSizeShapeLabel(option)}
                        </span>
                        <span className="mt-1 block text-[12px] font-medium leading-tight text-[var(--color-gray-100)] sm:text-sm">
                          {getSizeDimensionLabel(option)}
                        </span>
                      </button>
                    );
                  })}
              </div>
              {profile.customSizes && (
                <button
                  type="button"
                  onClick={() => setIsCustomSizeOpen(true)}
                  className="mt-3 text-left text-sm font-semibold text-[#137e89] underline decoration-[#137e89]/25 underline-offset-4 transition-colors hover:text-[#0f626b]"
                >
                  Need a custom shape or size?
                </button>
              )}
            </div>
          )}

        {configurableItem.thicknessOptions &&
          configurableItem.thicknessOptions.length > 0 && (
            <div className={OPTION_SECTION_CLASS}>
              <p className="page-kicker">Thickness</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {configurableItem.thicknessOptions
                  ?.filter((option) => option.available !== false)
                  .map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setSelectionValue("thicknessId", option.id)
                      }
                      className={optionButtonClass(
                        selection.thicknessId === option.id,
                      )}
                    >
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

        <div className={`${OPTION_SECTION_CLASS} grid gap-4`}>
          <div className="product-action-row grid min-w-0 grid-cols-[132px_minmax(0,1fr)] items-center gap-3">
            <div className="product-quantity-control inline-flex h-[52px] w-[132px] justify-self-start overflow-hidden rounded-full border border-black/8 bg-white/86">
              <button
                type="button"
                onClick={() =>
                  setSelectionValue(
                    "quantity",
                    normaliseQuantity(configurableItem, selection.quantity - 1),
                  )
                }
                className="inline-flex h-full flex-1 items-center justify-center text-xl text-[var(--color-dark-100)] transition-colors hover:bg-black/5"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <div className="flex h-full flex-1 items-center justify-center border-x border-black/8 text-sm font-semibold text-[var(--color-dark-100)]">
                {selection.quantity}
              </div>
              <button
                type="button"
                onClick={() =>
                  setSelectionValue(
                    "quantity",
                    normaliseQuantity(configurableItem, selection.quantity + 1),
                  )
                }
                className="inline-flex h-full flex-1 items-center justify-center text-xl text-[var(--color-dark-100)] transition-colors hover:bg-black/5"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {requiresReview ? (
              <Link
                href={quoteHref}
                className="page-cta h-14 w-full justify-center text-center text-[18px]"
              >
                {quoteLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="page-cta add-to-cart h-14 w-full text-[18px]"
              >
                Add to cart - {formatSgd(price.total)}
              </button>
            )}
          </div>

          <p className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">{DELIVERY_DISCLOSURE}<br />{ORDER_LEAD_TIME}</p>
          <Link
            href="/contact"
            className="grid grid-cols-[42px_minmax(0,1fr)] items-center gap-4 rounded-[18px] bg-[rgba(19,126,137,0.12)] px-4 py-4 text-[#137e89] no-underline transition-colors hover:bg-[rgba(19,126,137,0.16)]"
          >
            <HelpCircle className="h-8 w-8 text-[#137e89]" strokeWidth={1.8} />
            <span className="text-sm font-medium leading-6">
              Not sure which product fits your room? Get a free consultation
              with our acoustic experts.
            </span>
          </Link>
        </div>

        <p className="m-0 mt-2 text-sm leading-7 text-[var(--color-gray-100)]">
          {shortDescription}
        </p>
      </div>
      <CustomSizeDialog
        item={configurableItem}
        open={isCustomSizeOpen}
        onClose={closeCustomSize}
      />
    </div>
  );
}
