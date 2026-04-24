import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { TipsCard } from "@/components/admin/TipsCard";
import { selectSummerRows } from "@/lib/summer/supabase";
import type { SummerClient } from "@/lib/summer/types";

export default async function AdminClientsPage() {
  const clients = await selectSummerRows<SummerClient>("clients", {
    order: "updated_at.desc",
    limit: 200,
  }).catch(() => []);

  return (
    <AdminPage
      title="Clients"
      description="Everyone Summer has a real relationship with — from early leads to active Inner Circle members."
    >
      <div className="space-y-6">
        <TipsCard pageKey="clients" />

        <AdminCard>
          {clients.length === 0 ? (
            <p className="py-4 text-sm text-[#5f5650]">
              No clients yet. Inquiries you convert will appear here automatically. You can also seed an example
              client row in Supabase to test the flow.
            </p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-[0.22em] text-[#7a6f67]">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Stripe</th>
                  <th className="py-3 pr-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-black/5">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/clients/${c.id}`} className="accent-underline">
                        {c.full_name || "—"}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-[#3a322c]">{c.email}</td>
                    <td className="py-3 pr-4 text-xs uppercase tracking-[0.22em] text-[#8a7d72]">
                      {c.lifecycle_status}
                    </td>
                    <td className="py-3 pr-4 text-[11px] text-[#8a7d72]">
                      {c.stripe_customer_id ? "linked" : "—"}
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#8a7d72]">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
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
