import { AdminCard } from "@/components/admin/AdminCard";
import { AdminImage } from "@/components/admin/AdminImage";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";
import { saveHeroItemAction } from "@/server/summer/admin-actions";

export default async function AdminHeroPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const { heroItems, mediaAssets } = await getSummerAdminCollections();
  const heroAssets = mediaAssets.filter((asset) => asset.category === "hero" || asset.section_key === "hero");
  const byId = new Map(mediaAssets.map((asset) => [asset.id, asset]));

  return (
    <AdminPage title="Hero" description="Select and order desktop/mobile hero pairs for the public homepage rotation." result={result}>
      <div className="grid gap-6 xl:grid-cols-2">
        {heroItems.map((item) => {
          const desktop = item.desktop_media_asset_id ? byId.get(item.desktop_media_asset_id) : null;
          const mobile = item.mobile_media_asset_id ? byId.get(item.mobile_media_asset_id) : null;

          return (
            <AdminCard key={item.id}>
              <form action={saveHeroItemAction} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Desktop preview</p>
                    <div className="relative aspect-[16/9] overflow-hidden border border-black/8 bg-[#e8ddd0]">
                      {desktop ? <AdminImage src={desktop.public_url || desktop.file_path} alt={desktop.alt_text || desktop.title || "Desktop hero"} fill sizes="300px" className="object-cover" /> : null}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Mobile preview</p>
                    <div className="relative mx-auto aspect-[4/5] max-w-[180px] overflow-hidden border border-black/8 bg-[#e8ddd0]">
                      {mobile ? <AdminImage src={mobile.public_url || mobile.file_path} alt={mobile.alt_text || mobile.title || "Mobile hero"} fill sizes="180px" className="object-cover" /> : null}
                    </div>
                  </div>
                </div>
                <input name="title" defaultValue={item.title || ""} placeholder="Title" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                <div className="grid gap-4 md:grid-cols-2">
                  <select name="desktop_media_asset_id" defaultValue={item.desktop_media_asset_id || ""} className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
                    <option value="">Select desktop asset</option>
                    {heroAssets.map((asset) => (
                      <option key={asset.id} value={asset.id}>{asset.title || asset.slug}</option>
                    ))}
                  </select>
                  <select name="mobile_media_asset_id" defaultValue={item.mobile_media_asset_id || ""} className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
                    <option value="">Select mobile asset</option>
                    {heroAssets.map((asset) => (
                      <option key={asset.id} value={asset.id}>{asset.title || asset.slug}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#5f5650]">
                  <label className="flex items-center gap-2"><input type="checkbox" name="is_visible" defaultChecked={item.is_visible} /> Visible</label>
                  <input name="sort_order" type="number" defaultValue={item.sort_order} className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </div>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">Save hero item</button>
              </form>
            </AdminCard>
          );
        })}

        <AdminCard>
          <h2 className="font-editorial text-3xl leading-none">Add hero pair</h2>
          <form action={saveHeroItemAction} className="mt-5 space-y-4">
            <input name="title" placeholder="Title" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
            <select name="desktop_media_asset_id" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
              <option value="">Select desktop asset</option>
              {heroAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.title || asset.slug}</option>
              ))}
            </select>
            <select name="mobile_media_asset_id" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
              <option value="">Select mobile asset</option>
              {heroAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.title || asset.slug}</option>
              ))}
            </select>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">Create hero item</button>
          </form>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
