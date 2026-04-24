import type { Metadata } from "next";

import { About } from "@/components/summer/About";
import { ClassesTeaser } from "@/components/summer/ClassesTeaser";
import { ContactCta } from "@/components/summer/ContactCta";
import { FaqAccordion } from "@/components/summer/FaqAccordion";
import { Gallery } from "@/components/summer/Gallery";
import { Hero } from "@/components/summer/Hero";
import { MobileCtaBar } from "@/components/summer/MobileCtaBar";
import { Offers } from "@/components/summer/Offers";
import { PlansTeaser } from "@/components/summer/PlansTeaser";
import { PullQuote } from "@/components/summer/PullQuote";
import { SignatureBreak } from "@/components/summer/SignatureBreak";
import { TestimonialsStrip } from "@/components/summer/TestimonialsStrip";
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
  const faqSchema = snapshot.faqItems.length
    ? [
        {
          "@type": "FAQPage",
          "@id": "/#faq",
          mainEntity: snapshot.faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        },
      ]
    : [];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "/#website",
        name: siteTitle,
        url: "/",
        description:
          "Private training, online coaching, classes, and digital guides with Summer Loffler in Los Angeles.",
      },
      {
        "@type": "Person",
        "@id": "/#person",
        name: siteTitle,
        url: "/",
        jobTitle: "Private Trainer, Fitness Coach, and Glutes Specialist",
        description:
          "Heavy-lifting and glutes specialist coaching private clients in Los Angeles and online.",
        homeLocation: { "@type": "City", name: "Los Angeles" },
        areaServed: [
          { "@type": "City", name: "Los Angeles" },
          { "@type": "City", name: "Playa Del Rey" },
          { "@type": "City", name: "Manhattan Beach" },
          { "@type": "City", name: "Venice" },
          { "@type": "City", name: "Santa Monica" },
          { "@type": "City", name: "Marina Del Rey" },
          { "@type": "City", name: "El Segundo" },
        ],
        knowsAbout: [
          "Private Training",
          "Online Coaching",
          "Personal Training",
          "Strength Training",
          "Heavy Lifting",
          "Glute-Focused Training",
          "Nutrition Guidance",
          "Meal Planning",
          "Fitness Subscriptions",
          "Editorial Fitness Portfolio",
        ],
        sameAs: snapshot.instagramUrl ? [snapshot.instagramUrl] : undefined,
      },
      {
        "@type": "LocalBusiness",
        "@id": "/#local-business",
        name: `${siteTitle} — Private Training`,
        url: "/",
        image: "/images/summer/accent/signature_16_9_aspect_ratio.jpg",
        priceRange: "$$$",
        telephone: undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Playa Del Rey",
          addressRegion: "CA",
          addressCountry: "US",
        },
        areaServed: [
          "Playa Del Rey",
          "Manhattan Beach",
          "Venice",
          "Santa Monica",
          "Marina Del Rey",
          "El Segundo",
          "Los Angeles",
        ],
        geo: { "@type": "GeoCoordinates", latitude: 33.9617, longitude: -118.4487 },
      },
      {
        "@type": "Service",
        "@id": "/#private-training",
        serviceType: "Private Training",
        provider: { "@id": "/#person" },
        areaServed: ["Playa Del Rey", "Manhattan Beach", "Los Angeles"],
        description:
          "Hands-on private training for clients who want Summer's eye on every rep — heavy lifting, glutes, nutrition.",
        offers: { "@type": "Offer", priceCurrency: "USD", price: 149, priceSpecification: "from $149 per session" },
      },
      {
        "@type": "Service",
        "@id": "/#online-coaching",
        serviceType: "Online Coaching",
        provider: { "@id": "/#person" },
        description:
          "Remote 1:1 programming and weekly adjustments — heavy lifting, glute-focused work, nutrition.",
        offers: { "@type": "Offer", priceCurrency: "USD", price: 349 },
      },
      {
        "@type": "Service",
        "@id": "/#online-classes",
        serviceType: "Online Class Subscription",
        provider: { "@id": "/#person" },
        description:
          "Subscribe to Summer's on-demand class library — heavy lifting, glutes, mobility, and live classes.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: 29,
          highPrice: 149,
          offerCount: snapshot.tiers.length,
        },
      },
      {
        "@type": "Service",
        "@id": "/#editorial-bookings",
        serviceType: "Refined Fitness Portfolio and Brand Bookings",
        provider: { "@id": "/#person" },
        areaServed: ["Los Angeles"],
        description: "Editorial and campaign work with a strong, directable on-camera presence.",
      },
      ...faqSchema,
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
      <ClassesTeaser
        eyebrow={snapshot.classesIntro.eyebrow}
        heading={snapshot.classesIntro.heading}
        subheading={snapshot.classesIntro.subheading}
        cta={{ label: "See Subscriptions", href: "/classes" }}
      />
      {snapshot.signature.isVisible ? (
        <PullQuote
          eyebrow={snapshot.signature.eyebrow || "Mindset"}
          quote={snapshot.signature.heading || "My summer body isn't a deadline."}
          attribution={snapshot.signature.subheading || "— Summer Loffler"}
        />
      ) : null}
      {snapshot.trainWithMe.section.isVisible ? (
        <TrainWithMe
          section={snapshot.trainWithMe.section}
          leadCard={snapshot.trainWithMe.leadCard}
          pillars={snapshot.trainWithMe.pillars}
          cards={snapshot.trainWithMe.cards}
        />
      ) : null}
      <PlansTeaser
        eyebrow={snapshot.plansIntro.eyebrow}
        heading={snapshot.plansIntro.heading}
        subheading={snapshot.plansIntro.subheading}
      />
      <SignatureBreak section={snapshot.galleryIntro} />
      {snapshot.galleryIntro.isVisible ? <Gallery intro={snapshot.galleryIntro} items={snapshot.galleryItems} /> : null}
      <TestimonialsStrip
        eyebrow={snapshot.testimonialsIntro.eyebrow}
        heading={snapshot.testimonialsIntro.heading}
        subheading={snapshot.testimonialsIntro.subheading}
        items={snapshot.testimonials}
      />
      <FaqAccordion
        eyebrow={snapshot.faqIntro.eyebrow}
        heading={snapshot.faqIntro.heading}
        subheading={snapshot.faqIntro.subheading}
        items={snapshot.faqItems}
      />
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
