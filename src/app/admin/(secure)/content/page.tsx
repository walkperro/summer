import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";
import { saveSectionContentAction } from "@/server/summer/admin-actions";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const { sections } = await getSummerAdminCollections();

  return (
    <AdminPage
      title="Content"
      description="Edit section-level copy for the public site. Each block writes into `summer.section_content` and the homepage falls back safely if a record is missing."
      result={result}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map((section) => {
          const body = section.body || {};
          return (
            <AdminCard key={section.id}>
              <form action={saveSectionContentAction} className="space-y-4">
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="section_key" value={section.section_key} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{section.section_key}</p>
                    <h2 className="font-editorial mt-2 text-3xl leading-none">{section.heading || section.section_key}</h2>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[#5f5650]">
                    <input type="checkbox" name="is_visible" defaultChecked={section.is_visible} /> Visible
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Eyebrow</span>
                  <input name="eyebrow" defaultValue={section.eyebrow || ""} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Heading</span>
                  <input name="heading" defaultValue={section.heading || ""} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Subheading</span>
                  <textarea name="subheading" rows={3} defaultValue={section.subheading || ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Paragraphs</span>
                  <textarea name="paragraphs" rows={5} defaultValue={Array.isArray(body.paragraphs) ? body.paragraphs.join("\n\n") : ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Points / bullets</span>
                  <textarea name="points" rows={4} defaultValue={Array.isArray(body.points) ? body.points.join("\n") : ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Pillars</span>
                  <textarea name="pillars" rows={3} defaultValue={Array.isArray(body.pillars) ? body.pillars.join("\n") : ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Lead card / availability note</span>
                  <textarea name="lead_card" rows={3} defaultValue={typeof body.lead_card === "string" ? body.lead_card : typeof body.availability_note === "string" ? body.availability_note : ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
                </label>
                <input type="hidden" name="availability_note" value={typeof body.availability_note === "string" ? body.availability_note : ""} />
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Sort order</span>
                  <input name="sort_order" type="number" defaultValue={section.sort_order} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </label>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">
                  Save section
                </button>
              </form>
            </AdminCard>
          );
        })}
      </div>
    </AdminPage>
  );
}
