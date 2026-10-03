"use client";

import { useRef, useState } from "react";
import type { ShopItem } from "@/lib/types";
import { resolveProductLine } from "@/lib/shopProductProfiles";
import { getSpecValue, isFlexiProduct } from "./productHelpers";

export function ProductDetailAccordions({ item }: { item: ShopItem }) {
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
