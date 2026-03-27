import { AdminCard } from "@/components/admin/AdminCard";
import { AdminImage } from "@/components/admin/AdminImage";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";
import { updateMediaAssetAction, uploadMediaAssetAction } from "@/server/summer/admin-actions";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const { mediaAssets } = await getSummerAdminCollections();

  return (
    <AdminPage title="Media" description="Upload, inspect, categorize, approve, and re-order assets used across the public site and image studio." result={result}>
      <AdminCard>
        <h2 className="font-editorial text-3xl leading-none">Upload new media</h2>
        <form action={uploadMediaAssetAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <input name="title" placeholder="Title" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="slug" placeholder="Slug" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="category" placeholder="Category" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="section_key" placeholder="Section key" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="alt_text" placeholder="Alt text" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35 lg:col-span-2" />
          <textarea name="tags" rows={3} placeholder="Tags, one per line" className="border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35 lg:col-span-2" />
          <input name="file" type="file" accept="image/*" required className="min-h-11 border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35 lg:col-span-2" />
          <div className="flex flex-wrap gap-4 text-sm text-[#5f5650] lg:col-span-2">
            <label className="flex items-center gap-2"><input type="checkbox" name="is_approved" defaultChecked /> Approved</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="is_visible" defaultChecked /> Visible</label>
          </div>
          <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f] lg:col-span-2">
            Upload media asset
          </button>
        </form>
      </AdminCard>

      <div className="grid gap-6 xl:grid-cols-2">
        {mediaAssets.map((asset) => (
          <AdminCard key={asset.id}>
            <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="relative aspect-[4/5] overflow-hidden border border-black/8 bg-[#eadfd4]">
                <AdminImage src={asset.public_url || asset.file_path} alt={asset.alt_text || asset.title || "Media asset"} fill sizes="180px" className="object-cover" />
              </div>
              <form action={updateMediaAssetAction} className="space-y-3">
                <input type="hidden" name="id" value={asset.id} />
                <input name="title" defaultValue={asset.title || ""} placeholder="Title" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="category" defaultValue={asset.category || ""} placeholder="Category" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                  <input name="section_key" defaultValue={asset.section_key || ""} placeholder="Section" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                </div>
                <input name="alt_text" defaultValue={asset.alt_text || ""} placeholder="Alt text" className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                <textarea name="tags" rows={3} defaultValue={Array.isArray(asset.tags) ? asset.tags.join("\n") : ""} className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="sort_order" type="number" defaultValue={asset.sort_order} placeholder="Sort order" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                  <input readOnly value={asset.public_url || asset.file_path} className="min-h-11 border border-black/10 bg-[#f5efe7] px-4 text-sm text-[#5f5650]" />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-[#5f5650]">
                  <label className="flex items-center gap-2"><input type="checkbox" name="is_approved" defaultChecked={asset.is_approved} /> Approved</label>
                  <label className="flex items-center gap-2"><input type="checkbox" name="is_visible" defaultChecked={asset.is_visible} /> Visible</label>
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{asset.mime_type || "Unknown type"} / {asset.width || "?"}×{asset.height || "?"} / {asset.aspect_ratio || "Unknown ratio"}</p>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">
                  Save media
                </button>
              </form>
            </div>
          </AdminCard>
        ))}
      </div>
    </AdminPage>
  );
}
