import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { selectSummerSingle } from "@/lib/summer/supabase";
import type { SummerAdminTip } from "@/lib/summer/types";

type Props = {
  pageKey: string;
  fallback?: Partial<Pick<SummerAdminTip, "title" | "body" | "cta_label" | "cta_href" | "icon">>;
};

const FALLBACK_TIPS: Record<string, Partial<SummerAdminTip>> = {
  dashboard: {
    title: "Turn this site into income, fast",
    body:
      "Three things move the needle: add one class to the library, publish one digital guide, and send the subscription link to your warmest DMs. Everything else is polish.",
    cta_label: "Open Settings",
    cta_href: "/admin/settings",
  },
  clients: {
    title: "The point is relationships, not spreadsheets",
    body:
      "New inquiries auto-land as clients in the 'lead' status. Promote them as they book or subscribe. Use notes to capture what they told you in their first DM.",
    cta_label: "Open inquiries",
    cta_href: "/admin/inquiries",
  },
  classes: {
    title: "Stack 3–6 classes before you launch",
    body:
      "Subscribers need a reason to stay past month one. A full foundation library (warm-up, mobility, strength, glute focus, finisher, cool-down) gives Essentials tier real value.",
  },
  plans: {
    title: "Guides sell while you sleep",
    body:
      "Unlike coaching, digital guides are pure margin. Price them in the $29–$79 range — approachable enough to impulse-buy off Instagram.",
  },
  subscriptions: {
    title: "Live subscriptions are your MRR",
    body:
      "Watch status transitions: active → past_due → canceled. A weekly glance here tells you what's real and what's churning.",
    cta_label: "View clients",
    cta_href: "/admin/clients",
  },
  revenue: {
    title: "A weekly look keeps you honest",
    body:
      "MRR + last-30-days product sales = your real number. The rest is story. Check it every Sunday night.",
  },
  testimonials: {
    title: "Quiet testimonials convert",
    body:
      "Avoid the loud 'best program ever' copy. Lift specific client sentences: what changed, how it felt. Three short, specific quotes beats a paragraph.",
  },
  inquiries: {
    title: "Reply fast, close warm",
    body:
      "A 24-hour response more than doubles your close rate. Use the status pipeline and leave a note after every touch.",
  },
};

export async function TipsCard({ pageKey, fallback }: Props) {
  let tip: SummerAdminTip | null = null;
  try {
    tip = await selectSummerSingle<SummerAdminTip>("admin_tips", { page_key: `eq.${pageKey}` });
  } catch {
    tip = null;
  }

  const merged = tip || (FALLBACK_TIPS[pageKey] as SummerAdminTip | undefined);
  const title = merged?.title || fallback?.title;
  const body = merged?.body || fallback?.body;
  if (!title && !body) return null;

  const ctaLabel = merged?.cta_label || fallback?.cta_label || null;
  const ctaHref = merged?.cta_href || fallback?.cta_href || null;

  return (
    <AdminCard>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#a8896b]">How this helps you make money</p>
          {title ? (
            <h2 className="font-editorial mt-3 text-2xl leading-none tracking-[-0.01em]">{title}</h2>
          ) : null}
          {body ? <p className="mt-3 text-sm leading-relaxed text-[#3a322c]">{body}</p> : null}
        </div>
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-[#2a241f]"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </AdminCard>
  );
}
