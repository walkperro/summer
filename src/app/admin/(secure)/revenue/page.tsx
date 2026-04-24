import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { TipsCard } from "@/components/admin/TipsCard";
import { selectSummerRows } from "@/lib/summer/supabase";
import type { SummerPurchase, SummerSubscription, SummerSubscriptionTier } from "@/lib/summer/types";

function formatMoney(cents: number) {
  const dollars = (cents / 100).toFixed(Number.isInteger(cents / 100) ? 0 : 2);
  return `$${dollars}`;
}

export default async function AdminRevenuePage() {
  const [subs, purchases, tiers] = await Promise.all([
    selectSummerRows<SummerSubscription>("subscriptions", { order: "created_at.desc" }).catch(() => []),
    selectSummerRows<SummerPurchase>("purchases", { order: "created_at.desc" }).catch(() => []),
    selectSummerRows<SummerSubscriptionTier>("subscription_tiers", {}).catch(() => []),
  ]);

  const tierById = new Map(tiers.map((t) => [t.id, t]));

  const activeSubs = subs.filter((s) => ["active", "trialing"].includes(s.status));
  const mrrCents = activeSubs.reduce((sum, s) => {
    const tier = tierById.get(s.tier_id || "");
    if (!tier) return sum;
    if (tier.interval === "year") return sum + Math.round(tier.price_cents / 12);
    return sum + tier.price_cents;
  }, 0);

  const THIRTY_D = 1000 * 60 * 60 * 24 * 30;
  // Server component, renders once per request — safe to read current time.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const recentPurchases = purchases.filter(
    (p) => p.status === "paid" && nowMs - new Date(p.created_at).getTime() <= THIRTY_D,
  );
  const last30Cents = recentPurchases.reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <AdminPage title="Revenue" description="What's actually coming in. Check it every Sunday night.">
      <div className="space-y-6">
        <TipsCard pageKey="revenue" />
        <div className="grid gap-4 md:grid-cols-3">
          <AdminCard>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">MRR</p>
            <p className="font-editorial mt-4 text-5xl leading-none tracking-[-0.03em]">{formatMoney(mrrCents)}</p>
            <p className="mt-3 text-xs text-[#8a7d72]">
              {activeSubs.length} active subscription{activeSubs.length === 1 ? "" : "s"}
            </p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Last 30 days — products</p>
            <p className="font-editorial mt-4 text-5xl leading-none tracking-[-0.03em]">{formatMoney(last30Cents)}</p>
            <p className="mt-3 text-xs text-[#8a7d72]">{recentPurchases.length} purchase{recentPurchases.length === 1 ? "" : "s"}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Running total — products</p>
            <p className="font-editorial mt-4 text-5xl leading-none tracking-[-0.03em]">
              {formatMoney(purchases.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount_cents, 0))}
            </p>
          </AdminCard>
        </div>

        <AdminCard>
          <h2 className="font-editorial text-2xl leading-none">Recent purchases</h2>
          {purchases.length === 0 ? (
            <p className="mt-4 text-sm text-[#5f5650]">Nothing yet. Add your first digital product and share the link.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {purchases.slice(0, 10).map((p) => (
                <li key={p.id} className="border-t border-black/6 pt-3">
                  <p>
                    {formatMoney(p.amount_cents)} · <span className="text-xs uppercase tracking-[0.22em] text-[#8a7d72]">{p.status}</span>
                  </p>
                  <p className="text-xs text-[#8a7d72]">{new Date(p.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </AdminPage>
  );
}
