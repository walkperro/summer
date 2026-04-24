import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { TipsCard } from "@/components/admin/TipsCard";
import { selectSummerRows } from "@/lib/summer/supabase";
import type { SummerSubscription, SummerSubscriptionTier } from "@/lib/summer/types";

function formatMoney(cents: number) {
  const dollars = (cents / 100).toFixed(Number.isInteger(cents / 100) ? 0 : 2);
  return `$${dollars}`;
}

export default async function AdminSubscriptionsPage() {
  const [tiers, subs] = await Promise.all([
    selectSummerRows<SummerSubscriptionTier>("subscription_tiers", { order: "sort_order.asc" }).catch(() => []),
    selectSummerRows<SummerSubscription>("subscriptions", { order: "created_at.desc", limit: 200 }).catch(() => []),
  ]);

  const active = subs.filter((s) => ["active", "trialing"].includes(s.status)).length;
  const pastDue = subs.filter((s) => s.status === "past_due").length;
  const canceled = subs.filter((s) => s.status === "canceled").length;

  return (
    <AdminPage
      title="Subscriptions"
      description="Your recurring income. Watch active vs. past-due — that's churn before it happens."
    >
      <div className="space-y-6">
        <TipsCard pageKey="subscriptions" />

        <div className="grid gap-4 md:grid-cols-3">
          <AdminCard>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Active + trialing</p>
            <p className="font-editorial mt-4 text-5xl leading-none tracking-[-0.03em]">{active}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Past due</p>
            <p className="font-editorial mt-4 text-5xl leading-none tracking-[-0.03em]">{pastDue}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Canceled</p>
            <p className="font-editorial mt-4 text-5xl leading-none tracking-[-0.03em]">{canceled}</p>
          </AdminCard>
        </div>

        <AdminCard>
          <h2 className="font-editorial text-2xl leading-none">Tiers</h2>
          {tiers.length === 0 ? (
            <p className="mt-4 text-sm text-[#5f5650]">No tiers yet. Seed them via the migration.</p>
          ) : (
            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-[0.22em] text-[#7a6f67]">
                  <th className="py-3 pr-4">Tier</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Stripe price id</th>
                  <th className="py-3 pr-4">Visible</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t) => (
                  <tr key={t.id} className="border-b border-black/5">
                    <td className="py-3 pr-4">{t.title}</td>
                    <td className="py-3 pr-4 text-[#3a322c]">
                      {formatMoney(t.price_cents)} / {t.interval}
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#8a7d72]">{t.stripe_price_id || "—"}</td>
                    <td className="py-3 pr-4 text-xs">{t.is_visible ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="font-editorial text-2xl leading-none">Recent subscription events</h2>
          {subs.length === 0 ? (
            <p className="mt-4 text-sm text-[#5f5650]">
              No subscriptions yet. Once a client subscribes through Stripe, rows appear here automatically via the
              webhook.
            </p>
          ) : (
            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-[0.22em] text-[#7a6f67]">
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Stripe id</th>
                  <th className="py-3 pr-4">Period ends</th>
                  <th className="py-3 pr-4">Cancel at period end</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-black/5">
                    <td className="py-3 pr-4 text-xs uppercase tracking-[0.22em] text-[#8a7d72]">{s.status}</td>
                    <td className="py-3 pr-4 text-xs text-[#8a7d72]">{s.stripe_subscription_id || "—"}</td>
                    <td className="py-3 pr-4 text-xs text-[#8a7d72]">
                      {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 pr-4 text-xs">{s.cancel_at_period_end ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminCard>
      </div>
    </AdminPage>
  );
}
