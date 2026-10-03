"use client";

import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
  const rows = useMemo(
    () => item.acousticalSpecs?.rows || [],
    [item.acousticalSpecs?.rows],
  );
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
