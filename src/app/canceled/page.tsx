import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Checkout canceled",
  description: "Your checkout was canceled.",
  robots: { index: false, follow: false },
};

export default function CanceledPage() {
  return (
    <main className="relative min-h-[100svh] bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      <Container
        size="md"
        className="flex min-h-[100svh] flex-col justify-center py-24"
        style={{ paddingTop: "calc(8rem + env(safe-area-inset-top))" }}
      >
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-[color:var(--bronze-500)]" aria-hidden="true" />
          <Eyebrow variant="mono" tone="bronze">
            No charge · Nothing lost
          </Eyebrow>
        </div>
        <h1
          className="font-editorial mt-10 text-balance leading-[0.9] font-medium tracking-[-0.04em] text-[color:var(--ink-900)]"
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
        >
          Until next time.
        </h1>
        <p className="mt-8 max-w-[50ch] font-editorial-italic text-xl leading-[1.55] text-[color:var(--ink-600)] md:text-2xl">
          Nothing was charged. If you&rsquo;d like to talk with Summer before committing, reach out
          through the inquiry form — no pressure, no templated replies.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/#contact"
            className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[color:var(--ink-700)]"
          >
            Start a conversation
          </Link>
          <Link
            href="/classes"
            className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)]/22 px-6 font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]"
          >
            Return to classes
          </Link>
        </div>
      </Container>
    </main>
  );
}
