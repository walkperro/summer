import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import type { SummerPublicSection } from "@/lib/summer/site-content";

export function SignatureBreak({ section }: { section: SummerPublicSection }) {
  return (
    <section className="relative overflow-hidden bg-[color:var(--paper-100)]">
      <Container size="xl" className="py-10 md:py-14">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.55fr)]">
          {/* Large cinematic panel */}
          <ScrollReveal>
            <div className="relative overflow-hidden bg-[color:var(--ink-900)] text-white">
              <div className="absolute inset-0">
                <Image
                  src="/images/summer/accent/signature_16_9_aspect_ratio.jpg"
                  alt="Summer Loffler in a refined private gym, signature monochrome frame."
                  fill
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="object-cover object-[68%_32%] hero-ken-burns"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,7,0.82)_0%,rgba(12,10,7,0.45)_40%,rgba(12,10,7,0.15)_70%,rgba(12,10,7,0.35)_100%)]" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    opacity: 0.12,
                    mixBlendMode: "overlay",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  }}
                />
              </div>

              <div className="relative z-10 flex min-h-[28rem] items-end p-8 sm:min-h-[34rem] sm:p-14">
                <div className="max-w-2xl">
                  <Eyebrow variant="mono" tone="light">
                    {section.eyebrow}
                  </Eyebrow>
                  <blockquote className="font-editorial-italic mt-6 text-balance text-4xl leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-[4.5rem]">
                    <span className="pull-quote-mark" aria-hidden="true">
                      &ldquo;
                    </span>
                    {section.heading}
                    <span className="pull-quote-mark" aria-hidden="true">
                      &rdquo;
                    </span>
                  </blockquote>
                  {section.subheading && (
                    <p className="mt-6 max-w-md font-mono-editorial text-[11px] uppercase tracking-[0.3em] text-white/75 sm:text-xs">
                      {section.subheading}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Portrait accent */}
          <ScrollReveal delayMs={100}>
            <figure className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)]">
              <Image
                src="/images/summer/accent/signature_4_5_aspect_ratio.jpg"
                alt="Portrait signature image of Summer Loffler in a monochrome training space."
                fill
                sizes="(min-width: 1024px) 24vw, 100vw"
                className="object-cover object-[58%_24%] grayscale-[8%]"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-white/90 mix-blend-difference">
                  The Studio · Private Training
                </span>
              </div>
            </figure>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
