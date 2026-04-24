import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { cn } from "@/lib/cn";
import type { SummerTestimonial } from "@/lib/summer/types";

type Props = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items: (SummerTestimonial & { beforeUrl?: string | null; afterUrl?: string | null })[];
};

export function TestimonialsStrip({
  eyebrow = "Client Words",
  heading = "Quiet results, loud confidence.",
  subheading,
  items,
}: Props) {
  if (!items.length) return null;
  return (
    <section id="testimonials" className="relative bg-[color:var(--paper-50)]">
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § VI
                </span>
                <Eyebrow variant="mono" tone="bronze">
                  {eyebrow}
                </Eyebrow>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <h2 className="font-editorial mt-5 max-w-[20ch] text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-[4.25rem]">
                {heading}
              </h2>
            </ScrollReveal>
          </div>
          {subheading && (
            <div className="lg:col-span-5">
              <ScrollReveal delayMs={160}>
                <p className="text-[15px] leading-[1.75] text-[color:var(--ink-500)]">
                  {subheading}
                </p>
              </ScrollReveal>
            </div>
          )}
        </div>

        {/* Alternating pull-quote layout */}
        <div className="mt-16 flex flex-col gap-16 md:mt-24 md:gap-24">
          {items.map((item, idx) => {
            const alignLeft = idx % 2 === 0;
            return (
              <ScrollReveal key={item.id} delayMs={idx * 120}>
                <figure
                  className={cn(
                    "grid items-start gap-8 md:grid-cols-12 md:gap-10",
                    alignLeft ? "" : "md:[&>*:first-child]:order-2",
                  )}
                >
                  {/* Portrait (optional) */}
                  <div className="md:col-span-5">
                    {item.afterUrl ? (
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[color:var(--paper-300)]">
                        <Image
                          src={item.afterUrl}
                          alt={item.name || "Client portrait"}
                          fill
                          sizes="(min-width: 1024px) 36vw, 100vw"
                          className="object-cover grayscale-[10%]"
                        />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="relative aspect-[4/5] w-full overflow-hidden bg-[color:var(--paper-200)]"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-editorial-italic text-6xl text-[color:var(--bronze-400)] md:text-8xl">
                            &ldquo;
                          </span>
                        </div>
                      </div>
                    )}
                    <span className="mt-4 inline-flex font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-[color:var(--ink-400)]">
                      {String(idx + 1).padStart(2, "0")} · {item.location || "Los Angeles"}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="flex flex-col justify-center md:col-span-7 md:pt-10">
                    <blockquote className="font-editorial-italic text-balance text-[2rem] leading-[1.1] tracking-[-0.02em] text-[color:var(--ink-900)] md:text-[3rem]">
                      <span className="pull-quote-mark" aria-hidden="true">
                        &ldquo;
                      </span>
                      {item.quote}
                      <span className="pull-quote-mark" aria-hidden="true">
                        &rdquo;
                      </span>
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span className="h-px w-8 bg-[color:var(--bronze-500)]" aria-hidden="true" />
                      <span className="font-mono-editorial text-[11px] uppercase tracking-[0.3em] text-[color:var(--ink-500)]">
                        {item.name || "Client"}
                      </span>
                    </figcaption>
                  </div>
                </figure>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
