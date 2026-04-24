import Image from "next/image";
import Link from "next/link";

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
    <section id="plans-teaser" className="relative overflow-hidden bg-[#fbf7f1] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-20">
        <div>
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">{eyebrow}</p>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h2 className="font-editorial mt-4 max-w-xl text-balance text-4xl leading-[1.04] tracking-[-0.01em] md:text-6xl">
              {heading}
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={160}>
            <p className="mt-6 max-w-xl text-base text-[#3a322c] md:text-lg">{subheading}</p>
          </ScrollReveal>
          <ScrollReveal delayMs={240}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={cta.href}
                className="inline-flex min-h-12 items-center justify-center border border-[#1d1814] bg-[#191512] px-6 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
              >
                {cta.label}
              </Link>
              <Link
                href="/classes"
                className="inline-flex min-h-12 items-center justify-center border border-black/18 px-6 text-[11px] uppercase tracking-[0.28em] transition hover:border-[#a8896b] hover:text-[#a8896b]"
              >
                Or subscribe instead
              </Link>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#e8ddd0]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
