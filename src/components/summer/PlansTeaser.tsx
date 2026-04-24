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

export function PlansTeaser({
  eyebrow = "Guides & Meal Plans",
  heading = "The tools she reaches for with her private clients.",
  subheading = "Printable, specific, and priced to actually try. Start with a guide, bring it into a session, or stack one under a subscription.",
  imageUrl = "/images/summer/refined/summer-mat-portrait-about.png",
  imageAlt = "Summer Loffler on a pink yoga mat, composed portrait.",
  cta = { label: "Browse Guides", href: "/plans" },
}: Props) {
  return (
    <section
      id="plans-teaser"
      className="relative overflow-hidden bg-[color:var(--paper-50)]"
    >
      <Container size="xl" className="py-24 md:py-32">
        <div className="grid items-center gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-20">
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § IV
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
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={cta.href}
                  className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
                >
                  {cta.label}
                </Link>
                <Link
                  href="/classes"
                  className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)]/22 px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]"
                >
                  Or subscribe instead
                </Link>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 52vw, 100vw"
                className="object-cover object-[50%_30%] transition duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.18))]" />
              <div className="absolute left-6 top-6">
                <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-white/85">
                  Library · III Guides · I Meal Plan
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
