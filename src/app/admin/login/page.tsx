import { redirect } from "next/navigation";

import { hasSummerSupabaseAdminConfig } from "@/lib/summer/supabase";
import { getSummerAdminSession } from "@/lib/summer/admin-auth";
import { adminLoginAction } from "@/server/summer/admin-actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const session = await getSummerAdminSession();

  if (session) {
    redirect("/admin");
  }

  const error = typeof params?.error === "string" ? params.error : null;
  const configured = hasSummerSupabaseAdminConfig();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea] px-4 py-10 text-[#181512]">
      <div className="w-full max-w-md border border-black/8 bg-[#fbf7f2] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.06)] sm:p-8">
        <p className="font-editorial text-4xl leading-none tracking-[0.04em]">Summer Loffler</p>
        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[#7a6f67]">Admin Login</p>
        <h1 className="font-editorial mt-6 text-4xl leading-none tracking-[-0.03em]">Protected access.</h1>
        <p className="mt-4 text-sm leading-6 text-[#5f5650]">
          Sign in with a Supabase account that is allowed in `summer.admin_users`.
        </p>

        {!configured ? (
          <div className="mt-6 border border-[#a66d3d]/20 bg-[#fff4e8] p-4 text-sm leading-6 text-[#7b4c1f]">
            Supabase admin env vars are missing. Configure them before using `/admin`.
          </div>
        ) : null}

        {error ? <div className="mt-6 border border-[#8a2b2b]/20 bg-[#fff1f1] p-4 text-sm leading-6 text-[#8a2b2b]">{error}</div> : null}

        <form action={adminLoginAction} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Email</span>
            <input name="email" type="email" required className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Password</span>
            <input name="password" type="password" required className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm outline-none focus:border-black/35" />
          </label>
          <button
            type="submit"
            disabled={!configured}
            className="inline-flex min-h-12 w-full items-center justify-center border border-[#1d1814] bg-[#191512] px-6 text-sm font-medium tracking-[0.03em] text-white transition enabled:hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-55"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
