"use client";

import { createContext, useContext } from "react";
import { ShoppingBag } from "lucide-react";

export type CartItemOption = {
  label: string;
  value?: string;
  swatchSrc?: string;
  hex?: string;
};

export type CartItemInput = {
  slug: string;
  title: string;
  imageSrc?: string | null;
  unitPrice: number;
  quantity: number;
  options: CartItemOption[];
};

export type CartItem = CartItemInput & {
  id: string;
  addedAt: string;
};

export type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  addItem: (item: CartItemInput) => void;
  openCart: () => void;
  closeCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function CartButton({
  className = "",
  label = "Cart",
}: {
  className?: string;
  label?: string;
}) {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={className}
      aria-label={
        itemCount
          ? `Open cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`
          : "Open empty cart"
      }
    >
      <ShoppingBag className="h-4 w-4" />
      <span className="cart-button-label">{label}</span>
      {itemCount > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-brand-orange)] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}
