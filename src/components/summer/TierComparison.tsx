import { PricingCard } from "@/components/summer/PricingCard";
import { ScrollReveal } from "@/components/summer/ScrollReveal";

export type TierComparisonItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price_cents: number;
  interval: string;
  features: string[];
  badge: string | null;
  is_featured: boolean;
  stripe_price_id: string | null;
};

type Props = {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  tiers: TierComparisonItem[];
};

export function TierComparison({ eyebrow = "Subscribe", heading = "Pick a tier. Move with Summer.", subheading, tiers }: Props) {
  if (!tiers.length) return null;
  return (
    <section id="subscriptions" className="relative overflow-hidden bg-[#f6f1ea] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">{eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal delayMs={80}>
          <h2 className="font-editorial mt-4 max-w-3xl text-balance text-4xl leading-[1.04] tracking-[-0.01em] md:text-6xl">
            {heading}
          </h2>
        </ScrollReveal>
        {subheading ? (
          <ScrollReveal delayMs={160}>
            <p className="mt-5 max-w-3xl text-base text-[#3a322c] md:text-lg">{subheading}</p>
          </ScrollReveal>
        ) : null}
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tierId={tier.id}
              slug={tier.slug}
              title={tier.title}
              subtitle={tier.subtitle}
              description={tier.description}
              priceCents={tier.price_cents}
              interval={tier.interval}
              features={tier.features}
              badge={tier.badge}
              featured={tier.is_featured}
              hasStripePrice={Boolean(tier.stripe_price_id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
