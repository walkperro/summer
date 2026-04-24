import type { Metadata } from "next";
import Link from "next/link";

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

export default async function ClientHomePage() {
  const session = await requireClientSession();
  const clientId = session.client.id;

  const [subscriptions, purchases, tiers] = await Promise.all([
    selectSummerRows<SummerSubscription>("subscriptions", { client_id: `eq.${clientId}`, order: "created_at.desc" }).catch(() => []),
    selectSummerRows<SummerPurchase>("purchases", { client_id: `eq.${clientId}`, order: "created_at.desc" }).catch(() => []),
    selectSummerRows<SummerSubscriptionTier>("subscription_tiers", { order: "sort_order.asc" }).catch(() => []),
  ]);

  const tierById = new Map(tiers.map((t) => [t.id, t]));
  const activeSub = subscriptions.find((s) => ["active", "trialing"].includes(s.status));

  return (
    <main className="bg-[#f6f1ea] text-[#181512]">
      <section className="px-6 pt-32 pb-10 md:px-10 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">Your Account</p>
          <div className="mt-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <h1 className="font-editorial text-4xl leading-[1.05] tracking-[-0.01em] md:text-6xl">
              Welcome back{session.client.full_name ? `, ${session.client.full_name.split(" ")[0]}` : ""}.
            </h1>
            <form action={clientLogoutAction}>
              <button
                type="submit"
                className="text-[11px] uppercase tracking-[0.28em] text-[#5f5650] transition hover:text-[#181512]"
              >
                Sign out
              </button>
            </form>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-[#5f5650]">
            Your subscription, upcoming classes, and purchased guides — all in one place.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {/* Subscription */}
          <article className="luxe-card p-8 md:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">Subscription</p>
            {activeSub ? (
              <>
                <h2 className="font-editorial mt-3 text-3xl leading-none tracking-[-0.01em]">
                  {tierById.get(activeSub.tier_id || "")?.title || "Active"}
                </h2>
                <p className="mt-2 text-sm text-[#5f5650]">
                  Status: <span className="text-[#181512]">{activeSub.status}</span>
                </p>
                {activeSub.current_period_end ? (
                  <p className="mt-1 text-sm text-[#5f5650]">
                    Next renewal: {new Date(activeSub.current_period_end).toLocaleDateString()}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/classes#library"
                    className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
                  >
                    Open class library
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-editorial mt-3 text-3xl leading-none tracking-[-0.01em]">No active subscription yet</h2>
                <p className="mt-3 max-w-md text-sm text-[#5f5650]">
                  Pick a tier and start training — cancel anytime, keep access to the day you cancel.
                </p>
                <div className="mt-6">
                  <Link
                    href="/classes#subscriptions"
                    className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
                  >
                    See subscription tiers
                  </Link>
                </div>
              </>
            )}
          </article>

          {/* Quick links */}
          <article className="luxe-card p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">Quick access</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/classes" className="accent-underline text-[#181512]">
                  Browse classes
                </Link>
              </li>
              <li>
                <Link href="/plans" className="accent-underline text-[#181512]">
                  Buy a guide
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="accent-underline text-[#181512]">
                  Apply for private training
                </Link>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Downloads / purchases */}
      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-editorial text-3xl leading-none tracking-[-0.01em] md:text-4xl">Your downloads</h2>
          {purchases.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {purchases.map((p) => (
                <div key={p.id} className="luxe-card flex flex-col gap-2 p-6">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">{p.status}</p>
                  <p className="font-editorial text-xl leading-snug">Purchase {formatMoney(p.amount_cents, p.currency)}</p>
                  {p.download_url ? (
                    <a
                      href={p.download_url}
                      className="accent-underline mt-2 text-sm text-[#181512]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-sm text-[#8a7d72]">Download will appear here shortly.</span>
                  )}
                  <p className="mt-1 text-xs text-[#8a7d72]">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#5f5650]">
              Nothing purchased yet. Start with the <Link href="/plans" className="accent-underline text-[#181512]">guides shop</Link>.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
