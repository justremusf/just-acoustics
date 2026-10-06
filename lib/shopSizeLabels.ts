// Size option labels shared by the product configurator (client) and the
// orders API via lib/shopCatalogue. Kept dependency-free so the configurator
// bundle doesn't pull in the product catalogue/profile data.
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
