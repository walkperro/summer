import type { Metadata } from "next";

import { About } from "@/components/summer/About";
import { ContactCta } from "@/components/summer/ContactCta";
import { Gallery } from "@/components/summer/Gallery";
import { Hero } from "@/components/summer/Hero";
import { MobileCtaBar } from "@/components/summer/MobileCtaBar";
import { Offers } from "@/components/summer/Offers";
import { SignatureBreak } from "@/components/summer/SignatureBreak";
import { TrainWithMe } from "@/components/summer/TrainWithMe";
import { getSummerPublicSnapshot } from "@/lib/summer/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const snapshot = await getSummerPublicSnapshot();
  const siteTitle = snapshot.siteTitle || "Summer Loffler";
  const title = `${siteTitle} | Private Training in Los Angeles`;
  const description =
    "Private training, online coaching, and refined fitness work in Los Angeles with Summer Loffler, serving Playa Del Rey, Manhattan Beach, and surrounding areas.";

  return {
    title,
    description,
    keywords: [
      "Summer Loffler",
      "private training in Los Angeles",
      "online coaching",
      "personal training",
      "strength training",
      "glute-focused training",
      "nutrition guidance",
      "fitness coaching",
      "refined fitness portfolio",
      "Playa Del Rey",
      "Manhattan Beach",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "/",
      images: [
        {
          url: "/images/summer/accent/signature_16_9_aspect_ratio.jpg",
          width: 1376,
          height: 768,
          alt: "Summer Loffler in a monochrome signature frame inside a refined training space.",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/summer/accent/signature_16_9_aspect_ratio.jpg"],
    },
  };
}

export default async function Home() {
  const snapshot = await getSummerPublicSnapshot();
  const siteTitle = snapshot.siteTitle || "Summer Loffler";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "/#website",
        name: siteTitle,
        url: "/",
        description:
          "Private training, online coaching, and refined fitness work with Summer Loffler in Los Angeles.",
      },
      {
        "@type": "Person",
        "@id": "/#person",
        name: siteTitle,
        url: "/",
        jobTitle: "Private Trainer and Fitness Coach",
        description:
          "Private trainer, online coach, and refined fitness talent based in Los Angeles.",
        homeLocation: {
          "@type": "City",
          name: "Los Angeles",
        },
        areaServed: [
          { "@type": "City", name: "Los Angeles" },
          { "@type": "City", name: "Playa Del Rey" },
          { "@type": "City", name: "Manhattan Beach" },
        ],
        knowsAbout: [
          "Private Training",
          "Online Coaching",
          "Personal Training",
          "Strength Training",
          "Glute-Focused Training",
          "Nutrition Guidance",
          "Fitness Coaching",
          "Refined Fitness Portfolio",
        ],
        sameAs: snapshot.instagramUrl ? [snapshot.instagramUrl] : undefined,
      },
      {
        "@type": "Service",
        "@id": "/#private-training",
        serviceType: "Private Training",
        provider: { "@id": "/#person" },
        areaServed: ["Los Angeles", "Playa Del Rey", "Manhattan Beach"],
        description:
          "Private training in Los Angeles for clients seeking serious coaching, strength training, and polished presentation.",
      },
      {
        "@type": "Service",
        "@id": "/#online-coaching",
        serviceType: "Online Coaching",
        provider: { "@id": "/#person" },
        description:
          "Online coaching with structured programming, strength training, glute-focused work, and nutrition guidance.",
      },
      {
        "@type": "Service",
        "@id": "/#editorial-bookings",
        serviceType: "Refined Fitness Portfolio and Brand Bookings",
        provider: { "@id": "/#person" },
        areaServed: ["Los Angeles"],
        description:
          "Refined fitness portfolio work and select campaign bookings with a polished, athletic point of view.",
      },
    ],
  };

  return (
    <main className="overflow-x-hidden bg-[#f6f1ea] text-[#181512]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero
        slides={snapshot.heroSlides}
        heading={snapshot.heroHeading}
        subheading={snapshot.heroSubheading}
        primaryCtaLabel={snapshot.primaryCtaLabel}
        primaryCtaHref={snapshot.primaryCtaHref}
        secondaryCtaLabel={snapshot.secondaryCtaLabel}
        secondaryCtaHref={snapshot.secondaryCtaHref}
      />
      {snapshot.about.section.isVisible ? <About section={snapshot.about.section} images={snapshot.about.images} points={snapshot.about.points} /> : null}
      {snapshot.offersIntro.isVisible ? <Offers intro={snapshot.offersIntro} offers={snapshot.offers} /> : null}
      {snapshot.trainWithMe.section.isVisible ? (
        <TrainWithMe
          section={snapshot.trainWithMe.section}
          leadCard={snapshot.trainWithMe.leadCard}
          pillars={snapshot.trainWithMe.pillars}
          cards={snapshot.trainWithMe.cards}
        />
      ) : null}
      {snapshot.signature.isVisible ? <SignatureBreak section={snapshot.signature} /> : null}
      {snapshot.galleryIntro.isVisible ? <Gallery intro={snapshot.galleryIntro} items={snapshot.galleryItems} /> : null}
      {snapshot.contact.isVisible ? (
        <ContactCta section={snapshot.contact} contactEmail={snapshot.contactEmail} instagramUrl={snapshot.instagramUrl} />
      ) : null}
      <footer className="border-t border-black/6 bg-[#f6f1ea] px-6 pb-28 pt-8 md:px-10 md:pb-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-editorial text-3xl leading-none tracking-[0.05em] text-[#181512]">Summer Loffler</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">Los Angeles / Playa Del Rey / Manhattan Beach</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-[#5f5650]">
            <a href="#about" className="transition hover:text-[#181512]">
              About
            </a>
            <a href="#training" className="transition hover:text-[#181512]">
              Training
            </a>
            <a href="#portfolio" className="transition hover:text-[#181512]">
              Portfolio
            </a>
            <a href="#contact" className="transition hover:text-[#181512]">
              Inquiry
            </a>
          </div>
        </div>
      </footer>
      <MobileCtaBar />
    </main>
  );
}
