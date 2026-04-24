import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ClassCard } from "@/components/summer/ClassCard";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { TierComparison } from "@/components/summer/TierComparison";
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
        url: "/images/summer/refined/summer-rings-venice-hero.png",
        width: 1920,
        height: 1080,
        alt: "Summer Loffler on gymnastic rings at Venice Beach.",
      },
    ],
    type: "website",
  },
};

export default async function ClassesPage() {
  const snapshot = await getSummerPublicSnapshot();
  const visibleClasses = snapshot.classes.filter((c) => c.is_visible);

  return (
    <main className="bg-[#f6f1ea] text-[#181512]">
      {/* Hero */}
      <section className="relative h-[72vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="/images/summer/refined/summer-rings-venice-hero.png"
          alt="Summer Loffler training on rings at Venice Beach."
          fill
          sizes="100vw"
          priority
          className="hero-ken-burns object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14 pt-32 md:px-14 md:pb-20 md:pt-40">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/80">Online Classes</p>
            <h1 className="font-editorial mt-4 max-w-3xl text-balance text-5xl leading-[1.02] tracking-[-0.01em] text-white md:text-7xl">
              {snapshot.classesIntro.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
              {snapshot.classesIntro.subheading}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#subscriptions"
                className="inline-flex min-h-12 items-center justify-center border border-white bg-white px-6 text-[11px] uppercase tracking-[0.28em] text-[#181512] transition hover:bg-[#a8896b] hover:text-white"
              >
                See tiers
              </Link>
              <Link
                href="#library"
                className="inline-flex min-h-12 items-center justify-center border border-white/70 px-6 text-[11px] uppercase tracking-[0.28em] text-white transition hover:border-white"
              >
                Browse library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Library */}
      <section id="library" className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">The Library</p>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h2 className="font-editorial mt-4 max-w-3xl text-balance text-4xl leading-[1.04] tracking-[-0.01em] md:text-6xl">
              Every class is a foundation you can come back to.
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleClasses.map((c) => (
              <ClassCard
                key={c.id}
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
        </div>
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
