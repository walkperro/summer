import type { Metadata } from "next";
import Link from "next/link";

import { clientSignupAction } from "@/server/summer/client-actions";

export const metadata: Metadata = {
  title: "Create your client account",
  description: "Create your Summer Loffler client account — subscriptions, class access, and downloads in one place.",
  robots: { index: false, follow: false },
};

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function ClientSignupPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const error = typeof params?.error === "string" ? params.error : null;

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center bg-[#f6f1ea] px-6 pt-28 pb-12 md:px-10">
      <div className="w-full max-w-md">
        <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">Client</p>
        <h1 className="font-editorial mt-3 text-4xl leading-none tracking-[-0.01em] md:text-5xl">Create account</h1>
        <p className="mt-3 text-sm text-[#5f5650]">
          One account — every subscription, live class, and downloadable guide attached to it.
        </p>

        <form action={clientSignupAction} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#7a6f67]">Full name</span>
            <input
              name="full_name"
              type="text"
              autoComplete="name"
              className="min-h-12 w-full border border-black/14 bg-white px-4 text-sm outline-none transition focus:border-[#a8896b]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#7a6f67]">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="min-h-12 w-full border border-black/14 bg-white px-4 text-sm outline-none transition focus:border-[#a8896b]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#7a6f67]">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="min-h-12 w-full border border-black/14 bg-white px-4 text-sm outline-none transition focus:border-[#a8896b]"
            />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center border border-[#1d1814] bg-[#191512] text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-[#5f5650]">
          Already signed up?{" "}
          <Link href="/client/login" className="accent-underline text-[#181512]">
            Sign in
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
