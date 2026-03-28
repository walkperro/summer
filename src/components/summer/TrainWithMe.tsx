import Image from "next/image";

import { SectionHeading } from "@/components/summer/SectionHeading";
import { trainingCards } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

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
    <section id="training" className="px-6 py-20 sm:py-24 md:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
          <SectionHeading eyebrow={section.eyebrow} title={section.heading} description={section.subheading} />
          <div className="grid gap-3 text-sm leading-6 text-[#5f5650] sm:grid-cols-3 lg:text-right">
            {pillars.map((pillar) => (
              <p key={pillar}>{pillar}</p>
            ))}
          </div>
        </div>

        <figure className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem] border border-black/8 bg-[#ddd5cb] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <Image
            src="/images/summer/train_with_me/summer_train_lead.jpg"
            alt="Summer Loffler performing a push-up on a court, showing strength and control."
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover object-[48%_34%] sm:object-[42%_40%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.36))]" />
          <div className="absolute bottom-4 left-4 right-auto sm:bottom-0 sm:left-0 sm:right-0 sm:p-8">
            <div className="max-w-[15.5rem] border border-white/18 bg-black/28 p-4 backdrop-blur-sm sm:max-w-lg sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/68">Training Philosophy</p>
              <p className="mt-3 text-sm leading-6 text-white/82 sm:text-base sm:leading-7">{leadCard}</p>
            </div>
          </div>
        </figure>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="overflow-hidden border border-black/8 bg-white shadow-[0_20px_45px_rgba(0,0,0,0.05)]">
              <figure className="relative aspect-[4/5] bg-[#ddd5cb]">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  sizes="(min-width: 768px) 28vw, 100vw"
                  className={`object-cover ${card.imagePosition}`}
                />
              </figure>
              <div className="px-5 py-6">
                <h3 className="font-editorial text-[1.8rem] leading-none tracking-[-0.03em] text-[#181512]">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#5f5650]">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
