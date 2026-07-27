import type {
  ShopItem,
  ShopPackageOption,
  ShopSizeOption,
  ShopThicknessOption,
} from "./types";
import { formatSgd } from "./shopPricing";
import { resolveProductLine } from "./shopProductProfiles";

export function getShopPriceLabel(item: ShopItem) {
  if (item.price == null) return "Request a Quote";
  return resolveProductLine(item) === "accessory"
    ? formatSgd(item.price)
    : `From ${formatSgd(item.price)}`;
}

export function formatCmDimensionLabel(
  option?: Pick<
    ShopSizeOption,
    "widthMm" | "heightMm" | "description" | "label"
  > | null,
) {
  if (!option) return "";
  if (option.widthMm && option.heightMm) {
    const widthCm = Math.round(option.widthMm / 10);
    const heightCm = Math.round(option.heightMm / 10);
    return `${widthCm} x ${heightCm} cm`;
  }
  return option.description || option.label || "";
}

export function formatThicknessLabel(
  option?: Pick<ShopThicknessOption, "millimeters" | "label"> | null,
) {
  if (!option) return "";
  if (option.millimeters) return `${option.millimeters / 10} cm`;
  return option.label || "";
}

export function getItemSizeLabel(item: ShopItem) {
  const firstAvailable =
    item.sizeOptions?.find((option) => option.available !== false) ||
    item.sizeOptions?.[0];
  return (
    formatCmDimensionLabel(firstAvailable) ||
    item.shortDescription ||
    item.title
  );
}

export function getPackageSummary(option?: ShopPackageOption | null) {
  if (!option) return "";
  const countLabel = `${option.panelCount || 0} panel${option.panelCount === 1 ? "" : "s"}`;
  return option.bestFor ? `${countLabel} · ${option.bestFor}` : countLabel;
}
