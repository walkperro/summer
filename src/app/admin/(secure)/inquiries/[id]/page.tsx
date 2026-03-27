import { notFound } from "next/navigation";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerInquiryDetail } from "@/lib/summer/admin-data";
import { addInquiryNoteAction, updateInquiryStatusAction } from "@/server/summer/admin-actions";

export default async function AdminInquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const query = searchParams ? await searchParams : {};
  const result = typeof query?.result === "string" ? query.result : undefined;
  const { inquiry, notes } = await getSummerInquiryDetail(resolvedParams.id);

  if (!inquiry) {
    notFound();
  }

  return (
    <AdminPage title={inquiry.full_name || inquiry.email || "Inquiry detail"} description="Review full inquiry information, update status, and add internal notes." result={result}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <AdminCard>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Inquiry type</p>
              <p className="mt-2 text-lg font-medium">{inquiry.inquiry_type}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Status</p>
              <p className="mt-2 text-lg font-medium">{inquiry.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Email</p>
              <p className="mt-2 text-lg font-medium">{inquiry.email || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Phone</p>
              <p className="mt-2 text-lg font-medium">{inquiry.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Instagram</p>
              <p className="mt-2 text-lg font-medium">{inquiry.instagram_handle || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Created</p>
              <p className="mt-2 text-lg font-medium">{new Date(inquiry.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-8 space-y-6 border-t border-black/8 pt-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Goals</p>
              <p className="mt-2 text-sm leading-7 text-[#433c37]">{inquiry.goals || "No goals submitted."}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#7a6f67]">Message</p>
              <p className="mt-2 text-sm leading-7 text-[#433c37] whitespace-pre-wrap">{inquiry.message || "No message submitted."}</p>
            </div>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard>
            <h2 className="font-editorial text-3xl leading-none">Status</h2>
            <form action={updateInquiryStatusAction} className="mt-5 space-y-4">
              <input type="hidden" name="inquiry_id" value={inquiry.id} />
              <select name="status" defaultValue={inquiry.status} className="min-h-11 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="booked">Booked</option>
                <option value="archived">Archived</option>
              </select>
              <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">Update status</button>
            </form>
          </AdminCard>

          <AdminCard>
            <h2 className="font-editorial text-3xl leading-none">Internal notes</h2>
            <div className="mt-5 space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
                  <p className="text-sm leading-7 text-[#433c37] whitespace-pre-wrap">{note.body}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{note.author_email || "Admin"} / {new Date(note.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <form action={addInquiryNoteAction} className="mt-6 space-y-4 border-t border-black/8 pt-6">
              <input type="hidden" name="inquiry_id" value={inquiry.id} />
              <textarea name="body" rows={5} placeholder="Add an internal note" className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35" />
              <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f]">Add note</button>
            </form>
          </AdminCard>
        </div>
      </div>
    </AdminPage>
  );
}
