// Static product data for the product detail page (performance series,
// gallery assets, visible colour/fabric ids). Server-only: client islands
// receive what they need as props.
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

// Flexi colours and Soothe fabrics are shared with the orders API
// (lib/orders/validation.ts) so browser and server pricing always agree.
export {
  FLEXI_COLOUR_CHART_SRC as STANDARD_FLEXI_COLOUR_CHART_SRC,
  FLEXI_VISIBLE_COLOUR_IDS as STANDARD_FLEXI_VISIBLE_COLOUR_IDS,
} from "@/lib/flexiColours";
export { SOOTHE_FABRIC_CHARTS } from "@/lib/sootheFabrics";

export const STANDARD_FLEXI_SIZE_IMAGE_SRC: Record<string, string> = {
  "600x600": "/assets/shop/standard-flexi/standard-flexi-600x600.webp",
  "1200x600": "/assets/shop/standard-flexi/standard-flexi-1200x600.webp",
  "1800x600": "/assets/shop/standard-flexi/standard-flexi-1800x600.webp",
};

export const STANDARD_FLEXI_IN_USE_IMAGES = [
  "/assets/shop/standard-flexi/gallery/flexi-gallery-1.webp",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-2.webp",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-3.webp",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-4.webp",
];

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
