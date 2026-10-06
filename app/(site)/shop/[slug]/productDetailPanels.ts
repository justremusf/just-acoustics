// Copy for the product detail accordions, built on the server so the client
// accordion only receives the final title/body pairs.
import type { ShopItem } from "@/lib/types";
import { resolveProductLine } from "@/lib/shopProductProfiles";
import { STANDARD_LEAD_TIME } from "@/lib/shopDisplay";
import { getSpecValue, isFlexiProduct } from "./productHelpers";

export type ProductDetailPanel = { title: string; body: string };

export function getProductDetailPanels(item: ShopItem): ProductDetailPanel[] {
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

  return isStandardFlexi
    ? [
        {
          title: "Shipping & Lead Time",
          body: "Flexi™ Acoustic Panels are made to order based on your selected size, colour, and quantity.\n\nStandard orders take 4 to 6 weeks. Larger custom orders may need a little longer, and we will tell you upfront.\n\nDelivery and installation are available across Singapore. Timeline will be confirmed before production begins.",
        },
        {
          title: "Specifications",
          body: "Thickness: 2.5cm or 5cm\nStandard sizes: 60 x 60cm, 60 x 120cm and 60 x 180cm\nCustom sizes: Available upon request\nMounting: Wall or ceiling\nCore density: 96kg/m3\nNRC: Up to 1.00\nAverage weight: 60 x 120 x 5cm is approximately 4kg",
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
          body: "Every panel comes with a 1-year warranty covering defects in materials and workmanship. If anything happens, let us know and we'll make it right.",
        },
      ]
    : [
        {
          title: "Lead time",
          body: `${STANDARD_LEAD_TIME} We confirm your exact timeline once we review your quantity, finish, and delivery requirements in Singapore.`,
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
          body: "Every panel comes with a 1-year warranty covering defects in materials and workmanship. If anything happens, let us know and we'll make it right.",
        },
      ];
}
