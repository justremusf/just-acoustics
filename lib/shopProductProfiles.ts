import type { ShopItem } from "./types";

export type ShopProductLine =
  | "flexi-panel"
  | "bass-trap"
  | "gobo"
  | "custom-print-panels"
  | "pet-panel"
  | "accessory";

export type ProductFeatureIcon =
  | "layers"
  | "flame"
  | "palette"
  | "ruler"
  | "truck"
  | "wrench";

export type ProductProfile = {
  line: ShopProductLine;
  pricePrefix: "From" | "Per Panel" | "Fixed";
  quoteOnly: boolean;
  artworkReview: boolean;
  customSizes: boolean;
  shortDescription: string;
  performance: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    disclaimer?: string;
  };
  features: Array<{ icon: ProductFeatureIcon; title: string; copy: string }>;
  storyTitle: string;
  storyEyebrow: string;
  useCases: Array<{ title: string; copy: string; benefits: string[] }>;
};

const profiles: Record<ShopProductLine, ProductProfile> = {
  "flexi-panel": {
    line: "flexi-panel",
    pricePrefix: "Per Panel",
    quoteOnly: false,
    artworkReview: false,
    customSizes: true,
    shortDescription:
      "Clean, slim, and effective broadband absorption for offices, studios, homes, restaurants, churches, and commercial interiors.",
    performance: {
      eyebrow: "Acoustic Data",
      title: "High Performance",
      accent: "Backed By Data",
      description:
        "Our Flexi acoustic panels are tested to provide dependable broadband absorption across practical room frequencies.",
    },
    features: [
      {
        icon: "layers",
        title: "Broadband absorption",
        copy: "Controls echo across highs, mids, and low-mid reflections.",
      },
      {
        icon: "flame",
        title: "High safety rating",
        copy: "Fire safe, formaldehyde safe, and emissions safe.",
      },
      {
        icon: "palette",
        title: "30+ colours",
        copy: "Texture-backed swatches make it easier to choose a finish.",
      },
      {
        icon: "ruler",
        title: "Custom sizes",
        copy: "Standard formats plus custom sizes for real rooms.",
      },
      {
        icon: "truck",
        title: "Made to order",
        copy: "Typical production lead time is 3-4 weeks.",
      },
      {
        icon: "wrench",
        title: "Install support available",
        copy: "Installation support for walls, ceilings, and full-wall layouts.",
      },
    ],
    storyEyebrow: "Acoustic Control",
    storyTitle: "Slim profile. Fits in every space",
    useCases: [
      {
        title: "Studios",
        copy: "Reduce reflections so monitoring, recording, and playback feel clearer.",
        benefits: [
          "Higher sound quality",
          "More reliable mixes",
          "Reflection points controlled",
        ],
      },
      {
        title: "Churches",
        copy: "Control harsh reflections so speech stays intelligible during services and events.",
        benefits: ["Clearer speech", "Calmer rooms", "More comfortable events"],
      },
      {
        title: "Offices",
        copy: "Improve focus in meeting rooms, call areas, and open workspaces.",
        benefits: [
          "Controlled video calls",
          "Improved speech clarity",
          "Better focus",
        ],
      },
    ],
  },
  "bass-trap": {
    line: "bass-trap",
    pricePrefix: "From",
    quoteOnly: false,
    artworkReview: false,
    customSizes: true,
    shortDescription:
      "Deep porous bass treatment designed to reduce low-frequency buildup, modal ringing, and long decay times in studios and critical listening rooms.",
    performance: {
      eyebrow: "Indicative Reference Performance",
      title: "Control The Low End",
      accent: "Below 200 Hz",
      description:
        "Greater depth and a built-in air gap help the Maxx version work further into the low end, while the Studio version is a practical starting point for upper-bass control.",
      disclaimer:
        "Indicative comparison based on comparable published bass-trap construction and thickness guidance. This is not a Just Acoustics laboratory test report; actual results vary with room, placement, coverage, and installation.",
    },
    features: [
      {
        icon: "layers",
        title: "Low-frequency control",
        copy: "Targets bass buildup, room modes, and lingering decay below 200 Hz.",
      },
      {
        icon: "ruler",
        title: "15 cm or 30 cm",
        copy: "Choose Studio for practical depth or Maxx for stronger low-end control.",
      },
      {
        icon: "layers",
        title: "Deep rockwool core",
        copy: "Two layers in Studio and four layers in Maxx.",
      },
      {
        icon: "wrench",
        title: "Corner-ready",
        copy: "Designed for corners, front walls, back walls, and critical studio positions.",
      },
      {
        icon: "truck",
        title: "Made to order",
        copy: "Built after the final size, finish, and placement plan is confirmed.",
      },
      {
        icon: "palette",
        title: "Studio finishes",
        copy: "Fabric finishes help the traps integrate into professional and home studios.",
      },
    ],
    storyEyebrow: "Studio Low-End Control",
    storyTitle: "Hear tighter bass. Make better decisions.",
    useCases: [
      {
        title: "Mix Engineers",
        copy: "Reduce low-end ringing so kick, bass, and sub information translate more reliably.",
        benefits: [
          "Tighter decay",
          "Clearer mix decisions",
          "More accurate monitoring",
        ],
      },
      {
        title: "Drum Studios",
        copy: "Control the weight and sustain of kick drums, floor toms, and room resonances.",
        benefits: ["Less boom", "Cleaner microphones", "More usable room tone"],
      },
      {
        title: "Recording Studios",
        copy: "Build a controlled low-frequency foundation around tracking and control rooms.",
        benefits: [
          "Reduced modal buildup",
          "Improved imaging",
          "Consistent playback",
        ],
      },
    ],
  },
  gobo: {
    line: "gobo",
    pricePrefix: "From",
    quoteOnly: true,
    artworkReview: false,
    customSizes: true,
    shortDescription:
      "A movable, freestanding acoustic panel for shaping room tone, reducing reflections, and improving separation without permanent wall or ceiling mounting.",
    performance: {
      eyebrow: "Indicative Reference Performance",
      title: "Portable Control",
      accent: "Where You Need It",
      description:
        "Final performance depends on the selected size, depth, internal construction, and position. Deeper builds extend control into the upper-bass range.",
      disclaimer:
        "Performance bands are indicative because every Gobo is configured to suit the room and recording application. Final specifications are confirmed before production.",
    },
    features: [
      {
        icon: "truck",
        title: "Portable treatment",
        copy: "Move it between instruments, rooms, windows, doors, and reflection points.",
      },
      {
        icon: "layers",
        title: "Broadband control",
        copy: "Reduces reflections, reverberation, and microphone bleed.",
      },
      {
        icon: "ruler",
        title: "Fully custom",
        copy: "Size, depth, finish, and stand configuration are tailored to your workflow.",
      },
      {
        icon: "wrench",
        title: "No wall mounting",
        copy: "Useful where permanent wall or ceiling installation is not possible.",
      },
      {
        icon: "palette",
        title: "Room-friendly finish",
        copy: "Choose a finish that works on camera and in client-facing studios.",
      },
      {
        icon: "flame",
        title: "Acoustic treatment",
        copy: "Improves sound inside the room; it is not a substitute for construction soundproofing.",
      },
    ],
    storyEyebrow: "Portable Acoustic Control",
    storyTitle: "Move it. Position it. Shape the room.",
    useCases: [
      {
        title: "Vocals",
        copy: "Place treatment around the microphone to reduce room reflections and capture a more focused sound.",
        benefits: ["Cleaner takes", "Less room tone", "Flexible positioning"],
      },
      {
        title: "Drums & Amplifiers",
        copy: "Create temporary acoustic separation between loud sources during recording.",
        benefits: [
          "Reduced bleed",
          "Controlled reflections",
          "Fast setup changes",
        ],
      },
      {
        title: "Flexible Rooms",
        copy: "Treat windows, doors, or shared rooms without committing to permanent mounting.",
        benefits: ["No drilling", "Easy relocation", "Multipurpose use"],
      },
    ],
  },
  "custom-print-panels": {
    line: "custom-print-panels",
    pricePrefix: "From",
    quoteOnly: false,
    artworkReview: true,
    customSizes: true,
    shortDescription:
      "Custom-printed acoustic panels that combine branded artwork and decorative imagery with practical room absorption.",
    performance: {
      eyebrow: "Indicative Reference Performance",
      title: "Artwork With",
      accent: "Acoustic Purpose",
      description:
        "The printed synthetic finish remains absorptive, although performance can be up to approximately 30% lower than an equivalent fabric-wrapped Flexi panel depending on print and finish.",
      disclaimer:
        "The comparison is indicative rather than a product-specific laboratory result. Final performance depends on panel depth, artwork finish, mounting, and room conditions.",
    },
    features: [
      {
        icon: "palette",
        title: "High-resolution print",
        copy: "Turn logos, artwork, photography, and brand graphics into acoustic treatment.",
      },
      {
        icon: "layers",
        title: "Acoustic core",
        copy: "Uses the same practical panel formats as the Flexi product family.",
      },
      {
        icon: "ruler",
        title: "Custom sizes",
        copy: "Standard Flexi formats plus custom dimensions after artwork review.",
      },
      {
        icon: "wrench",
        title: "Artwork checked",
        copy: "Files are reviewed for resolution, crop, bleed, and final production fit.",
      },
      {
        icon: "truck",
        title: "Made to order",
        copy: "Printing begins after artwork proof and order details are approved.",
      },
      {
        icon: "flame",
        title: "Wipeable finish",
        copy: "More moisture-resistant than fabric, but not sold as waterproof.",
      },
    ],
    storyEyebrow: "Custom Acoustic Artwork",
    storyTitle: "Make the treatment part of the design.",
    useCases: [
      {
        title: "Company Branding",
        copy: "Use logos, campaign graphics, or brand patterns in offices and customer-facing spaces.",
        benefits: [
          "On-brand treatment",
          "Functional signage",
          "Custom layouts",
        ],
      },
      {
        title: "Hospitality",
        copy: "Print artwork that suits restaurants, bars, hotels, and entertainment venues.",
        benefits: [
          "Designed ambience",
          "Reduced reverberation",
          "Wipeable surface",
        ],
      },
      {
        title: "Feature Walls",
        copy: "Create artwork grids or large visual moments without giving up acoustic function.",
        benefits: ["Custom imagery", "Flexible sizing", "Integrated design"],
      },
    ],
  },
  "pet-panel": {
    line: "pet-panel",
    pricePrefix: "From",
    quoteOnly: true,
    artworkReview: false,
    customSizes: true,
    shortDescription:
      "Lightweight recycled PET acoustic panels for direct-fix walls, decorative features, pinboard surfaces, and tailored commercial interiors.",
    performance: {
      eyebrow: "Indicative Reference Performance",
      title: "Lightweight Treatment",
      accent: "Built To Fit",
      description:
        "Choose 9 mm for slim decorative control or 12 mm for stronger absorption. Air gaps, coverage, and mounting can materially change performance.",
      disclaimer:
        "Reference values use comparable direct-mounted PET products: approximately NRC 0.30 at 9 mm and NRC 0.45 for comparable 12 mm material. This is not a Forma laboratory report.",
    },
    features: [
      {
        icon: "layers",
        title: "Recycled PET",
        copy: "A lightweight polyester-felt format suited to modern interior applications.",
      },
      {
        icon: "ruler",
        title: "9 mm or 12 mm",
        copy: "Choose the depth that suits the visual detail and acoustic requirement.",
      },
      {
        icon: "palette",
        title: "Colour-led design",
        copy: "Use solid colours, layered forms, grooves, and custom-cut shapes.",
      },
      {
        icon: "wrench",
        title: "Direct-fix installation",
        copy: "Panels can be adhered or mechanically fixed to suitable wall surfaces.",
      },
      {
        icon: "truck",
        title: "Made to order",
        copy: "Final quantities, cutting, colour, and installation are confirmed by quote.",
      },
      {
        icon: "flame",
        title: "Commercial applications",
        copy: "Ideal for offices, schools, hospitality, meeting rooms, and feature walls.",
      },
    ],
    storyEyebrow: "PET Acoustic Design",
    storyTitle: "Colour, texture, and practical sound control.",
    useCases: [
      {
        title: "Offices",
        copy: "Add colour and useful absorption to meeting rooms, collaboration spaces, and work areas.",
        benefits: ["Reduced chatter", "Custom branding", "Direct wall fixing"],
      },
      {
        title: "Education",
        copy: "Create durable visual zones and pinboard-style surfaces in classrooms and learning spaces.",
        benefits: ["Clearer teaching", "Durable surface", "Custom-cut forms"],
      },
      {
        title: "Hospitality",
        copy: "Build decorative acoustic features for restaurants, cafes, hotels, and shared venues.",
        benefits: [
          "Design flexibility",
          "Lighter reverberation",
          "Colour choice",
        ],
      },
    ],
  },
  accessory: {
    line: "accessory",
    pricePrefix: "Fixed",
    quoteOnly: false,
    artworkReview: false,
    customSizes: false,
    shortDescription:
      "Mounting hardware and accessories for Just Acoustics panel installations.",
    performance: {
      eyebrow: "Installation Accessory",
      title: "Built For",
      accent: "Secure Installation",
      description:
        "Use the correct accessory for the selected panel, surface, and installation method.",
    },
    features: [
      {
        icon: "wrench",
        title: "Purpose-built",
        copy: "Designed to support compatible Just Acoustics products.",
      },
      {
        icon: "layers",
        title: "Clean finish",
        copy: "Keeps mounting details discreet and practical.",
      },
      {
        icon: "truck",
        title: "Project support",
        copy: "Contact the team if you are unsure which mounting system is required.",
      },
    ],
    storyEyebrow: "Installation Support",
    storyTitle: "The right hardware for the right surface.",
    useCases: [],
  },
};

export function resolveProductLine(
  item: Pick<ShopItem, "productLine" | "slug" | "title" | "category">,
): ShopProductLine {
  if (item.productLine && item.productLine in profiles)
    return item.productLine as ShopProductLine;

  const identity = `${item.slug.current} ${item.title}`.toLowerCase();
  if (
    item.category === "accessories" ||
    identity.includes("mount kit") ||
    identity.includes("mounting")
  )
    return "accessory";
  if (identity.includes("bass trap")) return "bass-trap";
  if (identity.includes("gobo")) return "gobo";
  if (identity.includes("custom print")) return "custom-print-panels";
  if (identity.includes("pet panel")) return "pet-panel";
  return "flexi-panel";
}

export function getProductProfile(
  item: Pick<ShopItem, "productLine" | "slug" | "title" | "category">,
) {
  return profiles[resolveProductLine(item)];
}
