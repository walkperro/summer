import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { TipsCard } from "@/components/admin/TipsCard";
import { selectSummerRows } from "@/lib/summer/supabase";
import type { SummerDigitalProduct } from "@/lib/summer/types";

function formatMoney(cents: number) {
  const dollars = (cents / 100).toFixed(Number.isInteger(cents / 100) ? 0 : 2);
  return `$${dollars}`;
}

export default async function AdminPlansPage() {
  const products = await selectSummerRows<SummerDigitalProduct>("digital_products", {
    order: "sort_order.asc",
  }).catch(() => []);

  return (
    <AdminPage
      title="Guides & Meal Plans"
      description="Your one-time digital products. High margin, leveraged — sell while you sleep."
    >
      <div className="space-y-6">
        <TipsCard pageKey="plans" />
        <AdminCard>
          {products.length === 0 ? (
            <p className="py-4 text-sm text-[#5f5650]">
              No products yet. When you publish one, wire its Stripe price id in here so Checkout can charge.
            </p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-[0.22em] text-[#7a6f67]">
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Kind</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Stripe</th>
                  <th className="py-3 pr-4">Visible</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-black/5">
                    <td className="py-3 pr-4">{p.title}</td>
                    <td className="py-3 pr-4 text-[#3a322c]">{p.kind}</td>
                    <td className="py-3 pr-4 text-[#3a322c]">{formatMoney(p.price_cents)}</td>
                    <td className="py-3 pr-4 text-xs text-[#8a7d72]">{p.stripe_price_id ? "linked" : "—"}</td>
                    <td className="py-3 pr-4 text-xs">{p.is_visible ? "Yes" : "No"}</td>
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
