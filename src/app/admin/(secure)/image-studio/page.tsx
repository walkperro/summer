import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminCard";
import { AdminImage } from "@/components/admin/AdminImage";
import { AdminPage } from "@/components/admin/AdminPage";
import { getSummerAdminCollections } from "@/lib/summer/admin-data";
import { approveImageOutputAction, saveImageOutputToMediaAction } from "@/server/summer/admin-actions";

export default async function AdminImageStudioPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const result = typeof params?.result === "string" ? params.result : undefined;
  const { imageJobs, imageOutputs } = await getSummerAdminCollections();

  return (
    <AdminPage
      title="Image Studio"
      description="The existing Summer generation and refinement workspace now lives inside admin. Recent jobs and approved outputs stay connected to the media library and public site sections."
      result={result}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Generate Campaign Images", "Use the existing prompt and reference workflow."],
          ["Enhance Original Reference", "Improve a reference before campaign generation."],
          ["Refine Final Images", "Run the final refinement stack and preserve camera logic."],
          ["Recent Jobs", `${imageJobs.length} tracked jobs`],
          ["Approved Outputs", `${imageOutputs.filter((item) => item.is_approved).length} approved outputs`],
        ].map(([title, body]) => (
          <AdminCard key={String(title)}>
            <p className="font-editorial text-2xl leading-none">{title}</p>
            <p className="mt-3 text-sm leading-6 text-[#5f5650]">{body}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-3xl leading-none">Studio workspace</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f5650]">
              This embeds the current `/review` workflow so generation, enhancement, and final refinement continue to run with the existing prompts, validators, and Blob strategy.
            </p>
          </div>
          <Link href="/review" target="_blank" className="inline-flex min-h-11 items-center justify-center border border-black/12 bg-white px-5 text-sm font-medium text-[#181512] transition hover:bg-[#efe7dd]">
            Open full studio
          </Link>
        </div>
        <div className="mt-6 overflow-hidden border border-black/8 bg-white">
          <iframe src="/review" title="Summer image studio" className="h-[78vh] w-full" />
        </div>
      </AdminCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <AdminCard>
          <h2 className="font-editorial text-3xl leading-none">Recent jobs</h2>
          <div className="mt-5 space-y-4">
            {imageJobs.map((job) => (
              <div key={job.id} className="border-t border-black/8 pt-4 first:border-t-0 first:pt-0">
                <p className="text-sm font-medium">{job.job_type}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{job.status}</p>
                <p className="mt-2 text-sm text-[#5f5650]">{new Date(job.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-editorial text-3xl leading-none">Approved outputs</h2>
          <div className="mt-5 space-y-6">
            {imageOutputs.map((output) => (
              <div key={output.id} className="grid gap-4 border-t border-black/8 pt-6 first:border-t-0 first:pt-0 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="relative aspect-[4/5] overflow-hidden border border-black/8 bg-[#e8ddd0]">
                  {output.public_url ? <AdminImage src={output.public_url} alt={output.title || "Generated output"} fill sizes="220px" className="object-cover" /> : null}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">{output.title || output.output_type || "Untitled output"}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#7a6f67]">{output.aspect_ratio || "Unknown ratio"} / {output.output_type || "output"}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {!output.is_approved ? (
                      <form action={approveImageOutputAction}>
                        <input type="hidden" name="output_id" value={output.id} />
                        <button type="submit" className="inline-flex min-h-10 items-center justify-center border border-black/12 bg-white px-4 text-sm font-medium text-[#181512] transition hover:bg-[#efe7dd]">Mark approved</button>
                      </form>
                    ) : null}
                  </div>
                  <form action={saveImageOutputToMediaAction} className="grid gap-3 lg:grid-cols-2">
                    <input type="hidden" name="output_id" value={output.id} />
                    <input name="title" defaultValue={output.title || ""} placeholder="Media title" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                    <input name="slug" placeholder="Slug" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                    <input name="category" placeholder="Category" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                    <input name="section_key" placeholder="Assign section: hero, gallery, about, train_with_me, contact, signature" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
                    <input name="alt_text" placeholder="Alt text" className="min-h-11 border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35 lg:col-span-2" />
                    <textarea name="tags" rows={3} placeholder="Tags, one per line" className="border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/35 lg:col-span-2" />
                    <button type="submit" className="inline-flex min-h-11 items-center justify-center border border-[#1d1814] bg-[#191512] px-5 text-sm font-medium text-white transition hover:bg-[#2a241f] lg:col-span-2">Save output to media library</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
}
