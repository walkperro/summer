import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminImage } from "@/components/admin/AdminImage";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminDashboardData } from "@/lib/summer/admin-data";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const dashboard = await getSummerAdminDashboardData();

  return (
    <AdminPage
      title="Dashboard"
      description="A clean overview of inquiries, media, offers, and image tooling activity across the Summer system."
      result={result}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total inquiries", dashboard.totals.inquiries],
          ["New inquiries", dashboard.totals.newInquiries],
          ["Approved media", dashboard.totals.approvedMedia],
          ["Visible offers", dashboard.totals.visibleOffers],
          ["Recent image jobs", dashboard.totals.recentImageJobs],
        ].map(([label, value]) => (
          <AdminCard key={String(label)}>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{label}</p>
            <p className="mt-4 font-editorial text-5xl leading-none tracking-[-0.03em]">{value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-3xl leading-none">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-[#5f5650] underline-offset-4 hover:underline">
              Open inquiries
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {dashboard.latestInquiries.map((inquiry) => (
              <div key={inquiry.id} className="border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
                <p className="text-sm font-medium">{inquiry.full_name || inquiry.email || "Unnamed inquiry"}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{inquiry.inquiry_type}</p>
                <p className="mt-2 text-sm text-[#5f5650]">Status: {inquiry.status}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-3xl leading-none">Latest approved media</h2>
            <Link href="/admin/media" className="text-sm text-[#5f5650] underline-offset-4 hover:underline">
              Open media
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {dashboard.latestApprovedMedia.map((asset) => (
              <div key={asset.id}>
                <div className="relative aspect-[4/5] overflow-hidden border border-black/8 bg-[#e8ddd0]">
                  <AdminImage src={asset.public_url || asset.file_path} alt={asset.alt_text || asset.title || "Media asset"} fill sizes="200px" className="object-cover" />
                </div>
                <p className="mt-2 text-sm font-medium">{asset.title || asset.slug}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-3xl leading-none">Latest image outputs</h2>
            <Link href="/admin/image-studio" className="text-sm text-[#5f5650] underline-offset-4 hover:underline">
              Open studio
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {dashboard.latestImageOutputs.map((output) => (
              <div key={output.id} className="border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
                <p className="text-sm font-medium">{output.title || output.output_type || "Untitled output"}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{output.aspect_ratio || "Unknown ratio"}</p>
                <p className="mt-2 text-sm text-[#5f5650]">{output.is_approved ? "Approved" : "Pending approval"}</p>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
