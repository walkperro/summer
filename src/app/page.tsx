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

export const metadata: Metadata = {
  title: "Editorial Fitness & Private Training",
  description:
    "A premium editorial homepage for Summer, blending model presence, real training credibility, and private coaching inquiries.",
  keywords: [
    "Summer",
    "private training",
    "online coaching",
    "editorial fitness",
    "brand campaign bookings",
    "fitness model",
  ],
  openGraph: {
    title: "Summer | Editorial Fitness & Private Training",
    description:
      "Editorial presence, serious training credibility, and premium private coaching availability.",
    images: [
      {
        url: "/images/summer/accent/signature_16_9_aspect_ratio.jpg",
        width: 1376,
        height: 768,
        alt: "Summer in a monochrome signature frame inside a refined training space.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summer | Editorial Fitness & Private Training",
    description:
      "A premium homepage for Summer with private training, coaching, and campaign booking inquiries.",
    images: ["/images/summer/accent/signature_16_9_aspect_ratio.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Summer",
  description:
    "Editorial fitness talent and private coach offering premium private training, online coaching, and brand campaign bookings.",
  knowsAbout: [
    "Private Training",
    "Online Coaching",
    "Editorial Fitness",
    "Campaign Bookings",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Private Training",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Online Coaching",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Brand / Campaign Bookings",
      },
    },
  ],
};

export default async function Home() {
  const snapshot = await getSummerPublicSnapshot();

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
      <MobileCtaBar />
    </main>
  );
}
