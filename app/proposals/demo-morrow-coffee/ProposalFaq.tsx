"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

type FaqItem = readonly [question: string, answer: string];

export default function ProposalFaq({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mc-faq">
      {items.map(([question, answer], index) => {
        const isOpen = openIndex === index;
        const panelId = `proposal-faq-panel-${index}`;
        const buttonId = `proposal-faq-button-${index}`;

        return (
          <div
            className={`mc-faq-item${isOpen ? " is-open" : ""}`}
            key={question}
          >
            <button
              id={buttonId}
              className="mc-faq-trigger"
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{question}</span>
              <span className="mc-faq-icon" aria-hidden="true">
                <Plus />
              </span>
            </button>
            <div
              id={panelId}
              className="mc-faq-panel"
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
            >
              <div className="mc-faq-panel-inner">
                <p>{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
