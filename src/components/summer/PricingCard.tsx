import { CheckoutButton } from "@/components/summer/CheckoutButton";
import { ScrollReveal } from "@/components/summer/ScrollReveal";

export type PricingCardProps = {
  tierId: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  priceCents: number;
  interval: string;
  features: string[];
  badge?: string | null;
  featured?: boolean;
  hasStripePrice: boolean;
};

function formatPrice(cents: number, interval: string) {
  const dollars = (cents / 100).toFixed(Number.isInteger(cents / 100) ? 0 : 2);
  return {
    amount: `$${dollars}`,
    unit: interval === "year" ? "/ year" : "/ month",
  };
}

export function PricingCard({
  tierId,
  slug,
  title,
  subtitle,
  description,
  priceCents,
  interval,
  features,
  badge,
  featured,
  hasStripePrice,
}: PricingCardProps) {
  const { amount, unit } = formatPrice(priceCents, interval);
  return (
    <ScrollReveal
      as="article"
      className={`relative flex h-full flex-col p-8 md:p-10 ${featured ? "luxe-card-featured luxe-card" : "luxe-card"}`}
    >
      {badge ? (
        <span
          className={`absolute right-6 top-6 text-[10px] uppercase tracking-[0.28em] ${
            featured ? "text-[#a8896b]" : "text-[#8a7d72]"
          }`}
        >
          {badge}
        </span>
      ) : null}
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">Tier</p>
      <h3 className="font-editorial mt-4 text-4xl leading-none tracking-[-0.01em]">{title}</h3>
      {subtitle ? <p className="mt-3 text-sm text-[#5f5650]">{subtitle}</p> : null}

      <div className="mt-8 flex items-baseline gap-2">
        <span className="font-editorial text-5xl leading-none tracking-[-0.02em]">{amount}</span>
        <span className="text-xs uppercase tracking-[0.22em] text-[#8a7d72]">{unit}</span>
      </div>
      {description ? <p className="mt-5 text-sm leading-relaxed text-[#3a322c]">{description}</p> : null}

      <ul className="mt-7 space-y-3 text-sm text-[#2a241f]">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-[9px] block h-px w-4 shrink-0 bg-[#a8896b]"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex-1" />
      <CheckoutButton
        endpoint="/api/checkout/subscribe"
        payload={{ tierId, tierSlug: slug }}
        variant={featured ? "primary" : "secondary"}
        className="w-full"
      >
        {hasStripePrice ? `Subscribe · ${amount} ${unit}` : "Get notified at launch"}
      </CheckoutButton>
      {!hasStripePrice ? (
        <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[#8a7d72]">
          Pricing connects to Stripe on go-live
        </p>
      ) : null}
    </ScrollReveal>
  );
}
