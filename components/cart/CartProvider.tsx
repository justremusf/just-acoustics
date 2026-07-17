"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  JUST_ACOUSTICS_WHATSAPP_URL,
  PAYNOW_HELP_BODY,
  PAYNOW_HELP_TITLE,
  PAYNOW_INSTRUCTIONS,
  PAYNOW_REASSURANCE,
} from "@/lib/paymentCopy";
import { formatSgd } from "@/lib/shopPricing";

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

type CheckoutFields = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  deliveryNotes: string;
};

type ManualPaymentDetails = {
  method: string;
  currency: string;
  amount: number;
  instructions: string;
};

type CartContextValue = {
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

const CART_STORAGE_KEY = "just-acoustics-cart";
const CART_COOKIE_KEY = "just-acoustics-cart-v1";
const CART_STORAGE_VERSION = 1;
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const PAYNOW_VPA = "UEN202336944WA00#XNAP";
const PAYNOW_QR_SRC = "/assets/paynow/just-acoustics-paynow-qr.png";

const emptyCheckoutFields: CheckoutFields = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  deliveryNotes: "",
};

const CartContext = createContext<CartContextValue | null>(null);

function createPaymentReference() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `JA-${datePart}-${randomPart}`;
}

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
    document.cookie = `${CART_COOKIE_KEY}=${encodeURIComponent(payload)}; Path=/; Max-Age=${CART_COOKIE_MAX_AGE}; SameSite=Lax`;
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
        className="inline-flex h-full w-12 items-center justify-center text-[var(--color-dark-100)] transition-colors hover:bg-black/5"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="flex h-full min-w-12 items-center justify-center border-x border-black/8 px-3 text-base font-semibold text-[var(--color-dark-100)]">
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

export function CartOptionDetails({
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
    <dl
      className={`m-0 grid ${compact ? "mt-2 grid-cols-2 gap-1.5" : "mt-3 grid-cols-2 gap-2"}`}
    >
      {visibleOptions.map((option) => {
        const isColour =
          option.label.toLowerCase().includes("colour") ||
          option.label.toLowerCase().includes("color");
        const fallbackHex =
          isColour && option.value
            ? CART_COLOUR_FALLBACKS[
                option.value.toLowerCase().replace(/\s+\d+$/, "")
              ]
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
            <dd
              className={`m-0 mt-1 flex min-w-0 items-center gap-2 font-semibold leading-tight text-[var(--color-dark-100)] ${compact ? "text-[11px]" : "text-[12px]"}`}
            >
              {isColour && (option.swatchSrc || swatchHex) ? (
                <span
                  className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full border border-black/10 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]"
                  style={
                    !option.swatchSrc && swatchHex
                      ? { backgroundColor: swatchHex }
                      : undefined
                  }
                >
                  {option.swatchSrc ? (
                    <Image
                      src={option.swatchSrc}
                      alt=""
                      fill
                      sizes="16px"
                      className="object-cover"
                    />
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [fields, setFields] = useState<CheckoutFields>(emptyCheckoutFields);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] =
    useState<ManualPaymentDetails | null>(null);
  const [paymentReference, setPaymentReference] = useState(() =>
    createPaymentReference(),
  );
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
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
              unitPrice: Math.max(0, Math.round(input.unitPrice)),
              imageSrc: input.imageSrc || null,
              id,
              addedAt: new Date().toISOString(),
            },
          ];
      return nextItems;
    });
    setCheckoutOpen(false);
    setFormError(null);
    setFormMessage(null);
    setPaymentDetails(null);
    setPaymentReference(createPaymentReference());
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setPaymentDetails(null);
    setPaymentReference(createPaymentReference());
    setFormMessage(null);
    setItems((current) => {
      const nextItems = current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
            : item,
        )
        .filter((item) => item.quantity > 0);
      return nextItems;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setPaymentDetails(null);
    setPaymentReference(createPaymentReference());
    setFormMessage(null);
    setItems((current) => {
      const nextItems = current.filter((item) => item.id !== id);
      return nextItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCheckoutOpen(false);
    setFields(emptyCheckoutFields);
    setFormError(null);
    setFormMessage(null);
    setPaymentDetails(null);
    setPaymentReference(createPaymentReference());
  }, []);

  const closeCart = useCallback(() => setIsOpen(false), []);
  const openCart = useCallback(() => setIsOpen(true), []);

  const checkoutPayload = useMemo(
    () => ({
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.quantity * item.unitPrice,
        options: item.options,
      })),
      subtotal,
      customer: fields,
      paymentReference,
      timestamp: new Date().toISOString(),
    }),
    [fields, items, paymentReference, subtotal],
  );

  const copyToClipboard = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(key);
      window.setTimeout(
        () => setCopiedValue((current) => (current === key ? null : current)),
        1600,
      );
    } catch {
      setCopiedValue(null);
    }
  };

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormMessage(null);
    setPaymentDetails(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/cart-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setFormError(body?.error || "Checkout could not be prepared.");
      } else {
        setFormMessage(
          body?.message ||
            "Order details received. Please complete the PayNow payment below. Once payment is received, you will receive a confirmation email and our team will reach out to schedule delivery and/or installation.",
        );
        setPaymentDetails(
          body?.payment || {
            method: "PayNow QR",
            currency: "SGD",
            amount: subtotal,
            instructions: PAYNOW_INSTRUCTIONS,
          },
        );
      }
    } catch {
      setFormError("Checkout could not be prepared. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
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

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
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
                          {formatSgd(item.unitPrice * item.quantity)}
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

                {checkoutOpen && (
                  <form
                    onSubmit={submitCheckout}
                    className="mt-2 grid gap-4 rounded-[24px] border border-black/8 bg-white/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="m-0 text-xl font-semibold text-[var(--color-dark-100)]">
                        Delivery details
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCheckoutOpen(false)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-gray-100)] hover:text-[var(--color-dark-100)]"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Cart
                      </button>
                    </div>

                    {[
                      ["fullName", "Full name", "text", true],
                      ["email", "Email", "email", true],
                      ["phone", "Phone number", "tel", true],
                      ["company", "Company name (optional)", "text", false],
                      ["addressLine1", "Delivery address", "text", true],
                      ["addressLine2", "Unit / address line 2", "text", false],
                      ["postalCode", "Postal code", "text", true],
                    ].map(([name, label, type, required]) => {
                      const inputId = `cart-checkout-${name}`;
                      return (
                        <div key={name as string} className="grid gap-2">
                          <label
                            htmlFor={inputId}
                            className="text-sm font-semibold text-[var(--color-dark-100)]"
                          >
                            {label}
                          </label>
                          <input
                            id={inputId}
                            required={Boolean(required)}
                            type={type as string}
                            value={fields[name as keyof CheckoutFields]}
                            onChange={(event) =>
                              setFields((current) => ({
                                ...current,
                                [name as string]: event.target.value,
                              }))
                            }
                            className="h-12 rounded-[14px] border border-black/10 bg-white px-4 text-sm font-medium outline-none transition-colors focus:border-[var(--color-brand-orange)]"
                          />
                        </div>
                      );
                    })}

                    <div className="grid gap-2">
                      <label
                        htmlFor="cart-checkout-delivery-notes"
                        className="text-sm font-semibold text-[var(--color-dark-100)]"
                      >
                        Delivery notes
                      </label>
                      <textarea
                        id="cart-checkout-delivery-notes"
                        value={fields.deliveryNotes}
                        onChange={(event) =>
                          setFields((current) => ({
                            ...current,
                            deliveryNotes: event.target.value,
                          }))
                        }
                        className="min-h-[96px] rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-[var(--color-brand-orange)]"
                      />
                    </div>

                    {formError && (
                      <p className="m-0 rounded-[14px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        {formError}
                      </p>
                    )}
                    {formMessage && (
                      <p className="m-0 rounded-[14px] bg-[rgba(19,126,137,0.12)] px-4 py-3 text-sm font-semibold text-[#137e89]">
                        {formMessage}
                      </p>
                    )}
                    {paymentDetails && (
                      <div className="grid gap-4 rounded-[22px] border border-[rgba(19,126,137,0.18)] bg-[linear-gradient(180deg,rgba(19,126,137,0.10),rgba(255,255,255,0.72))] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-[#137e89]">
                              {paymentDetails.method}
                            </p>
                            <h4 className="m-0 mt-2 text-xl font-semibold text-[var(--color-dark-100)]">
                              Pay {formatSgd(paymentDetails.amount)}
                            </h4>
                          </div>
                          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#137e89]">
                            Manual payment
                          </span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-center">
                          <div className="grid gap-3">
                            <div className="flex aspect-square items-center justify-center rounded-[20px] border border-black/8 bg-white p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                              <img
                                src={PAYNOW_QR_SRC}
                                alt="PayNow QR placeholder"
                                className="h-full w-full rounded-[14px] object-contain"
                              />
                            </div>
                            <a
                              href={PAYNOW_QR_SRC}
                              download="just-acoustics-paynow-qr.png"
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-4 text-sm font-semibold text-[var(--color-dark-100)] no-underline shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                            >
                              <Download className="h-4 w-4" />
                              Save QR
                            </a>
                          </div>
                          <div className="text-sm leading-6 text-[var(--color-gray-100)]">
                            <p className="m-0 font-semibold text-[var(--color-dark-100)]">
                              Use PayNow in any Singapore banking app.
                            </p>
                            <p className="m-0 mt-2">
                              {paymentDetails.instructions}
                            </p>
                            <p className="m-0 mt-3 text-[var(--color-dark-100)]">
                              {PAYNOW_REASSURANCE}
                            </p>
                            <div className="mt-4 grid gap-3">
                              <div className="rounded-[16px] border border-black/8 bg-white/72 p-3">
                                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-gray-200)]">
                                  VPA
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <code className="min-w-0 break-all text-sm font-bold text-[var(--color-dark-100)]">
                                    {PAYNOW_VPA}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(PAYNOW_VPA, "vpa")
                                    }
                                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[rgba(19,126,137,0.12)] px-3 text-xs font-bold text-[#137e89]"
                                  >
                                    {copiedValue === "vpa" ? (
                                      <Check className="h-3.5 w-3.5" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                    {copiedValue === "vpa" ? "Copied" : "Copy"}
                                  </button>
                                </div>
                              </div>
                              <div className="rounded-[16px] border border-black/8 bg-white/72 p-3">
                                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-gray-200)]">
                                  Payment reference
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <code className="min-w-0 break-all text-sm font-bold text-[var(--color-dark-100)]">
                                    {paymentReference}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        paymentReference,
                                        "reference",
                                      )
                                    }
                                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[rgba(255,165,0,0.16)] px-3 text-xs font-bold text-[rgba(180,106,0,0.95)]"
                                  >
                                    {copiedValue === "reference" ? (
                                      <Check className="h-3.5 w-3.5" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                    {copiedValue === "reference"
                                      ? "Copied"
                                      : "Copy"}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 rounded-[18px] border border-[rgba(19,126,137,0.18)] bg-[rgba(19,126,137,0.08)] p-4">
                              <p className="m-0 text-sm font-semibold text-[#137e89]">
                                {PAYNOW_HELP_TITLE}
                              </p>
                              <p className="m-0 mt-2 text-sm leading-6 text-[var(--color-gray-100)]">
                                {PAYNOW_HELP_BODY}
                              </p>
                              <a
                                href={JUST_ACOUSTICS_WHATSAPP_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(19,126,137,0.18)] bg-white/84 px-4 text-sm font-semibold text-[#137e89] no-underline shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                              >
                                Contact our team
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="page-cta add-to-cart inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full text-base disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LockKeyhole className="h-5 w-5" />
                      {submitting
                        ? "Preparing payment..."
                        : paymentDetails
                          ? "Update PayNow details"
                          : "Show PayNow QR"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {items.length > 0 && !checkoutOpen && (
            <div className="border-t border-black/8 bg-white/66 px-5 py-5 sm:px-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">
                    Shipping calculated at checkout
                  </p>
                </div>
                <div className="text-right">
                  <p className="m-0 text-sm font-semibold text-[var(--color-gray-100)]">
                    Subtotal
                  </p>
                  <p className="m-0 mt-1 text-[30px] font-semibold leading-none text-[var(--color-dark-100)]">
                    {formatSgd(subtotal)}
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
            </div>
          )}
        </aside>
      </div>}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
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
