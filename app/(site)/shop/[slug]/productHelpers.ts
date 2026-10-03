import { urlFor } from "@/sanity/lib/image";
import type { ShopItem } from "@/lib/types";
import { resolveProductLine } from "@/lib/shopProductProfiles";
import {
  resolveShopSelection,
  type ShopQuoteSelection,
} from "@/lib/shopPricing";
import {
  SOOTHE_FABRICS,
  STANDARD_FLEXI_COLOURS,
  STANDARD_FLEXI_INSTALLATION_OPTIONS,
  STANDARD_FLEXI_SIZE_IMAGE_SRC,
  STANDARD_FLEXI_SIZE_OPTIONS,
  STANDARD_FLEXI_THICKNESS_OPTIONS,
} from "./productData";

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

export function isFlexiProduct(item: ShopItem) {
  return resolveProductLine(item) === "flexi-panel";
}

export function isSootheProduct(item: ShopItem) {
  const line = resolveProductLine(item);
  return line === "bass-trap" || line === "gobo";
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

export function getSizeShapeLabel(option: { id?: string; label?: string }) {
  const id = option.id || "";
  if (id === "600x600") return "Square";
  if (id === "1200x600") return "Standard";
  if (id === "1800x600") return "Tall";
  return option.label || "Panel";
}

export function getSizeDimensionLabel(option: {
  widthMm?: number;
  heightMm?: number;
  description?: string;
  label?: string;
}) {
  if (option.widthMm && option.heightMm) {
    return `${option.widthMm / 10} x ${option.heightMm / 10}cm`;
  }
  return option.description || option.label || "";
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

export function getConfigurableItem(item: ShopItem) {
  const line = resolveProductLine(item);

  if (isSootheProduct(item)) {
    return {
      ...item,
      configuratorEnabled: true,
      colourOptions: SOOTHE_FABRICS,
    } as ShopItem;
  }

  if (line === "custom-print-panels") {
    return {
      ...item,
      price: 120,
      defaultSizeId: "1200x600",
      defaultThicknessId: "25mm",
      sizeOptions: STANDARD_FLEXI_SIZE_OPTIONS,
      thicknessOptions: STANDARD_FLEXI_THICKNESS_OPTIONS,
      colourOptions: [],
      installationOptions: item.installationOptions?.length
        ? item.installationOptions
        : STANDARD_FLEXI_INSTALLATION_OPTIONS,
    } as ShopItem;
  }

  if (!isFlexiProduct(item)) return item;

  return {
    ...item,
    price: 100,
    defaultSizeId: "1200x600",
    defaultThicknessId: item.defaultThicknessId || "25mm",
    sizeOptions: STANDARD_FLEXI_SIZE_OPTIONS,
    thicknessOptions: STANDARD_FLEXI_THICKNESS_OPTIONS,
    colourOptions: STANDARD_FLEXI_COLOURS,
    installationOptions: item.installationOptions?.length
      ? item.installationOptions
      : STANDARD_FLEXI_INSTALLATION_OPTIONS,
  } as ShopItem;
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
  if (!option?.swatchSrc || !option.swatchCrop) return undefined;
  // Crop tightly into the photographed panel so labels and white chart space never enter the swatch.
  const renderedWidth = 760;
  const renderedHeight = 1140;
  const swatchCenter = 22;
  return {
    backgroundImage: `url("${option.swatchSrc}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${renderedWidth}px ${renderedHeight}px`,
    backgroundPosition: `${swatchCenter - (option.swatchCrop.x * renderedWidth) / 1024}px ${swatchCenter - (option.swatchCrop.y * renderedHeight) / 1536}px`,
  };
}
