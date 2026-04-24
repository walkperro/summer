import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { trainingCards } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

const NUMBERS = ["01", "02", "03", "04"];

export function TrainWithMe({
  section,
  leadCard,
  pillars,
  cards = trainingCards,
}: {
  section: SummerPublicSection;
  leadCard: string;
  pillars: string[];
  cards?: typeof trainingCards;
}) {
  return (
    <section id="training" className="relative bg-[color:var(--paper-100)]">
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        {/* Asymmetric heading row */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-end">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § III
                </span>
                <Eyebrow variant="mono" tone="bronze">
                  {section.eyebrow}
                </Eyebrow>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <h2 className="font-editorial mt-5 max-w-[20ch] text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] text-[color:var(--ink-900)] md:text-[4.5rem]">
                {section.heading}
              </h2>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-5">
            <ScrollReveal delayMs={160}>
              <p className="max-w-md text-[15px] leading-[1.75] text-[color:var(--ink-500)]">
                {section.subheading}
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Lead image */}
        <ScrollReveal>
          <figure className="relative mt-14 aspect-[16/9] overflow-hidden bg-[color:var(--paper-300)] md:mt-20">
            <Image
              src="/images/summer/train_with_me/summer_train_lead.jpg"
              alt="Summer Loffler performing a push-up on a court, showing strength and control."
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover object-[48%_34%] sm:object-[42%_40%] hero-ken-burns"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(12,10,7,0.55))]" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <div className="max-w-xl">
                <Eyebrow variant="mono" tone="light">
                  Training Philosophy
                </Eyebrow>
                <p className="font-editorial-italic mt-4 text-balance text-2xl leading-[1.2] text-white sm:text-3xl md:text-4xl">
                  {leadCard}
                </p>
              </div>
            </figcaption>
          </figure>
        </ScrollReveal>

        {/* Pillars row */}
        {pillars.length > 0 && (
          <div className="mt-16 grid gap-5 border-y border-[color:var(--bronze-300)] py-10 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <ScrollReveal key={pillar} delayMs={i * 80}>
                <div className="flex items-start gap-5">
                  <span className="font-editorial-italic text-4xl leading-[0.85] text-[color:var(--bronze-500)]">
                    {NUMBERS[i] ?? "•"}
                  </span>
                  <p className="pt-2 text-[15px] leading-[1.7] text-[color:var(--ink-700)]">
                    {pillar}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <ScrollReveal key={card.title} delayMs={i * 80}>
              <article className="group flex h-full flex-col">
                <figure className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    sizes="(min-width: 768px) 28vw, 100vw"
                    className={`object-cover transition duration-700 group-hover:scale-[1.03] ${card.imagePosition}`}
                  />
                </figure>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="font-editorial-italic text-3xl leading-[0.85] text-[color:var(--bronze-500)]">
                    {NUMBERS[i] ?? "•"}
                  </span>
                  <h3 className="font-editorial text-2xl leading-[1.05] tracking-[-0.02em] text-[color:var(--ink-900)] md:text-3xl">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--ink-500)]">
                  {card.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
