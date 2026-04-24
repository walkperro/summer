import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PullNumber } from "@/components/ui/PullNumber";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { aboutImages, aboutPoints } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

export function About({
  section,
  images = aboutImages,
  points = aboutPoints,
}: {
  section: SummerPublicSection;
  images?: typeof aboutImages;
  points?: string[];
}) {
  const paragraphs = Array.isArray(section.body.paragraphs) ? (section.body.paragraphs as string[]) : [];

  return (
    <section id="about" className="relative overflow-hidden bg-[color:var(--paper-100)]">
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20 lg:items-start">
          {/* Images — asymmetric overlap, editorial cadence */}
          <ScrollReveal className="relative">
            <div className="grid grid-cols-[1fr_0.68fr] items-start gap-4 sm:gap-5">
              <figure className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
                <Image
                  src={images.main.src}
                  alt={images.main.alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 60vw"
                  className="object-cover object-center grayscale-[12%]"
                />
              </figure>
              <figure className="relative mt-14 aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)] sm:mt-20">
                <Image
                  src={images.supporting.src}
                  alt={images.supporting.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 40vw"
                  className="object-cover object-center grayscale-[10%]"
                />
              </figure>
            </div>
            <span className="mt-6 block font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-[color:var(--ink-400)]">
              Summer Loffler · Private Training · Los Angeles
            </span>
          </ScrollReveal>

          {/* Text column */}
          <div className="flex flex-col">
            <ScrollReveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-[color:var(--bronze-500)]" aria-hidden="true" />
                <Eyebrow variant="mono" tone="bronze">
                  {section.eyebrow}
                </Eyebrow>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={80}>
              <h2 className="font-editorial mt-6 text-balance text-4xl leading-[0.98] font-medium tracking-[-0.035em] text-[color:var(--ink-900)] sm:text-5xl md:text-[3.75rem]">
                {section.heading}
              </h2>
            </ScrollReveal>

            {paragraphs.length > 0 && (
              <ScrollReveal delayMs={160}>
                <p className="drop-cap mt-9 max-w-xl text-[17px] leading-[1.75] text-[color:var(--ink-600)]">
                  {paragraphs[0]}
                </p>
              </ScrollReveal>
            )}

            {paragraphs.slice(1).map((paragraph, i) => (
              <ScrollReveal key={paragraph} delayMs={220 + i * 80}>
                <p className="mt-5 max-w-xl text-[17px] leading-[1.75] text-[color:var(--ink-600)]">
                  {paragraph}
                </p>
              </ScrollReveal>
            ))}

            {/* Credentials row — magazine pull-numbers */}
            <ScrollReveal delayMs={320}>
              <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[color:var(--bronze-300)] pt-8 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <PullNumber value="08" label="Years coaching" size="md" />
                </div>
                <div className="flex flex-col gap-2">
                  <PullNumber value="LA" label="Home studio" size="md" />
                </div>
                <div className="flex flex-col gap-2">
                  <PullNumber value="1:1" label="Private only" size="md" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={400}>
              <ul className="mt-10 grid gap-3 text-[15px] leading-relaxed text-[color:var(--ink-600)] sm:grid-cols-1">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-4 border-t border-[color:var(--bronze-200)] pt-3">
                    <span aria-hidden="true" className="mt-[11px] h-px w-5 shrink-0 bg-[color:var(--bronze-500)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
