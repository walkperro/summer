import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireClientSession } from "@/lib/summer/client-auth";
import { selectSummerRows } from "@/lib/summer/supabase";
import type { SummerPurchase, SummerSubscription, SummerSubscriptionTier } from "@/lib/summer/types";
import { clientLogoutAction } from "@/server/summer/client-actions";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Your Summer Loffler client dashboard.",
  robots: { index: false, follow: false },
};

function formatMoney(cents: number, currency = "usd") {
  const dollars = (cents / 100).toFixed(Number.isInteger(cents / 100) ? 0 : 2);
  return `${currency === "usd" ? "$" : ""}${dollars}${currency !== "usd" ? ` ${currency.toUpperCase()}` : ""}`;
}

function formatLongDate(isoOrNull: string | null | undefined) {
  if (!isoOrNull) return null;
  const d = new Date(isoOrNull);
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function daysUntil(isoOrNull: string | null | undefined): number | null {
  if (!isoOrNull) return null;
  const d = new Date(isoOrNull).getTime();
  const now = Date.now();
  return Math.max(0, Math.round((d - now) / (1000 * 60 * 60 * 24)));
}

export default async function ClientHomePage() {
  const session = await requireClientSession();
  const clientId = session.client.id;
  const firstName = session.client.full_name?.split(" ")[0] ?? "";

  const [subscriptions, purchases, tiers] = await Promise.all([
    selectSummerRows<SummerSubscription>("subscriptions", {
      client_id: `eq.${clientId}`,
      order: "created_at.desc",
    }).catch(() => []),
    selectSummerRows<SummerPurchase>("purchases", {
      client_id: `eq.${clientId}`,
      order: "created_at.desc",
    }).catch(() => []),
    selectSummerRows<SummerSubscriptionTier>("subscription_tiers", {
      order: "sort_order.asc",
    }).catch(() => []),
  ]);

  const tierById = new Map(tiers.map((t) => [t.id, t]));
  const activeSub = subscriptions.find((s) => ["active", "trialing"].includes(s.status));
  const renewsIn = daysUntil(activeSub?.current_period_end);
  const renewDate = formatLongDate(activeSub?.current_period_end);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-[100svh] bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      {/* Welcome */}
      <section
        className="relative overflow-hidden bg-[color:var(--paper-50)]"
        style={{ paddingTop: "calc(8rem + env(safe-area-inset-top))" }}
      >
        <Container size="xl" className="pb-16 pt-4 md:pb-20 md:pt-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[color:var(--bronze-500)]" aria-hidden="true" />
                <Eyebrow variant="mono" tone="bronze">
                  Your Account · Private
                </Eyebrow>
              </div>
              <h1 className="font-editorial mt-6 text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-[5rem]">
                Welcome back{firstName ? `, ${firstName}` : ""}.
              </h1>
              <p className="mt-4 font-editorial-italic text-lg text-[color:var(--ink-500)]">
                {today}
              </p>
            </div>
            <form action={clientLogoutAction}>
              <button
                type="submit"
                className="press-effect accent-underline font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-500)] transition hover:text-[color:var(--ink-900)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </Container>
      </section>

      {/* Subscription + quick access */}
      <section className="relative bg-[color:var(--paper-100)]">
        <Container size="xl" className="pb-16 pt-10 md:pb-24 md:pt-16">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {/* Subscription */}
            <article className="luxe-card relative flex flex-col p-8 md:col-span-2 md:p-10">
              <div className="flex items-center justify-between gap-4">
                <Eyebrow variant="mono" tone="bronze">
                  Subscription
                </Eyebrow>
                {activeSub && <StatusBadge status={activeSub.status as "active" | "trialing" | "past_due" | "canceled" | "incomplete"} />}
              </div>

              {activeSub ? (
                <>
                  <h2 className="font-editorial mt-5 text-4xl leading-[0.98] tracking-[-0.025em] md:text-5xl">
                    {tierById.get(activeSub.tier_id || "")?.title || "Active"}
                  </h2>
                  {renewsIn !== null && renewDate && (
                    <div className="mt-8 flex items-baseline gap-4 border-t border-[color:var(--bronze-200)] pt-6">
                      <span className="font-editorial-italic text-5xl leading-[0.85] text-[color:var(--bronze-600)]">
                        {renewsIn}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-400)]">
                          Days until renewal
                        </span>
                        <span className="mt-1 font-editorial-italic text-[15px] text-[color:var(--ink-500)]">
                          {renewDate}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/classes#library"
                      className="press-effect focus-ring inline-flex min-h-11 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-5 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
                    >
                      Open class library
                    </Link>
                    <Link
                      href="/plans"
                      className="press-effect focus-ring inline-flex min-h-11 items-center justify-center border border-[color:var(--ink-900)]/22 px-5 font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]"
                    >
                      Add a guide
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-editorial mt-5 text-4xl leading-[0.98] tracking-[-0.025em] md:text-5xl">
                    The studio is quiet.
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-[1.75] text-[color:var(--ink-500)]">
                    Pick a tier and start training. Cancel anytime; keep access to the day you stop.
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/classes#subscriptions"
                      className="press-effect focus-ring inline-flex min-h-11 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-5 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
                    >
                      See subscription tiers
                    </Link>
                  </div>
                </>
              )}
            </article>

            {/* Quick links */}
            <article className="luxe-card flex flex-col p-8 md:p-10">
              <Eyebrow variant="mono" tone="bronze">
                Quick access
              </Eyebrow>
              <ul className="mt-6 flex flex-col divide-y divide-[color:var(--bronze-200)]">
                {[
                  { href: "/classes", label: "Browse classes" },
                  { href: "/plans", label: "Buy a guide" },
                  { href: "/#contact", label: "Apply for private training" },
                  { href: "/about", label: "About Summer" },
                ].map((l) => (
                  <li key={l.href} className="py-3">
                    <Link
                      href={l.href}
                      className="accent-underline inline-flex items-center gap-2 font-editorial-italic text-[17px] text-[color:var(--ink-900)]"
                    >
                      {l.label}
                      <span aria-hidden="true" className="text-[color:var(--bronze-500)]">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </section>

      {/* Library / purchases */}
      <section className="relative bg-[color:var(--paper-50)]">
        <Container size="xl" className="py-16 md:py-24 lg:py-28">
          <div className="flex items-center gap-3">
            <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
              § Your library
            </span>
            <Eyebrow variant="mono" tone="bronze">
              Guides &amp; Downloads
            </Eyebrow>
          </div>
          <h2 className="font-editorial mt-5 text-balance text-4xl leading-[0.98] tracking-[-0.035em] md:text-[3.5rem]">
            What you&rsquo;ve collected.
          </h2>

          {purchases.length ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {purchases.map((p) => (
                <div key={p.id} className="luxe-card flex items-start gap-5 p-6 md:p-7">
                  <div className="flex h-24 w-20 shrink-0 items-center justify-center bg-[color:var(--paper-200)] font-editorial-italic text-2xl text-[color:var(--bronze-500)]">
                    PDF
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Eyebrow variant="mono" tone="bronze">
                      {p.status}
                    </Eyebrow>
                    <p className="font-editorial mt-2 text-xl leading-[1.2]">
                      Purchase · {formatMoney(p.amount_cents, p.currency)}
                    </p>
                    <p className="mt-1 font-mono-editorial text-[10.5px] uppercase tracking-[0.28em] text-[color:var(--ink-400)]">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                    {p.download_url ? (
                      <a
                        href={p.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="accent-underline mt-4 inline-flex w-fit font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-900)]"
                      >
                        Download ↗
                      </a>
                    ) : (
                      <span className="mt-4 font-editorial-italic text-[14px] text-[color:var(--ink-400)]">
                        Download will appear here shortly.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                eyebrow="Nothing yet"
                title="Your library is quiet."
                subtitle="Start with a guide or meal plan. They stay in your account forever, ready when you are."
                action={
                  <Link
                    href="/plans"
                    className="accent-underline font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-900)]"
                  >
                    Browse the guides shop →
                  </Link>
                }
              />
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
