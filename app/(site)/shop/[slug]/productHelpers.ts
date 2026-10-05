import { urlFor } from "@/sanity/lib/image";
import type { ShopItem } from "@/lib/types";
import {
  resolveShopSelection,
  type ShopQuoteSelection,
} from "@/lib/shopPricing";
import { colourSwatchStyle } from "@/lib/colourSwatchStyle";
import { resolveProductLine } from "@/lib/shopProductProfiles";
import { isFlexiProduct } from "@/lib/shopCatalogue";
import { STANDARD_FLEXI_SIZE_IMAGE_SRC } from "./productData";

// Shared with the orders API so the configurator and server pricing agree.
// getConfigurableItem offers supply only: installation is a separate enquiry.
export {
  getConfigurableItem,
  getSizeDimensionLabel,
  getSizeShapeLabel,
  isFlexiProduct,
  isSootheProduct,
} from "@/lib/shopCatalogue";

export function getImageSrc(
  image:
    | ShopItem["mainImage"]
    | NonNullable<ShopItem["gallery"]>[number]
    | null
    | undefined,
  width: number,
  height: number,
) {
  return image && "asset" in image && image.asset._ref
    ? urlFor(image).width(width).height(height).url()
    : null;
}

export function optionButtonClass(active: boolean) {
  return [
    "rounded-[16px] border px-4 py-3 text-left text-sm transition-all duration-200",
    active
      ? "border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.12)] text-[var(--color-dark-100)] shadow-[0_12px_28px_rgba(255,165,0,0.08)]"
      : "border-black/8 bg-white/74 text-[var(--color-gray-100)] hover:border-black/18 hover:text-[var(--color-dark-100)]",
  ].join(" ");
}

export function optionSectionClass() {
  return "border-t border-black/8 pt-5";
}

export function getSpecValue(item: ShopItem, label: string) {
  return item.specifications?.find(
    (spec) => spec.label.toLowerCase() === label.toLowerCase(),
  )?.value;
}

export function parseNumericValue(value: string | number | undefined) {
  if (value == null) return 0;
  const parsed =
    typeof value === "number"
      ? value
      : Number.parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getSizePreviewSrc(
  item: ShopItem,
  selection: ShopQuoteSelection,
  width = 1200,
  height = 1500,
) {
  if (resolveProductLine(item) === "custom-print-panels") return null;
  const sizeOption = resolveShopSelection(item, selection).sizeOption;
  return (
    getImageSrc(sizeOption?.previewImage, width, height) ||
    (isFlexiProduct(item) && sizeOption?.id
      ? STANDARD_FLEXI_SIZE_IMAGE_SRC[sizeOption.id]
      : null)
  );
}

export function getColourSwatchSrc(
  option: ReturnType<typeof resolveShopSelection>["colourOption"] | undefined,
  width = 1200,
  height = 1500,
) {
  if (!option) return null;
  return (
    getImageSrc(option.swatchImage, width, height) ||
    ("swatchSrc" in option && typeof option.swatchSrc === "string"
      ? option.swatchSrc
      : null)
  );
}

export function getSootheFabricSwatchStyle(
  option: ReturnType<typeof resolveShopSelection>["colourOption"] | undefined,
) {
  // Crops the original chart photo to the fabric cell; no recolouring.
  return colourSwatchStyle(option?.swatchSrc, option?.swatchRegion);
}
