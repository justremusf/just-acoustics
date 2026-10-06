// Server-side helpers for the product page. Client islands receive the
// results as props (see getProductMedia) so Sanity URL building and the
// product catalogue/profile data stay out of the browser bundle.
import { urlFor } from "@/sanity/lib/image";
import type { ShopItem } from "@/lib/types";
import {
  resolveShopSelection,
  type ShopQuoteSelection,
} from "@/lib/shopPricing";
import { resolveProductLine } from "@/lib/shopProductProfiles";
import { isFlexiProduct } from "@/lib/shopCatalogue";
import { STANDARD_FLEXI_SIZE_IMAGE_SRC } from "./productData";

// Shared with the orders API so the configurator and server pricing agree.
// getConfigurableItem offers supply only: installation is a separate enquiry.
export {
  getConfigurableItem,
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

/** Image URLs the client islands need, resolved once on the server. */
export type ProductMedia = {
  /** Main image at gallery size (1200x1500). */
  mainImageSrc: string | null;
  /** Main image at cart size (640x640), the add-to-cart fallback. */
  cartImageSrc: string | null;
  /** Size preview per size option id: gallery (1200x1500) and cart (640x640). */
  sizePreviews: Record<string, { gallery: string | null; cart: string | null }>;
  /** Swatch per colour option id: button (120x120) and cart (64x64). */
  colourSwatches: Record<string, { button: string | null; cart: string | null }>;
};

export function getProductMedia(configurableItem: ShopItem): ProductMedia {
  const sizePreviews: ProductMedia["sizePreviews"] = {};
  for (const option of configurableItem.sizeOptions || []) {
    if (!option.id) continue;
    const selection = { sizeId: option.id, quantity: 1 } as ShopQuoteSelection;
    sizePreviews[option.id] = {
      gallery: getSizePreviewSrc(configurableItem, selection) ?? null,
      cart: getSizePreviewSrc(configurableItem, selection, 640, 640) ?? null,
    };
  }
  const colourSwatches: ProductMedia["colourSwatches"] = {};
  for (const option of configurableItem.colourOptions || []) {
    if (!option.id) continue;
    colourSwatches[option.id] = {
      button: getColourSwatchSrc(option, 120, 120),
      cart: getColourSwatchSrc(option, 64, 64),
    };
  }
  return {
    mainImageSrc: getImageSrc(configurableItem.mainImage, 1200, 1500),
    cartImageSrc: getImageSrc(configurableItem.mainImage, 640, 640),
    sizePreviews,
    colourSwatches,
  };
}
