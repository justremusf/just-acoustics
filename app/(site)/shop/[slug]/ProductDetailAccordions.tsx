"use client";

import { useRef, useState } from "react";
import type { ProductDetailPanel } from "./productDetailPanels";

export function ProductDetailAccordions({
  panels,
}: {
  panels: ProductDetailPanel[];
}) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const panelRef = useRef<Record<string, HTMLDivElement | null>>({});

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
