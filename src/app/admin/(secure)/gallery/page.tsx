import { AdminCard } from "@/components/admin/AdminCard";
import { AdminImage } from "@/components/admin/AdminImage";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";
import { saveGalleryItemAction } from "@/server/summer/admin-actions";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const { galleryItems, mediaAssets } = await getSummerAdminCollections();
  const galleryAssets = mediaAssets.filter((asset) => asset.category === "gallery" || asset.section_key === "gallery");
  const byId = new Map(mediaAssets.map((asset) => [asset.id, asset]));

  return (
    <AdminPage title="Gallery" description="Pick assets for the portfolio grid, tune their category and layout size, and control visibility/order." result={result}>
      <div className="grid gap-6 xl:grid-cols-2">
        {galleryItems.map((item) => {
          const asset = item.media_asset_id ? byId.get(item.media_asset_id) : null;

          return (
            <AdminCard key={item.id}>
              <form action={saveGalleryItemAction} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                <div className="relative aspect-[16/10] overflow-hidden border border-black/8 bg-[#e8ddd0]">
                  {asset ? <AdminImage src={asset.public_url || asset.file_path} alt={asset.alt_text || asset.title || "Gallery asset"} fill sizes="400px" className="object-cover" /> : null}
                </div>
                <select name="media_asset_id" defaultValue={item.media_asset_id || ""} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
                  <option value="">Select asset</option>
                  {galleryAssets.map((option) => (
                    <option key={option.id} value={option.id}>{option.title || option.slug}</option>
                  ))}
                </select>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="title" defaultValue={item.title || ""} placeholder="Title" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                  <input name="category" defaultValue={item.category || ""} placeholder="Category" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <select name="layout_size" defaultValue={item.layout_size || "wide"} className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
                    <option value="wide">Wide</option>
                    <option value="portrait">Portrait</option>
                    <option value="feature">Feature</option>
                  </select>
                  <input name="sort_order" type="number" defaultValue={item.sort_order} className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                  <label className="flex items-center gap-2 text-sm text-[#5f5650]"><input type="checkbox" name="is_visible" defaultChecked={item.is_visible} /> Visible</label>
                </div>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">Save gallery item</button>
              </form>
            </AdminCard>
          );
        })}

        <AdminCard>
          <h2 className="font-editorial text-3xl leading-none">Add gallery item</h2>
          <form action={saveGalleryItemAction} className="mt-5 space-y-4">
            <select name="media_asset_id" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
              <option value="">Select asset</option>
              {galleryAssets.map((option) => (
                <option key={option.id} value={option.id}>{option.title || option.slug}</option>
              ))}
            </select>
            <input name="title" placeholder="Title" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
            <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">Create gallery item</button>
          </form>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
