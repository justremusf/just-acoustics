"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { formatPayable, lineTotal, roundCents } from "@/lib/checkout";
import {
  CartContext,
  type CartContextValue,
  type CartItem,
  type CartItemInput,
  type CartItemOption,
} from "@/components/cart/CartContext";
import InstallationEnquiry from "./InstallationEnquiry";
import CartOptionDetails from "@/components/cart/CartOptionDetails";

const CART_STORAGE_KEY = "just-acoustics-cart";
const CART_COOKIE_KEY = "just-acoustics-cart-v1";
const CART_STORAGE_VERSION = 1;
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
// Browsers drop cookies over ~4KB; only mirror small carts into the cookie.
const CART_COOKIE_MAX_BYTES = 3800;

function getCartItemId(item: CartItemInput) {
  const optionKey = item.options
    .map((option) => `${option.label}:${option.value || ""}`)
    .join("|");
  return `${item.slug}|${optionKey}|${item.unitPrice}`;
}

function parseStoredItems(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    const stored = JSON.parse(value);
    const parsed: unknown[] = Array.isArray(stored)
      ? stored
      : stored?.version === CART_STORAGE_VERSION && Array.isArray(stored.items)
        ? stored.items
        : [];
    return parsed
      .map((item: unknown): CartItem | null => {
        if (!item || typeof item !== "object") return null;
        const candidate = item as Record<string, unknown>;
        if (
          typeof candidate.id !== "string" ||
          typeof candidate.slug !== "string" ||
          typeof candidate.title !== "string"
        )
          return null;
        const quantity = Number(candidate.quantity);
        const unitPrice = Number(candidate.unitPrice);
        if (
          !Number.isFinite(quantity) ||
          quantity < 1 ||
          !Number.isFinite(unitPrice) ||
          unitPrice < 0
        )
          return null;
        return {
          selection: candidate.selection as CartItem["selection"],
          id: candidate.id,
          slug: candidate.slug,
          title: candidate.title,
          imageSrc:
            typeof candidate.imageSrc === "string" ? candidate.imageSrc : null,
          unitPrice,
          quantity: Math.floor(quantity),
          options: Array.isArray(candidate.options)
            ? candidate.options
                .filter((option: unknown): option is CartItemOption => {
                  return Boolean(
                    option &&
                      typeof option === "object" &&
                      "label" in option &&
                      typeof (option as CartItemOption).label === "string",
                  );
                })
                .map((option: CartItemOption) => ({
                  label: option.label,
                  value:
                    typeof option.value === "string" ? option.value : undefined,
                  swatchSrc:
                    typeof option.swatchSrc === "string"
                      ? option.swatchSrc
                      : undefined,
                  swatchRegion: option.swatchRegion,
                  hex: typeof option.hex === "string" ? option.hex : undefined,
                }))
            : [],
          addedAt:
            typeof candidate.addedAt === "string"
              ? candidate.addedAt
              : new Date().toISOString(),
        };
      })
      .filter((item: CartItem | null): item is CartItem => Boolean(item));
  } catch {
    return [];
  }
}

function readCartCookie() {
  const prefix = `${CART_COOKIE_KEY}=`;
  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix))
    ?.slice(prefix.length);
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function persistCartItems(items: CartItem[]) {
  const payload = JSON.stringify({
    version: CART_STORAGE_VERSION,
    items,
    updatedAt: new Date().toISOString(),
  });
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, payload);
  } catch {
    // Keep the in-memory cart usable when storage is unavailable or full.
  }
  try {
    const encoded = encodeURIComponent(payload);
    document.cookie =
      encoded.length <= CART_COOKIE_MAX_BYTES
        ? `${CART_COOKIE_KEY}=${encoded}; Path=/; Max-Age=${CART_COOKIE_MAX_AGE}; SameSite=Lax`
        : `${CART_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  } catch {
    // Cookie fallback is best-effort; localStorage remains the primary store.
  }
}

function CartQuantityControl({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex h-12 min-w-[142px] overflow-hidden rounded-full border border-black/8 bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(15,23,42,0.04)]">
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= 1}
        className="inline-flex h-full w-12 items-center justify-center text-[var(--color-dark-100)] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div
        className="flex h-full min-w-12 items-center justify-center border-x border-black/8 px-3 text-base font-semibold text-[var(--color-dark-100)]"
        aria-live="polite"
        aria-label={`Quantity ${value}`}
      >
        {value}
      </div>
      <button
        type="button"
        onClick={onIncrease}
        className="inline-flex h-full w-12 items-center justify-center text-[var(--color-dark-100)] transition-colors hover:bg-black/5"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  useEffect(() => {
    try {
      const storedValue =
        window.localStorage.getItem(CART_STORAGE_KEY) || readCartCookie();
      setItems(parseStoredItems(storedValue));
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistCartItems(items);
  }, [hydrated, items]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      setItems(parseStoredItems(event.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setDrawerMounted(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const subtotal = useMemo(
    () =>
      roundCents(
        items.reduce(
          (sum, item) => sum + lineTotal(item.unitPrice, item.quantity),
          0,
        ),
      ),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const addItem = useCallback((input: CartItemInput) => {
    const quantity = Math.max(1, Math.floor(input.quantity || 1));
    const id = getCartItemId({ ...input, quantity });
    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      const nextItems = existing
        ? current.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [
            ...current,
            {
              ...input,
              quantity,
              // Whole cents: the orders API reprices on the server and compares cents.
              unitPrice: Math.max(0, Math.round(input.unitPrice * 100) / 100),
              imageSrc: input.imageSrc || null,
              id,
              addedAt: new Date().toISOString(),
            },
          ];
      return nextItems;
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const closeCart = useCallback(() => setIsOpen(false), []);
  const openCart = useCallback(() => setIsOpen(true), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      hydrated,
      isOpen,
      addItem,
      openCart,
      closeCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      addItem,
      closeCart,
      clearCart,
      hydrated,
      isOpen,
      itemCount,
      items,
      openCart,
      removeItem,
      subtotal,
      updateQuantity,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}

      {drawerMounted && <div
        className={`fixed inset-0 z-[1100] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div
          role="presentation"
          className="absolute inset-0 z-0 bg-black/30 backdrop-blur-[6px]"
          onClick={closeCart}
        />

        <aside
          className={`absolute bottom-0 right-0 z-10 flex max-h-[96dvh] w-full flex-col overflow-hidden rounded-t-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(246,243,237,0.96))] shadow-[0_30px_100px_rgba(0,0,0,0.22)] transition-transform duration-300 sm:top-0 sm:h-full sm:max-h-none sm:w-[min(560px,92vw)] sm:rounded-l-[34px] sm:rounded-tr-none ${
            isOpen
              ? "translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-x-full sm:translate-y-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-black/8 px-5 py-5 sm:px-7">
            <div className="flex items-baseline gap-3">
              <h2
                className="m-0 text-[32px] font-semibold leading-none text-[var(--color-dark-100)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Cart
              </h2>
              <span className="text-[22px] font-semibold text-black/24">
                {itemCount}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white/72 text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-0.5"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
            {items.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <ShoppingBag
                  className="h-12 w-12 text-[var(--color-brand-orange)]"
                  strokeWidth={1.7}
                />
                <h3
                  className="m-0 mt-6 max-w-[260px] text-[32px] font-semibold leading-tight text-[var(--color-dark-100)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your cart is currently empty.
                </h3>
                <p className="m-0 mt-4 max-w-[260px] text-sm leading-6 text-[var(--color-gray-100)]">
                  Not sure where to start? Try these shop collections.
                </p>
                <div className="mt-8 grid w-full max-w-[340px] gap-3">
                  {[
                    ["Acoustic Panels", "/shop?category=standard-panels"],
                    ["Custom Solutions", "/shop?category=custom-solutions"],
                    ["Package Deals", "/shop?category=package-deals"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeCart}
                      className="flex items-center justify-between rounded-[18px] border border-black/6 bg-white/72 px-5 py-4 text-sm font-semibold text-[var(--color-dark-100)] no-underline"
                    >
                      {label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 rounded-[24px] border border-white/60 bg-white/58 p-3 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur-xl"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[var(--color-white-200)]">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          sizes="104px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[var(--color-gray-200)]">
                          JA
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="m-0 text-lg font-semibold leading-tight text-[var(--color-dark-100)]">
                            {item.title}
                          </h3>
                          <CartOptionDetails
                            itemId={item.id}
                            options={item.options}
                          />
                        </div>
                        <p className="m-0 shrink-0 text-sm font-semibold text-[var(--color-dark-100)]">
                          {formatPayable(lineTotal(item.unitPrice, item.quantity))}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <CartQuantityControl
                          value={item.quantity}
                          onDecrease={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          onIncrease={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="destructive-action inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[var(--color-gray-100)]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-black/8 bg-white/66 px-5 py-5 sm:px-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="m-0 max-w-[240px] text-sm leading-6 text-[var(--color-gray-100)]">
                    Add delivery details next, then pay by PayNow. S$50 flat-rate islandwide delivery is added after your address.
                  </p>
                </div>
                <div className="text-right">
                  <p className="m-0 text-sm font-semibold text-[var(--color-gray-100)]">
                    Subtotal
                  </p>
                  <p className="m-0 mt-1 text-[30px] font-semibold leading-none text-[var(--color-dark-100)]">
                    {formatPayable(subtotal)}
                  </p>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="page-cta add-to-cart mt-5 inline-flex min-h-[58px] w-full items-center justify-center gap-2 rounded-full text-lg"
              >
                <LockKeyhole className="h-5 w-5" />
                Check out
              </Link>
              <InstallationEnquiry />
            </div>
          )}
        </aside>
      </div>}
    </CartContext.Provider>
  );
}
