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

export function ClassesTeaser({
  eyebrow = "Online Classes",
  heading = "Train with Summer, wherever you are.",
  subheading = "A library built around heavy lifting, glute-focused work, and finishers shot in clean, full frame. New classes every week.",
  imageUrl = "/images/summer/refined/summer-rings-venice-card.png",
  imageAlt = "Summer training on gymnastic rings at Venice Beach.",
  cta = { label: "See Subscriptions", href: "/classes" },
}: Props) {
  return (
    <section id="classes-teaser" className="relative overflow-hidden bg-[#f6f1ea] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-20">
        <ScrollReveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#e8ddd0]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover object-[50%_28%]"
            />
          </div>
        </ScrollReveal>
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
            <ul className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 text-sm text-[#2a241f]">
              {[
                "Full on-demand library",
                "Weekly live classes",
                "Glute-focused programs",
                "Cancel anytime",
              ].map((l) => (
                <li key={l} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[9px] block h-px w-4 shrink-0 bg-[#a8896b]" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal delayMs={320}>
            <Link
              href={cta.href}
              className="mt-10 inline-flex min-h-12 items-center justify-center border border-[#1d1814] bg-[#191512] px-6 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
            >
              {cta.label}
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
