import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome in",
  description: "Your checkout is confirmed.",
  robots: { index: false, follow: false },
};

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function SuccessPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const type = typeof params?.type === "string" ? params.type : null;

  return (
    <main className="bg-[#f6f1ea] text-[#181512]">
      <section className="flex min-h-[72vh] items-center px-6 pt-32 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">You&rsquo;re in</p>
          <h1 className="font-editorial mt-4 text-balance text-5xl leading-[1.02] tracking-[-0.01em] md:text-7xl">
            {type === "product" ? "Your guide is on its way." : "Welcome to the program."}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[#3a322c] md:text-lg">
            {type === "product"
              ? "A receipt is in your inbox. Your download will appear in your client dashboard within a minute."
              : "Your subscription is active. You have full access to the class library, plus everything your tier includes."}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/client"
              className="inline-flex min-h-12 items-center justify-center border border-[#1d1814] bg-[#191512] px-6 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-[#2a241f]"
            >
              Go to my account
            </Link>
            <Link
              href="/classes"
              className="inline-flex min-h-12 items-center justify-center border border-black/18 px-6 text-[11px] uppercase tracking-[0.28em] transition hover:border-[#a8896b] hover:text-[#a8896b]"
            >
              Browse classes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
