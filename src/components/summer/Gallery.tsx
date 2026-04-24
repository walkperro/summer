import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { galleryItems } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

function parseObjectPosition(value: string) {
  const match = value.match(/^object-\[(.+)\]$/);
  return match ? match[1].replace(/_/g, " ") : undefined;
}

export function Gallery({
  intro,
  items = galleryItems,
}: {
  intro: SummerPublicSection;
  items?: typeof galleryItems;
}) {
  const supportingSentence =
    typeof intro.body.supporting_sentence === "string" ? intro.body.supporting_sentence : null;

  return (
    <section id="portfolio" className="relative bg-[color:var(--paper-100)]">
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-12">
          <div className="md:col-span-7">
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § V
                </span>
                <Eyebrow variant="mono" tone="bronze">
                  {intro.eyebrow}
                </Eyebrow>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <h2 className="font-editorial mt-5 max-w-[18ch] text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] text-[color:var(--ink-900)] md:text-[5.25rem]">
                {intro.heading}
              </h2>
            </ScrollReveal>
          </div>
          <div className="md:col-span-5">
            {intro.subheading && (
              <ScrollReveal delayMs={160}>
                <p className="text-[15px] leading-[1.75] text-[color:var(--ink-500)]">
                  {intro.subheading}
                </p>
              </ScrollReveal>
            )}
            {supportingSentence && (
              <ScrollReveal delayMs={240}>
                <p className="mt-4 font-editorial-italic text-[15px] leading-[1.7] text-[color:var(--bronze-600)]">
                  {supportingSentence}
                </p>
              </ScrollReveal>
            )}
          </div>
        </div>

        {/* Editorial lookbook grid */}
        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-6 xl:grid-cols-12">
          {items.map((item, idx) => (
            <ScrollReveal key={item.title} delayMs={idx * 60} className={item.spanClass}>
              <figure className="group">
                <div className={`relative overflow-hidden bg-[color:var(--paper-300)] ${item.aspectClass}`}>
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale-[6%] transition duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: parseObjectPosition(item.imagePosition) }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_70%,rgba(0,0,0,0.25))] opacity-0 transition duration-500 group-hover:opacity-100" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-[color:var(--bronze-200)] pt-3">
                  <span className="font-editorial-italic text-[1.05rem] tracking-[-0.01em] text-[color:var(--ink-900)]">
                    {item.title}
                  </span>
                  <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.28em] text-[color:var(--ink-400)]">
                    {item.category} · {String(idx + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
