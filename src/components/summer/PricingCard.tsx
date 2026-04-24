import { CheckoutButton } from "@/components/summer/CheckoutButton";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { cn } from "@/lib/cn";

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
  index?: number;
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
  index = 0,
}: PricingCardProps) {
  const { amount, unit } = formatPrice(priceCents, interval);
  const accentText = featured
    ? "text-[color:var(--oxblood-500)]"
    : "text-[color:var(--bronze-600)]";

  return (
    <ScrollReveal
      as="article"
      delayMs={index * 100}
      className={cn(
        "relative flex h-full flex-col p-8 md:p-10",
        featured ? "luxe-card-featured luxe-card" : "luxe-card",
      )}
    >
      {featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[1px] left-1/2 -translate-x-1/2 bg-[color:var(--oxblood-500)] px-4 py-1"
        >
          <span className="font-mono-editorial text-[9.5px] uppercase tracking-[0.32em] text-[color:var(--paper-100)]">
            {badge || "Most Chosen"}
          </span>
        </div>
      )}
      {!featured && badge && (
        <span
          className={cn(
            "absolute right-6 top-6 font-mono-editorial text-[10px] uppercase tracking-[0.28em]",
            accentText,
          )}
        >
          {badge}
        </span>
      )}

      <span className="font-mono-editorial text-[11px] uppercase tracking-[0.3em] text-[color:var(--bronze-600)]">
        Tier №{String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="font-editorial mt-4 text-4xl leading-[0.98] tracking-[-0.025em] text-[color:var(--ink-900)] md:text-5xl">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-3 font-editorial-italic text-[15px] text-[color:var(--bronze-700)]">
          {subtitle}
        </p>
      )}

      <div className="mt-7 flex items-baseline gap-2 border-t border-[color:var(--bronze-200)] pt-7">
        <span className="font-editorial text-6xl leading-none tracking-[-0.03em]">{amount}</span>
        <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--ink-400)]">
          {unit}
        </span>
      </div>
      {description && (
        <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--ink-500)]">
          {description}
        </p>
      )}

      <ul className="mt-7 space-y-3 text-[14.5px] text-[color:var(--ink-700)]">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-[10px] block h-px w-4 shrink-0 bg-[color:var(--bronze-500)]"
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
      {!hasStripePrice && (
        <p className="mt-3 font-mono-editorial text-[10.5px] uppercase tracking-[0.24em] text-[color:var(--ink-400)]">
          Pricing connects to Stripe on go-live
        </p>
      )}
    </ScrollReveal>
  );
}
