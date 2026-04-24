import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

export function TierComparison({
  eyebrow = "Subscribe",
  heading = "Pick a tier. Move with Summer.",
  subheading,
  tiers,
}: Props) {
  if (!tiers.length) return null;
  return (
    <section
      id="subscriptions"
      className="relative overflow-hidden border-y border-[color:var(--bronze-300)] bg-[color:var(--paper-50)]"
    >
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § IX
                </span>
                <Eyebrow variant="mono" tone="bronze">
                  {eyebrow}
                </Eyebrow>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <h2 className="font-editorial mt-5 max-w-[22ch] text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-[4.75rem]">
                {heading}
              </h2>
            </ScrollReveal>
          </div>
          {subheading && (
            <div className="lg:col-span-5">
              <ScrollReveal delayMs={160}>
                <p className="text-[15px] leading-[1.75] text-[color:var(--ink-500)]">{subheading}</p>
              </ScrollReveal>
            </div>
          )}
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3 md:mt-20">
          {tiers.map((tier, idx) => (
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
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
