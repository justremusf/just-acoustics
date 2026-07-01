"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle,
  Download,
  FileText,
  Flame,
  HelpCircle,
  Headphones,
  Layers,
  MessageCircle,
  PackageCheck,
  Palette,
  Presentation,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Truck,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import FAQ, { type FaqItem } from "@/components/sections/FAQ";
import { useCart, type CartItemOption } from "@/components/cart/CartProvider";
import ShimmerButton from "@/components/ui/shimmer-button";
import ProductPanelCalculator from "@/components/shop/ProductPanelCalculator";
import { urlFor } from "@/sanity/lib/image";
import type { ShopItem } from "@/lib/types";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import {
  getProductProfile,
  resolveProductLine,
  type ProductFeatureIcon,
} from "@/lib/shopProductProfiles";
import {
  calculateShopPrice,
  formatSgd,
  getDefaultSelection,
  normaliseQuantity,
  resolveShopSelection,
  type ShopQuoteSelection,
} from "@/lib/shopPricing";

const CATEGORY_LABELS: Record<string, string> = {
  "package-deals": "Package Deals",
  "standard-panels": "Acoustic Panels",
  "ceiling-panels": "Ceiling Panels",
  soundproofing: "Soundproofing",
  "custom-solutions": "Custom Solutions",
  accessories: "Accessories",
};

function getImageSrc(
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

function isFlexiProduct(item: ShopItem) {
  return resolveProductLine(item) === "flexi-panel";
}

function isSootheProduct(item: ShopItem) {
  const line = resolveProductLine(item);
  return line === "bass-trap" || line === "gobo";
}

const shopPortableTextComponents = {
  types: {
    image: ({ value }: { value?: ShopItem["mainImage"] }) => {
      const src = getImageSrc(value, 1200, 800);
      return src ? (
        <div className="my-8 overflow-hidden rounded-[24px]">
          <Image
            src={src}
            alt={value?.alt || ""}
            width={1200}
            height={800}
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            quality={72}
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null;
    },
  },
};

function optionButtonClass(active: boolean) {
  return [
    "rounded-[16px] border px-4 py-3 text-left text-sm transition-all duration-200",
    active
      ? "border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.12)] text-[var(--color-dark-100)] shadow-[0_12px_28px_rgba(255,165,0,0.08)]"
      : "border-black/8 bg-white/74 text-[var(--color-gray-100)] hover:border-black/18 hover:text-[var(--color-dark-100)]",
  ].join(" ");
}

function optionSectionClass() {
  return "border-t border-black/8 pt-5";
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

function getSpecValue(item: ShopItem, label: string) {
  return item.specifications?.find(
    (spec) => spec.label.toLowerCase() === label.toLowerCase(),
  )?.value;
}

function ProductDetailAccordions({ item }: { item: ShopItem }) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const panelRef = useRef<Record<string, HTMLDivElement | null>>({});
  const isStandardFlexi = isFlexiProduct(item);
  const productLine = resolveProductLine(item);
  const materialNotes: Record<string, string> = {
    "bass-trap":
      "Studio: two layers of rockwool in a 15 cm deep absorptive build. Maxx: four layers of rockwool in a 30 cm build with an internal air gap. Both use an acoustically transparent fabric finish. Final fire and building-management requirements are confirmed before production.",
    gobo: "A freestanding acoustic build with an absorptive core, durable fabric finish, internal frame, and stable floor support. Final depth and construction are selected for the required balance of absorption, portability, and microphone separation.",
    "custom-print-panels":
      "A high-density absorptive core with a custom-printed synthetic face. The finish is wipeable and more moisture-resistant than fabric, but it is not waterproof. Artwork and material suitability are approved before production.",
    "pet-panel":
      "Compressed recycled PET acoustic felt in 9 mm or 12 mm thickness. It is lightweight, suitable for custom cutting, and intended for indoor direct-fix decorative and acoustic applications.",
    accessory:
      "Mounting hardware must be matched to the panel, surface, loading, and installation method. Contact the team if the substrate or required fixing is uncertain.",
  };
  const specText = [
    getSpecValue(item, "Thickness") &&
      `Depth / thickness: ${getSpecValue(item, "Thickness")}`,
    getSpecValue(item, "Standard Size") &&
      `Standard size: ${getSpecValue(item, "Standard Size")}`,
    item.sizeOptions?.length
      ? `Available sizes: ${item.sizeOptions
          .filter((option) => option.available !== false)
          .map((option) => option.label)
          .join(", ")}`
      : null,
    getSpecValue(item, "Acoustic Performance") &&
      `Performance: ${getSpecValue(item, "Acoustic Performance")}`,
  ].filter(Boolean);

  const panels = isStandardFlexi
    ? [
        {
          title: "Shipping & Lead Time",
          body: "Flexi™ Acoustic Panels are made to order based on your selected size, colour, and quantity.\n\nStandard orders usually take 4 weeks to prepare. Larger custom orders may require additional lead time.\n\nDelivery and installation are available across Singapore. Timeline will be confirmed before production begins.",
        },
        {
          title: "Specifications",
          body: "Thickness: 2.5cm or 5cm\nStandard sizes: 60 x 60cm, 30 x 120cm, 60 x 90cm, and 60 x 120cm\nCustom sizes: Available upon request\nMounting: Wall or ceiling\nCore density: 96kg/m3\nNRC: Up to 1.00\nAverage weight: 60 x 120 x 5cm is approximately 4kg",
        },
        {
          title: "Installation",
          body: "Flexi™ Acoustic Panels can be installed on walls or ceilings. Placement depends on the room layout and acoustic goal. Our team offers complimentary consultation for each project or order.\n\nWall panels can be installed with a non-drill option using wall impalers and adhesive for a clean, secure finish. Ceiling panels require drilling, hooks, wires, or direct fixing depending on the ceiling type so the mounting is safe and secure.\n\nFor best results, panels should be evenly placed around reflection-heavy areas rather than randomly installed.",
        },
        {
          title: "Materials, Safety, and Care",
          body: "Flexi™ Acoustic Panels are built with a high-density acoustic glasswool core, wrapped in acoustically transparent polyester fabric.\n\nCore: High-density acoustic glass wool\nDensity: 96kg/m3\nFabric: Polyester acoustic fabric\nEdge: Bevel edge finish\nUse: Safe for normal indoor use in offices, homes, studios, restaurants, churches, and commercial spaces\n\nFor cleaning, vacuum gently or wipe lightly with a dry or slightly damp cloth. Avoid soaking the panel, using harsh chemicals, or scrubbing the fabric.",
        },
        {
          title: "Warranty",
          body: "All panels include a 1-year limited warranty covering defects in materials and workmanship under normal indoor use.\n\nDamage from misuse, water exposure, incorrect installation, or normal wear and tear is not covered.",
        },
      ]
    : [
        {
          title: "Lead time",
          body:
            item.leadTime ||
            "Made-to-order products are confirmed after we review your selected quantity, finish, and delivery requirements in Singapore.",
        },
        {
          title: "Specifications",
          body: specText.length
            ? specText.join("\n")
            : "We will confirm exact panel dimensions, weight, and mounting details before production.",
        },
        {
          title: "Installation",
          body: item.installationOptions?.length
            ? item.installationOptions
                .filter((option) => option.available !== false)
                .map(
                  (option) =>
                    `${option.label}: ${option.description || "Suitable for selected site conditions."}`,
                )
                .join("\n")
            : "We can guide wall, ceiling, or custom mounting based on your room photos, ceiling type, and access requirements.",
        },
        {
          title: "Materials & Safety",
          body:
            materialNotes[productLine] ||
            "Built for indoor acoustic use with durable finishes selected for offices, studios, restaurants, schools, and commercial interiors. For projects with fire-rating or building-management requirements, we will confirm the suitable specification before production.",
        },
        {
          title: "Warranty",
          body: "Most acoustic products are made to order. We confirm dimensions, colours, and installation requirements before production so the final order matches your room and use case.",
        },
      ];

  const togglePanel = (title: string) => {
    setOpenPanel((current) => (current === title ? null : title));
  };

  return (
    <div className="product-accordion-list overflow-hidden rounded-[24px] border border-black/8 bg-white/78">
      {panels.map((panel) => (
        <div
          key={panel.title}
          className="border-b border-black/8 last:border-b-0"
        >
          <button
            type="button"
            onClick={() => togglePanel(panel.title)}
            className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[var(--color-dark-100)] marker:hidden"
            aria-expanded={openPanel === panel.title}
          >
            {panel.title}
            <span
              className={`text-xl leading-none text-[var(--color-gray-200)] transition-transform duration-300 ${openPanel === panel.title ? "rotate-45" : "rotate-0"}`}
            >
              +
            </span>
          </button>
          <div
            ref={(node) => {
              panelRef.current[panel.title] = node;
            }}
            style={{
              height:
                openPanel === panel.title
                  ? (panelRef.current[panel.title]?.scrollHeight ?? "auto")
                  : 0,
              overflow: "hidden",
              transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="whitespace-pre-line px-5 pb-5 text-sm leading-7 text-[var(--color-gray-100)]">
              {panel.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductEditorialImage({
  image,
  fallback,
  alt,
}: {
  image?: ShopItem["mainImage"] | NonNullable<ShopItem["gallery"]>[number];
  fallback: string;
  alt: string;
}) {
  const src = getImageSrc(image, 960, 640) || fallback;

  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-[24px] bg-[var(--color-white-200)]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 100vw, 50vw"
        placeholder="blur"
        blurDataURL={IMAGE_BLUR_DATA_URL}
        quality={72}
        className="rounded-[24px] object-cover"
      />
    </div>
  );
}

const ACOUSTIC_FREQUENCIES = [
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

type PerformanceSeries = {
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

const FREQUENCY_GUIDES: Record<
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

function FrequencyGuide({
  productLine,
}: {
  productLine: Exclude<ReturnType<typeof resolveProductLine>, "accessory">;
}) {
  const items = FREQUENCY_GUIDES[productLine];

  return (
    <section
      className="mb-5 rounded-[24px] border border-black/7 bg-[linear-gradient(145deg,rgba(248,250,250,0.96),rgba(237,242,243,0.82))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] sm:p-5"
      aria-label="What the frequency ranges mean"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#137e89]">
            What does Hz mean?
          </p>
          <h3 className="m-0 mt-2 text-[20px] font-semibold leading-tight text-[var(--color-dark-100)] sm:text-[22px]">
            A quick guide to what you hear
          </h3>
        </div>
        <p className="m-0 max-w-[430px] text-xs leading-5 text-[var(--color-gray-100)]">
          Hz measures pitch: lower numbers are deeper sounds, while higher
          numbers are brighter and sharper.
        </p>
      </div>

      <div className="relative mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
        <span
          aria-hidden="true"
          className="absolute left-[9%] right-[9%] top-[13px] hidden h-px bg-[linear-gradient(90deg,rgba(19,126,137,0.16),rgba(19,126,137,0.42),rgba(19,126,137,0.16))] md:block"
        />
        {items.map((item) => (
          <div
            key={item.range}
            className="relative rounded-[18px] border border-white/88 bg-white/80 p-4 pt-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-sm"
          >
            <span
              aria-hidden="true"
              className="absolute left-4 top-[8px] hidden h-2.5 w-2.5 rounded-full border-2 border-white bg-[#137e89] shadow-[0_0_0_3px_rgba(19,126,137,0.14)] md:block"
            />
            <div className="flex items-center gap-2 md:mt-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#137e89] md:hidden" />
              <span className="rounded-full bg-[#137e89]/10 px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-[#137e89]">
                {item.range}
              </span>
            </div>
            <h4 className="m-0 mt-3 text-sm font-semibold text-[var(--color-dark-100)]">
              {item.title}
            </h4>
            <p className="m-0 mt-1.5 text-xs leading-5 text-[var(--color-gray-100)]">
              {item.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function parseNumericValue(value: string | number | undefined) {
  if (value == null) return 0;
  const parsed =
    typeof value === "number"
      ? value
      : Number.parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNrcRange(item: ShopItem) {
  if (isFlexiProduct(item)) {
    return "NRC 0.80-1.00";
  }

  const values = (item.acousticalSpecs?.rows || [])
    .map((row) => parseNumericValue(row.nrc))
    .filter((value) => value > 0);
  if (!values.length)
    return getSpecValue(item, "Acoustic Performance") || "Broadband absorption";

  const min = Math.min(...values).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  return `NRC ${min}-${max}`;
}

const STANDARD_FLEXI_PERFORMANCE_SERIES: PerformanceSeries[] = [
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

const BASS_TRAP_FREQUENCIES = [
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

const BASS_TRAP_REFERENCE_SERIES: PerformanceSeries[] = [
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

const PET_REFERENCE_SERIES: PerformanceSeries[] = [
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

const GOBO_REFERENCE_SERIES: PerformanceSeries[] = [
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

const STANDARD_FLEXI_SIZE_IMAGE_SRC: Record<string, string> = {
  "600x600": "/assets/shop/standard-flexi/standard-flexi-600x600.png",
  "1200x600": "/assets/shop/standard-flexi/standard-flexi-1200x600.png",
  "1800x600": "/assets/shop/standard-flexi/standard-flexi-1800x600.png",
};

const STANDARD_FLEXI_COLOUR_CHART_SRC =
  "/assets/shop/standard-flexi/source/colour-swatches.png";
const PRODUCT_PLAY_ICON =
  "/assets/webflow/6967a0f62bd9b7dce9e01040_Play%20icon.png";

const STANDARD_FLEXI_IN_USE_IMAGES = [
  "/assets/shop/standard-flexi/gallery/flexi-gallery-1.png",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-2.png",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-3.png",
  "/assets/shop/standard-flexi/gallery/flexi-gallery-4.png",
];

const STANDARD_FLEXI_GIK_PERFORMANCE_FREQUENCIES = [
  "40 Hz",
  "50 Hz",
  "63 Hz",
  "80 Hz",
  "100 Hz",
  "125 Hz",
  "160 Hz",
  "200 Hz",
  "250 Hz",
  "315 Hz",
  "400 Hz",
  "500 Hz",
  "630 Hz",
  "800 Hz",
  "1000 Hz",
  "1250 Hz",
  "1600 Hz",
  "2000 Hz",
  "2500 Hz",
  "3150 Hz",
  "4000 Hz",
  "5000 Hz",
  "6300 Hz",
  "8000 Hz",
  "10000 Hz",
];

const STANDARD_FLEXI_GIK_PERFORMANCE_SERIES = [
  {
    label: "Standard Flexi Acoustic Panel",
    color: "#c46a35",
    values: [
      0.01, 0.05, 0.03, 0.12, 0.14, 0.4, 0.43, 0.72, 0.84, 0.94, 1.12, 1.18,
      1.06, 1.05, 1.02, 1.06, 0.99, 1.03, 1.05, 1.04, 1.01, 1.04, 1.1, 1.13,
      1.15,
    ],
  },
  {
    label: "Typical Foam Panel",
    color: "#377d8b",
    values: [
      0.0, 0.0, 0.01, 0.04, 0.08, 0.28, 0.18, 0.35, 0.36, 0.48, 0.63, 0.8, 0.88,
      0.89, 0.92, 0.96, 0.9, 0.78, 0.73, 0.76, 0.77, 0.78, 0.74, 0.75, 0.75,
    ],
  },
];

const STANDARD_FLEXI_VISIBLE_COLOUR_IDS = [
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

const STANDARD_FLEXI_COLOURS = [
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

const SOOTHE_FABRIC_CHARTS = {
  "8080": "/assets/shop/soothe/source/soothe-8080-series.png",
  "2020": "/assets/shop/soothe/source/soothe-2020-series.png",
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

const SOOTHE_FABRICS = [...SOOTHE_8080_FABRICS, ...SOOTHE_2020_FABRICS];
const SOOTHE_VISIBLE_FABRIC_IDS = [
  "8080-11",
  "8080-25",
  "8080-17",
  "8080-09",
  "2020-14",
  "2020-18",
  "2020-15",
  "2020-21",
];

function getConfigurableItem(item: ShopItem) {
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

function getSizePreviewSrc(
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

function getColourSwatchSrc(
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

function getSootheFabricSwatchStyle(
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

function ProductColourSwatch({
  option,
}: {
  option: ReturnType<typeof resolveShopSelection>["colourOption"];
}) {
  const sootheStyle = getSootheFabricSwatchStyle(option);
  const swatchSrc = getColourSwatchSrc(option, 120, 120);

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
  selected,
  onSelect,
  showTooltip = false,
}: {
  option: NonNullable<ReturnType<typeof resolveShopSelection>["colourOption"]>;
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
        "group relative flex h-11 w-11 items-center justify-center rounded-full border p-0 transition-all duration-200 hover:z-50 hover:-translate-y-0.5 focus-visible:z-50",
        selected
          ? "border-[var(--color-dark-100)] ring-2 ring-[var(--color-brand-orange)] ring-offset-2"
          : "border-black/10 hover:border-black/25",
      ].join(" ")}
    >
      <span className="block h-full w-full overflow-hidden rounded-full">
        <ProductColourSwatch option={option} />
      </span>
      {showTooltip && (
        <span className="pointer-events-none absolute left-1/2 top-full z-[90] mt-2 w-max max-w-[180px] -translate-x-1/2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] font-semibold leading-tight text-[var(--color-dark-100)] opacity-0 shadow-[0_12px_28px_rgba(15,23,42,0.14)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {option.name}
        </span>
      )}
    </button>
  );
}

function ProductStorySections({ item }: { item: ShopItem }) {
  const profile = getProductProfile(item);
  const fallbackImages = profile.useCases.map((useCase, index) => {
    const title = useCase.title.toLowerCase();
    if (title.includes("studio") || title.includes("mix engineer")) {
      if (title.includes("drum"))
        return "/assets/studio-lander/solution-drum.jpg";
      return "/assets/pricing/home-studio.jpg";
    }
    if (
      title.includes("church") ||
      title.includes("worship") ||
      title.includes("event")
    ) {
      return "/assets/pricing/church.jpg";
    }
    if (
      title.includes("office") ||
      title.includes("work") ||
      title.includes("meeting") ||
      title.includes("branding")
    ) {
      return "/assets/pricing/office.jpg";
    }
    if (
      title.includes("restaurant") ||
      title.includes("hospitality") ||
      title.includes("cafe") ||
      title.includes("bar")
    ) {
      return "/assets/pricing/restaurant.jpg";
    }
    if (
      title.includes("school") ||
      title.includes("education") ||
      title.includes("classroom")
    ) {
      return "/assets/pricing/school.jpg";
    }
    if (title.includes("vocal")) {
      return "/assets/studio-lander/hero-studio.jpg";
    }
    if (title.includes("drum") || title.includes("amplifier")) {
      return "/assets/studio-lander/solution-drum.jpg";
    }
    if (title.includes("flexible") || title.includes("room")) {
      return "/assets/pricing/home-studio.jpg";
    }

    // Default fallbacks in case nothing matches
    const defaults = [
      "/assets/pricing/home-studio.jpg",
      "/assets/pricing/church.jpg",
      "/assets/pricing/office.jpg",
    ];
    return defaults[index % defaults.length];
  });
  const benefitIcons = [Headphones, SlidersHorizontal, Target];
  const isStandardFlexi = isFlexiProduct(item);

  return (
    <section className="home-shell page-hero-shell relative isolate overflow-hidden border border-white/78 bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.98),transparent_32%),radial-gradient(circle_at_88%_20%,rgba(255,183,62,0.10),transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.84),rgba(238,241,242,0.72))] shadow-[0_28px_90px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.96)_inset] backdrop-blur-[32px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[rgba(255,176,45,0.12)] blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[rgba(120,168,196,0.12)] blur-3xl"
      />
      <div
        className={
          isStandardFlexi
            ? "grid gap-8"
            : "grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center"
        }
      >
        <div className="relative z-10">
          <p className="page-kicker">{profile.storyEyebrow}</p>
          <h2
            className="m-0 mt-3 max-w-[654px] text-[clamp(32px,3.6vw,45px)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--color-dark-100)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {profile.storyTitle}
          </h2>
        </div>
        {!isStandardFlexi && (
          <div className="space-y-5 text-[15px] leading-8 text-[var(--color-gray-100)]">
            <p className="m-0">
              {item.shortDescription || profile.shortDescription}
            </p>
            {item.body && item.body.length > 0 ? (
              <div className="portable-copy">
                <PortableText
                  value={item.body as PortableTextBlock[]}
                  components={shopPortableTextComponents}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>

      <section className="relative z-10 mt-8 grid items-stretch gap-5 md:grid-cols-3">
        {profile.useCases.map((useCase, useCaseIndex) => (
          <div
            key={useCase.title}
            className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/84 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(239,242,243,0.64))] shadow-[0_24px_70px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.98)_inset] backdrop-blur-[30px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white hover:bg-white/76 hover:shadow-[0_34px_90px_rgba(15,23,42,0.15),0_1px_0_rgba(255,255,255,1)_inset]"
          >
            <div className="p-2.5">
              <ProductEditorialImage
                fallback={fallbackImages[useCaseIndex]}
                alt={`${useCase.title} space photo`}
              />
            </div>
            <div className="flex flex-1 flex-col border-t border-white/72 bg-white/20 p-6 pt-5 backdrop-blur-xl">
              <h3 className="m-0 text-xl font-semibold text-[var(--color-dark-100)]">
                {useCase.title}
              </h3>
              <p className="m-0 mt-3 text-sm leading-7 text-[var(--color-gray-100)]">
                {useCase.copy}
              </p>
              <div className="mt-auto grid gap-3 pt-5">
                {useCase.benefits.map((text, benefitIndex) => {
                  const Icon = benefitIcons[benefitIndex];
                  return (
                    <div
                      key={text}
                      className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-white/82 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(242,244,245,0.56))] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-2xl"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(255,165,0,0.22)] bg-[rgba(255,165,0,0.10)]">
                        <Icon
                          className="h-3.5 w-3.5 text-[var(--color-brand-orange)]"
                          strokeWidth={1.9}
                        />
                      </span>
                      <p className="m-0 text-sm leading-5 text-[var(--color-gray-100)]">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}

function ProductInUseGallery() {
  const images = [
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-1.png",
      label: "Flexi™ 180 x 60 x 5cm - Colour: Amber 14",
      position: "left-[46%] top-[67px]",
    },
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-2.png",
      label: "Flexi™ 120 x 60 x 5cm - Colour: Black",
      position: "left-[42%] top-[34%]",
    },
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-3.png",
      label: "Flexi™ 120 x 60 x 5cm - Colour: Concrete 27",
      position: "left-[50%] top-[28%]",
    },
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-4.png",
      label: "Flexi™ 120 x 60 x 5cm - Colour: Slate 25",
      position: "right-[10%] top-[72px]",
    },
  ];

  return (
    <section className="home-shell page-hero-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="page-card-title text-[clamp(32px,3.4vw,42px)]">
            Flexi™ Panels used all around Singapore
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {images.map((image, index) => (
          <div
            key={image.src}
            className="group relative min-h-[300px] overflow-hidden rounded-[28px] border border-white/45 bg-[var(--color-white-200)] shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:min-h-[380px]"
          >
            <Image
              src={image.src}
              alt={`Flexi acoustic panel in use ${index + 1}`}
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.28))]" />
            <button
              type="button"
              className={`absolute ${image.position} max-w-[240px] -translate-x-1/2 rounded-[18px] border border-white/40 bg-white/18 px-4 py-3 text-left text-xs font-semibold leading-5 text-white shadow-[0_18px_46px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80`}
            >
              {image.label}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductGuidanceSections() {
  const productFaqs: FaqItem[] = [
    {
      q: "Can these panels soundproof my room?",
      a: "No. Acoustic panels improve sound inside a room by absorbing reflections. Soundproofing needs construction changes that reduce sound transfer through walls, ceilings, doors, and gaps.",
    },
    {
      q: "How many panels do I need?",
      a: "It depends on room size, ceiling height, surface finishes, and how bad the echo is. Send room photos and dimensions and we can suggest a practical starting layout.",
    },
    {
      q: "Which thickness should I choose?",
      a: "The right thickness depends on whether you are prioritising a slimmer visual profile or stronger broadband control. If you are unsure, send the room use and photos before ordering.",
    },
    {
      q: "Can you install them?",
      a: "Yes. Select an installation option if available, or send us the room details so we can confirm mounting, access, and site constraints.",
    },
    {
      q: "What if I am unsure about colour?",
      a: "Choose the closest finish for now and add notes in the order request. We can confirm fabric or finish suitability before production.",
    },
    {
      q: "Will this work for a studio or music room?",
      a: "It can, but the right setup depends on whether you are treating speech, recording, mixing, or general echo. Music rooms often need more careful placement and enough panel depth to control a wider frequency range.",
    },
    {
      q: "What happens after I submit an order request?",
      a: "We receive your selected size, finish, quantity, and room notes. From there, we confirm stock or production details, installation requirements, and payment instructions before the order is finalised.",
    },
  ];

  const choices = [
    {
      title: "Standard Panels",
      copy: "Best general starting point for echo reduction and cleaner speech in practical rooms.",
      href: "/shop",
    },
    {
      title: "Custom Print Panels",
      copy: "Use when the panel needs to carry artwork, branding, signage, or a designed feature wall.",
      href: "/shop",
    },
    {
      title: "Package Deals",
      copy: "Useful when you want a faster studio or room setup with a sensible starting quantity.",
      href: "/shop?category=package-deals",
    },
  ];

  return (
    <>
      <section className="home-shell page-hero-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="page-kicker">Not sure what is right?</p>
            <h2 className="page-card-title">We are here to help!</h2>
          </div>
          <Link
            href="/contact"
            className="inline-block w-full no-underline sm:w-auto"
          >
            <ShimmerButton className="h-auto w-full px-8 py-4 text-sm sm:w-auto">
              Free Consultation
            </ShimmerButton>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {choices.map((choice) => (
            <Link
              key={choice.title}
              href={choice.href}
              className="rounded-[24px] border border-black/8 bg-white/76 p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <PackageCheck
                className="h-7 w-7 text-[var(--color-brand-orange-dark)]"
                strokeWidth={1.7}
              />
              <h3 className="m-0 mt-4 text-lg font-semibold text-[var(--color-dark-100)]">
                {choice.title}
              </h3>
              <p className="m-0 mt-2 text-sm leading-6 text-[var(--color-gray-100)]">
                {choice.copy}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <FAQ
        items={productFaqs}
        title="Product Questions"
        subtitle="The common things to check before choosing panel quantity, thickness, finish, and installation."
      />
    </>
  );
}

function ProductPerformanceChart({ item }: { item: ShopItem }) {
  const productLine = resolveProductLine(item);
  const rows = item.acousticalSpecs?.rows || [];
  const frequencies =
    productLine === "bass-trap" ? BASS_TRAP_FREQUENCIES : ACOUSTIC_FREQUENCIES;
  const parsedRows: PerformanceSeries[] = useMemo(() => {
    if (productLine === "flexi-panel") return STANDARD_FLEXI_PERFORMANCE_SERIES;
    if (productLine === "bass-trap") return BASS_TRAP_REFERENCE_SERIES;
    if (productLine === "pet-panel") return PET_REFERENCE_SERIES;
    if (productLine === "gobo") return GOBO_REFERENCE_SERIES;
    if (productLine === "custom-print-panels") {
      return STANDARD_FLEXI_PERFORMANCE_SERIES.slice(0, 2).map((series) => ({
        ...series,
        id: `print-${series.id}`,
        label: series.label.replace(
          "Flexi™ Panel",
          "Custom Print - indicative",
        ),
        values: series.values.map((value) => Number((value * 0.7).toFixed(2))),
      }));
    }

    return rows
      .map((row, index) => ({
        id: row.thickness || `row-${index}`,
        label: row.thickness || `Row ${index + 1}`,
        color: ["#356AE6", "#4D9BFF", "#8F5AD9", "#E35D86"][index % 4],
        values: frequencies.map(({ key }) =>
          parseNumericValue(
            (row as unknown as Record<string, string | number | undefined>)[
              key
            ],
          ),
        ),
      }))
      .filter((row) => row.values.some((value) => value > 0));
  }, [frequencies, productLine, rows]);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  if (!parsedRows.length) {
    return (
      <div className="rounded-[28px] border border-black/8 bg-white/84 p-6 text-sm text-[var(--color-gray-100)]">
        Acoustical specs coming soon.
      </div>
    );
  }

  const viewWidth = 980;
  const viewHeight = 380;
  const pad = { top: 28, right: 26, bottom: 60, left: 58 };
  const innerWidth = viewWidth - pad.left - pad.right;
  const innerHeight = viewHeight - pad.top - pad.bottom;
  const step =
    frequencies.length > 1 ? innerWidth / (frequencies.length - 1) : innerWidth;
  const maxValue = Math.max(1.2, ...parsedRows.flatMap((row) => row.values));
  const minValue = 0;
  const yFor = (value: number) =>
    pad.top +
    innerHeight -
    ((value - minValue) / (maxValue - minValue)) * innerHeight;
  const xFor = (index: number) => pad.left + index * step;
  const linePalette = parsedRows.map((row) => row.color);

  const buildLinePath = (values: number[]) =>
    values
      .map(
        (value, index) =>
          `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(value)}`,
      )
      .join(" ");

  const buildAreaPath = (values: number[]) =>
    `${buildLinePath(values)} L ${xFor(values.length - 1)} ${viewHeight - pad.bottom} L ${xFor(0)} ${viewHeight - pad.bottom} Z`;

  const activeIndex = hoverIndex ?? parsedRows[0].values.findIndex(Boolean);
  const activeFrequency =
    frequencies[Math.max(0, activeIndex)]?.label || frequencies[0].label;
  const activePointValues = parsedRows.map((row) => ({
    id: row.id,
    label: row.label,
    value: row.values[Math.max(0, activeIndex)] ?? 0,
    color: row.color,
  }));

  const updateHoverFromEvent = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = chartRef.current?.getBoundingClientRect();
    if (!rect) return;
    const renderedX = ((event.clientX - rect.left) / rect.width) * viewWidth;
    const x = Math.min(Math.max(renderedX, pad.left), viewWidth - pad.right);
    const nextIndex = Math.round((x - pad.left) / step);
    setHoverIndex(Math.min(frequencies.length - 1, Math.max(0, nextIndex)));
  };

  const tooltipX = xFor(Math.max(0, activeIndex));
  const tooltipXPercent = `${(tooltipX / viewWidth) * 100}%`;
  const tooltipPlacement =
    tooltipX > viewWidth * 0.66
      ? "right-4"
      : tooltipX < viewWidth * 0.33
        ? "left-4"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      ref={chartRef}
      className="product-performance-chart relative w-full overflow-hidden rounded-[32px] border border-black/8 bg-white p-5 text-[var(--color-dark-100)] shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:p-7"
    >
      <FrequencyGuide
        productLine={productLine as Exclude<typeof productLine, "accessory">}
      />
      <div className="product-performance-chart-scroll relative">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="product-performance-chart-svg block h-auto w-full overflow-visible"
        >
          <defs>
            {linePalette.map((color, index) => (
              <linearGradient
                key={`${color}-${index}`}
                id={`fill-${index}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={color} stopOpacity="0.04" />
              </linearGradient>
            ))}
          </defs>

          {[0, 0.4, 0.8, 1.2].map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={pad.left}
                  x2={viewWidth - pad.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(17,24,39,0.08)"
                />
                <text
                  x={pad.left - 14}
                  y={y + 5}
                  textAnchor="end"
                  fill="rgba(75,85,99,0.82)"
                  fontSize="14"
                >
                  {tick === 0 ? "0" : tick.toFixed(1)}
                </text>
              </g>
            );
          })}

          {frequencies.map((freq, index) => (
            <g key={freq.key}>
              <line
                x1={xFor(index)}
                x2={xFor(index)}
                y1={pad.top}
                y2={viewHeight - pad.bottom}
                stroke="rgba(17,24,39,0.04)"
              />
              <text
                x={xFor(index)}
                y={viewHeight - 22}
                textAnchor="middle"
                fill="rgba(75,85,99,0.82)"
                fontSize="12"
              >
                {freq.label}
              </text>
            </g>
          ))}

          {parsedRows.map((row, index) => {
            const color = linePalette[index % linePalette.length];
            return (
              <g key={row.id}>
                <path
                  d={buildAreaPath(row.values)}
                  fill={`url(#fill-${index % linePalette.length})`}
                />
                <path
                  d={buildLinePath(row.values)}
                  fill="none"
                  stroke={color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {row.values.map((value, pointIndex) => (
                  <circle
                    key={`${row.id}-${pointIndex}`}
                    cx={xFor(pointIndex)}
                    cy={yFor(value)}
                    r="5.5"
                    fill={color}
                  />
                ))}
              </g>
            );
          })}

          {hoverIndex !== null && (
            <g>
              <line
                x1={xFor(hoverIndex)}
                x2={xFor(hoverIndex)}
                y1={pad.top}
                y2={viewHeight - pad.bottom}
                stroke="rgba(17,24,39,0.18)"
                strokeDasharray="6 6"
              />
              {parsedRows.map((row, index) => {
                const value = row.values[hoverIndex];
                const color = linePalette[index % linePalette.length];
                return (
                  <circle
                    key={`${row.id}-active`}
                    cx={xFor(hoverIndex)}
                    cy={yFor(value)}
                    r="7"
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}
        </svg>

        <div
          className="absolute inset-0"
          onPointerMove={updateHoverFromEvent}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerDown={updateHoverFromEvent}
          aria-hidden="true"
        />

        <div
          className={`pointer-events-none absolute top-3 ${tooltipPlacement} z-10 w-[min(320px,calc(100%-1rem))] rounded-[18px] border border-black/8 bg-white/96 p-3 text-[13px] text-[var(--color-dark-100)] shadow-[0_20px_48px_rgba(0,0,0,0.12)] transition-opacity duration-200 ${hoverIndex === null ? "opacity-0" : "opacity-100"}`}
          style={{
            left:
              hoverIndex !== null &&
              tooltipPlacement === "left-1/2 -translate-x-1/2"
                ? tooltipXPercent
                : undefined,
          }}
        >
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-200)]">
            {activeFrequency}
          </p>
          <div className="mt-2 grid gap-2">
            {activePointValues.map((point) => (
              <div
                key={point.id}
                className="flex items-center justify-between gap-3"
              >
                <span className="inline-flex items-center gap-2 font-medium text-[var(--color-gray-100)]">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: point.color }}
                  />
                  {point.label}
                </span>
                <span className="font-semibold">{point.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="product-performance-legend mt-4 flex flex-wrap gap-3">
        {parsedRows.map((row, index) => (
          <span
            key={row.id}
            className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-semibold text-[var(--color-gray-100)] shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: linePalette[index % linePalette.length],
              }}
            />
            {row.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductPerformanceSection({ item }: { item: ShopItem }) {
  const profile = getProductProfile(item);
  return (
    <section className="home-shell page-hero-shell bg-white">
      <div className="max-w-[980px]">
        <p className="page-kicker">{profile.performance.eyebrow}</p>
        <h2
          className="m-0 mt-3 text-[clamp(36px,3.4vw,48px)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--color-dark-100)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {profile.performance.title}{" "}
          <span className="text-[#c46a35]">{profile.performance.accent}</span>
        </h2>
        <p className="m-0 mt-5 max-w-[980px] text-base leading-8 text-[var(--color-gray-100)]">
          {profile.performance.description}
        </p>
        {profile.performance.disclaimer && (
          <p className="m-0 mt-3 max-w-[980px] text-sm leading-6 text-[var(--color-gray-200)]">
            {profile.performance.disclaimer}
          </p>
        )}
      </div>
      <div className="mt-7">
        <ProductPerformanceChart item={item} />
      </div>
    </section>
  );
}

function ProductBeforeAfterSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const videos = [
    {
      videoId: "8DURhlYt3wQ",
      thumbnail: "/assets/webflow/69687b1239333b922d70b26a_Title.avif",
      label: "Meeting Room",
      category: "Meeting Room",
      note: "Clearer voices",
    },
    {
      videoId: "bm-q3dQWB6g",
      thumbnail: "/assets/webflow/69687d6c4e41c7a3a58f9107_Title.avif",
      label: "Noisy Restaurant",
      category: "Restaurant",
      note: "Comfortable dining",
    },
    {
      videoId: "Y9b0NNTRnFw",
      thumbnail: "/assets/webflow/69687c96d1feff52c5d91be4_3.avif",
      label: "Function Room",
      category: "Church",
      note: "Comfortable event space",
    },
  ];

  return (
    <section className="home-shell page-hero-shell">
      <div className="flex flex-col gap-3">
        <div>
          <p className="page-kicker">Before and after</p>
          <h2
            className="m-0 mt-3 text-[clamp(34px,4vw,52px)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--color-dark-100)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Listen to the results yourself
          </h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {videos.map((video) => {
            const isActive = activeVideoId === video.videoId;

            return (
              <button
                key={video.videoId}
                type="button"
                onClick={() => setActiveVideoId(video.videoId)}
                className="group relative overflow-hidden rounded-[24px] border border-white/55 bg-white/35 p-0 text-left shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(0,0,0,0.12)]"
                aria-label={`Play ${video.label} result clip`}
              >
                <div className="relative aspect-[4/5] min-h-[300px]">
                  {isActive ? (
                    <div className="absolute inset-0 bg-black">
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&playsinline=1`}
                        title={video.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <>
                      <Image
                        src={video.thumbnail}
                        alt={video.label}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 768px) 30vw, 92vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.26)_42%,rgba(0,0,0,0.84))]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_10px_rgba(255,165,0,0.10),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_0_15px_rgba(255,165,0,0.14),0_30px_72px_rgba(0,0,0,0.38)]">
                          <Image
                            src={PRODUCT_PLAY_ICON}
                            alt=""
                            width={58}
                            height={58}
                            sizes="58px"
                            className="h-[58px] w-[58px] drop-shadow-lg"
                          />
                        </span>
                      </div>
                    </>
                  )}

                  {!isActive && (
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(20,20,20,0.28),rgba(8,8,8,0.82))] p-4 backdrop-blur-xl">
                        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
                          {video.category}
                        </p>
                        <h3
                          className="m-0 mt-3 text-[24px] font-medium leading-[1.02] tracking-[-0.9px] text-white"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {video.label}
                        </h3>
                        <p className="m-0 mt-3 text-sm leading-6 text-white/62">
                          {video.note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductInstallationDownloads() {
  const downloads = [
    {
      title: "Wall Mount Installation Guide.pdf",
      href: "/assets/shop/standard-flexi/downloads/wall-mount-installation-guide.pdf",
    },
    {
      title: "Ceiling Mount Installation Guide.pdf",
      href: "/assets/shop/standard-flexi/downloads/ceiling-mount-installation-guide.pdf",
    },
    {
      title: "Flexi Panel NRC Test Report.pdf",
      href: "/assets/shop/standard-flexi/downloads/flexi-nrc-test-report.pdf",
    },
  ];

  return (
    <section className="home-shell page-hero-shell">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2
            className="m-0 text-[clamp(34px,4vw,58px)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--color-dark-100)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Installation Made Simple
          </h2>
          <p className="m-0 mt-5 text-base leading-8 text-[var(--color-gray-100)]">
            Great acoustics start with proper installation. Our guides walk
            through wall and ceiling mounting so panels are placed securely and
            effectively.
          </p>
        </div>
        <div className="grid gap-4 rounded-[28px] border border-black/6 bg-white/72 p-4 sm:p-5">
          {downloads.map((download) => (
            <a
              key={download.href}
              href={download.href}
              download
              className="flex items-center justify-between gap-4 rounded-[18px] px-2 py-3 text-[var(--color-dark-100)] no-underline transition-colors hover:bg-black/4 sm:px-3"
            >
              <span className="flex min-w-0 items-center gap-4">
                <FileText
                  className="h-9 w-9 shrink-0 text-[var(--color-dark-100)]"
                  strokeWidth={1.7}
                />
                <span className="min-w-0 text-base font-semibold leading-tight sm:text-lg">
                  {download.title}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#3b82f6]">
                <Download className="h-4 w-4" />
                Download
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomPrintWorkflow() {
  const steps = [
    {
      number: "01",
      title: "Upload your artwork",
      copy: "Upload a high-resolution PDF or image and tell us the panel size you need.",
    },
    {
      number: "02",
      title: "We review and print it",
      copy: "We confirm the crop and print quality, send you a proof, then produce the approved panels.",
    },
  ];

  return (
    <section className="home-shell page-hero-shell">
      <p className="page-kicker">How it works</p>
      <h2 className="page-card-title text-[clamp(32px,3.4vw,44px)]">
        Customise your acoustic panels
      </h2>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-[24px] border border-black/8 bg-white/76 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)]"
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-brand-orange-dark)]">
              {step.number}
            </span>
            <h3 className="m-0 mt-4 text-xl font-semibold text-[var(--color-dark-100)]">
              {step.title}
            </h3>
            <p className="m-0 mt-3 text-sm leading-7 text-[var(--color-gray-100)]">
              {step.copy}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/contact?product=flexi-custom-print-panels&request=artwork-review"
        className="mt-6 inline-flex min-h-12 items-center rounded-full border border-[#137e89]/25 bg-[#137e89]/10 px-6 text-sm font-semibold text-[#137e89] no-underline transition-colors hover:bg-[#137e89]/15"
      >
        Start artwork review
      </Link>
    </section>
  );
}

function ProductReviewsSection({ item }: { item: ShopItem }) {
  const profile = getProductProfile(item);
  if (profile.line === "bass-trap") {
    return (
      <section className="home-shell page-hero-shell">
        <p className="page-kicker">Studio Applications</p>
        <h2 className="page-card-title text-[clamp(32px,3.4vw,42px)]">
          Built for critical listening spaces
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {profile.useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-[24px] border border-black/8 bg-white/76 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)]"
            >
              <Headphones
                className="h-7 w-7 text-[var(--color-brand-orange)]"
                strokeWidth={1.7}
              />
              <h3 className="m-0 mt-5 text-xl font-semibold text-[var(--color-dark-100)]">
                {useCase.title}
              </h3>
              <p className="m-0 mt-3 text-sm leading-7 text-[var(--color-gray-100)]">
                {useCase.copy}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const reviews = [
    {
      name: "Gerald",
      company: "Mortgage Hub",
      quote:
        "They are patient and explained the options of reducing echoes in the office space professionally. I recommend Just Acoustics for both residential and commercial projects.",
    },
    {
      name: "Irvin",
      company: "Church of Christ",
      quote:
        "The Just Acoustics team were professional, efficient and detailed in their work. Highly recommended for homes and businesses!",
    },
    {
      name: "Madeleine",
      company: "Concentricheal",
      quote:
        "Working with the team was very smooth! They are highly knowledgeable in elaborating on the sound treatment options and recommending the best one that fits our requirements.",
    },
  ];

  return (
    <section className="home-shell page-hero-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="page-kicker">Reviews</p>
          <h2 className="page-card-title text-[clamp(32px,3.4vw,42px)]">
            Hear from our clients
          </h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="rounded-[24px] border border-black/8 bg-white/76 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]"
          >
            <div className="flex gap-1 text-[var(--color-brand-orange)]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-4 w-4 fill-current"
                  strokeWidth={1.6}
                />
              ))}
            </div>
            <p className="m-0 mt-4 text-sm leading-7 text-[var(--color-gray-100)]">
              “{review.quote}”
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-gray-600)] text-lg font-semibold text-white shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
                {review.name[0]}
              </div>
              <div>
                <p className="m-0 text-base font-semibold text-[var(--color-dark-100)]">
                  {review.name}
                </p>
                <p className="m-0 text-sm text-[var(--color-gray-200)]">
                  {review.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductInfoFaqSection({ item }: { item: ShopItem }) {
  const line = resolveProductLine(item);
  const shared = [
    {
      q: "Can this soundproof my room?",
      a: "No. Acoustic treatment improves sound inside a room. Soundproofing requires construction changes that reduce sound transfer through walls, ceilings, doors, windows, and gaps.",
    },
    {
      q: "Can you make a custom size?",
      a: "Yes. Send room dimensions, photos, and the intended placement so we can confirm a practical custom shape, size, finish, and mounting method.",
    },
    {
      q: "Can Just Acoustics install it?",
      a: "Yes. Delivery and installation can be reviewed together with access, surface, height, and mounting requirements.",
    },
  ];
  const specific: Record<string, FaqItem[]> = {
    "flexi-panel": [
      {
        q: "Can Flexi panels soundproof my room?",
        a: "No. Flexi panels improve sound inside a room by absorbing reflections and reducing echo. Soundproofing requires construction changes that reduce sound transfer through walls, ceilings, doors, windows, and gaps.",
      },
      {
        q: "What do Flexi acoustic panels improve?",
        a: "They reduce reverberation and harsh reflections so speech, calls, music, and everyday activity sound clearer and less tiring.",
      },
      {
        q: "How many panels do I need?",
        a: "The right quantity depends on room size, surface finishes, ceiling height, and how the space is used. Send us dimensions and photos and we can recommend a practical starting coverage.",
      },
      {
        q: "Should I choose 25 mm or 50 mm panels?",
        a: "The 25 mm panel is a slim broadband option for speech and general room control. Choose 50 mm when you want stronger absorption through more of the low-mid range or have a more demanding room.",
      },
      {
        q: "Where should acoustic panels be installed?",
        a: "Common priorities include first-reflection points, walls facing speakers, hard parallel surfaces, and areas close to talkers or listeners. The best arrangement depends on the room layout.",
      },
      {
        q: "Can you make a custom size or shape?",
        a: "Yes. Most practical shapes and sizes can be produced. Send the dimensions, intended placement, and photos so we can confirm the finish and mounting method.",
      },
      {
        q: "Can Flexi panels be installed on a ceiling?",
        a: "Yes. They can be ceiling mounted when the correct mounting system and substrate are confirmed. We can review access, ceiling type, and installation height with you.",
      },
      {
        q: "Can Just Acoustics install the panels?",
        a: "Yes. We provide supply-only or delivery and installation, subject to site access, surface condition, mounting requirements, and working height.",
      },
      {
        q: "How long is the lead time?",
        a: "Flexi panels are made to order. Typical production is about four weeks, with final timing confirmed when the colour, size, quantity, and installation scope are approved.",
      },
      {
        q: "Can I see fabric colours before ordering?",
        a: "Yes. Contact us to review the available fabric collection or request help choosing a finish that suits the room.",
      },
      {
        q: "How should I clean the panels?",
        a: "Remove surface dust gently with a soft brush or low-suction vacuum. Avoid soaking the fabric or using harsh cleaners.",
      },
      {
        q: "Which spaces are Flexi panels suitable for?",
        a: "They are used in offices, meeting rooms, studios, restaurants, homes, schools, churches, and other interiors where clearer sound and a clean finish are important.",
      },
    ],
    "bass-trap": [
      {
        q: "Should I choose Studio or Maxx?",
        a: "Studio is a practical 15 cm starting point for upper-bass control. Choose the 30 cm Maxx when deeper low-frequency control is the priority and room space allows it.",
      },
      {
        q: "Where should bass traps go?",
        a: "Corners are normally the first priority, followed by front and back walls or other pressure-heavy positions identified from room dimensions and measurements.",
      },
      {
        q: "Will bass traps remove every null?",
        a: "No treatment removes every room mode. Bass traps reduce the severity and decay of modal problems, while speaker and listener placement remain important.",
      },
    ],
    gobo: [
      {
        q: "What is a Gobo used for?",
        a: "A Gobo is a movable acoustic panel used around microphones, drums, amplifiers, performers, windows, doors, or temporary reflection points.",
      },
      {
        q: "Does a Gobo block sound completely?",
        a: "No. It can reduce reflections and microphone bleed, but it does not replace a fully constructed sound-isolated wall or booth.",
      },
    ],
    "custom-print-panels": [
      {
        q: "Which artwork files work best?",
        a: "High-resolution PDF and vector artwork are preferred. We review resolution, crop, bleed, and panel layout before production.",
      },
      {
        q: "Is the printed surface waterproof?",
        a: "No. The synthetic finish is wipeable and more moisture-resistant than fabric, but it is not sold as a waterproof exterior surface.",
      },
    ],
    "pet-panel": [
      {
        q: "What is the difference between 9 mm and 12 mm?",
        a: "The 9 mm panel is slimmer and works well for decorative direct-fix applications. The 12 mm panel provides stronger absorption and a more substantial visual profile.",
      },
      {
        q: "Can PET panels be custom cut?",
        a: "Yes. Forma panels can be cut into practical shapes, grooves, patterns, and sizes after the layout and material use are reviewed.",
      },
    ],
  };

  if (line === "accessory") return null;
  const items =
    line === "flexi-panel"
      ? specific[line]
      : [...(specific[line] || []), ...shared];
  return (
    <FAQ
      items={items}
      title="Product Info"
      subtitle="Common questions before selecting size, placement, and installation."
      flush
    />
  );
}

function GikPerformanceChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const viewWidth = 1680;
  const viewHeight = 460;
  const pad = { top: 58, right: 28, bottom: 62, left: 82 };
  const innerWidth = viewWidth - pad.left - pad.right;
  const innerHeight = viewHeight - pad.top - pad.bottom;
  const maxValue = 1.32;
  const step =
    innerWidth / (STANDARD_FLEXI_GIK_PERFORMANCE_FREQUENCIES.length - 1);
  const xFor = (index: number) => pad.left + index * step;
  const yFor = (value: number) =>
    pad.top + innerHeight - (value / maxValue) * innerHeight;
  const activeIndex = hoverIndex ?? 13;
  const linePath = (values: number[]) =>
    values
      .map(
        (value, index) =>
          `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(value)}`,
      )
      .join(" ");

  const updateHover = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = chartRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    setHoverIndex(
      Math.round(
        ratio * (STANDARD_FLEXI_GIK_PERFORMANCE_FREQUENCIES.length - 1),
      ),
    );
  };

  return (
    <div className="mt-8 pb-1" ref={chartRef}>
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="h-auto w-full"
        >
          {[0, 0.3, 0.5, 0.8, 1, 1.3].map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={pad.left}
                  x2={viewWidth - pad.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(15,23,42,0.08)"
                />
                <text
                  x={pad.left - 14}
                  y={y + 5}
                  textAnchor="end"
                  fill="#41515a"
                  fontSize="15"
                >
                  {tick === 0 ? "0" : tick.toFixed(1).replace(".0", "")}
                </text>
              </g>
            );
          })}

          <text
            x={20}
            y={viewHeight / 2}
            fill="#24343c"
            fontSize="15"
            transform={`rotate(-90 20 ${viewHeight / 2})`}
            textAnchor="middle"
          >
            Sound Absorption Coefficient
          </text>
          <text
            x={viewWidth / 2}
            y={viewHeight - 12}
            fill="#24343c"
            fontSize="15"
            textAnchor="middle"
          >
            Frequency
          </text>

          {STANDARD_FLEXI_GIK_PERFORMANCE_FREQUENCIES.map((freq, index) => (
            <text
              key={freq}
              x={xFor(index)}
              y={viewHeight - 38}
              textAnchor="middle"
              fill="#41515a"
              fontSize="13"
            >
              {freq}
            </text>
          ))}

          <g>
            <rect
              x={viewWidth / 2 - 170}
              y="10"
              width="340"
              height="32"
              rx="8"
              fill="#f1f3f3"
            />
            {STANDARD_FLEXI_GIK_PERFORMANCE_SERIES.map((series, index) => (
              <g
                key={series.label}
                transform={`translate(${viewWidth / 2 - 145 + index * 170}, 26)`}
              >
                <line
                  x1="0"
                  x2="20"
                  y1="0"
                  y2="0"
                  stroke={series.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="0" r="4" fill={series.color} />
                <text
                  x="28"
                  y="5"
                  fill="#1f2528"
                  fontSize="13"
                  fontWeight="700"
                >
                  {series.label}
                </text>
              </g>
            ))}
          </g>

          {STANDARD_FLEXI_GIK_PERFORMANCE_SERIES.map((series) => (
            <g key={series.label}>
              <path
                d={linePath(series.values)}
                fill="none"
                stroke={series.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {series.values.map((value, index) => (
                <circle
                  key={`${series.label}-${index}`}
                  cx={xFor(index)}
                  cy={yFor(value)}
                  r="4.5"
                  fill={series.color}
                />
              ))}
            </g>
          ))}

          {hoverIndex !== null && (
            <g>
              <line
                x1={xFor(activeIndex)}
                x2={xFor(activeIndex)}
                y1={pad.top}
                y2={viewHeight - pad.bottom}
                stroke="rgba(15,23,42,0.16)"
                strokeDasharray="6 7"
              />
              {STANDARD_FLEXI_GIK_PERFORMANCE_SERIES.map((series) => (
                <circle
                  key={`${series.label}-hover`}
                  cx={xFor(activeIndex)}
                  cy={yFor(series.values[activeIndex])}
                  r="7"
                  fill={series.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}
        </svg>
        <div
          className="absolute inset-0"
          onPointerMove={updateHover}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerDown={updateHover}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function MergedSectionCard({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-black/8 bg-white/82 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)] sm:p-8 lg:p-12">
      <p className="page-kicker">{kicker}</p>
      <h2
        className="m-0 mt-3 max-w-[920px] text-[clamp(34px,5vw,64px)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--color-dark-100)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function MergedProofGrid() {
  return (
    <section className="rounded-[28px] border border-black/8 bg-white/76 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[720px]">
          <p className="page-kicker">Proof in real spaces</p>
          <h2
            className="m-0 mt-3 text-[clamp(32px,4vw,56px)] font-medium leading-none tracking-[-0.04em] text-[var(--color-dark-100)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Clarity, backed by practical installation.
          </h2>
        </div>
        <p className="m-0 max-w-[420px] text-sm leading-6 text-[var(--color-gray-100)]">
          Installed examples across work, music, hospitality, and residential
          rooms.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STANDARD_FLEXI_IN_USE_IMAGES.map((src, index) => (
          <div
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-white"
          >
            <Image
              src={src}
              alt={`Standard Flexi acoustic panel installed ${index + 1}`}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/28 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/32 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MergedAlternatingSections() {
  const sections = [
    {
      title: "Pro-level sound control",
      copy: "Control flutter echoes, harsh reflections, and uncontrolled reverb so speech, music, and calls sound more intentional.",
      image: STANDARD_FLEXI_IN_USE_IMAGES[2],
      reverse: false,
    },
    {
      title: "Slim profile. Flexible placement.",
      copy: "Use Flexi panels on walls, ceilings, or full-wall layouts without making the room feel like a temporary studio buildout.",
      image: STANDARD_FLEXI_SIZE_IMAGE_SRC["1800x600"],
      reverse: true,
    },
    {
      title: "Custom finish and fit",
      copy: "Choose from 38 colour textures and three core sizes so the treatment fits the room visually as well as acoustically.",
      image: STANDARD_FLEXI_COLOUR_CHART_SRC,
      reverse: false,
    },
  ];

  return (
    <section className="grid gap-6">
      {sections.map((section) => (
        <div
          key={section.title}
          className={`overflow-hidden rounded-[28px] border border-black/8 bg-white/82 shadow-[0_22px_70px_rgba(15,23,42,0.06)] lg:flex ${section.reverse ? "lg:flex-row-reverse" : ""}`}
        >
          <div className="relative min-h-[320px] flex-1 lg:min-h-[560px]">
            <Image
              src={section.image}
              alt={section.title}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 items-center p-6 sm:p-8 lg:p-12">
            <div>
              <h2
                className="m-0 text-[clamp(32px,4vw,56px)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--color-dark-100)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {section.title}
              </h2>
              <p className="m-0 mt-5 text-base leading-8 text-[var(--color-gray-100)]">
                {section.copy}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function MergedConsultationBanner() {
  return (
    <section className="relative min-h-[480px] overflow-hidden rounded-[32px] border border-white/30 bg-black text-white shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
      <Image
        src={STANDARD_FLEXI_IN_USE_IMAGES[0]}
        alt="Acoustic consultation for Standard Flexi panels"
        fill
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/42" />
      <div className="relative z-10 flex min-h-[480px] items-end p-6 sm:p-10 lg:items-center lg:justify-center lg:text-center">
        <div className="max-w-[760px]">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
            Free consultation
          </p>
          <h2
            className="m-0 mt-4 text-[clamp(38px,6vw,72px)] font-medium leading-[0.94] tracking-[-0.05em]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start with a room recommendation.
          </h2>
          <p className="m-0 mt-5 text-base leading-8 text-white/82">
            Send your room photos, dimensions, and goals. We will help you
            choose the right quantity, placement, size, thickness, and colour.
          </p>
          <Link href="/contact" className="mt-7 inline-block no-underline">
            <ShimmerButton className="h-auto px-8 py-4 text-sm">
              Free Consultation
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

function MergedTestProductSections({ item }: { item: ShopItem }) {
  return (
    <div className="grid gap-8">
      <MergedSectionCard
        kicker="Performance you can trust"
        title={
          <>
            Performance You Can <span className="text-[#c46a35]">Trust</span>
          </>
        }
      >
        <p className="m-0 mt-5 max-w-[980px] text-base leading-8 text-[var(--color-gray-100)]">
          Flexi panels are built for broadband absorption across practical room
          frequencies. The goal is simple: clearer conversations, more
          controlled video calls, and spaces that feel calmer without looking
          temporary.
        </p>
        <GikPerformanceChart />
      </MergedSectionCard>
      <MergedProofGrid />
      <MergedAlternatingSections />
      <MergedConsultationBanner />
      <FAQ
        items={[
          {
            q: "Can these panels soundproof my room?",
            a: "No. Acoustic panels improve sound inside a room by absorbing reflections. Soundproofing needs construction changes that reduce sound transfer through walls, ceilings, doors, and gaps.",
          },
          {
            q: "Which thickness should I choose?",
            a: "Choose 25 mm for a slim profile and 50 mm when stronger broadband absorption is the priority.",
          },
          {
            q: "Can you install them?",
            a: "Yes. Choose professional installation and we will confirm mounting, access, and site requirements before production.",
          },
        ]}
        title={`${item.title} FAQ`}
        subtitle="Extra test-product FAQ block merged into the live page for comparison."
      />
    </div>
  );
}

function ProductFeatureCards({ item }: { item: ShopItem }) {
  const profile = getProductProfile(item);
  const iconMap: Record<ProductFeatureIcon, typeof Layers> = {
    layers: Layers,
    flame: Flame,
    palette: Palette,
    ruler: Ruler,
    truck: Truck,
    wrench: Wrench,
  };

  return (
    <section className="home-shell p-5 sm:p-6 lg:p-7">
      <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {profile.features.map(({ icon, title, copy }) => {
          const Icon = iconMap[icon];
          return (
            <div
              key={title}
              className="grid grid-cols-[34px_minmax(0,1fr)] gap-3"
            >
              <Icon
                className="mt-0.5 h-6 w-6 text-[var(--color-brand-orange)]"
                strokeWidth={1.8}
              />
              <div>
                <h3 className="m-0 text-[17px] font-semibold leading-tight text-[var(--color-dark-100)]">
                  {title}
                </h3>
                <p className="m-0 mt-1.5 text-[13px] leading-6 text-[var(--color-gray-100)]">
                  {copy}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
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

function ProductConfigurator({
  item: configurableItem,
  selection,
  setSelection,
  price,
  resolved,
  onImageModeChange,
}: {
  item: ShopItem;
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
  const isStandardFlexi = isFlexiProduct(configurableItem);
  const isSoothe = isSootheProduct(configurableItem);
  const profile = getProductProfile(configurableItem);
  const [isColourOpen, setIsColourOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const colourPopoverRef = useRef<HTMLDivElement | null>(null);

  const configuratorEnabled = configurableItem.configuratorEnabled !== false;
  const colours = (configurableItem.colourOptions || []).filter(
    (option) => option.available !== false,
  );
  const visibleColours = isStandardFlexi
    ? STANDARD_FLEXI_VISIBLE_COLOUR_IDS.map((id) =>
        colours.find((option) => option.id === id),
      ).filter((option): option is (typeof colours)[number] => Boolean(option))
    : isSoothe
      ? SOOTHE_VISIBLE_FABRIC_IDS.map((id) =>
          colours.find((option) => option.id === id),
        ).filter((option): option is (typeof colours)[number] =>
          Boolean(option),
        )
      : colours.slice(0, 9);
  const hiddenColourCount = Math.max(0, colours.length - visibleColours.length);
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
  };

  useEffect(() => {
    if (!isColourOpen) return;

    const onPointerDown = (event: MouseEvent) => {
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
  }, [isColourOpen]);

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
        swatchSrc: isSoothe
          ? undefined
          : getColourSwatchSrc(resolved.colourOption, 64, 64) || undefined,
        hex: resolved.colourOption?.hex,
      },
    ].filter((option) => Boolean(option.value));

    addItem({
      slug: configurableItem.slug.current,
      title: configurableItem.title,
      imageSrc:
        getSizePreviewSrc(configurableItem, selection, 640, 640) ||
        getImageSrc(configurableItem.mainImage, 640, 640),
      unitPrice,
      quantity,
      options,
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
          onClose={() => setIsCustomSizeOpen(false)}
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
              <div className="product-swatch-grid mt-3 grid grid-cols-5 gap-2.5 sm:grid-cols-10">
                {visibleColours.map((option) => (
                  <ProductColourSwatchButton
                    key={option.id}
                    option={option}
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
            )}

            {isColourOpen && hiddenColourCount > 0 && (
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
            <div className={optionSectionClass()}>
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
            <div className={optionSectionClass()}>
              <p className="page-kicker">Thickness</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
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

        <div className={`${optionSectionClass()} grid gap-4`}>
          <div className="product-action-row grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3">
            <div className="inline-flex h-14 overflow-hidden rounded-full border border-black/8 bg-white/86">
              <button
                type="button"
                onClick={() =>
                  setSelectionValue(
                    "quantity",
                    normaliseQuantity(configurableItem, selection.quantity - 1),
                  )
                }
                className="inline-flex h-full w-11 items-center justify-center text-2xl text-[var(--color-dark-100)] transition-colors hover:bg-black/5"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <div className="flex h-full w-11 items-center justify-center border-x border-black/8 text-base font-semibold text-[var(--color-dark-100)]">
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
                className="inline-flex h-full w-11 items-center justify-center text-2xl text-[var(--color-dark-100)] transition-colors hover:bg-black/5"
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
        onClose={() => setIsCustomSizeOpen(false)}
      />
    </div>
  );
}

function TabContent({ item }: { item: ShopItem }) {
  const [activeTab, setActiveTab] = useState<
    "details" | "specs" | "acoustical" | "installation"
  >("details");
  const tabs = [
    { id: "details", label: "Details" },
    { id: "specs", label: "Specs" },
    { id: "acoustical", label: "Acoustical Specs" },
    { id: "installation", label: "Installation" },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? "page-filter active cursor-pointer"
                : "page-filter cursor-pointer"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 text-sm leading-7 text-[var(--color-gray-100)]">
        {activeTab === "details" && (
          <div className="space-y-4">
            {item.shortDescription && (
              <p className="m-0">{item.shortDescription}</p>
            )}
            {item.body && item.body.length > 0 && (
              <div className="portable-copy">
                <PortableText
                  value={item.body as PortableTextBlock[]}
                  components={shopPortableTextComponents}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" &&
          (item.specifications && item.specifications.length > 0 ? (
            <div className="grid gap-2.5">
              {item.specifications.map((spec) => (
                <div
                  key={`${spec.label}-${spec.value}`}
                  className="flex flex-col gap-1 rounded-[18px] border border-black/6 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="font-medium text-[var(--color-dark-100)]">
                    {spec.label}
                  </span>
                  <span className="text-[var(--color-gray-100)] sm:text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0">Specifications coming soon.</p>
          ))}

        {activeTab === "acoustical" &&
          (item.acousticalSpecs?.rows &&
          item.acousticalSpecs.rows.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {item.acousticalSpecs.title && (
                  <h3
                    className="m-0 text-[clamp(26px,3vw,38px)] font-medium tracking-[-0.03em] text-[var(--color-dark-100)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.acousticalSpecs.title}
                  </h3>
                )}
                {item.acousticalSpecs.subtitle && (
                  <p
                    className="m-0 text-[clamp(17px,2vw,21px)] tracking-[-0.02em] text-[var(--color-gray-100)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.acousticalSpecs.subtitle}
                  </p>
                )}
              </div>

              <div className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full border-collapse text-left text-[14px] leading-6 text-[var(--color-gray-100)]">
                    <thead className="bg-[linear-gradient(180deg,rgba(255,188,42,0.10),rgba(255,255,255,0.92))]">
                      <tr>
                        <th className="border-b border-r border-black/6 px-4 py-4 font-semibold text-[var(--color-dark-100)]">
                          Thickness
                        </th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">
                          125Hz
                        </th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">
                          250Hz
                        </th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">
                          500Hz
                        </th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">
                          1kHz
                        </th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">
                          2kHz
                        </th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">
                          4kHz
                        </th>
                        <th className="border-b px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">
                          NRC
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.acousticalSpecs.rows.map((row) => (
                        <tr
                          key={row.thickness}
                          className="bg-white even:bg-[rgba(255,188,42,0.04)]"
                        >
                          <td className="border-r border-black/6 px-4 py-4 font-medium text-[var(--color-dark-100)]">
                            {row.thickness}
                          </td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">
                            {row.hz125}
                          </td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">
                            {row.hz250}
                          </td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">
                            {row.hz500}
                          </td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">
                            {row.hz1000}
                          </td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">
                            {row.hz2000}
                          </td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">
                            {row.hz4000}
                          </td>
                          <td className="px-4 py-4 text-center font-semibold text-[var(--color-brand-orange-dark)]">
                            {row.nrc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="m-0">Acoustical specs coming soon.</p>
          ))}

        {activeTab === "installation" &&
          (item.installation && item.installation.length > 0 ? (
            <div className="portable-copy">
              <PortableText
                value={item.installation as PortableTextBlock[]}
                components={shopPortableTextComponents}
              />
            </div>
          ) : (
            <p className="m-0">Installation details coming soon.</p>
          ))}
      </div>
    </div>
  );
}

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

  const selectNextImage = () =>
    setSelectedImage((current) => (current + 1) % displayImages.length);
  const selectPreviousImage = () =>
    setSelectedImage(
      (current) => (current - 1 + displayImages.length) % displayImages.length,
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
  }, [lightboxOpen, displayImages.length]);

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
                  onClick={() => mainSrc && setLightboxOpen(true)}
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
                  className="mt-5 mb-0 font-medium text-[clamp(18px,1.2vw,21px)] leading-none tracking-[-0.1px] text-[var(--color-dark-100)]"
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

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-black">
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
