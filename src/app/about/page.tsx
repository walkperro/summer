import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PullQuote } from "@/components/summer/PullQuote";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PullNumber } from "@/components/ui/PullNumber";
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

  // About-page-specific framing (overrides the shared section copy used on home).
  const aboutEyebrow = "The maker";
  const aboutHeading = "Meet the practice.";

  return (
    <main className="bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      {/* Hero — editorial split */}
      <section
        className="relative overflow-hidden bg-[color:var(--paper-50)]"
        style={{ paddingTop: "calc(8rem + env(safe-area-inset-top))" }}
      >
        <Container size="xl" className="pb-16 pt-4 md:pb-24 md:pt-6">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[color:var(--bronze-500)]" aria-hidden="true" />
                  <Eyebrow variant="mono" tone="bronze">
                    {aboutEyebrow}
                  </Eyebrow>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={80}>
                <h1 className="font-editorial mt-6 text-balance text-5xl leading-[0.9] font-medium tracking-[-0.04em] md:text-[7.5rem]">
                  {aboutHeading}
                </h1>
              </ScrollReveal>
              <ScrollReveal delayMs={160}>
                <p className="mt-8 max-w-xl font-editorial-italic text-xl leading-[1.5] text-[color:var(--ink-500)] md:text-2xl">
                  {about.subheading}
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
                <Image
                  src="/images/summer/hero/summer_hero_bw_3_desktop.jpg"
                  alt="Black and white studio image of Summer Loffler standing in a refined private gym."
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-[68%_30%]"
                />
                <span className="absolute left-4 bottom-4 font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-white/95 mix-blend-difference">
                  Summer Loffler · Private Setting · MMXXV
                </span>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Story with drop cap */}
      <section className="relative bg-[color:var(--paper-100)]">
        <Container size="lg" className="py-20 md:py-28 lg:py-36">
          {paragraphs.length > 0 && (
            <ScrollReveal>
              <p className="drop-cap-italic font-editorial-italic text-[1.8rem] leading-[1.45] text-[color:var(--ink-700)] md:text-[2.3rem] md:leading-[1.4]">
                {paragraphs[0]}
              </p>
            </ScrollReveal>
          )}
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            {paragraphs.slice(1).map((p, idx) => (
              <ScrollReveal key={idx} delayMs={idx * 100}>
                <p className="text-[17px] leading-[1.85] text-[color:var(--ink-600)]">{p}</p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Credentials row */}
      <section className="relative bg-[color:var(--paper-50)]">
        <Container size="xl" className="py-16 md:py-20">
          <div className="grid gap-10 border-y border-[color:var(--bronze-300)] py-12 sm:grid-cols-3 md:py-16">
            <ScrollReveal>
              <PullNumber value="08" label="Years of private coaching" size="xl" />
            </ScrollReveal>
            <ScrollReveal delayMs={100}>
              <PullNumber value="LA" label="Home studio · Playa Del Rey" size="xl" />
            </ScrollReveal>
            <ScrollReveal delayMs={200}>
              <PullNumber value="1:1" label="Private only — never group" size="xl" />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <PullQuote
        eyebrow="Her voice"
        quote="You heal and find strength by caring for your body and mind together — not by punishing either one."
        attribution="— Summer Loffler"
      />

      {/* Photo strip */}
      <section className="relative overflow-hidden bg-[color:var(--paper-100)]">
        <Container size="xl" className="py-20 md:py-28">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <ScrollReveal>
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
                <Image
                  src="/images/summer/refined/summer-splits-venice-portrait.png"
                  alt="Summer in a full split across parallel bars at Venice Beach."
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale-[8%]"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={120}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
                <Image
                  src="/images/summer/refined/summer-partner-train-portrait.png"
                  alt="Summer training a partner in matched planks, palms pressed together."
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale-[8%]"
                />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Pillars — notebook pages */}
      <section className="relative bg-[color:var(--paper-50)]">
        <Container size="xl" className="py-20 md:py-32">
          <ScrollReveal>
            <div className="flex items-center gap-3">
              <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                § Method
              </span>
              <Eyebrow variant="mono" tone="bronze">
                How Summer coaches
              </Eyebrow>
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h2 className="font-editorial mt-5 max-w-3xl text-balance text-4xl leading-[1.0] tracking-[-0.035em] md:text-[3.5rem]">
              The practice doesn&rsquo;t change, only the person doing it.
            </h2>
          </ScrollReveal>
          <ul className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
            {snapshot.about.points.map((point, idx) => (
              <ScrollReveal as="li" key={idx} delayMs={idx * 100} className="border-t border-[color:var(--bronze-300)] pt-6">
                <div className="flex items-start gap-5">
                  <span className="font-editorial-italic text-4xl leading-[0.85] text-[color:var(--bronze-500)] md:text-5xl">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 font-editorial text-[1.4rem] leading-[1.3] tracking-[-0.01em] text-[color:var(--ink-900)] md:text-[1.7rem]">
                    {point}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </ul>
          <ScrollReveal delayMs={320}>
            <div className="mt-16 flex flex-wrap gap-4">
              <Link
                href="/#contact"
                className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
              >
                Apply for Private Training
              </Link>
              <Link
                href="/classes"
                className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)]/22 px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]"
              >
                Start a subscription
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </main>
  );
}
