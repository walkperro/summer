"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/summer/ScrollReveal";

type Item = { id: string; topic: string | null; question: string; answer: string };

type Props = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items: Item[];
};

export function FaqAccordion({
  eyebrow = "Questions",
  heading = "What you'll probably ask.",
  subheading,
  items,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  if (!items.length) return null;

  return (
    <section id="faq" className="relative bg-[color:var(--paper-100)]">
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-20">
          <div className="md:sticky md:top-24 md:self-start">
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § VII
                </span>
                <Eyebrow variant="mono" tone="bronze">
                  {eyebrow}
                </Eyebrow>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <h2 className="font-editorial mt-5 text-balance text-4xl leading-[0.98] font-medium tracking-[-0.035em] md:text-[3.75rem]">
                {heading}
              </h2>
            </ScrollReveal>
            {subheading && (
              <ScrollReveal delayMs={160}>
                <p className="mt-6 max-w-sm text-[15px] leading-[1.75] text-[color:var(--ink-500)]">
                  {subheading}
                </p>
              </ScrollReveal>
            )}
          </div>
          <div className="border-t border-[color:var(--bronze-300)]">
            {items.map((item) => {
              const open = openId === item.id;
              return (
                <div key={item.id} className="border-b border-[color:var(--bronze-300)]">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="group flex w-full items-baseline justify-between gap-6 py-6 text-left transition md:py-7"
                    aria-expanded={open}
                  >
                    <span className="flex items-baseline gap-4">
                      {item.topic && (
                        <span className="hidden font-mono-editorial text-[10.5px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)] md:inline">
                          {item.topic}
                        </span>
                      )}
                      <span className="font-editorial text-xl leading-[1.2] tracking-[-0.02em] text-[color:var(--ink-900)] md:text-[1.75rem]">
                        {item.question}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`font-editorial-italic text-3xl leading-none text-[color:var(--bronze-500)] transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-7 text-[15px] leading-[1.8] text-[color:var(--ink-500)] md:text-[16px]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
