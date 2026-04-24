import Image from "next/image";

import { CheckoutButton } from "@/components/summer/CheckoutButton";
import { ScrollReveal } from "@/components/summer/ScrollReveal";

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

export function PlanCard({ item }: { item: PlanCardItem }) {
  const kindLabel =
    item.kind === "meal_plan" ? "Meal Plan" : item.kind === "bundle" ? "Bundle" : "Guide";
  return (
    <ScrollReveal
      as="article"
      className={`flex h-full flex-col overflow-hidden ${item.featured ? "luxe-card-featured luxe-card" : "luxe-card"}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8ddd0]">
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.28em] text-[#8a7d72]">
            {kindLabel}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#2a241f] backdrop-blur">
          {kindLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-editorial text-2xl leading-tight tracking-[-0.005em]">{item.title}</h3>
        {item.subtitle ? <p className="mt-2 text-sm text-[#5f5650]">{item.subtitle}</p> : null}
        {item.description ? (
          <p className="mt-4 text-sm leading-relaxed text-[#3a322c]">{item.description}</p>
        ) : null}
        {item.includes?.length ? (
          <ul className="mt-5 space-y-2 text-sm text-[#2a241f]">
            {item.includes.slice(0, 4).map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] block h-px w-4 shrink-0 bg-[#a8896b]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-8 flex-1" />
        <div className="mt-6 flex items-baseline justify-between gap-4">
          <span className="font-editorial text-3xl leading-none tracking-[-0.02em]">{formatPrice(item.priceCents)}</span>
          {item.pageCount ? (
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#8a7d72]">{item.pageCount} pages</span>
          ) : null}
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
