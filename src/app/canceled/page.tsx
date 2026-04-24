import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout canceled",
  description: "Your checkout was canceled.",
  robots: { index: false, follow: false },
};

export default function CanceledPage() {
  return (
    <main className="bg-[#f6f1ea] text-[#181512]">
      <section className="flex min-h-[60vh] items-center px-6 pt-32 md:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">No charge</p>
          <h1 className="font-editorial mt-4 text-balance text-4xl leading-[1.05] tracking-[-0.01em] md:text-6xl">
            Checkout canceled.
          </h1>
          <p className="mt-5 max-w-xl text-base text-[#3a322c] md:text-lg">
            Nothing was charged. If you want to talk to Summer before committing, use the inquiry form on the home page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/classes"
              className="inline-flex min-h-12 items-center justify-center border border-[#1d1814] bg-[#191512] px-6 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
            >
              Return to classes
            </Link>
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center justify-center border border-black/18 px-6 text-[11px] uppercase tracking-[0.28em] transition hover:border-[#a8896b] hover:text-[#a8896b]"
            >
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
