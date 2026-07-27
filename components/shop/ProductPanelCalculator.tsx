"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculatePanels,
  generateWhatsAppUrl,
  MAIN_PROBLEM_LABELS,
  ROOM_TYPE_LABELS,
  type MainProblem,
  type RoomType,
} from "@/lib/panel-calculator";
import type { ShopProductLine } from "@/lib/shopProductProfiles";

type Step = 1 | 2 | 3 | 4;

const roomOrder: RoomType[] = [
  "office",
  "restaurant",
  "tuition",
  "church",
  "residential",
  "studio",
  "gym",
  "other",
];

const problemOrder: MainProblem[] = [
  "echo",
  "speech",
  "loud",
  "video",
  "music",
  "noise",
  "unsure",
];

const productCopy: Record<
  Exclude<ShopProductLine, "accessory">,
  {
    title: string;
    intro: string;
    defaultRoom: RoomType;
    unit: string;
    resultNote: string;
    cta: string;
    href: (slug: string) => string;
  }
> = {
  "flexi-panel": {
    title: "How many Flexi panels does your space need?",
    intro:
      "Get a practical starting range based on your room dimensions and how the space is used.",
    defaultRoom: "office",
    unit: "panels",
    resultNote: "Based on standard 120 × 60 cm Flexi panels.",
    cta: "Configure your Flexi panels",
    href: () => "#product-configurator",
  },
  "bass-trap": {
    title: "How many bass traps should you plan for?",
    intro:
      "Estimate a starting treatment range for your studio before confirming corner and boundary placement.",
    defaultRoom: "studio",
    unit: "bass traps",
    resultNote:
      "A starting range only. Room modes and corner availability determine the final layout.",
    cta: "Configure Studio Bass Traps",
    href: () => "#product-configurator",
  },
  gobo: {
    title: "How many Gobos should you start with?",
    intro:
      "Estimate a useful starting quantity for portable reflection control around performers and equipment.",
    defaultRoom: "studio",
    unit: "Gobos",
    resultNote:
      "Final quantity, depth, and size are confirmed around your recording layout.",
    cta: "Request a Gobo plan",
    href: (slug) => `/contact?product=${slug}&request=gobo-plan`,
  },
  "custom-print-panels": {
    title: "How many printed panels does your space need?",
    intro:
      "Estimate the panel count first, then plan the artwork across the recommended treatment area.",
    defaultRoom: "office",
    unit: "printed panels",
    resultNote:
      "Based on standard 120 × 60 cm panels. Artwork and custom sizes are reviewed separately.",
    cta: "Start artwork review",
    href: (slug) => `/contact?product=${slug}&request=artwork-review`,
  },
  "pet-panel": {
    title: "How much PET treatment should you plan for?",
    intro:
      "Get a standard-panel equivalent before we convert the result into a custom PET layout.",
    defaultRoom: "office",
    unit: "panel equivalents",
    resultNote:
      "The final PET quantity changes with sheet size, cut pattern, thickness, and coverage.",
    cta: "Request a PET layout",
    href: (slug) => `/contact?product=${slug}&request=pet-layout`,
  },
};

export default function ProductPanelCalculator({
  line,
  productTitle,
  productSlug,
}: {
  line: Exclude<ShopProductLine, "accessory">;
  productTitle: string;
  productSlug: string;
}) {
  const copy = productCopy[line];
  const [step, setStep] = useState<Step>(1);
  const [roomType, setRoomType] = useState<RoomType>(copy.defaultRoom);
  const [problem, setProblem] = useState<MainProblem>(
    line === "bass-trap" ? "music" : "echo",
  );
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");

  const results = useMemo(
    () =>
      calculatePanels({
        roomType,
        mainProblem: problem,
        length: Number(length),
        width: Number(width),
        height: Number(height),
        treatmentArea: "unsure",
        severity: "noticeable",
      }),
    [height, length, problem, roomType, width],
  );

  const showResults = () => {
    const dimensions = [Number(length), Number(width), Number(height)];
    if (
      !results ||
      dimensions.some((value) => !Number.isFinite(value) || value <= 0)
    ) {
      setError("Enter valid room dimensions before generating the estimate.");
      return;
    }
    setError("");
    setStep(4);
  };

  const whatsappHref = results
    ? generateWhatsAppUrl(
        {
          roomType,
          mainProblem: problem,
          length: Number(length),
          width: Number(width),
          height: Number(height),
          treatmentArea: "unsure",
          severity: "noticeable",
        },
        results,
        productTitle,
      )
    : "#";

  return (
    <section
      className="home-shell page-hero-shell scroll-mt-28"
      id="panel-calculator"
    >
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div className="max-w-[540px]">
          <span className="soft-pill">Panel Calculator</span>
          <h2
            className="m-0 mt-4 text-[clamp(32px,3.2vw,46px)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--color-dark-100)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {copy.title}
          </h2>
          <p className="m-0 mt-4 text-[15px] leading-7 text-[var(--color-gray-100)]">
            {copy.intro}
          </p>
          <p className="m-0 mt-3 text-xs leading-5 text-[var(--color-gray-200)]">
            Ballpark guidance only. Final coverage depends on room finishes,
            placement, and the chosen product specification.
          </p>
        </div>

        <div className="glass-card p-4 sm:p-5">
          {step < 4 ? (
            <div className="mb-5">
              <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-[var(--color-brand-orange)] transition-[width] duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
              <p className="page-kicker m-0 mt-3">Step {step} of 3</p>
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <h3 className="m-0 text-2xl font-semibold text-[var(--color-dark-100)]">
                Select room type
              </h3>
              <p className="m-0 mt-2 text-sm text-[var(--color-gray-100)]">
                Choose the closest match for your space.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {roomOrder.map((room) => (
                  <button
                    key={room}
                    type="button"
                    onClick={() => {
                      setRoomType(room);
                      setStep(2);
                    }}
                    className={`min-h-12 rounded-[14px] border px-3 py-3 text-sm font-semibold transition-colors ${roomType === room ? "border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.07)] text-[var(--color-dark-100)]" : "border-black/8 bg-white/72 text-[var(--color-gray-100)] hover:border-[rgba(255,165,0,0.35)]"}`}
                  >
                    {ROOM_TYPE_LABELS[room]}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h3 className="m-0 text-2xl font-semibold text-[var(--color-dark-100)]">
                What needs improving?
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {problemOrder.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setProblem(item);
                      setStep(3);
                    }}
                    className={`min-h-12 rounded-[14px] border px-4 py-3 text-left text-sm font-semibold transition-colors ${problem === item ? "border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.07)] text-[var(--color-dark-100)]" : "border-black/8 bg-white/72 text-[var(--color-gray-100)] hover:border-[rgba(255,165,0,0.35)]"}`}
                  >
                    {MAIN_PROBLEM_LABELS[item]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 text-sm font-semibold text-[var(--color-gray-200)]"
              >
                Back
              </button>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h3 className="m-0 text-2xl font-semibold text-[var(--color-dark-100)]">
                Enter room dimensions
              </h3>
              <p className="m-0 mt-2 text-sm text-[var(--color-gray-100)]">
                Use metres. An approximate measurement is enough.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Length", value: length, set: setLength },
                  { label: "Width", value: width, set: setWidth },
                  { label: "Height", value: height, set: setHeight },
                ].map((field) => {
                  const inputId = `product-calculator-${field.label.toLowerCase()}`;
                  return (
                    <div key={field.label}>
                      <label
                        htmlFor={inputId}
                        className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-gray-200)]"
                      >
                        {field.label}
                      </label>
                      <span className="relative mt-2 block">
                        <input
                          id={inputId}
                          aria-label={`${field.label} in metres`}
                          type="number"
                          inputMode="decimal"
                          min="0"
                          value={field.value}
                          onChange={(event) => field.set(event.target.value)}
                          className="min-h-12 w-full rounded-[14px] border border-black/8 bg-white px-4 pr-9 text-base font-semibold text-[var(--color-dark-100)] outline-none focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[rgba(255,165,0,0.12)]"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                          m
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
              {error ? (
                <p className="m-0 mt-3 text-sm text-red-600">{error}</p>
              ) : null}
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-12 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={showResults}
                  className="page-cta flex-1"
                >
                  Generate estimate
                </button>
              </div>
            </div>
          ) : null}

          {step === 4 && results ? (
            <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
              <div>
                <p className="page-kicker m-0">Ballpark range</p>
                <p className="m-0 mt-2 text-[clamp(42px,6vw,64px)] font-semibold leading-none tracking-[-0.05em] text-[var(--color-dark-100)]">
                  {results.recommendedMin}–{results.recommendedMax}
                </p>
                <p className="m-0 mt-2 text-lg font-semibold text-[var(--color-brand-orange-dark)]">
                  {copy.unit}
                </p>
                <p className="m-0 mt-3 text-sm leading-6 text-[var(--color-gray-100)]">
                  {copy.resultNote}
                </p>
              </div>
              <div className="rounded-[18px] border border-black/7 bg-white/72 p-4">
                <p className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">
                  <strong className="text-[var(--color-dark-100)]">
                    Placement:
                  </strong>{" "}
                  {results.placementGuidance}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={copy.href(productSlug)}
                    className="page-cta min-h-12 text-center"
                  >
                    {copy.cta}
                  </Link>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#137e89]/25 bg-[#137e89]/9 px-4 text-center text-sm font-semibold text-[#137e89] no-underline transition-colors hover:bg-[#137e89]/14"
                  >
                    Get personalised advice
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-3 text-sm font-semibold text-[var(--color-gray-200)]"
                >
                  Recalculate
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
