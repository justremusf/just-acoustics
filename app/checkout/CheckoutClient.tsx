"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Copy,
  Download,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { CartOptionDetails, useCart } from "@/components/cart/CartProvider";
import {
  JUST_ACOUSTICS_WHATSAPP_URL,
  PAYNOW_HELP_BODY,
  PAYNOW_HELP_TITLE,
  PAYNOW_INSTRUCTIONS,
  PAYNOW_REASSURANCE,
} from "@/lib/paymentCopy";
import { formatSgd } from "@/lib/shopPricing";

const PAYNOW_VPA = "UEN202336944WA00#XNAP";
const PAYNOW_QR_SRC = "/assets/paynow/just-acoustics-paynow-qr.png";

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

type PaymentDetails = {
  method: string;
  amount: number;
  instructions: string;
};

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

function createPaymentReference() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `JA-${datePart}-${randomPart}`;
}

export default function CheckoutClient() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, openCart } =
    useCart();
  const [fields, setFields] = useState<CheckoutFields>(emptyFields);
  const [paymentReference, setPaymentReference] = useState(() =>
    createPaymentReference(),
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const resetPayment = () => {
    setPaymentDetails(null);
    setFormMessage(null);
    setPaymentReference(createPaymentReference());
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
        setPaymentDetails(
          body?.payment || {
            method: "PayNow QR",
            amount: subtotal,
            instructions: PAYNOW_INSTRUCTIONS,
          },
        );
        setFormMessage(
          body?.emailStatus === "sent"
            ? "Order details received. We emailed you the PayNow instructions as well. Once payment is received, you will receive a confirmation email and our team will reach out to schedule delivery and/or installation."
            : "Order details received. Please complete the PayNow payment below. Once payment is received, you will receive a confirmation email and our team will reach out to schedule delivery and/or installation.",
        );
      }
    } catch {
      setFormError("Checkout could not be prepared. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-wrap page-stack">
        <section className="home-shell page-hero-shell grid min-h-[520px] place-items-center text-center">
          <div className="max-w-[420px]">
            <ShoppingBag
              className="mx-auto h-12 w-12 text-[var(--color-brand-orange)]"
              strokeWidth={1.7}
            />
            <h1
              className="m-0 mt-6 text-[clamp(34px,5vw,58px)] font-medium leading-none text-[var(--color-dark-100)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your cart is empty.
            </h1>
            <p className="m-0 mt-4 text-base leading-7 text-[var(--color-gray-100)]">
              Add a product before checking out.
            </p>
            <Link
              href="/shop"
              className="page-cta mt-7 inline-flex min-h-[54px] items-center justify-center rounded-full px-7 no-underline"
            >
              Browse shop
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="page-kicker">Checkout</p>
            <h1
              className="m-0 mt-3 text-[clamp(38px,6vw,76px)] font-medium leading-none tracking-[-0.04em] text-[var(--color-dark-100)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Complete your order
            </h1>
          </div>
          <button
            type="button"
            onClick={openCart}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-black/8 bg-white/76 px-5 text-sm font-semibold text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart {itemCount}
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <form
            onSubmit={submitCheckout}
            className="order-2 grid gap-5 rounded-[28px] border border-white/60 bg-white/74 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:order-1 lg:p-7"
          >
            <div>
              <h2 className="m-0 text-2xl font-semibold text-[var(--color-dark-100)]">
                Delivery details
              </h2>
              <p className="m-0 mt-2 text-sm leading-6 text-[var(--color-gray-100)]">
                We use these details to confirm delivery, installation access if
                needed, and payment matching.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["fullName", "Full name", "text", true],
                ["email", "Email", "email", true],
                ["phone", "Phone number", "tel", true],
                ["company", "Company name (optional)", "text", false],
                ["addressLine1", "Delivery address", "text", true],
                ["addressLine2", "Unit / address line 2", "text", false],
                ["postalCode", "Postal code", "text", true],
              ].map(([name, label, type, required]) => {
                const inputId = `checkout-${name}`;
                return (
                  <div
                    key={name as string}
                    className={`${name === "addressLine1" || name === "addressLine2" ? "sm:col-span-2" : ""} grid gap-2`}
                  >
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
                      onChange={(event) => {
                        resetPayment();
                        setFields((current) => ({
                          ...current,
                          [name as string]: event.target.value,
                        }));
                      }}
                      className="h-12 rounded-[14px] border border-black/10 bg-white px-4 text-sm font-medium outline-none transition-colors focus:border-[var(--color-brand-orange)]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="checkout-delivery-notes"
                className="text-sm font-semibold text-[var(--color-dark-100)]"
              >
                Delivery notes
              </label>
              <textarea
                id="checkout-delivery-notes"
                value={fields.deliveryNotes}
                onChange={(event) => {
                  resetPayment();
                  setFields((current) => ({
                    ...current,
                    deliveryNotes: event.target.value,
                  }));
                }}
                className="min-h-[108px] rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-[var(--color-brand-orange)]"
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

            <button
              type="submit"
              disabled={submitting}
              className="page-cta add-to-cart inline-flex min-h-[58px] w-full items-center justify-center gap-2 rounded-full text-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LockKeyhole className="h-5 w-5" />
              {submitting
                ? "Preparing PayNow..."
                : paymentDetails
                  ? "Update PayNow details"
                  : "Show PayNow QR"}
            </button>

            {paymentDetails && (
              <div className="grid gap-5 rounded-[26px] border border-[rgba(19,126,137,0.18)] bg-[linear-gradient(180deg,rgba(19,126,137,0.10),rgba(255,255,255,0.78))] p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-[#137e89]">
                      {paymentDetails.method}
                    </p>
                    <h2 className="m-0 mt-2 text-3xl font-semibold text-[var(--color-dark-100)]">
                      Pay {formatSgd(paymentDetails.amount)}
                    </h2>
                  </div>
                  <span className="w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#137e89]">
                    Manual PayNow
                  </span>
                </div>

                <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
                  <div className="grid gap-3">
                    <div className="rounded-[22px] border border-black/8 bg-white p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <img
                        src={PAYNOW_QR_SRC}
                        alt="Just Acoustics PayNow QR code"
                        className="aspect-square w-full rounded-[16px] object-contain"
                      />
                    </div>
                    <a
                      href={PAYNOW_QR_SRC}
                      download="just-acoustics-paynow-qr.png"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-4 text-sm font-semibold text-[var(--color-dark-100)] no-underline shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                    >
                      <Download className="h-4 w-4" />
                      Save QR to photos
                    </a>
                  </div>

                  <div className="grid gap-3 text-sm leading-6 text-[var(--color-gray-100)]">
                    <p className="m-0 font-semibold text-[var(--color-dark-100)]">
                      Open your Singapore banking app, choose PayNow, then scan
                      this QR or paste the VPA.
                    </p>
                    <p className="m-0">{paymentDetails.instructions}</p>
                    <p className="m-0 text-[var(--color-dark-100)]">
                      {PAYNOW_REASSURANCE}
                    </p>

                    {[
                      [
                        "VPA",
                        PAYNOW_VPA,
                        "vpa",
                        "bg-[rgba(19,126,137,0.12)] text-[#137e89]",
                      ],
                      [
                        "Payment reference",
                        paymentReference,
                        "reference",
                        "bg-[rgba(255,165,0,0.16)] text-[rgba(180,106,0,0.95)]",
                      ],
                    ].map(([label, value, key, className]) => (
                      <div
                        key={key}
                        className="rounded-[16px] border border-black/8 bg-white/72 p-3"
                      >
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-gray-200)]">
                          {label}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <code className="min-w-0 break-all text-sm font-bold text-[var(--color-dark-100)]">
                            {value}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(value, key)}
                            className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold ${className}`}
                          >
                            {copiedValue === key ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedValue === key ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-[18px] border border-[rgba(19,126,137,0.18)] bg-[rgba(19,126,137,0.08)] p-4">
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
          </form>

          <aside className="order-1 rounded-[28px] border border-white/60 bg-white/74 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:order-2 lg:sticky lg:top-28">
            <h2 className="m-0 text-2xl font-semibold text-[var(--color-dark-100)]">
              Order summary
            </h2>
            <div className="mt-5 grid gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[80px_minmax(0,1fr)] gap-3 border-b border-black/8 pb-4 last:border-b-0"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-[var(--color-white-200)]">
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        sizes="80px"
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
                      <div>
                        <h3 className="m-0 text-base font-semibold leading-tight text-[var(--color-dark-100)]">
                          {item.title}
                        </h3>
                        <CartOptionDetails
                          itemId={item.id}
                          options={item.options}
                          compact
                        />
                      </div>
                      <p className="m-0 shrink-0 text-sm font-semibold text-[var(--color-dark-100)]">
                        {formatSgd(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex h-11 w-full max-w-[156px] overflow-hidden rounded-[14px] border border-black/8 bg-white/88 sm:w-auto">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="inline-flex h-full w-11 items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="flex h-full w-11 items-center justify-center border-x border-black/8 text-sm font-semibold leading-none">
                          {item.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="inline-flex h-full w-11 items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="destructive-action inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-[var(--color-gray-100)] sm:self-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-black/8 pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[var(--color-gray-100)]">
                  Subtotal
                </span>
                <span className="text-3xl font-semibold text-[var(--color-dark-100)]">
                  {formatSgd(subtotal)}
                </span>
              </div>
              <p className="m-0 mt-3 text-sm leading-6 text-[var(--color-gray-100)]">
                Delivery or installation details will be confirmed after payment
                if required.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
