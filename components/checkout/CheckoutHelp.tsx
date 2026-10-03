import { Mail, MessageCircle, Phone } from "lucide-react";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/lib/checkout";
import { JUST_ACOUSTICS_WHATSAPP_URL } from "@/lib/paymentCopy";

/** Short "stuck? talk to a person" block shown near the pay step. */
export default function CheckoutHelp({
  title = "Stuck or unsure? Talk to us.",
  body = "Message us on WhatsApp and a real person from our team will help you finish your order.",
  compact = false,
}: {
  title?: string;
  body?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[20px] border border-black/8 bg-white/70 ${compact ? "p-4" : "p-5"}`}
    >
      <p className="m-0 text-sm font-semibold text-[var(--color-dark-100)]">
        {title}
      </p>
      <p className="m-0 mt-1.5 text-sm leading-6 text-[var(--color-gray-100)]">
        {body}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={JUST_ACOUSTICS_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#137e89] px-4 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp us
        </a>
        <a
          href={CONTACT_PHONE_HREF}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-[var(--color-dark-100)] no-underline"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {CONTACT_PHONE_DISPLAY}
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-[var(--color-dark-100)] no-underline"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email
        </a>
      </div>
    </div>
  );
}
