import type { Metadata } from "next";
import Link from "next/link";

import { PlanCard } from "@/components/summer/PlanCard";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSummerPublicSnapshot } from "@/lib/summer/site-content";

export const metadata: Metadata = {
  title: "Guides & Meal Plans",
  description:
    "Printable guides and meal plans from Summer Loffler: glute programming, nutrition starter, 7-day reset. Buy once, keep forever.",
  alternates: { canonical: "/plans" },
  openGraph: {
    title: "Guides & Meal Plans | Summer Loffler",
    description: "The tools Summer reaches for with her private clients.",
    url: "/plans",
    type: "website",
  },
};

export default async function PlansPage() {
  const snapshot = await getSummerPublicSnapshot();
  const products = snapshot.digitalProducts.filter((p) => p.is_visible);

  return (
    <main className="bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--paper-50)]">
        <Container
          size="xl"
          className="pb-16 pt-36 md:pb-24 md:pt-48"
          style={{ paddingTop: "calc(9rem + env(safe-area-inset-top))" }}
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                    § Collection
                  </span>
                  <Eyebrow variant="mono" tone="bronze">
                    Guides &amp; Meal Plans
                  </Eyebrow>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={80}>
                <h1 className="font-editorial mt-5 max-w-[22ch] text-balance text-5xl leading-[0.9] font-medium tracking-[-0.04em] md:text-[7.5rem]">
                  {snapshot.plansIntro.heading}
                </h1>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-4">
              <ScrollReveal delayMs={160}>
                <p className="font-editorial-italic text-[17px] leading-[1.7] text-[color:var(--ink-500)]">
                  {snapshot.plansIntro.subheading}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Products */}
      <section className="relative bg-[color:var(--paper-100)]">
        <Container size="xl" className="py-20 md:py-28">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
            {products.map((p, idx) => (
              <PlanCard
                key={p.id}
                index={idx}
                item={{
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  subtitle: p.subtitle,
                  description: p.description,
                  priceCents: p.price_cents,
                  coverUrl: null,
                  pageCount: p.page_count,
                  includes: p.includes,
                  featured: p.is_featured,
                  kind: p.kind,
                }}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Cinematic CTA strip */}
      <section className="relative overflow-hidden bg-[color:var(--ink-900)] text-white">
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
                Or start with everything
              </Eyebrow>
              <h2 className="font-editorial-italic mt-6 max-w-[24ch] text-balance text-5xl leading-[0.98] tracking-[-0.035em] md:text-[5rem]">
                Pair a guide with a subscription and the progress compounds.
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-white/70">
                Bring any guide into your weekly sessions with Summer — the classes pick up where
                the printable leaves off.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/classes"
                className="press-effect focus-ring inline-flex min-h-12 items-center justify-center gap-2 border border-white bg-white px-7 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-900)] transition hover:border-[color:var(--bronze-500)] hover:bg-[color:var(--bronze-500)] hover:text-white"
              >
                See subscription tiers
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
