import { Check } from "lucide-react";

const STEPS = ["Cart", "Details", "PayNow"] as const;

/** Three-step progress indicator: Cart → Details → PayNow. */
export default function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol
      className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-xs font-semibold"
      aria-label="Checkout progress"
    >
      {STEPS.map((step, index) => {
        const number = index + 1;
        const done = number < current;
        const active = number === current;
        return (
          <li
            key={step}
            className="flex items-center gap-2"
            aria-current={active ? "step" : undefined}
          >
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                active
                  ? "border-[var(--color-dark-100)] bg-[var(--color-dark-100)] text-white"
                  : done
                    ? "border-black/10 bg-white text-[var(--color-dark-100)]"
                    : "border-black/8 bg-white/60 text-[var(--color-gray-200)]"
              }`}
            >
              {done ? (
                <Check className="h-3.5 w-3.5 text-[#137e89]" aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{number}</span>
              )}
              {step}
            </span>
            {number < STEPS.length && (
              <span className="h-px w-4 bg-black/15" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
