import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Summer Loffler — terms of service.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <main className="bg-[#f6f1ea] text-[#181512]">
      <section className="px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">Legal</p>
          <h1 className="font-editorial mt-3 text-4xl leading-[1.05] tracking-[-0.01em] md:text-5xl">Terms of Service</h1>
          <div className="prose prose-neutral mt-10 max-w-none text-sm leading-relaxed text-[#3a322c] md:text-base">
            <p>
              Welcome to Summer Loffler. These terms govern your use of this site, subscriptions, and one-time
              digital products. By using the site or making a purchase, you agree to these terms.
            </p>
            <h2 className="font-editorial mt-8 text-2xl">Subscriptions</h2>
            <p>
              Subscriptions renew automatically each billing period until canceled. You can cancel anytime from
              your client dashboard or by emailing hello@summerloffler.com. Access remains active until the end
              of the current billing period.
            </p>
            <h2 className="font-editorial mt-8 text-2xl">Digital products</h2>
            <p>
              Digital products (guides, meal plans) are delivered immediately on checkout. Because of their nature,
              one-time purchases are non-refundable except where required by law. If something went wrong, write
              to us within 7 days and we will make it right.
            </p>
            <h2 className="font-editorial mt-8 text-2xl">Health &amp; safety</h2>
            <p>
              Training programs are educational. They are not a substitute for medical advice. Consult a qualified
              professional before starting any exercise or nutrition program, especially if you have injuries or
              medical conditions.
            </p>
            <h2 className="font-editorial mt-8 text-2xl">Intellectual property</h2>
            <p>
              All content is owned by Summer Loffler or licensed from the respective owners. Do not redistribute,
              resell, or share purchased materials.
            </p>
            <h2 className="font-editorial mt-8 text-2xl">Contact</h2>
            <p>Questions: hello@summerloffler.com.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
