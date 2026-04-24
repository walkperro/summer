import { redirect } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
    <main className="flex min-h-screen items-center bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      <Container size="md" className="py-16">
        <div className="mx-auto w-full max-w-md border border-[color:var(--bronze-300)] bg-[color:var(--paper-50)] p-8 sm:p-10">
          <span className="font-editorial text-3xl leading-[0.95] tracking-[-0.02em]">
            Summer Loffler
          </span>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-6 bg-[color:var(--bronze-500)]" aria-hidden="true" />
            <Eyebrow variant="mono" tone="bronze">
              Admin · Protected
            </Eyebrow>
          </div>
          <h1 className="font-editorial mt-6 text-5xl leading-[0.95] tracking-[-0.035em]">
            Protected access.
          </h1>
          <p className="mt-5 text-[15px] leading-[1.7] text-[color:var(--ink-500)]">
            Sign in with a Supabase account allowed in{" "}
            <code className="rounded bg-[color:var(--paper-200)] px-1.5 py-0.5 font-mono-editorial text-[12px]">
              summer.admin_users
            </code>
            .
          </p>

          {!configured && (
            <div className="mt-6 border border-[color:var(--bronze-400)] bg-[color:var(--bronze-100)] p-4 font-editorial-italic text-[14px] leading-[1.55] text-[color:var(--ink-700)]">
              Supabase admin env vars are missing. Configure them before using{" "}
              <code className="font-mono-editorial">/admin</code>.
            </div>
          )}

          {error && (
            <div className="mt-6 border border-[color:var(--danger-700)]/30 bg-[color:var(--danger-50)] p-4 font-editorial-italic text-[14px] leading-[1.55] text-[color:var(--danger-700)]">
              {error}
            </div>
          )}

          <form action={adminLoginAction} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className="eyebrow eyebrow-bronze">
                Email
              </label>
              <div className="flex items-center border-b border-[color:var(--ink-900)]/15 pb-2 transition focus-within:border-[color:var(--bronze-500)]">
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="min-h-10 w-full bg-transparent text-base focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="eyebrow eyebrow-bronze">
                Password
              </label>
              <div className="flex items-center border-b border-[color:var(--ink-900)]/15 pb-2 transition focus-within:border-[color:var(--bronze-500)]">
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="min-h-10 w-full bg-transparent text-base focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!configured}
              className="press-effect focus-ring mt-3 inline-flex min-h-12 w-full items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition enabled:hover:bg-[color:var(--ink-700)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              Sign in
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}
