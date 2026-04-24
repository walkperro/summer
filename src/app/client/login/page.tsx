import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { clientLoginAction } from "@/server/summer/client-actions";

export const metadata: Metadata = {
  title: "Client sign-in",
  description: "Sign in to your Summer Loffler client account.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientLoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const error = typeof params?.error === "string" ? params.error : null;

  return (
    <main className="min-h-[100svh] bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      <div className="grid min-h-[100svh] lg:grid-cols-2">
        {/* Editorial portrait (desktop only) */}
        <div className="relative hidden overflow-hidden bg-[color:var(--ink-900)] lg:block">
          <Image
            src="/images/summer/refined/summer-mat-portrait-about.png"
            alt="Summer Loffler in a close, composed portrait."
            fill
            priority
            sizes="50vw"
            className="object-cover object-[48%_28%] grayscale-[10%] hero-ken-burns"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.5)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <Eyebrow variant="mono" tone="light">
              Private Studio · Members Only
            </Eyebrow>
            <p className="font-editorial-italic mt-5 max-w-md text-2xl leading-[1.25] text-white/95 md:text-3xl">
              The work is quiet. The progress is specific. Welcome back.
            </p>
          </div>
        </div>

        {/* Form */}
        <div
          className="flex items-center px-6 py-16 md:px-10"
          style={{ paddingTop: "calc(7rem + env(safe-area-inset-top))" }}
        >
          <Container size="sm" className="px-0 md:px-0">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--bronze-500)]" aria-hidden="true" />
              <Eyebrow variant="mono" tone="bronze">
                Client · Sign in
              </Eyebrow>
            </div>
            <h1 className="font-editorial mt-6 text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-[4.5rem]">
              Welcome back.
            </h1>
            <p className="mt-6 max-w-md font-editorial-italic text-lg leading-[1.55] text-[color:var(--ink-500)]">
              Your subscriptions, live-class links, and downloads live behind this door.
            </p>

            <form action={clientLoginAction} className="mt-10 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="login-email" className="eyebrow eyebrow-bronze">
                  Email
                </label>
                <div className="flex items-center border-b border-[color:var(--ink-900)]/15 pb-2 transition focus-within:border-[color:var(--bronze-500)]">
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    className="min-h-10 w-full bg-transparent text-base text-[color:var(--ink-900)] placeholder:text-[color:var(--ink-300)] focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="login-password" className="eyebrow eyebrow-bronze">
                  Password
                </label>
                <div className="flex items-center border-b border-[color:var(--ink-900)]/15 pb-2 transition focus-within:border-[color:var(--bronze-500)]">
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="min-h-10 w-full bg-transparent text-base text-[color:var(--ink-900)] placeholder:text-[color:var(--ink-300)] focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="font-editorial-italic text-[15px] text-[color:var(--danger-700)]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="press-effect focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
              >
                Sign in
              </button>
            </form>

            <p className="mt-8 font-editorial-italic text-[15px] text-[color:var(--ink-500)]">
              New here?{" "}
              <Link href="/client/signup" className="accent-underline text-[color:var(--ink-900)]">
                Create your account
              </Link>
              .
            </p>
          </Container>
        </div>
      </div>
    </main>
  );
}
