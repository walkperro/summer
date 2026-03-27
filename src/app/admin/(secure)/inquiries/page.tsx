import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";

function matchesFilters(
  value: { inquiry_type: string; status: string; full_name: string | null; email: string | null },
  filters: { type?: string; status?: string; q?: string },
) {
  const query = filters.q?.toLowerCase();
  const name = value.full_name?.toLowerCase() || "";
  const email = value.email?.toLowerCase() || "";

  if (filters.type && filters.type !== "all" && value.inquiry_type !== filters.type) {
    return false;
  }

  if (filters.status && filters.status !== "all" && value.status !== filters.status) {
    return false;
  }

  if (query && !name.includes(query) && !email.includes(query)) {
    return false;
  }

  return true;
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const type = typeof params?.type === "string" ? params.type : "all";
  const status = typeof params?.status === "string" ? params.status : "all";
  const q = typeof params?.q === "string" ? params.q : "";
  const { inquiries } = await getSummerAdminCollections();
  const filtered = inquiries.filter((inquiry) => matchesFilters(inquiry, { type, status, q }));

  return (
    <AdminPage title="Inquiries" description="Track leads from the public site, filter them by type or status, and open each record for notes and status updates." result={result}>
      <AdminCard>
        <form className="grid gap-4 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Search by name or email" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35 md:col-span-2" />
          <select name="type" defaultValue={type} className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
            <option value="all">All inquiry types</option>
            <option value="Private Training">Private Training</option>
            <option value="Online Coaching">Online Coaching</option>
            <option value="Brand / Campaign Booking">Brand / Campaign Booking</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
          <select name="status" defaultValue={status} className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="booked">Booked</option>
            <option value="archived">Archived</option>
          </select>
          <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f] md:col-span-4 md:w-max">
            Apply filters
          </button>
        </form>
      </AdminCard>

      <AdminCard>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">
              <tr>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Created</th>
                <th className="pb-3">Open</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inquiry) => (
                <tr key={inquiry.id} className="border-t border-black/8">
                  <td className="py-4 pr-4">
                    <p className="font-medium">{inquiry.full_name || inquiry.email || "Unnamed inquiry"}</p>
                    <p className="mt-1 text-[#5f5650]">{inquiry.email || "No email"}</p>
                  </td>
                  <td className="py-4 pr-4">{inquiry.inquiry_type}</td>
                  <td className="py-4 pr-4">{inquiry.status}</td>
                  <td className="py-4 pr-4">{new Date(inquiry.created_at).toLocaleString()}</td>
                  <td className="py-4">
                    <Link href={`/admin/inquiries/${inquiry.id}`} className="text-[#181512] underline-offset-4 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </AdminPage>
  );
}
