import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ClassCard } from "@/components/summer/ClassCard";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { TierComparison } from "@/components/summer/TierComparison";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSummerPublicSnapshot } from "@/lib/summer/site-content";

export const metadata: Metadata = {
  title: "Online Classes",
  description:
    "Subscribe to Summer Loffler's on-demand class library — heavy lifting, glute-focused programming, mobility, and live sessions. Based in Los Angeles.",
  alternates: { canonical: "/classes" },
  openGraph: {
    title: "Online Classes | Summer Loffler",
    description:
      "Heavy lifting, glute-focused, and live classes with Summer Loffler. Subscribe from $29/month.",
    url: "/classes",
    images: [
      {
        url: "/images/summer/refined/summer-fitness-campaign-hero.png",
        width: 1920,
        height: 1080,
        alt: "Summer Loffler in an athletic campaign frame.",
      },
    ],
    type: "website",
  },
};

export default async function ClassesPage() {
  const snapshot = await getSummerPublicSnapshot();
  const visibleClasses = snapshot.classes.filter((c) => c.is_visible);

  return (
    <main className="bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      {/* Cinematic hero */}
      <section className="relative h-[86vh] min-h-[620px] w-full overflow-hidden">
        <Image
          src="/images/summer/refined/summer-fitness-campaign-hero.png"
          alt="Summer Loffler in an athletic campaign frame, emphasizing form and control."
          fill
          sizes="100vw"
          priority
          className="hero-ken-burns hidden object-cover object-[50%_30%] md:block"
        />
        <Image
          src="/images/summer/refined/summer-fitness-campaign-mobile.png"
          alt="Summer Loffler in an athletic campaign frame, emphasizing form and control."
          fill
          sizes="100vw"
          priority
          className="hero-ken-burns object-cover object-[50%_30%] md:hidden"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,7,0.2)_0%,rgba(12,10,7,0.1)_35%,rgba(12,10,7,0.62)_100%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.1,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <Container
          size="xl"
          className="absolute inset-x-0 bottom-0 flex flex-col justify-end pb-16 pt-40 md:pb-24"
          style={{ paddingTop: "calc(10rem + env(safe-area-inset-top))" }}
        >
          <Eyebrow variant="mono" tone="light" className="tracking-[0.32em]">
            § Library · Volume III · Updated weekly
          </Eyebrow>
          <h1 className="font-editorial mt-5 max-w-4xl text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] text-white md:text-[6.5rem]">
            {snapshot.classesIntro.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-white/85 md:text-xl md:leading-[1.55]">
            {snapshot.classesIntro.subheading}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#subscriptions"
              className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-white bg-white px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-900)] transition hover:bg-[color:var(--bronze-500)] hover:text-white hover:border-[color:var(--bronze-500)]"
            >
              See tiers
            </Link>
            <Link
              href="#library"
              className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-white/60 px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:border-white"
            >
              Browse library
            </Link>
          </div>
        </Container>
      </section>

      {/* Library intro */}
      <section id="library" className="relative bg-[color:var(--paper-100)]">
        <Container size="xl" className="py-24 md:py-32">
          <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
            <div className="md:col-span-7">
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                    § I
                  </span>
                  <Eyebrow variant="mono" tone="bronze">
                    The Library
                  </Eyebrow>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={80}>
                <h2 className="font-editorial mt-5 max-w-[20ch] text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-[5rem]">
                  Every class is a foundation you can come back to.
                </h2>
              </ScrollReveal>
            </div>
            <div className="md:col-span-5">
              <ScrollReveal delayMs={160}>
                <p className="font-editorial-italic text-[16px] leading-[1.7] text-[color:var(--ink-500)]">
                  {visibleClasses.length} classes · Updated weekly · Shot clean and in full frame
                </p>
              </ScrollReveal>
            </div>
          </div>

          {/* Magazine-style grid — alternating variants */}
          <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-10">
            {visibleClasses.map((c, idx) => (
              <ClassCard
                key={c.id}
                index={idx}
                variant={idx % 3 === 1 ? "portrait" : "landscape"}
                item={{
                  id: c.id,
                  slug: c.slug,
                  title: c.title,
                  summary: c.summary,
                  coverUrl: c.coverUrl || null,
                  durationMinutes: c.duration_minutes,
                  difficulty: c.difficulty,
                  category: c.category,
                  accessLevelMin: c.access_level_min,
                }}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Tiers */}
      <TierComparison
        eyebrow="Subscribe"
        heading="Pick a tier. Move with Summer."
        subheading="Cancel anytime. Upgrade or downgrade whenever the season asks for it."
        tiers={snapshot.tiers.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          subtitle: t.subtitle,
          description: t.description,
          price_cents: t.price_cents,
          interval: t.interval,
          features: t.features,
          badge: t.badge,
          is_featured: t.is_featured,
          stripe_price_id: t.stripe_price_id,
        }))}
      />

      {/* Private Training — final, premium funnel */}
      <section className="relative overflow-hidden bg-[color:var(--ink-900)] text-[color:var(--paper-100)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.11,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <Container size="xl" className="relative py-24 md:py-32 lg:py-40">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div>
              <Eyebrow variant="mono" tone="light">
                Private Training · By application
              </Eyebrow>
              <h2 className="font-editorial-italic mt-6 max-w-[24ch] text-balance text-5xl leading-[0.98] tracking-[-0.035em] md:text-[5rem]">
                Want Summer&rsquo;s eyes on every rep?
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-white/70">
                Hands-on coaching in Los Angeles for clients who want a program built around them
                — heavy lifting, glute-focused work, and nutrition guidance, reviewed week by
                week. Limited spots, by application.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/#contact"
                className="press-effect focus-ring inline-flex min-h-12 items-center justify-center gap-2 border border-white bg-white px-7 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-900)] transition hover:border-[color:var(--bronze-500)] hover:bg-[color:var(--bronze-500)] hover:text-white"
              >
                Apply for Private Training
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
