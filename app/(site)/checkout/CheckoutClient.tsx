"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  LoaderCircle,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import CartOptionDetails from "@/components/cart/CartOptionDetails";
import { useCart, type CartItem } from "@/components/cart/CartContext";
import CheckoutHelp from "@/components/checkout/CheckoutHelp";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import InstallationEnquiry from "@/components/cart/InstallationEnquiry";
import { trackEvent } from "@/components/analytics/trackEvent";
import {
  CONTACT_PHONE_DISPLAY,
  formatPayable,
  lineTotal,
  validateCheckoutFields,
  type CheckoutFieldErrors,
  type CheckoutFields,
} from "@/lib/checkout";
import {
  DELIVERY_DISCLOSURE,
  DELIVERY_FEE,
  JUST_ACOUSTICS_WHATSAPP_URL,
  ORDER_FOLLOW_UP,
} from "@/lib/paymentCopy";

// Shared with the order status page, which clears these once payment is confirmed.
export const DRAFT_STORAGE_KEY = "just-acoustics-checkout-draft";
export const REQUEST_STORAGE_KEY = "just-acoustics-checkout-request";
export const ORDER_CART_STORAGE_KEY = "ja-order-cart";
const SUBMIT_TIMEOUT_MS = 20000;

const emptyFields: CheckoutFields = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  deliveryNotes: "",
};

type FieldConfig = {
  name: Exclude<keyof CheckoutFields, "deliveryNotes">;
  label: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  required: boolean;
  wide?: boolean;
  maxLength?: number;
};

const FIELDS: FieldConfig[] = [
  { name: "fullName", label: "Full name", type: "text", autoComplete: "name", required: true },
  { name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "9123 4567", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", placeholder: "you@example.com", required: true, wide: true },
  { name: "addressLine1", label: "Delivery address", type: "text", autoComplete: "address-line1", placeholder: "Block and street name", required: true, wide: true },
  { name: "addressLine2", label: "Unit number", type: "text", autoComplete: "address-line2", placeholder: "#05-12", required: false },
  { name: "postalCode", label: "Postal code", type: "text", autoComplete: "postal-code", inputMode: "numeric", placeholder: "6 digits", required: true },
  { name: "company", label: "Company", type: "text", autoComplete: "organization", required: false, wide: true },
];

const inputClass =
  "h-12 w-full rounded-[14px] border bg-white px-4 text-base font-medium text-[var(--color-dark-100)] outline-none transition-colors placeholder:text-black/30 focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[rgba(255,165,0,0.18)]";

function readDraft(): CheckoutFields {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return emptyFields;
    const parsed = JSON.parse(raw) as Partial<CheckoutFields>;
    const next = { ...emptyFields };
    for (const key of Object.keys(emptyFields) as (keyof CheckoutFields)[]) {
      if (typeof parsed[key] === "string") next[key] = parsed[key] as string;
    }
    return next;
  } catch {
    return emptyFields;
  }
}

type CheckoutRequest = { snapshot: string; id: string };

function readRequest(): CheckoutRequest | null {
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(REQUEST_STORAGE_KEY) || "null");
    return typeof parsed?.snapshot === "string" && typeof parsed?.id === "string" ? parsed : null;
  } catch {
    return null;
  }
}

/** Delivery is charged once the address and six-digit postal code look valid. */
function isAddressReady(fields: CheckoutFields) {
  return fields.addressLine1.trim().length >= 5 && /^\d{6}$/.test(fields.postalCode.trim());
}

function QuantityControl({ item }: { item: CartItem }) {
  const { updateQuantity } = useCart();
  return (
    <div className="inline-flex h-11 overflow-hidden rounded-full border border-black/10 bg-white">
      <button
        type="button"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
        className="inline-flex h-full w-11 items-center justify-center text-[var(--color-dark-100)] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Decrease quantity of ${item.title}`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span
        className="flex h-full min-w-[40px] items-center justify-center border-x border-black/8 px-2 text-sm font-semibold"
        aria-live="polite"
      >
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        className="inline-flex h-full w-11 items-center justify-center text-[var(--color-dark-100)] transition-colors hover:bg-black/5"
        aria-label={`Increase quantity of ${item.title}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function OrderLines({ editable }: { editable: boolean }) {
  const { items, removeItem } = useCart();
  return (
    <ul className="m-0 grid list-none gap-4 p-0">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-black/8 pb-4 last:border-b-0 last:pb-0"
        >
          <div className="relative aspect-square w-[64px] overflow-hidden rounded-[14px] border border-black/6 bg-white">
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt=""
                fill
                sizes="64px"
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
                <p className="m-0 text-[15px] font-semibold leading-snug text-[var(--color-dark-100)]">
                  {item.title}
                </p>
                <p className="m-0 mt-0.5 text-xs text-[var(--color-gray-100)]">
                  {item.quantity} × {formatPayable(item.unitPrice)}
                </p>
              </div>
              <p className="m-0 shrink-0 text-[15px] font-semibold text-[var(--color-dark-100)]">
                {formatPayable(lineTotal(item.unitPrice, item.quantity))}
              </p>
            </div>
            <CartOptionDetails itemId={item.id} options={item.options} compact />
            {editable && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <QuantityControl item={item} />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="destructive-action inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[var(--color-gray-100)]"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function SummaryTotal({ addressReady }: { addressReady: boolean }) {
  const { subtotal } = useCart();
  const total = subtotal + (addressReady ? DELIVERY_FEE : 0);
  return (
    <div className="border-t border-black/8 pt-4">
      <dl className="m-0 grid grid-cols-[1fr_auto] gap-y-2 text-sm text-[var(--color-gray-100)]">
        <dt>Products</dt>
        <dd className="m-0 text-right">{formatPayable(subtotal)}</dd>
        <dt>Islandwide delivery</dt>
        <dd className="m-0 text-right" aria-live="polite">
          {addressReady ? formatPayable(DELIVERY_FEE) : `${formatPayable(DELIVERY_FEE)} after address`}
        </dd>
      </dl>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold text-[var(--color-dark-100)]">
          {addressReady ? "Total to pay" : "Product subtotal"}
        </span>
        <span className="text-2xl font-semibold text-[var(--color-dark-100)]" aria-live="polite">
          {formatPayable(total)}
        </span>
      </div>
      <p className="m-0 mt-2 text-xs leading-5 text-[var(--color-gray-100)]">
        Made to order: standard lead time is 4 to 6 weeks. We confirm
        delivery or installation timing after payment.
      </p>
      <p className="m-0 mt-1 text-xs leading-5 text-[var(--color-gray-100)]">
        Supply and delivery. Installation is arranged separately.
      </p>
    </div>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell">{children}</section>
    </div>
  );
}

export default function CheckoutClient() {
  const { items, itemCount, subtotal, hydrated } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(emptyFields);
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const submittingRef = useRef(false);
  const draftLoaded = useRef(false);
  const request = useRef<CheckoutRequest | null>(null);
  const tracked = useRef(false);
  const addressReady = isAddressReady(fields);
  const total = subtotal + (addressReady ? DELIVERY_FEE : 0);

  // Restore an unsent draft (e.g. after a refresh or a failed submit).
  useEffect(() => {
    setFields(readDraft());
    request.current = readRequest();
    draftLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated || !items.length || tracked.current) return;
    tracked.current = true;
    trackEvent("begin_checkout", { value: subtotal, currency: "SGD" });
  }, [hydrated, items.length, subtotal]);

  useEffect(() => {
    if (!draftLoaded.current) return;
    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(fields));
    } catch {
      // Draft saving is a convenience only.
    }
  }, [fields]);

  const setField = (name: keyof CheckoutFields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const validateField = (name: keyof CheckoutFields) => {
    const fieldError = validateCheckoutFields(fields)[name];
    setErrors((current) => ({ ...current, [name]: fieldError }));
  };

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current || items.length === 0) return;

    const nextErrors = validateCheckoutFields(fields);
    if (!nextErrors.addressLine1 && fields.addressLine1.trim().length < 5) {
      nextErrors.addressLine1 = "Please enter the full delivery address.";
    }
    setErrors(nextErrors);
    const firstInvalid = FIELDS.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid.name}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      if (items.some((item) => !item.selection)) {
        setSubmitError(
          "This cart was created before our checkout update. Please remove the products and add them again.",
        );
        return;
      }

      // Prices are recalculated on the server from the product catalogue.
      const payload = {
        customer: fields,
        items: items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          selection: { ...item.selection!, quantity: item.quantity },
        })),
      };
      // A stable request id makes retries return the same saved order.
      const snapshot = JSON.stringify(payload);
      if (request.current?.snapshot !== snapshot) {
        request.current = { snapshot, id: crypto.randomUUID() };
      }
      try {
        window.sessionStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(request.current));
      } catch {
        // Idempotency still holds for retries within this page view.
      }

      const response = await fetch("/api/cart-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ ...payload, requestId: request.current.id }),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.orderUrl || !body?.paymentReference) {
        setSubmitError(
          body?.error ||
            "We couldn't save your order just now. Please try again in a moment. Do not pay until your order is saved.",
        );
        return;
      }

      try {
        // The cart is cleared on the order page once payment is confirmed,
        // provided it hasn't changed since this order was placed.
        window.sessionStorage.setItem(
          ORDER_CART_STORAGE_KEY,
          JSON.stringify({ reference: body.paymentReference, snapshot: JSON.stringify(items) }),
        );
      } catch {
        // Clearing the cart after payment is a convenience only.
      }

      setPlaced(true);
      window.location.assign(body.orderUrl);
    } catch (error) {
      setSubmitError(
        error instanceof DOMException && error.name === "AbortError"
          ? "This is taking longer than expected. Please check your connection and try again."
          : "We couldn't reach our server. Please check your connection and try again.",
      );
    } finally {
      window.clearTimeout(timeout);
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <PageShell>
        <div className="grid min-h-[420px] place-items-center text-center">
          <div className="max-w-[420px]">
            <LoaderCircle
              className="mx-auto h-[40px] w-[40px] animate-spin text-[var(--color-brand-orange)]"
              aria-hidden="true"
            />
            <h1 className="page-title" style={{ marginTop: 20, fontSize: "clamp(28px, 4vw, 40px)" }}>
              Order saved
            </h1>
            <p className="page-subtitle" style={{ margin: "12px auto 0" }} role="status">
              Opening your PayNow details…
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!hydrated) {
    return (
      <PageShell>
        <div className="grid min-h-[420px] place-items-center" role="status">
          <LoaderCircle
            className="h-8 w-8 animate-spin text-[var(--color-gray-200)]"
            aria-hidden="true"
          />
          <span className="sr-only">Loading your cart…</span>
        </div>
      </PageShell>
    );
  }

  if (items.length === 0) {
    return (
      <PageShell>
        <div className="grid min-h-[420px] place-items-center text-center">
          <div className="max-w-[420px]">
            <ShoppingBag
              className="mx-auto h-12 w-12 text-[var(--color-brand-orange)]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <h1 className="page-title" style={{ marginTop: 24 }}>Your cart is empty.</h1>
            <p className="page-subtitle" style={{ margin: "16px auto 0" }}>
              Add a product from the shop, then come back here to check out.
            </p>
            <Link href="/shop" className="page-cta" style={{ marginTop: 28 }}>
              Browse the shop
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const itemLabel = `${itemCount} item${itemCount === 1 ? "" : "s"}`;

  return (
    <PageShell>
      <div className="flex flex-col gap-4">
        <Link href="/shop" className="page-link w-fit">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Continue shopping
        </Link>
        <CheckoutSteps current={2} />
        <div>
          <h1 className="page-title">Delivery details</h1>
          <p className="page-subtitle" style={{ marginTop: 12 }}>
            Tell us where to deliver. On the next step you&apos;ll get the
            PayNow QR, the exact amount and your order reference.
          </p>
          <p className="m-0 mt-2 text-sm leading-6 text-[var(--color-gray-100)]">
            {DELIVERY_DISCLOSURE}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-6">
        {/* Mobile: collapsible summary above the form */}
        <details className="group glass-card overflow-hidden lg:hidden">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--color-dark-100)]">
              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Order summary · {itemLabel}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
            <span className="shrink-0 text-lg font-semibold text-[var(--color-dark-100)]">
              {formatPayable(total)}
            </span>
          </summary>
          <div className="grid gap-4 border-t border-black/8 px-4 py-4">
            <OrderLines editable />
            <SummaryTotal addressReady={addressReady} />
          </div>
        </details>

        <form
          onSubmit={submitCheckout}
          noValidate
          className="glass-card grid gap-5 p-5 sm:p-6 lg:p-7"
          aria-busy={submitting}
        >
          <fieldset className="m-0 grid min-w-0 gap-4 border-0 p-0 sm:grid-cols-2" disabled={submitting}>
            <legend className="sr-only">Contact and delivery details</legend>
            {FIELDS.map((field) => {
              const id = `checkout-${field.name}`;
              const error = errors[field.name];
              return (
                <div
                  key={field.name}
                  className={`grid min-w-0 content-start gap-1.5 ${field.wide ? "sm:col-span-2" : ""}`}
                >
                  <label
                    htmlFor={id}
                    className="text-sm font-semibold text-[var(--color-dark-100)]"
                  >
                    {field.label}
                    {!field.required && (
                      <span className="font-normal text-[var(--color-gray-200)]">
                        {" "}
                        (optional)
                      </span>
                    )}
                  </label>
                  <input
                    id={id}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    required={field.required}
                    value={fields[field.name]}
                    onChange={(event) =>
                      setField(
                        field.name,
                        field.name === "postalCode"
                          ? event.target.value.replace(/\D/g, "").slice(0, 6)
                          : event.target.value,
                      )
                    }
                    onBlur={() => {
                      if (fields[field.name]) validateField(field.name);
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`${inputClass} ${error ? "border-red-400" : "border-black/12"}`}
                  />
                  {error && (
                    <p id={`${id}-error`} className="m-0 text-sm text-red-700">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="grid min-w-0 gap-1.5 sm:col-span-2">
              <label
                htmlFor="checkout-deliveryNotes"
                className="text-sm font-semibold text-[var(--color-dark-100)]"
              >
                Delivery notes
                <span className="font-normal text-[var(--color-gray-200)]">
                  {" "}
                  (optional)
                </span>
              </label>
              <textarea
                id="checkout-deliveryNotes"
                name="deliveryNotes"
                rows={3}
                maxLength={2000}
                placeholder="Access, lift or parking details, best time to reach you…"
                value={fields.deliveryNotes}
                onChange={(event) => setField("deliveryNotes", event.target.value)}
                className={`${inputClass} h-auto min-h-[96px] border-black/12 py-3`}
              />
            </div>
          </fieldset>

          {submitError && (
            <div
              role="alert"
              className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
            >
              <p className="m-0 font-semibold">{submitError}</p>
              <p className="m-0 mt-1">
                Still not working?{" "}
                <a
                  href={JUST_ACOUSTICS_WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-red-800 underline"
                >
                  WhatsApp us on {CONTACT_PHONE_DISPLAY}
                </a>{" "}
                and we&apos;ll take your order directly.
              </p>
            </div>
          )}

          <div className="grid gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="page-cta add-to-cart w-full disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Placing order…
                </>
              ) : (
                <>
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                  Continue to PayNow
                  <span className="hidden sm:inline">· {formatPayable(total)}</span>
                </>
              )}
            </button>
            <p className="m-0 text-center text-sm leading-6 text-[var(--color-gray-100)]">
              Nothing is charged automatically. Your order is saved first, then
              you&apos;ll pay by PayNow from your own banking app on the next step.
            </p>
            <p className="m-0 text-center text-sm leading-6 text-[var(--color-gray-100)]">
              {ORDER_FOLLOW_UP}
            </p>
          </div>

          <CheckoutHelp compact />
          <div className="lg:hidden">
            <InstallationEnquiry />
          </div>
        </form>

        {/* Desktop: sticky summary beside the form */}
        <aside
          className="glass-card hidden p-6 lg:sticky lg:top-28 lg:block"
          aria-label="Order summary"
        >
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="page-card-title">Order summary</h2>
            <span className="text-sm text-[var(--color-gray-100)]">{itemLabel}</span>
          </div>
          <div className="max-h-[52vh] overflow-y-auto pr-1">
            <OrderLines editable />
          </div>
          <div className="mt-4">
            <SummaryTotal addressReady={addressReady} />
          </div>
          <InstallationEnquiry />
        </aside>
      </div>
    </PageShell>
  );
}
