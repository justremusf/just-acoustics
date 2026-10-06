"use client";

// Below-the-fold interactive islands, split into their own chunks so they
// don't block the product hero from hydrating. All keep SSR, so their markup
// (and copy) is still in the server HTML.
import dynamic from "next/dynamic";

export const LazyProductPanelCalculator = dynamic(
  () => import("@/components/shop/ProductPanelCalculator"),
  {
    loading: () => (
      <div className="min-h-[420px] animate-pulse rounded-[28px] bg-black/[0.03]" />
    ),
  },
);

export const LazyProductPerformanceChart = dynamic(() =>
  import("./ProductPerformanceChart").then((mod) => mod.ProductPerformanceChart),
);

export const LazyProductBeforeAfterSection = dynamic(() =>
  import("./ProductBeforeAfterSection").then(
    (mod) => mod.ProductBeforeAfterSection,
  ),
);
