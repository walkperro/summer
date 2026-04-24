import Image from "next/image";

import { ScrollReveal } from "@/components/summer/ScrollReveal";
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
    <section id="testimonials" className="relative overflow-hidden bg-[#fbf7f1] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">{eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal delayMs={80}>
          <h2 className="font-editorial mt-4 max-w-2xl text-balance text-4xl leading-[1.04] tracking-[-0.01em] md:text-5xl">
            {heading}
          </h2>
        </ScrollReveal>
        {subheading ? (
          <ScrollReveal delayMs={160}>
            <p className="mt-5 max-w-2xl text-base text-[#3a322c] md:text-lg">{subheading}</p>
          </ScrollReveal>
        ) : null}

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ScrollReveal
              as="figure"
              key={item.id}
              className="flex h-full flex-col gap-6 border border-black/8 bg-white p-8 md:p-10"
            >
              {item.afterUrl ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e8ddd0]">
                  <Image
                    src={item.afterUrl}
                    alt={item.name || "Client transformation"}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <blockquote className="font-editorial-italic text-xl leading-snug tracking-[-0.005em] text-[#181512]">
                “{item.quote}”
              </blockquote>
              <figcaption className="text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">
                {item.name || "Client"}
                {item.location ? ` · ${item.location}` : ""}
              </figcaption>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
