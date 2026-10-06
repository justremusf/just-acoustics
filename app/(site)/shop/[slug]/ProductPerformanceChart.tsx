"use client";

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { PerformanceSeries } from "./productData";

export type PerformanceFrequency = { key: string; label: string };

/**
 * Interactive absorption chart. Series data and the frequency guide are
 * prepared on the server (see ProductPerformance.tsx).
 */
export function ProductPerformanceChart({
  frequencies,
  parsedRows,
  guide,
}: {
  frequencies: readonly PerformanceFrequency[];
  parsedRows: PerformanceSeries[];
  guide: ReactNode;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

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
      {guide}
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

