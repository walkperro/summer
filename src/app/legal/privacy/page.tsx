import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Summer Loffler — privacy policy.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#f6f1ea] text-[#181512]">
      <section className="px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">Legal</p>
          <h1 className="font-editorial mt-3 text-4xl leading-[1.05] tracking-[-0.01em] md:text-5xl">Privacy Policy</h1>
          <div className="prose prose-neutral mt-10 max-w-none text-sm leading-relaxed text-[#3a322c] md:text-base">
            <p>
              We collect the minimum we need to serve you: your name, email, and any details you share on the
              inquiry form. Payment details are handled by Stripe — we never see your full card.
            </p>
            <h2 className="font-editorial mt-8 text-2xl">What we store</h2>
            <ul>
              <li>Inquiry details (name, email, message, optional phone/instagram/goals).</li>
              <li>Client account info if you sign up.</li>
              <li>Subscription and purchase records.</li>
              <li>Basic analytics (page views, referrer) to make the site better.</li>
            </ul>
            <h2 className="font-editorial mt-8 text-2xl">What we don&rsquo;t</h2>
            <ul>
              <li>Credit cards or bank details.</li>
              <li>Sell data to third parties.</li>
              <li>Track you across other sites.</li>
            </ul>
            <h2 className="font-editorial mt-8 text-2xl">Your rights</h2>
            <p>
              Write to hello@summerloffler.com to access, correct, or delete your data. We&rsquo;ll respond within
              30 days.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
