"use client";

import Image from "next/image";
import type { CartItemOption } from "@/components/cart/CartContext";

const CART_COLOUR_FALLBACKS: Record<string, string> = {
  white: "#f5f5f2",
  black: "#171717",
  charcoal: "#41454a",
  navy: "#243d5a",
  "sky blue": "#91b6d6",
  seafoam: "#abc8c1",
  linen: "#d9cfbf",
  bone: "#ddd8cc",
  terracotta: "#b65c43",
  magenta: "#d6185a",
};

export default function CartOptionDetails({
  itemId,
  options,
  compact = false,
}: {
  itemId: string;
  options: CartItemOption[];
  compact?: boolean;
}) {
  const visibleOptions = options.filter((option) => option.value);
  if (!visibleOptions.length) return null;

  return (
    <dl className={`m-0 grid ${compact ? "mt-2 grid-cols-2 gap-1.5" : "mt-3 grid-cols-2 gap-2"}`}>
      {visibleOptions.map((option) => {
        const isColour =
          option.label.toLowerCase().includes("colour") ||
          option.label.toLowerCase().includes("color");
        const fallbackHex =
          isColour && option.value
            ? CART_COLOUR_FALLBACKS[option.value.toLowerCase().replace(/\s+\d+$/, "")]
            : undefined;
        const swatchHex = option.hex || fallbackHex;

        return (
          <div
            key={`${itemId}-${option.label}`}
            className={`min-w-0 rounded-[12px] border border-black/7 bg-white/68 ${compact ? "px-2.5 py-2" : "px-3 py-2.5"}`}
          >
            <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--color-gray-200)]">
              {option.label}
            </dt>
            <dd className={`m-0 mt-1 flex min-w-0 items-center gap-2 font-semibold leading-tight text-[var(--color-dark-100)] ${compact ? "text-[11px]" : "text-[12px]"}`}>
              {isColour && (option.swatchSrc || swatchHex) ? (
                <span
                  className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full border border-black/10 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]"
                  style={!option.swatchSrc && swatchHex ? { backgroundColor: swatchHex } : undefined}
                >
                  {option.swatchSrc ? (
                    <Image src={option.swatchSrc} alt="" fill sizes="16px" className="object-cover" />
                  ) : null}
                </span>
              ) : null}
              <span className="min-w-0 truncate">{option.value}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
