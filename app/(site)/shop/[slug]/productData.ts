// Static product data for the product detail page (performance series,
// Standard Flexi options and colours, Soothe fabric collections).
import type { resolveProductLine } from "@/lib/shopProductProfiles";

export const ACOUSTIC_FREQUENCIES = [
  { key: "hz125", label: "125Hz" },
  { key: "hz250", label: "250Hz" },
  { key: "hz500", label: "500Hz" },
  { key: "hz1000", label: "1kHz" },
  { key: "hz2000", label: "2kHz" },
  { key: "hz3150", label: "3.15kHz" },
  { key: "hz4000", label: "4kHz" },
  { key: "hz5000", label: "5kHz" },
  { key: "hz6300", label: "6.3kHz" },
  { key: "hz8000", label: "8kHz" },
] as const;

export type PerformanceSeries = {
  id: string;
  label: string;
  color: string;
  values: number[];
};

type FrequencyGuideItem = {
  range: string;
  title: string;
  copy: string;
};

export const FREQUENCY_GUIDES: Record<
  Exclude<ReturnType<typeof resolveProductLine>, "accessory">,
  FrequencyGuideItem[]
> = {
  "flexi-panel": [
    {
      range: "500 Hz-1 kHz",
      title: "Speech body",
      copy: "The weight and fullness of voices and everyday conversation.",
    },
    {
      range: "1-4 kHz",
      title: "Voice clarity",
      copy: "This is where speech intelligibility issues are often easiest to notice.",
    },
    {
      range: "4-8 kHz",
      title: "Sharp reflections",
      copy: "Hard rooms can make consonants, sibilance, and clatter feel tiring here.",
    },
  ],
  "bass-trap": [
    {
      range: "40-80 Hz",
      title: "Sub-bass weight",
      copy: "Deep lows from subwoofers, kick fundamentals, and room modes.",
    },
    {
      range: "80-160 Hz",
      title: "Kick and bass punch",
      copy: "Where low-end impact can become boomy or linger too long.",
    },
    {
      range: "160-250 Hz",
      title: "Low-mid buildup",
      copy: "Excess energy here can make mixes feel muddy and crowded.",
    },
  ],
  gobo: [
    {
      range: "125-500 Hz",
      title: "Instrument body",
      copy: "The weight of vocals, guitars, drums, and nearby sources.",
    },
    {
      range: "500 Hz-4 kHz",
      title: "Vocal clarity",
      copy: "The key speech range where reflections and microphone bleed stand out.",
    },
    {
      range: "4-8 kHz",
      title: "Cymbal and room spill",
      copy: "Bright reflections from cymbals and hard surfaces become obvious here.",
    },
  ],
  "custom-print-panels": [
    {
      range: "500 Hz-1 kHz",
      title: "Speech body",
      copy: "The fullness of conversation in offices, restaurants, and public spaces.",
    },
    {
      range: "1-4 kHz",
      title: "Voice clarity",
      copy: "This is the most important zone for making speech easier to understand.",
    },
    {
      range: "4-8 kHz",
      title: "High-frequency reflections",
      copy: "Controls the sharp edge of clatter, consonants, and hard-room brightness.",
    },
  ],
  "pet-panel": [
    {
      range: "500 Hz-1 kHz",
      title: "Office chatter",
      copy: "The body of nearby conversation and general occupied-room noise.",
    },
    {
      range: "1-4 kHz",
      title: "Speech clarity",
      copy: "A critical range for meetings, teaching, hospitality, and everyday speech.",
    },
    {
      range: "4-8 kHz",
      title: "Hard-surface reflections",
      copy: "Higher-pitched clatter and sharp reflections are most noticeable here.",
    },
  ],
};

export const STANDARD_FLEXI_PERFORMANCE_SERIES: PerformanceSeries[] = [
  {
    id: "flexi-25",
    label: "25 mm Flexi™ Panel",
    color: "#356AE6",
    values: [0.08, 0.08, 0.18, 0.16, 0.18, 0.58, 0.95, 0.99, 1.0, 1.0],
  },
  {
    id: "flexi-50",
    label: "50 mm Flexi™ Panel",
    color: "#4D9BFF",
    values: [0.1, 0.03, 0.22, 0.31, 0.43, 0.94, 1.14, 1.06, 1.02, 0.99],
  },
  {
    id: "soothe-bass",
    label: "Soothe™ Bass Trap",
    color: "#8F5AD9",
    values: [0.22, 0.18, 0.48, 0.79, 1.14, 1.05, 1.02, 1.04, 1.02, 0.97],
  },
  {
    id: "soothe-maxx",
    label: "Soothe™ Maxx Bass Trap",
    color: "#E35D86",
    values: [0.25, 0.3, 0.66, 1.02, 1.01, 1.0, 1.01, 1.05, 1.04, 1.01],
  },
];

export const BASS_TRAP_FREQUENCIES = [
  { key: "hz40", label: "40Hz" },
  { key: "hz50", label: "50Hz" },
  { key: "hz63", label: "63Hz" },
  { key: "hz80", label: "80Hz" },
  { key: "hz100", label: "100Hz" },
  { key: "hz125", label: "125Hz" },
  { key: "hz160", label: "160Hz" },
  { key: "hz200", label: "200Hz" },
  { key: "hz250", label: "250Hz" },
  { key: "hz500", label: "500Hz" },
  { key: "hz1000", label: "1kHz" },
  { key: "hz2000", label: "2kHz" },
  { key: "hz4000", label: "4kHz" },
  { key: "hz8000", label: "8kHz" },
] as const;

export const BASS_TRAP_REFERENCE_SERIES: PerformanceSeries[] = [
  {
    id: "studio-150",
    label: "Studio Bass Trap - 15 cm",
    color: "#4D9BFF",
    values: [
      0.06, 0.1, 0.15, 0.22, 0.31, 0.42, 0.54, 0.66, 0.79, 0.92, 1.0, 1.02, 1.0,
      0.98,
    ],
  },
  {
    id: "maxx-300",
    label: "Maxx Bass Trap - 30 cm",
    color: "#E35D86",
    values: [
      0.13, 0.21, 0.31, 0.44, 0.58, 0.72, 0.86, 0.97, 1.03, 1.05, 1.04, 1.02,
      1.0, 0.98,
    ],
  },
];

export const PET_REFERENCE_SERIES: PerformanceSeries[] = [
  {
    id: "pet-9",
    label: "9 mm PET - indicative",
    color: "#4D9BFF",
    values: [0.03, 0.08, 0.22, 0.4, 0.56, 0.68, 0.74, 0.78, 0.78, 0.76],
  },
  {
    id: "pet-12",
    label: "12 mm PET - indicative",
    color: "#8F5AD9",
    values: [0.06, 0.1, 0.28, 0.61, 0.89, 0.93, 0.95, 0.94, 0.92, 0.88],
  },
];

export const GOBO_REFERENCE_SERIES: PerformanceSeries[] = [
  {
    id: "gobo-slim",
    label: "Slim custom build",
    color: "#4D9BFF",
    values: [0.08, 0.16, 0.42, 0.74, 0.92, 0.97, 0.98, 0.96, 0.92, 0.88],
  },
  {
    id: "gobo-deep",
    label: "Deep custom build",
    color: "#8F5AD9",
    values: [0.18, 0.48, 0.76, 0.93, 1.02, 1.03, 1.01, 0.99, 0.96, 0.92],
  },
];

export const STANDARD_FLEXI_SIZE_OPTIONS = [
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

export const STANDARD_FLEXI_THICKNESS_OPTIONS = [
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

export const STANDARD_FLEXI_INSTALLATION_OPTIONS = [
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

export const STANDARD_FLEXI_SIZE_IMAGE_SRC: Record<string, string> = {
  "600x600": "/assets/shop/standard-flexi/standard-flexi-600x600.webp",
  "1200x600": "/assets/shop/standard-flexi/standard-flexi-1200x600.webp",
  "1800x600": "/assets/shop/standard-flexi/standard-flexi-1800x600.webp",
};

export const STANDARD_FLEXI_COLOUR_CHART_SRC =
  "/assets/shop/standard-flexi/source/colour-swatches.webp";

export const PRODUCT_PLAY_ICON =
  "/assets/webflow/6967a0f62bd9b7dce9e01040_Play%20icon.png";

export const STANDARD_FLEXI_IN_USE_IMAGES = [
  "/assets/shop/standard-flexi/gallery/flexi-gallery-1.webp",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-2.webp",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-3.webp",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-4.webp",
];

export const STANDARD_FLEXI_VISIBLE_COLOUR_IDS = [
  "white",
  "pearl-05",
  "terracotta-16",
  "magenta-18",
  "seafoam-22",
  "sky-blue-23",
  "linen-26",
  "bone-34",
  "black",
];

export const STANDARD_FLEXI_COLOURS = [
  "White",
  "Egg White 01",
  "Stone Grey 02",
  "Sand 03",
  "Ash 04",
  "Pearl 05",
  "Silver Mist 06",
  "Frost 07",
  "Dove Grey 08",
  "Cement 09",
  "Steel 10",
  "Moss 11",
  "Olive 12",
  "Blush 13",
  "Amber 14",
  "Walnut 15",
  "Terracotta 16",
  "Crimson 17",
  "Magenta 18",
  "Rose 19",
  "Plum 20",
  "Fog 21",
  "Seafoam 22",
  "Sky Blue 23",
  "Charcoal 24",
  "Slate 25",
  "Linen 26",
  "Concrete 27",
  "Ocean Blue 28",
  "Powder Blue 29",
  "Graphite 30",
  "Navy 31",
  "Oat 32",
  "Mocha 33",
  "Bone 34",
  "Anchor Grey 35",
  "Espresso 36",
  "Black",
].map((name, index) => {
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return {
    id,
    name,
    swatchSrc: `/assets/shop/standard-flexi/swatches/${String(index + 1).padStart(2, "0")}-${id}.png`,
    priceAdjustment: 0,
    available: true,
  };
});

export const SOOTHE_FABRIC_CHARTS = {
  "8080": "/assets/shop/soothe/source/soothe-8080-series.webp",
  "2020": "/assets/shop/soothe/source/soothe-2020-series.webp",
} as const;

const SOOTHE_FABRIC_GRID_X = [145, 383, 622, 861];

const SOOTHE_FABRIC_GRID_Y = [175, 400, 625, 850, 1075, 1275, 1430];

function createSootheFabricSeries(
  series: keyof typeof SOOTHE_FABRIC_CHARTS,
  fabrics: Array<[name: string, code: string]>,
) {
  return fabrics.map(([name, code], index) => ({
    id: code.toLowerCase(),
    name: `${name} ${code}`,
    description: `${series} Series fabric`,
    fabricSeries: series,
    swatchSrc: SOOTHE_FABRIC_CHARTS[series],
    swatchCrop: {
      x: SOOTHE_FABRIC_GRID_X[index % 4],
      y: SOOTHE_FABRIC_GRID_Y[Math.floor(index / 4)],
    },
    priceAdjustment: 0,
    available: true,
  }));
}

const SOOTHE_8080_FABRICS = createSootheFabricSeries("8080", [
  ["Steel", "8080-11"],
  ["Moonstone", "8080-12"],
  ["Aqua", "8080-03"],
  ["Illume Green", "8080-29"],
  ["Winter", "8080-25"],
  ["Haze", "8080-23"],
  ["Blue Lagoon", "8080-05"],
  ["Mango", "8080-06"],
  ["Champagne", "8080-26"],
  ["Heather", "8080-15"],
  ["Teal Blue", "8080-19"],
  ["Rose", "8080-08"],
  ["Bright Orange", "8080-30"],
  ["Buttercup", "8080-27"],
  ["Iris", "8080-13"],
  ["Flame", "8080-10"],
  ["Ash", "8080-28"],
  ["Espresso", "8080-24"],
  ["Ocean Deep", "8080-18"],
  ["Cherry", "8080-09"],
  ["Neon Red", "8080-31"],
  ["Bamboo", "8080-02"],
  ["Carbon", "8080-17"],
  ["Royal Purple", "8080-21"],
  ["Rust", "8080-20"],
  ["Butternut", "8080-01"],
]);

const SOOTHE_2020_FABRICS = createSootheFabricSeries("2020", [
  ["Milky Way", "2020-14"],
  ["Lemon Peel", "2020-12"],
  ["Sorbet Lime", "2020-11"],
  ["Glacier", "2020-13"],
  ["Mica", "2020-07"],
  ["Desert", "2020-16"],
  ["Wheat", "2020-03"],
  ["Moss", "2020-15"],
  ["Sky", "2020-25"],
  ["Sea Breeze", "2020-18"],
  ["Rattan", "2020-19"],
  ["Golden Dust", "2020-22"],
  ["Green Field", "2020-06"],
  ["Marine Blue", "2020-05"],
  ["Stone", "2020-04"],
  ["Chestnut", "2020-09"],
  ["Freezy Orange", "2020-17"],
  ["Green Brier", "2020-08"],
  ["Blueridge", "2020-02"],
  ["Dark Grey", "2020-26"],
  ["Tearose", "2020-01"],
  ["Carrot", "2020-27"],
  ["Royal", "2020-28"],
  ["Capuccino", "2020-23"],
  ["Cherry", "2020-29"],
  ["Cardinal Red", "2020-24"],
  ["Baltic", "2020-30"],
  ["Black", "2020-21"],
]);

export const SOOTHE_FABRICS = [...SOOTHE_8080_FABRICS, ...SOOTHE_2020_FABRICS];

export const SOOTHE_VISIBLE_FABRIC_IDS = [
  "8080-11",
  "8080-25",
  "8080-17",
  "8080-09",
  "2020-14",
  "2020-18",
  "2020-15",
  "2020-21",
];
