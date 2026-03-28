import { SectionHeading } from "@/components/summer/SectionHeading";
import { offers as defaultOffers } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

type OfferItem = {
  id?: string;
  title: string;
  subtitle?: string | null;
  description: string;
  detail: string;
  cta: string;
  href?: string | null;
  badge?: string | null;
  featured?: boolean;
};

export function Offers({
  intro,
  offers = defaultOffers.map((offer) => ({ ...offer, href: "#contact", badge: offer.featured ? "Most Exclusive" : null })),
}: {
  intro: SummerPublicSection;
  offers?: OfferItem[];
}) {
  return (
    <section id="services" className="border-y border-black/6 bg-[#f1ebe3] px-6 py-20 sm:py-24 md:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={intro.eyebrow} title={intro.heading} description={intro.subheading} />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className={`flex h-full flex-col justify-between border px-6 py-7 shadow-[0_24px_50px_rgba(0,0,0,0.04)] ${
                offer.featured ? "border-[#1d1814] bg-[#191512] text-white" : "border-black/8 bg-[#fbf7f2] text-[#181512]"
              }`}
            >
              <div>
                <p className={`text-[11px] uppercase tracking-[0.3em] ${offer.featured ? "text-white/62" : "text-[#8a7d72]"}`}>
                  {offer.badge || (offer.featured ? "Most Exclusive" : "Service")}
                </p>
                <h3 className={`font-editorial mt-5 text-3xl leading-none font-medium tracking-[-0.03em] ${offer.featured ? "text-white" : "text-[#181512]"}`}>
                  {offer.title}
                </h3>
                <p className={`mt-4 text-base leading-7 ${offer.featured ? "text-white/78" : "text-[#5f5650]"}`}>{offer.description}</p>
                <p className={`mt-5 text-sm leading-6 ${offer.featured ? "text-white/65" : "text-[#776d66]"}`}>{offer.detail}</p>
              </div>

              <div className="mt-10">
                <a
                  href={offer.href || "#contact"}
                  className={`inline-flex min-h-11 items-center justify-center border px-5 text-sm font-medium tracking-[0.03em] transition ${
                    offer.featured
                      ? "border-[#e7ddd1] bg-[#f4ece2] text-[#181512] hover:bg-white"
                      : "border-black/12 bg-white text-[#181512] hover:bg-[#f3ede5]"
                  }`}
                >
                  {offer.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
