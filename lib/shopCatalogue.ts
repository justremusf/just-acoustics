import { SOOTHE_FABRIC_CHARTS, SOOTHE_FABRICS } from "./sootheFabrics";
import { STANDARD_FLEXI_COLOURS } from "./flexiColours";
import type { ShopItem } from "./types";
import { resolveProductLine } from "./shopProductProfiles";
function isFlexiProduct(item: ShopItem) {
  return resolveProductLine(item) === "flexi-panel";
}

function isSootheProduct(item: ShopItem) {
  const line = resolveProductLine(item);
  return line === "bass-trap" || line === "gobo";
}


function getSizeShapeLabel(option: { id?: string; label?: string }) {
  const id = option.id || "";
  if (id === "600x600") return "Square";
  if (id === "1200x600") return "Standard";
  if (id === "1800x600") return "Tall";
  return option.label || "Panel";
}

function getSizeDimensionLabel(option: {
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


const STANDARD_FLEXI_SIZE_OPTIONS = [
  {
    id: "600x600",
    label: "Square",
    widthMm: 600,
    heightMm: 600,
    description: "60 x 60cm",
    priceAdjustment: -45,
    available: true,
  },
  {
    id: "1200x600",
    label: "Standard",
    widthMm: 1200,
    heightMm: 600,
    description: "60 x 120cm",
    priceAdjustment: 0,
    available: true,
  },
  {
    id: "1800x600",
    label: "Tall",
    widthMm: 1800,
    heightMm: 600,
    description: "60 x 180cm",
    priceAdjustment: 60,
    available: true,
  },
];

const STANDARD_FLEXI_THICKNESS_OPTIONS = [
  {
    id: "25mm",
    label: "25 mm",
    millimeters: 25,
    nrc: "NRC 0.80",
    priceAdjustment: 0,
    available: true,
  },
  {
    id: "50mm",
    label: "50 mm",
    millimeters: 50,
    nrc: "NRC 1.00",
    priceAdjustment: 20,
    available: true,
  },
];

const STANDARD_FLEXI_INSTALLATION_OPTIONS = [
  {
    id: "self-install",
    label: "Self-install",
    description: "Panels are supplied for your own installation.",
    priceType: "none",
    price: 0,
    available: true,
  },
  {
    id: "professional-install",
    label: "Professional installation",
    description:
      "Just Acoustics installs the panels. Final access requirements are reviewed before payment.",
    priceType: "perUnit",
    price: 45,
    available: true,
  },
];



function getConfigurableItem(source: ShopItem) {
  const item: ShopItem = { ...source, installationOptions: [{ id: "self-install", label: "Supply only", priceType: "none", price: 0, available: true }] };
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


export { isFlexiProduct, isSootheProduct, getSizeShapeLabel, getSizeDimensionLabel, getConfigurableItem, STANDARD_FLEXI_SIZE_OPTIONS, STANDARD_FLEXI_THICKNESS_OPTIONS, STANDARD_FLEXI_INSTALLATION_OPTIONS, STANDARD_FLEXI_COLOURS, SOOTHE_FABRIC_CHARTS, SOOTHE_FABRICS };
