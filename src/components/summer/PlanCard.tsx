import Image from "next/image";

import { CheckoutButton } from "@/components/summer/CheckoutButton";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { cn } from "@/lib/cn";

export type PlanCardItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  priceCents: number;
  coverUrl: string | null;
  pageCount: number | null;
  includes: string[];
  featured: boolean;
  kind: string;
};

function formatPrice(cents: number) {
  const dollars = (cents / 100).toFixed(Number.isInteger(cents / 100) ? 0 : 2);
  return `$${dollars}`;
}

export function PlanCard({ item, index = 0 }: { item: PlanCardItem; index?: number }) {
  const kindLabel =
    item.kind === "meal_plan" ? "Meal Plan" : item.kind === "bundle" ? "Bundle" : "Guide";

  return (
    <ScrollReveal
      as="article"
      delayMs={index * 70}
      className={cn(
        "relative flex h-full flex-col overflow-hidden",
        item.featured ? "luxe-card-featured luxe-card" : "luxe-card",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--paper-200)]">
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[color:var(--paper-200)]">
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full text-[color:var(--bronze-300)]"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span className="relative font-editorial-italic text-5xl text-[color:var(--bronze-500)] sm:text-6xl">
              {kindLabel}
            </span>
            <span className="relative mt-2 font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-[color:var(--ink-400)]">
              Awaiting cover
            </span>
          </div>
        )}
        <span
          className={cn(
            "absolute left-4 top-4 font-mono-editorial text-[9.5px] uppercase tracking-[0.3em]",
            item.featured
              ? "rounded-full bg-[color:var(--oxblood-500)] px-3 py-1 text-white"
              : "rounded-full bg-[color:var(--paper-50)]/90 px-3 py-1 text-[color:var(--ink-700)] backdrop-blur",
          )}
        >
          {item.featured ? "Most Reached For" : kindLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-[color:var(--bronze-600)]">
          №{String(index + 1).padStart(2, "0")} · {kindLabel}
        </span>
        <h3 className="font-editorial mt-3 text-[1.75rem] leading-[1.02] tracking-[-0.02em] text-[color:var(--ink-900)]">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="mt-2 font-editorial-italic text-[15px] text-[color:var(--bronze-700)]">
            {item.subtitle}
          </p>
        )}
        {item.description && (
          <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--ink-500)]">
            {item.description}
          </p>
        )}
        {item.includes?.length && (
          <ul className="mt-5 space-y-2 text-[14.5px] text-[color:var(--ink-700)]">
            {item.includes.slice(0, 4).map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[10px] block h-px w-4 shrink-0 bg-[color:var(--bronze-500)]"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex-1" />
        <div className="flex items-baseline justify-between gap-4 border-t border-[color:var(--bronze-200)] pt-5">
          <span className="font-editorial text-4xl leading-none tracking-[-0.03em] text-[color:var(--ink-900)]">
            {formatPrice(item.priceCents)}
          </span>
          {item.pageCount && (
            <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.28em] text-[color:var(--ink-400)]">
              {item.pageCount} pages
            </span>
          )}
        </div>
        <div className="mt-5">
          <CheckoutButton
            endpoint="/api/checkout/product"
            payload={{ productId: item.id, productSlug: item.slug }}
            variant={item.featured ? "primary" : "secondary"}
            className="w-full"
          >
            Buy now
          </CheckoutButton>
        </div>
      </div>
    </ScrollReveal>
  );
}
