// Server-rendered performance section; only the chart itself hydrates.
import type { ShopItem } from "@/lib/types";
import {
  getProductProfile,
  resolveProductLine,
} from "@/lib/shopProductProfiles";
import {
  ACOUSTIC_FREQUENCIES,
  BASS_TRAP_FREQUENCIES,
  BASS_TRAP_REFERENCE_SERIES,
  FREQUENCY_GUIDES,
  GOBO_REFERENCE_SERIES,
  PET_REFERENCE_SERIES,
  STANDARD_FLEXI_PERFORMANCE_SERIES,
  type PerformanceSeries,
} from "./productData";
import { parseNumericValue } from "./productHelpers";
import { LazyProductPerformanceChart } from "./ProductLazySections";

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

function ProductPerformanceChart({ item }: { item: ShopItem }) {
  const productLine = resolveProductLine(item);
  const rows = item.acousticalSpecs?.rows || [];
  const frequencies =
    productLine === "bass-trap" ? BASS_TRAP_FREQUENCIES : ACOUSTIC_FREQUENCIES;
  const parsedRows: PerformanceSeries[] = (() => {
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
  })();

  if (!parsedRows.length) {
    return (
      <div className="rounded-[28px] border border-black/8 bg-white/84 p-6 text-sm text-[var(--color-gray-100)]">
        Acoustical specs coming soon.
      </div>
    );
  }

  return (
    <LazyProductPerformanceChart
      frequencies={frequencies}
      parsedRows={parsedRows}
      guide={
        <FrequencyGuide
          productLine={productLine as Exclude<typeof productLine, "accessory">}
        />
      }
    />
  );
}

export function ProductPerformanceSection({ item }: { item: ShopItem }) {
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
