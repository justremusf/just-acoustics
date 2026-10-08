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
        a: "Flexi panels are made to order. Standard lead time is 4 to 6 weeks, with final timing confirmed when the colour, size, quantity, and installation scope are approved.",
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
      flush
    />
  );
}
