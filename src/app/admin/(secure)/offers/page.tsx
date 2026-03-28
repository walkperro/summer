import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";
import { deleteOfferAction, saveOfferAction } from "@/server/summer/admin-actions";

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const { offers } = await getSummerAdminCollections();

  return (
    <AdminPage title="Ways to Work Together" description="Manage the public service cards, their ordering, featured state, and CTA copy." result={result}>
      <div className="grid gap-6 xl:grid-cols-2">
        {offers.map((offer) => (
          <AdminCard key={offer.id}>
            <form action={saveOfferAction} className="space-y-4">
              <input type="hidden" name="id" value={offer.id} />
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Slug</span>
                <input name="slug" defaultValue={offer.slug} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Title</span>
                <input name="title" defaultValue={offer.title} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Subtitle</span>
                <input name="subtitle" defaultValue={offer.subtitle || ""} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Description</span>
                <textarea name="description" rows={4} defaultValue={offer.description || ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Bullets</span>
                <textarea name="bullets" rows={4} defaultValue={Array.isArray(offer.bullets) ? offer.bullets.join("\n") : ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">CTA label</span>
                  <input name="cta_label" defaultValue={offer.cta_label || ""} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">CTA href</span>
                  <input name="cta_href" defaultValue={offer.cta_href || "#contact"} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Badge</span>
                  <input name="badge" defaultValue={offer.badge || ""} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Sort order</span>
                  <input name="sort_order" type="number" defaultValue={offer.sort_order} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </label>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[#5f5650]">
                <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" defaultChecked={offer.is_featured} /> Featured</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="is_visible" defaultChecked={offer.is_visible} /> Visible</label>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">
                  Save offer
                </button>
                <button formAction={deleteOfferAction} className="inline-flex min-h-11 items-center justify-center border border-black/12 bg-white px-5 text-sm font-medium text-[#181512] transition hover:bg-[#efe7dd]">
                  Delete
                </button>
              </div>
            </form>
          </AdminCard>
        ))}

        <AdminCard>
          <h2 className="font-editorial text-3xl leading-none">Add offer</h2>
          <form action={saveOfferAction} className="mt-5 space-y-4">
            <input name="slug" placeholder="slug" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
            <input name="title" placeholder="Title" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
            <textarea name="description" rows={4} placeholder="Description" className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
            <textarea name="bullets" rows={4} placeholder="One bullet per line" className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
            <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">
              Create offer
            </button>
          </form>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
