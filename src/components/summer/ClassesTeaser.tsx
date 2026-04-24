import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/summer/ScrollReveal";

type Props = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  imageUrl?: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
};

export function ClassesTeaser({
  eyebrow = "Online Classes",
  heading = "Train with Summer, wherever you are.",
  subheading = "A library built around heavy lifting, glute-focused work, and finishers shot in clean, full frame. New classes every week.",
  imageUrl = "/images/summer/refined/summer-rings-venice-card.png",
  imageAlt = "Summer training on gymnastic rings at Venice Beach.",
  cta = { label: "See Subscriptions", href: "/classes" },
}: Props) {
  return (
    <section
      id="classes-teaser"
      className="relative overflow-hidden bg-[color:var(--paper-100)]"
    >
      <Container size="xl" className="py-24 md:py-32">
        <div className="grid items-center gap-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-20">
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 52vw, 100vw"
                className="object-cover object-[50%_28%] transition duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.22)_100%)]" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white/92">
                <span className="h-px w-6 bg-white/70" aria-hidden="true" />
                <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.3em]">
                  Volume III · On-demand
                </span>
              </div>
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § II
                </span>
                <Eyebrow variant="mono" tone="bronze">
                  {eyebrow}
                </Eyebrow>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <h2 className="font-editorial mt-5 max-w-xl text-balance text-5xl leading-[0.98] font-medium tracking-[-0.035em] text-[color:var(--ink-900)] md:text-[4.25rem]">
                {heading}
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={160}>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.75] text-[color:var(--ink-600)]">
                {subheading}
              </p>
            </ScrollReveal>
            <ScrollReveal delayMs={240}>
              <ul className="mt-8 grid max-w-xl grid-cols-1 gap-3 border-t border-[color:var(--bronze-300)] pt-6 text-[15px] text-[color:var(--ink-700)] sm:grid-cols-2">
                {[
                  "Full on-demand library",
                  "Weekly live classes",
                  "Glute-focused programs",
                  "Cancel anytime",
                ].map((l) => (
                  <li key={l} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[10px] block h-px w-5 shrink-0 bg-[color:var(--bronze-500)]" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delayMs={320}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={cta.href}
                  className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
                >
                  {cta.label}
                </Link>
                <Link
                  href="/plans"
                  className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)]/22 px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-900)] transition hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]"
                >
                  Or a single guide
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
