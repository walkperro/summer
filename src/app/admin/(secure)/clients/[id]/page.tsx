import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { selectSummerRows, selectSummerSingle } from "@/lib/summer/supabase";
import type {
  SummerClient,
  SummerClientMessage,
  SummerPurchase,
  SummerSubscription,
} from "@/lib/summer/types";

type Props = { params: Promise<{ id: string }> };

function formatMoney(cents: number, currency = "usd") {
  const dollars = (cents / 100).toFixed(Number.isInteger(cents / 100) ? 0 : 2);
  return `${currency === "usd" ? "$" : ""}${dollars}${currency !== "usd" ? ` ${currency.toUpperCase()}` : ""}`;
}

export default async function AdminClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await selectSummerSingle<SummerClient>("clients", { id: `eq.${id}` }).catch(() => null);
  if (!client) notFound();

  const [subs, purchases, messages] = await Promise.all([
    selectSummerRows<SummerSubscription>("subscriptions", { client_id: `eq.${id}`, order: "created_at.desc" }).catch(() => []),
    selectSummerRows<SummerPurchase>("purchases", { client_id: `eq.${id}`, order: "created_at.desc" }).catch(() => []),
    selectSummerRows<SummerClientMessage>("client_messages", { client_id: `eq.${id}`, order: "created_at.desc" }).catch(() => []),
  ]);

  return (
    <AdminPage
      title={client.full_name || client.email}
      description={`Lifecycle: ${client.lifecycle_status} · joined ${new Date(client.created_at).toLocaleDateString()}`}
    >
      <div className="space-y-6">
        <AdminCard>
          <h2 className="font-editorial text-2xl leading-none">Details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Email</dt>
              <dd className="mt-1 text-sm">{client.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Phone</dt>
              <dd className="mt-1 text-sm">{client.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Instagram</dt>
              <dd className="mt-1 text-sm">{client.instagram_handle || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Stripe</dt>
              <dd className="mt-1 text-sm">{client.stripe_customer_id || "—"}</dd>
            </div>
          </dl>
          {client.notes ? (
            <div className="mt-6 border-t border-black/8 pt-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[#2a241f]">{client.notes}</p>
            </div>
          ) : null}
        </AdminCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <AdminCard>
            <div className="flex items-baseline justify-between">
              <h2 className="font-editorial text-2xl leading-none">Subscriptions</h2>
              <Link href="/admin/subscriptions" className="text-xs uppercase tracking-[0.22em] text-[#5f5650]">
                All subs
              </Link>
            </div>
            {subs.length === 0 ? (
              <p className="mt-4 text-sm text-[#5f5650]">None yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {subs.map((s) => (
                  <li key={s.id} className="border-t border-black/6 pt-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{s.status}</p>
                    <p className="mt-1">{s.stripe_subscription_id || "—"}</p>
                    {s.current_period_end ? (
                      <p className="text-xs text-[#8a7d72]">
                        Renews {new Date(s.current_period_end).toLocaleDateString()}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          <AdminCard>
            <h2 className="font-editorial text-2xl leading-none">Purchases</h2>
            {purchases.length === 0 ? (
              <p className="mt-4 text-sm text-[#5f5650]">None yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {purchases.map((p) => (
                  <li key={p.id} className="border-t border-black/6 pt-3">
                    <p>{formatMoney(p.amount_cents, p.currency)} · {p.status}</p>
                    <p className="text-xs text-[#8a7d72]">{new Date(p.created_at).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>

        <AdminCard>
          <h2 className="font-editorial text-2xl leading-none">Messages</h2>
          {messages.length === 0 ? (
            <p className="mt-4 text-sm text-[#5f5650]">No messages yet. When you wire DMs, they&rsquo;ll land here.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {messages.map((m) => (
                <li key={m.id} className="border-t border-black/6 pt-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{m.from_role}</p>
                  <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                  <p className="text-xs text-[#8a7d72]">{new Date(m.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </AdminPage>
  );
}
