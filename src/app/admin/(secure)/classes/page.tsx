import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { TipsCard } from "@/components/admin/TipsCard";
import { selectSummerRows } from "@/lib/summer/supabase";
import type { SummerClass } from "@/lib/summer/types";

export default async function AdminClassesPage() {
  const classes = await selectSummerRows<SummerClass>("classes", {
    order: "sort_order.asc",
  }).catch(() => []);

  return (
    <AdminPage
      title="Classes"
      description="Your on-demand library. Each class becomes a reason someone keeps paying."
    >
      <div className="space-y-6">
        <TipsCard pageKey="classes" />
        <AdminCard>
          {classes.length === 0 ? (
            <p className="py-4 text-sm text-[#5f5650]">
              No classes yet. Upload the first one via the image studio and this table fills up. (When the full CRUD
              form ships, you&rsquo;ll add title + video link + difficulty here.)
            </p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-[0.22em] text-[#7a6f67]">
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Duration</th>
                  <th className="py-3 pr-4">Access tier</th>
                  <th className="py-3 pr-4">Visible</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id} className="border-b border-black/5">
                    <td className="py-3 pr-4">{c.title}</td>
                    <td className="py-3 pr-4 text-[#3a322c]">{c.category || "—"}</td>
                    <td className="py-3 pr-4 text-[#3a322c]">{c.duration_minutes ? `${c.duration_minutes} min` : "—"}</td>
                    <td className="py-3 pr-4 text-xs uppercase tracking-[0.22em] text-[#8a7d72]">
                      {c.access_level_min >= 3 ? "Inner Circle" : c.access_level_min >= 2 ? "Signature" : "Essentials"}
                    </td>
                    <td className="py-3 pr-4 text-xs">{c.is_visible ? "Yes" : "No"}</td>
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
