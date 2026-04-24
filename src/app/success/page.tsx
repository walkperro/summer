import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Welcome in",
  description: "Your checkout is confirmed.",
  robots: { index: false, follow: false },
};

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function SuccessPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const type = typeof params?.type === "string" ? params.type : null;

  const heading = type === "product" ? "Your guide is on its way." : "Welcome.";
  const subheading =
    type === "product"
      ? "A receipt is in your inbox. Your download will appear in your client dashboard within a minute."
      : "Your subscription is active. You have full access to the class library, plus everything your tier includes.";

  return (
    <main className="relative min-h-[100svh] bg-[color:var(--paper-50)] text-[color:var(--ink-900)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.05,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <Container
        size="md"
        className="relative flex min-h-[100svh] flex-col justify-center py-24"
        style={{ paddingTop: "calc(8rem + env(safe-area-inset-top))" }}
      >
        <div className="mask-wipe-in flex items-center gap-4">
          <span className="h-px w-12 bg-[color:var(--bronze-500)]" aria-hidden="true" />
          <Eyebrow variant="mono" tone="bronze">
            {type === "product" ? "Receipt · On its way" : "Member · Welcome in"}
          </Eyebrow>
          <span className="h-px w-12 bg-[color:var(--bronze-500)]" aria-hidden="true" />
        </div>
        <h1
          className="font-editorial mask-wipe-in mt-10 text-balance text-center leading-[0.88] font-medium tracking-[-0.045em] text-[color:var(--ink-950)]"
          style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}
        >
          {heading}
        </h1>
        <p className="mx-auto mt-10 max-w-[52ch] text-center font-editorial-italic text-xl leading-[1.5] text-[color:var(--ink-600)] md:text-2xl">
          {subheading}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/client"
            className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
          >
            Go to my account
          </Link>
          <Link
            href="/classes"
            className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)]/22 px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]"
          >
            Browse classes
          </Link>
        </div>
      </Container>
    </main>
  );
}
