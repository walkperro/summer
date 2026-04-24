import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { offers as defaultOffers } from "@/components/summer/site-data";
import { cn } from "@/lib/cn";
import type { SummerPublicSection } from "@/lib/summer/site-content";

import { SectionHeading } from "./SectionHeading";

type OfferItem = {
  id?: string;
  title: string;
  subtitle?: string | null;
  description: string;
  detail: string;
  cta: string;
  href?: string | null;
  badge?: string | null;
  featured?: boolean;
};

const NUMBERS = ["01", "02", "03", "04", "05"];

export function Offers({
  intro,
  offers = defaultOffers.map((offer) => ({ ...offer, href: "#contact", badge: offer.featured ? "Most Exclusive" : null })),
}: {
  intro: SummerPublicSection;
  offers?: OfferItem[];
}) {
  return (
    <section
      id="services"
      className="relative overflow-hidden border-y border-[color:var(--bronze-300)] bg-[color:var(--paper-50)]"
    >
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ScrollReveal>
              <SectionHeading
                eyebrow={intro.eyebrow}
                title={intro.heading}
                description={intro.subheading}
                size="lg"
                number="§ I"
              />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-col">
              {offers.map((offer, idx) => (
                <ScrollReveal key={offer.title} delayMs={idx * 80}>
                  <article
                    className={cn(
                      "group relative flex flex-col gap-6 border-t border-[color:var(--bronze-300)] py-10 md:flex-row md:items-start md:gap-12 md:py-14",
                      idx === offers.length - 1 && "border-b",
                    )}
                  >
                    {/* Left — number + title */}
                    <div className="md:w-[42%]">
                      <div className="flex items-baseline gap-4">
                        <span className="font-editorial-italic text-5xl leading-[0.85] text-[color:var(--bronze-500)] md:text-6xl">
                          {NUMBERS[idx] ?? "•"}
                        </span>
                        {offer.featured && (
                          <span className="rounded-full bg-[color:var(--oxblood-500)] px-3 py-1 font-mono-editorial text-[9.5px] uppercase tracking-[0.28em] text-[color:var(--paper-100)]">
                            {offer.badge || "Most Exclusive"}
                          </span>
                        )}
                      </div>
                      <h3 className="font-editorial mt-4 text-3xl leading-[1.02] font-medium tracking-[-0.03em] text-[color:var(--ink-900)] md:text-4xl">
                        {offer.title}
                      </h3>
                    </div>

                    {/* Right — body + CTA */}
                    <div className="flex flex-1 flex-col">
                      <p className="text-[17px] leading-[1.7] text-[color:var(--ink-600)]">
                        {offer.description}
                      </p>
                      {offer.detail && (
                        <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--ink-400)]">
                          {offer.detail}
                        </p>
                      )}

                      <Link
                        href={offer.href || "#contact"}
                        className={cn(
                          "mt-7 inline-flex w-fit items-center gap-3 font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition",
                          "text-[color:var(--ink-900)] hover:text-[color:var(--bronze-700)]",
                          "accent-underline",
                        )}
                      >
                        {offer.cta}
                        <span aria-hidden="true" className="transition group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
