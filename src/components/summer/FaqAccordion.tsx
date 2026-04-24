"use client";

import { useState } from "react";

import { ScrollReveal } from "@/components/summer/ScrollReveal";

type Item = { id: string; topic: string | null; question: string; answer: string };

type Props = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items: Item[];
};

export function FaqAccordion({ eyebrow = "Questions", heading = "What you'll probably ask.", subheading, items }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  if (!items.length) return null;

  return (
    <section id="faq" className="relative overflow-hidden bg-[#f6f1ea] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div>
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">{eyebrow}</p>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h2 className="font-editorial mt-4 text-balance text-4xl leading-[1.04] tracking-[-0.01em] md:text-5xl">{heading}</h2>
          </ScrollReveal>
          {subheading ? (
            <ScrollReveal delayMs={160}>
              <p className="mt-5 max-w-sm text-sm text-[#3a322c] md:text-base">{subheading}</p>
            </ScrollReveal>
          ) : null}
        </div>
        <ScrollReveal>
          <div className="border-t border-[#d8c8b4]">
            {items.map((item) => {
              const open = openId === item.id;
              return (
                <div key={item.id} className="border-b border-[#d8c8b4]">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-baseline justify-between gap-6 py-5 text-left md:py-6"
                    aria-expanded={open}
                  >
                    <span className="flex items-baseline gap-4">
                      {item.topic ? (
                        <span className="hidden text-[11px] uppercase tracking-[0.28em] text-[#8a7d72] md:inline">
                          {item.topic}
                        </span>
                      ) : null}
                      <span className="font-editorial text-xl leading-snug tracking-[-0.005em] md:text-2xl">
                        {item.question}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`text-2xl leading-none text-[#a8896b] transition-transform ${open ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 text-sm leading-relaxed text-[#3a322c] md:text-base">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
