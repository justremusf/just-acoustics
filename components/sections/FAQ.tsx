"use client";

import { serializeJsonLd } from "@/lib/seo";

import { useEffect, useRef, useState } from "react";

export type FaqItem = { q: string; a: string };

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "How much do acoustic panels cost?",
    a: "Smaller spaces usually start from around $1,000, with most offices and home studios between $1,000 and $3,000.",
  },
  {
    q: "What are acoustic panels?",
    a: "They are soft panels that soak up echo, so a room sounds calmer, clearer and easier to talk in.",
  },
  {
    q: "What is the difference between acoustic treatment and soundproofing?",
    a: "Treatment makes sound clearer inside a room, while soundproofing stops sound getting in or out.",
  },
  {
    q: "How long does installation take?",
    a: "Most projects are installed in one to two days, depending on how much area we cover.",
  },
  {
    q: "Can you customise solutions?",
    a: "Yes, we tailor the treatment to how you use the room and the look you want to keep.",
  },
  {
    q: "What is included in the consultation?",
    a: "We look at your room, how it is used and your options, so you know the next step before committing.",
  },
  {
    q: "Is installation disruptive?",
    a: "Not much, we keep the site clean and can often work around your business hours.",
  },
];

function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="glass-card group mb-3 cursor-pointer p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset] md:p-6"
      onClick={onToggle}
      role="button"
      aria-expanded={open}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="flex w-full items-center justify-between gap-4 text-left">
        <span
          className={`text-[19px] leading-[1.14] font-medium tracking-[-0.6px] transition-all duration-300 md:text-[28px] ${
            open
              ? "translate-x-1 text-[var(--color-brand-orange)]"
              : "text-[var(--color-dark-100)] group-hover:translate-x-1 group-hover:text-[var(--color-brand-orange)]"
          }`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {q}
        </span>
        <span
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white transition-colors duration-300 ${open ? "border-[var(--color-brand-orange)]" : "border-black/8 group-hover:border-[var(--color-brand-orange)]"}`}
        >
          <span
            className={`absolute h-0.5 w-4 transition-colors duration-300 ${open ? "bg-[var(--color-brand-orange)]" : "bg-[var(--color-dark-100)] group-hover:bg-[var(--color-brand-orange)]"}`}
          />
          <span
            className={`absolute h-4 w-0.5 transition-all duration-300 ${open ? "bg-[var(--color-brand-orange)]" : "bg-[var(--color-dark-100)] group-hover:bg-[var(--color-brand-orange)]"}`}
            style={{
              opacity: open ? 0 : 1,
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </span>
      </div>
      <div
        ref={bodyRef}
        style={{
          height: open ? (bodyRef.current?.scrollHeight ?? "auto") : 0,
          overflow: "hidden",
          transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <p
          className="m-0 pt-4 text-sm leading-7 text-[var(--color-gray-100)] md:text-[15px]"
          onClick={(e) => e.stopPropagation()}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ({
  items = DEFAULT_FAQS,
  title = "Frequently Asked Questions",
  subtitle = "We make acoustics simple for you.",
  showLabel = true,
  flush = false,
}: {
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
  showLabel?: boolean;
  flush?: boolean;
}) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.hash !== "#faq") return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("faq")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <section
        id="faq"
        className={
          flush ? "scroll-mt-28" : "scroll-mt-28 px-4 py-10 md:px-5 md:py-12"
        }
      >
        <div
          className={`home-shell section-shell-pad mx-auto ${flush ? "w-full max-w-none" : "max-w-[1580px]"}`}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.57fr_1.43fr] md:gap-10">
            <div>
              {showLabel ? <span className="soft-pill">FAQ</span> : null}
              <h2 className="home-heading mt-5 text-[var(--color-dark-100)]">
                {title}
              </h2>
              {subtitle ? (
                <p className="home-copy mt-5 max-w-[40ch]">{subtitle}</p>
              ) : null}
            </div>
            <div>
              {items.map((faq) => (
                <AccordionItem
                  key={faq.q}
                  q={faq.q}
                  a={faq.a}
                  open={openQuestion === faq.q}
                  onToggle={() =>
                    setOpenQuestion((current) =>
                      current === faq.q ? null : faq.q,
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
