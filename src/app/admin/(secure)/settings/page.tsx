import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";
import { saveSiteSettingsAction } from "@/server/summer/admin-actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const { siteSettings } = await getSummerAdminCollections();

  return (
    <AdminPage title="Settings" description="Manage global site title, contact settings, and top-level CTA copy." result={result}>
      <AdminCard>
        <form action={saveSiteSettingsAction} className="grid gap-4 lg:grid-cols-2">
          <input name="site_title" defaultValue={siteSettings?.site_title || "Summer Loffler"} placeholder="Site title" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="contact_email" defaultValue={siteSettings?.contact_email || ""} placeholder="Contact email" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="hero_heading" defaultValue={siteSettings?.hero_heading || ""} placeholder="Hero heading" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35 lg:col-span-2" />
          <textarea name="hero_subheading" rows={4} defaultValue={siteSettings?.hero_subheading || ""} placeholder="Hero subheading" className="border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35 lg:col-span-2" />
          <input name="primary_cta_label" defaultValue={siteSettings?.primary_cta_label || ""} placeholder="Primary CTA label" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="primary_cta_href" defaultValue={siteSettings?.primary_cta_href || "#contact"} placeholder="Primary CTA href" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="secondary_cta_label" defaultValue={siteSettings?.secondary_cta_label || ""} placeholder="Secondary CTA label" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="secondary_cta_href" defaultValue={siteSettings?.secondary_cta_href || "#portfolio"} placeholder="Secondary CTA href" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="instagram_url" defaultValue={siteSettings?.instagram_url || ""} placeholder="Instagram URL" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="training_cta_text" defaultValue={siteSettings?.training_cta_text || ""} placeholder="Training CTA text" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <input name="booking_cta_text" defaultValue={siteSettings?.booking_cta_text || ""} placeholder="Booking CTA text" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          <div className="lg:col-span-2">
            <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">Save settings</button>
          </div>
        </form>
      </AdminCard>
    </AdminPage>
  );
}
