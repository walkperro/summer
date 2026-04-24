import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { TipsCard } from "@/components/admin/TipsCard";
import { selectSummerRows } from "@/lib/summer/supabase";
import type { SummerTestimonial } from "@/lib/summer/types";

export default async function AdminTestimonialsPage() {
  const testimonials = await selectSummerRows<SummerTestimonial>("testimonials", {
    order: "sort_order.asc",
  }).catch(() => []);

  return (
    <AdminPage
      title="Testimonials"
      description="Short, specific quotes from real clients. Keep them quiet — that's what converts."
    >
      <div className="space-y-6">
        <TipsCard pageKey="testimonials" />
        <AdminCard>
          {testimonials.length === 0 ? (
            <p className="py-4 text-sm text-[#5f5650]">
              No testimonials yet. Add a row in Supabase (or extend this page with a form) with name, location, and a
              short, specific quote.
            </p>
          ) : (
            <ul className="space-y-5">
              {testimonials.map((t) => (
                <li key={t.id} className="border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-editorial-italic text-xl leading-snug">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">
                    {t.name || "Client"}
                    {t.location ? ` · ${t.location}` : ""}
                    {t.is_featured ? " · featured" : ""}
                    {t.is_visible ? "" : " · hidden"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </AdminPage>
  );
}
