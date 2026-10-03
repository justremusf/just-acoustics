"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Download, LoaderCircle, MailCheck, TriangleAlert } from "lucide-react";
import CheckoutHelp from "@/components/checkout/CheckoutHelp";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CopyButton from "@/components/checkout/CopyButton";
import {
  CONTACT_PHONE_DISPLAY,
  LAST_ORDER_STORAGE_KEY,
  PAYNOW_QR_SRC,
  PAYNOW_VPA,
  formatPayable,
  plainAmount,
  type PlacedOrder,
} from "@/lib/checkout";
import { JUST_ACOUSTICS_WHATSAPP_URL, PAYNOW_REASSURANCE } from "@/lib/paymentCopy";

const REFERENCE_PATTERN = /^JA-\d{6}-[A-Z0-9]{5}$/;

function readStoredOrder(): PlacedOrder | null {
  try {
    const raw = window.localStorage.getItem(LAST_ORDER_STORAGE_KEY);
    if (!raw) return null;
    const order = JSON.parse(raw) as PlacedOrder;
    if (
      typeof order?.reference !== "string" ||
      typeof order.amount !== "number" ||
      !Number.isFinite(order.amount) ||
      !Array.isArray(order.items)
    )
      return null;
    return order;
  } catch {
    return null;
  }
}

function DetailRow({
  label,
  display,
  copyValue,
  copyLabel,
  emphasis = false,
}: {
  label: string;
  display: string;
  copyValue: string;
  copyLabel: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-black/8 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="page-kicker">{label}</p>
        <p
          className={`m-0 mt-1 break-all font-semibold text-[var(--color-dark-100)] ${
            emphasis ? "text-[26px] leading-tight" : "font-mono text-[17px] leading-snug"
          }`}
        >
          {display}
        </p>
      </div>
      <CopyButton value={copyValue} label={copyLabel} />
    </div>
  );
}

export default function PayNowClient() {
  const [loaded, setLoaded] = useState(false);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [urlReference, setUrlReference] = useState<string | null>(null);

  // Read on the client only: the order lives in this browser's storage.
  useEffect(() => {
    const refParam =
      new URLSearchParams(window.location.search).get("ref")?.trim().toUpperCase() || null;
    const validRef = refParam && REFERENCE_PATTERN.test(refParam) ? refParam : null;
    const stored = readStoredOrder();
    setUrlReference(validRef);
    setOrder(stored && (!validRef || stored.reference === validRef) ? stored : null);
    setLoaded(true);
  }, []);

  const reference = order?.reference || urlReference;

  if (!loaded) {
    return (
      // Keep the same wrapper markup as the loaded state: SitePageReveal adds
      // an "is-visible" class to this section, and a className change on
      // re-render would wipe it and hide the page.
      <div className="page-wrap page-stack">
        <section className="home-shell page-hero-shell">
          <div className="grid min-h-[420px] place-items-center" role="status">
            <LoaderCircle className="h-8 w-8 animate-spin text-[var(--color-gray-200)]" aria-hidden="true" />
            <span className="sr-only">Loading payment details…</span>
          </div>
        </section>
      </div>
    );
  }

  const steps = [
    "Open your Singapore banking app and choose PayNow.",
    "Scan the QR code, or pay to the PayNow VPA shown here.",
    order
      ? `Enter the amount: ${formatPayable(order.amount)}.`
      : "Enter the amount from your order confirmation email.",
    reference
      ? `Put ${reference} in the reference / comments field.`
      : "Put your order reference in the reference / comments field.",
    "Confirm the payment.",
  ];

  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell">
        <div className="flex flex-col gap-4">
          {order && <CheckoutSteps current={3} />}
          <div>
            <h1 className="page-title">
              {order ? `Pay ${formatPayable(order.amount)} by PayNow` : "Pay by PayNow"}
            </h1>
            <p className="page-subtitle" style={{ marginTop: 12 }}>
              {order
                ? "Your order has been received. Complete the payment below to confirm it."
                : reference
                  ? "Use the amount from your order confirmation email and the reference below."
                  : "Use the amount and order reference from your checkout or confirmation email."}
            </p>
          </div>
          {order?.customerEmailSent && (
            <p className="m-0 flex items-start gap-2 text-sm leading-6 text-[var(--color-gray-100)]">
              <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#137e89]" aria-hidden="true" />
              <span>
                We&apos;ve also emailed these payment details to{" "}
                <strong className="font-semibold text-[var(--color-dark-100)]">{order.email}</strong>.
              </span>
            </p>
          )}
          {order && !order.teamNotified && (
            <div
              role="note"
              className="flex items-start gap-3 rounded-[16px] border border-[rgba(255,165,0,0.45)] bg-[rgba(255,165,0,0.10)] px-4 py-3 text-sm leading-6 text-[var(--color-dark-100)]"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#b46a00]" aria-hidden="true" />
              <span>
                Our order email didn&apos;t go through. After paying, please{" "}
                <a
                  href={JUST_ACOUSTICS_WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--color-dark-100)] underline"
                >
                  WhatsApp us on {CONTACT_PHONE_DISPLAY}
                </a>{" "}
                with your reference <strong>{order.reference}</strong> so we can match it to your order.
              </span>
            </div>
          )}
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-6">
          {/* Payment details first on mobile (people usually pay from the same phone). */}
          <div className="glass-card order-1 grid gap-3 p-4 sm:p-6 lg:order-2">
            {order && (
              <DetailRow
                label="Amount"
                display={formatPayable(order.amount)}
                copyValue={plainAmount(order.amount)}
                copyLabel="amount"
                emphasis
              />
            )}
            {reference && (
              <DetailRow
                label="Reference"
                display={reference}
                copyValue={reference}
                copyLabel="payment reference"
              />
            )}
            <DetailRow
              label="PayNow VPA"
              display={PAYNOW_VPA}
              copyValue={PAYNOW_VPA}
              copyLabel="PayNow VPA"
            />

            <div className="mt-2">
              <h2 className="m-0 text-base font-semibold text-[var(--color-dark-100)]">How to pay</h2>
              <ol className="m-0 mt-3 grid list-none gap-2.5 p-0">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-[15px] leading-6 text-[var(--color-dark-100)]">
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-dark-100)] text-xs font-semibold text-white"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 break-words">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-2 rounded-[18px] bg-[rgba(19,126,137,0.08)] px-4 py-3">
              <p className="m-0 text-sm font-semibold text-[#137e89]">After you pay</p>
              <p className="m-0 mt-1 text-sm leading-6 text-[var(--color-gray-100)]">{PAYNOW_REASSURANCE}</p>
            </div>
          </div>

          <div className="glass-card order-2 p-4 sm:p-6 lg:order-1">
            <div className="mx-auto w-full max-w-[340px] rounded-[20px] border border-black/8 bg-white p-3">
              <Image
                src={PAYNOW_QR_SRC}
                alt="Just Acoustics PayNow QR code"
                width={890}
                height={892}
                sizes="(max-width: 400px) 90vw, 340px"
                className="h-auto w-full"
                priority
              />
            </div>
            <p className="m-0 mt-3 text-center text-sm leading-6 text-[var(--color-gray-100)]">
              On a phone? Save the QR, then upload it from your gallery in your banking app&apos;s PayNow scanner.
            </p>
            <a
              href={PAYNOW_QR_SRC}
              download="just-acoustics-paynow-qr.png"
              className="mx-auto mt-3 flex min-h-11 w-full max-w-[340px] items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-[var(--color-dark-100)] no-underline"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Save QR image
            </a>
          </div>

          {order && order.items.length > 0 && (
            <details className="group glass-card order-3 overflow-hidden lg:col-start-2">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-100)]">
                  Your order ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </span>
                <span className="text-base font-semibold text-[var(--color-dark-100)]">{formatPayable(order.amount)}</span>
              </summary>
              <ul className="m-0 grid list-none gap-3 border-t border-black/8 p-4 sm:px-6">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="font-semibold text-[var(--color-dark-100)]">
                        {item.quantity} × {item.title}
                      </span>
                      {item.options.some((option) => option.value) && (
                        <span className="mt-0.5 block text-[var(--color-gray-100)]">
                          {item.options
                            .filter((option) => option.value)
                            .map((option) => option.value)
                            .join(" · ")}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 font-semibold text-[var(--color-dark-100)]">{formatPayable(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="order-4 lg:col-start-2">
            <CheckoutHelp
              title="Stuck while paying?"
              body="WhatsApp us with your reference and we'll sort it out with you."
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/shop" className="page-link">
            Continue shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
