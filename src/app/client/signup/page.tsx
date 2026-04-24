"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { PasswordStrength } from "@/components/summer/PasswordStrength";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { clientSignupAction } from "@/server/summer/client-actions";

function SignupForm() {
  const [password, setPassword] = useState("");
  const search = useSearchParams();
  const error = search?.get("error") ?? null;

  return (
    <Container size="sm" className="px-0 md:px-0">
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-[color:var(--bronze-500)]" aria-hidden="true" />
        <Eyebrow variant="mono" tone="bronze">
          Client · Create account
        </Eyebrow>
      </div>
      <h1 className="font-editorial mt-6 text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-[4.5rem]">
        Begin the work.
      </h1>
      <p className="mt-6 max-w-md font-editorial-italic text-lg leading-[1.55] text-[color:var(--ink-500)]">
        One account — every subscription, live class, and downloadable guide attached to it.
      </p>

      <form action={clientSignupAction} className="mt-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-name" className="eyebrow eyebrow-bronze">
            Full name
          </label>
          <div className="flex items-center border-b border-[color:var(--ink-900)]/15 pb-2 transition focus-within:border-[color:var(--bronze-500)]">
            <input
              id="signup-name"
              name="full_name"
              type="text"
              autoComplete="name"
              className="min-h-10 w-full bg-transparent text-base placeholder:text-[color:var(--ink-300)] focus:outline-none"
              placeholder="Your name"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-email" className="eyebrow eyebrow-bronze">
            Email
          </label>
          <div className="flex items-center border-b border-[color:var(--ink-900)]/15 pb-2 transition focus-within:border-[color:var(--bronze-500)]">
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              className="min-h-10 w-full bg-transparent text-base placeholder:text-[color:var(--ink-300)] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-password" className="eyebrow eyebrow-bronze">
            Password
          </label>
          <div className="flex items-center border-b border-[color:var(--ink-900)]/15 pb-2 transition focus-within:border-[color:var(--bronze-500)]">
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-10 w-full bg-transparent text-base placeholder:text-[color:var(--ink-300)] focus:outline-none"
              placeholder="At least 8 characters"
            />
          </div>
          <PasswordStrength value={password} />
        </div>

        {error && (
          <p className="font-editorial-italic text-[15px] text-[color:var(--danger-700)]">{error}</p>
        )}

        <button
          type="submit"
          className="press-effect focus-ring mt-4 inline-flex min-h-12 w-full items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
        >
          Create account
        </button>
      </form>

      <p className="mt-8 font-editorial-italic text-[15px] text-[color:var(--ink-500)]">
        Already have one?{" "}
        <Link href="/client/login" className="accent-underline text-[color:var(--ink-900)]">
          Sign in
        </Link>
        .
      </p>
    </Container>
  );
}

export default function ClientSignupPage() {
  return (
    <main className="min-h-[100svh] bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      <div className="grid min-h-[100svh] lg:grid-cols-2">
        {/* Editorial portrait */}
        <div className="relative hidden overflow-hidden bg-[color:var(--ink-900)] lg:block">
          <Image
            src="/images/summer/refined/summer-splits-venice-portrait.png"
            alt="Summer Loffler in a full split on parallel bars."
            fill
            priority
            sizes="50vw"
            className="object-cover grayscale-[10%] hero-ken-burns"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.55)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <Eyebrow variant="mono" tone="light">
              Members Only · Class Library · Guides · Messaging
            </Eyebrow>
            <p className="font-editorial-italic mt-5 max-w-md text-2xl leading-[1.25] text-white/95 md:text-3xl">
              One account for every subscription, live session, and guide.
            </p>
          </div>
        </div>

        {/* Form */}
        <div
          className="flex items-center px-6 py-16 md:px-10"
          style={{ paddingTop: "calc(7rem + env(safe-area-inset-top))" }}
        >
          <Suspense fallback={null}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
