import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PullQuote } from "@/components/summer/PullQuote";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { getSummerPublicSnapshot } from "@/lib/summer/site-content";

export const metadata: Metadata = {
  title: "About Summer",
  description:
    "Summer Loffler is a heavy-lifting and glutes specialist coaching private clients in Los Angeles and online — grounded in discipline, built on resilience.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Summer Loffler",
    description: "Heavy lifting, glutes, and coaching grounded in resilience.",
    url: "/about",
    type: "profile",
  },
};

export default async function AboutPage() {
  const snapshot = await getSummerPublicSnapshot();
  const about = snapshot.about.section;
  const paragraphs = (about.body?.paragraphs as string[]) || [];

  return (
    <main className="bg-[#f6f1ea] text-[#181512]">
      {/* Hero portrait */}
      <section className="relative overflow-hidden px-6 pb-10 pt-40 md:px-10 md:pb-16 md:pt-48">
        <div className="mx-auto grid max-w-7xl items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <ScrollReveal>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">About Summer</p>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <h1 className="font-editorial mt-4 text-balance text-5xl leading-[1.02] tracking-[-0.01em] md:text-7xl">
                {about.heading}
              </h1>
            </ScrollReveal>
            <ScrollReveal delayMs={160}>
              <p className="mt-6 max-w-xl text-base text-[#3a322c] md:text-lg">{about.subheading}</p>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e8ddd0]">
              <Image
                src="/images/summer/refined/summer-mat-portrait-about.png"
                alt="Close portrait of Summer Loffler on a pink mat, direct gaze."
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-[50%_28%]"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-10">
          {paragraphs.map((p, idx) => (
            <ScrollReveal key={idx} delayMs={idx * 80}>
              <p className="font-editorial text-2xl leading-[1.4] tracking-[-0.002em] md:text-3xl">{p}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <PullQuote
        eyebrow="Her voice"
        quote="You heal and find strength by caring for your body and mind together — not by punishing either one."
        attribution="— Summer Loffler"
      />

      {/* Photo strip */}
      <section className="relative overflow-hidden bg-[#fbf7f1] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e8ddd0]">
              <Image
                src="/images/summer/refined/summer-splits-venice-portrait.png"
                alt="Summer in a full split across parallel bars at Venice Beach."
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={120}>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e8ddd0]">
              <Image
                src="/images/summer/refined/summer-partner-train-portrait.png"
                alt="Summer training a partner in matched planks, palms pressed together."
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">How Summer coaches</p>
          </ScrollReveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {snapshot.about.points.map((point, idx) => (
              <ScrollReveal as="li" key={idx} delayMs={idx * 80} className="border-t border-[#d8c8b4] pt-6">
                <p className="font-editorial text-2xl leading-snug tracking-[-0.005em]">{point}</p>
              </ScrollReveal>
            ))}
          </ul>
          <ScrollReveal delayMs={320}>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex min-h-12 items-center justify-center border border-[#1d1814] bg-[#191512] px-6 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
              >
                Apply for Private Training
              </Link>
              <Link
                href="/classes"
                className="inline-flex min-h-12 items-center justify-center border border-black/18 px-6 text-[11px] uppercase tracking-[0.28em] transition hover:border-[#a8896b] hover:text-[#a8896b]"
              >
                Start a subscription
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-black/6 bg-[#f6f1ea] px-6 py-12 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="font-editorial text-2xl leading-none tracking-[0.03em]">Summer Loffler</p>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">
            Los Angeles · Playa Del Rey · Manhattan Beach
          </p>
        </div>
      </footer>
    </main>
  );
}
