import type { Metadata } from "next";

import { PlanCard } from "@/components/summer/PlanCard";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
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
    <main className="bg-[#f6f1ea] text-[#181512]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-40 md:px-10 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">Guides & Meal Plans</p>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h1 className="font-editorial mt-4 max-w-4xl text-balance text-5xl leading-[1.02] tracking-[-0.01em] md:text-7xl">
              {snapshot.plansIntro.heading}
            </h1>
          </ScrollReveal>
          <ScrollReveal delayMs={160}>
            <p className="mt-6 max-w-2xl text-base text-[#3a322c] md:text-lg">
              {snapshot.plansIntro.subheading}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <PlanCard
                key={p.id}
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
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative overflow-hidden bg-[#191512] px-6 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/55">Bundle</p>
            <h2 className="font-editorial mt-4 max-w-xl text-balance text-4xl leading-[1.05] tracking-[-0.01em] md:text-5xl">
              Pair a guide with a subscription and the progress compounds.
            </h2>
          </div>
          <div className="flex items-end">
            <a
              href="/classes"
              className="inline-flex min-h-12 items-center justify-center border border-white bg-white px-6 text-[11px] uppercase tracking-[0.28em] text-[#181512] transition hover:bg-[#a8896b] hover:text-white hover:border-[#a8896b]"
            >
              See subscription tiers
            </a>
          </div>
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
