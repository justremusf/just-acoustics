// Presentational product page sections (no local state).
import Image from "@/components/ui/Image";
import Link from "next/link";
import {
  ExternalLink,
  FileText,
  Flame,
  Headphones,
  Layers,
  Palette,
  Ruler,
  SlidersHorizontal,
  Star,
  Target,
  Truck,
  Wrench,
} from "lucide-react";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import FAQ, { type FaqItem } from "@/components/sections/FAQ";
import type { ShopItem } from "@/lib/types";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import {
  getProductProfile,
  resolveProductLine,
  type ProductFeatureIcon,
} from "@/lib/shopProductProfiles";
import { getImageSrc, isFlexiProduct } from "./productHelpers";

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

export function ProductFeatureCards({ item }: { item: ShopItem }) {
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

export function ProductStorySections({ item }: { item: ShopItem }) {
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

export function ProductInUseGallery() {
  const images = [
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-1.webp",
      label: "Flexi™ 180 x 60 x 5cm - Colour: Amber 14",
      position: "md:left-[46%] md:top-[67px] md:-translate-x-1/2",
    },
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-2.webp",
      label: "Flexi™ 120 x 60 x 5cm - Colour: Black",
      position: "md:left-[42%] md:top-[34%] md:-translate-x-1/2",
    },
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-3.webp",
      label: "Flexi™ 120 x 60 x 5cm - Colour: Concrete 27",
      position: "md:left-[50%] md:top-[28%] md:-translate-x-1/2",
    },
    {
      src: "/assets/shop/standard-flexi/gallery/flexi-gallery-4.webp",
      label: "Flexi™ 120 x 60 x 5cm - Colour: Slate 25",
      position: "md:right-[10%] md:top-[72px]",
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
            <div
              className={`absolute inset-x-4 bottom-4 rounded-[16px] border border-white/40 bg-black/38 px-4 py-3 text-left text-sm font-semibold leading-5 text-white shadow-[0_18px_46px_rgba(0,0,0,0.24)] backdrop-blur-xl md:inset-x-auto md:bottom-auto md:max-w-[240px] md:rounded-[18px] md:bg-white/18 md:text-xs ${image.position}`}
            >
              {image.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductInstallationDownloads() {
  const downloads = [
    {
      title: "Wall Mount Installation Guide",
      href: "https://www.youtube.com/watch?v=6Ns6aZgqlZA",
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
            Great acoustics start with proper installation. Our guide walks
            through wall mounting so panels are placed securely and effectively.
          </p>
        </div>
        <div className="grid gap-4 rounded-[28px] border border-black/6 bg-white/72 p-4 sm:p-5">
          {downloads.map((download) => (
            <a
              key={download.href}
              href={download.href}
              target="_blank"
              rel="noopener noreferrer"
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
                <ExternalLink className="h-4 w-4" />
                View
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomPrintWorkflow() {
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

export function ProductReviewsSection({ item }: { item: ShopItem }) {
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

export function ProductInfoFaqSection({ item }: { item: ShopItem }) {
  const line = resolveProductLine(item);
  const shared = [
    {
      q: "Can this soundproof my room?",
      a: "No, panels improve sound inside a room, while soundproofing needs building work on walls, doors and windows.",
    },
    {
      q: "Can you make a custom size?",
      a: "Yes, send your dimensions, photos and where it is going, and we will confirm a size and fit that works.",
    },
    {
      q: "Can Just Acoustics install it?",
      a: "Yes, we can deliver and install it once we have checked access, wall type and mounting height.",
    },
  ];
  const specific: Record<string, FaqItem[]> = {
    "flexi-panel": [
      {
        q: "Can Flexi panels soundproof my room?",
        a: "No, Flexi panels cut echo inside a room, while soundproofing needs building work on walls, doors and windows.",
      },
      {
        q: "What do Flexi acoustic panels improve?",
        a: "They cut echo and harsh reflections, so speech, calls and music sound clearer and less tiring.",
      },
      {
        q: "How many panels do I need?",
        a: "It depends on room size and finishes, so send dimensions and photos and we will suggest a starting amount.",
      },
      {
        q: "Should I choose 25 mm or 50 mm panels?",
        a: "Pick 25 mm for speech and everyday rooms, or 50 mm for stronger absorption in louder, more demanding rooms.",
      },
      {
        q: "Where should acoustic panels be installed?",
        a: "Start with walls facing speakers, hard parallel walls and spots near where people talk, then adjust for your layout.",
      },
      {
        q: "Can you make a custom size or shape?",
        a: "Yes, most practical shapes and sizes are possible, so send dimensions and photos and we will confirm the details.",
      },
      {
        q: "Can Flexi panels be installed on a ceiling?",
        a: "Yes, they can go on ceilings once we have checked the ceiling type, access and mounting system.",
      },
      {
        q: "Can Just Acoustics install the panels?",
        a: "Yes, choose supply-only or full delivery and installation, depending on site access and wall condition.",
      },
      {
        q: "How long is the lead time?",
        a: "Panels are made to order and usually take 4 to 6 weeks, confirmed once your order is approved.",
      },
      {
        q: "Can I see fabric colours before ordering?",
        a: "Yes, contact us to see the fabric collection or get help picking a finish for your room.",
      },
      {
        q: "How should I clean the panels?",
        a: "Dust gently with a soft brush or low-suction vacuum, and never soak them or use harsh cleaners.",
      },
      {
        q: "Which spaces are Flexi panels suitable for?",
        a: "They suit offices, studios, restaurants, homes, schools and churches, or anywhere you want clearer sound and a clean finish.",
      },
    ],
    "bass-trap": [
      {
        q: "Should I choose Studio or Maxx?",
        a: "Start with the 15 cm Studio for upper bass, or the 30 cm Maxx for deeper bass if you have the space.",
      },
      {
        q: "Where should bass traps go?",
        a: "Corners first, then the front and back walls where bass builds up the most.",
      },
      {
        q: "Will bass traps remove every null?",
        a: "No, bass traps tame boomy and dead bass spots, but speaker and seating position still matter.",
      },
    ],
    gobo: [
      {
        q: "What is a Gobo used for?",
        a: "It is a movable panel that cuts reflections around mics, drums, amps or performers wherever you need it.",
      },
      {
        q: "Does a Gobo block sound completely?",
        a: "No, it cuts reflections and mic bleed but will not replace a properly built soundproof wall or booth.",
      },
    ],
    "custom-print-panels": [
      {
        q: "Which artwork files work best?",
        a: "High-resolution PDF or vector files work best, and we check the layout before printing.",
      },
      {
        q: "Is the printed surface waterproof?",
        a: "No, the printed finish wipes clean and handles moisture better than fabric, but it is not waterproof.",
      },
    ],
    "pet-panel": [
      {
        q: "What is the difference between 9 mm and 12 mm?",
        a: "9 mm is slimmer for decorative wall fixing, while 12 mm absorbs more sound and looks more solid.",
      },
      {
        q: "Can PET panels be custom cut?",
        a: "Yes, Forma panels can be cut into shapes, grooves and patterns once we have reviewed your layout.",
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
      flush
    />
  );
}
