import "server-only";

import {
  aboutImages,
  aboutPoints,
  galleryItems as defaultGalleryItems,
  heroSlides as defaultHeroSlides,
  offers as defaultOffers,
  trainingCards,
} from "@/components/summer/site-data";
import {
  hasSummerSupabaseAdminConfig,
  selectSummerRows,
  selectSummerSingle,
} from "@/lib/summer/supabase";
import type {
  SummerGalleryItem,
  SummerHeroItem,
  SummerMediaAsset,
  SummerOfferRecord,
  SummerSectionContent,
  SummerSiteSettings,
} from "@/lib/summer/types";

export type SummerPublicSection = {
  eyebrow: string;
  heading: string;
  subheading: string;
  body: Record<string, unknown>;
  meta: Record<string, unknown>;
  isVisible: boolean;
};

export type SummerPublicSnapshot = {
  siteTitle: string;
  heroHeading: string;
  heroSubheading: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  trainingCtaText: string;
  bookingCtaText: string;
  contactEmail: string | null;
  instagramUrl: string | null;
  heroSlides: typeof defaultHeroSlides;
  about: {
    section: SummerPublicSection;
    images: typeof aboutImages;
    points: string[];
  };
  offersIntro: SummerPublicSection;
  offers: Array<{
    id?: string;
    title: string;
    subtitle?: string | null;
    description: string;
    detail: string;
    cta: string;
    href?: string | null;
    badge?: string | null;
    featured?: boolean;
    visible?: boolean;
    bullets?: string[];
  }>;
  trainWithMe: {
    section: SummerPublicSection;
    leadCard: string;
    pillars: string[];
    cards: typeof trainingCards;
  };
  signature: SummerPublicSection;
  galleryIntro: SummerPublicSection;
  galleryItems: typeof defaultGalleryItems;
  contact: SummerPublicSection;
};

const DEFAULT_SECTIONS: Record<string, SummerPublicSection> = {
  about: {
    eyebrow: "About Summer Loffler",
    heading: "Grounded by hardship. Guided by discipline.",
    subheading:
      "Private training and coaching in Los Angeles, shaped by Atlanta roots, lived experience, and a clear respect for what real strength requires.",
    body: {
      paragraphs: [
        "Summer Loffler grew up in Atlanta before moving to Los Angeles, carrying with her a deep respect for resilience, discipline, and self-possession.",
        "Loss and hardship changed the way she saw herself and the world around her. Fitness became a form of grounding — not an escape, but a way to rebuild strength from the inside out.",
        "That experience shaped the way she coaches today. Her work blends private training, online coaching, strength training, glute-focused programming, and nutrition guidance with close attention to the person in front of her.",
        "Her mission is simple: help people become stronger physically and mentally, and carry that strength into every part of their lives.",
      ],
      points: aboutPoints,
    },
    meta: {},
    isVisible: true,
  },
  offers_intro: {
    eyebrow: "Ways to Work Together",
    heading: "Ways to Work Together",
    subheading:
      "Each service is built around focused attention, clear structure, and real results — whether you're training in person, working remotely, or booking for a campaign.",
    body: {},
    meta: {},
    isVisible: true,
  },
  train_with_me: {
    eyebrow: "Private Training / Online Coaching",
    heading: "Personal training and coaching built on strength, discipline, and clarity.",
    subheading:
      "For clients who want private training, online coaching, strength training, glute-focused programming, and nutrition guidance delivered with structure and real attention.",
    body: {
      pillars: [
        "Strength training coached closely.",
        "Glute-focused work where it serves the goal.",
        "Nutrition guidance and accountability that stay realistic.",
      ],
      lead_card:
        "Progress comes from disciplined, repeatable work. Each session is tailored, closely coached, and built to move you forward with clarity.",
    },
    meta: {},
    isVisible: true,
  },
  signature: {
    eyebrow: "Mindset",
    heading: "The body is capable. The mind decides.",
    subheading: "Real change starts in the mind. The body follows.",
    body: {},
    meta: {},
    isVisible: true,
  },
  gallery_intro: {
    eyebrow: "Gallery / Portfolio",
    heading: "Refined Fitness Portfolio",
    subheading:
      "A closer look at the work — performance, portraiture, and polished campaign imagery shaped by strength and presence.",
    body: {
      supporting_sentence:
        "Each image reflects a balance of athletic credibility, clean presentation, and editorial restraint.",
    },
    meta: {},
    isVisible: true,
  },
  contact_cta: {
    eyebrow: "Contact / Inquiry",
    heading: "Start the conversation.",
    subheading:
      "Share a few details about what you're looking for, and Summer will follow up with the best next step for private training, coaching, or bookings in Los Angeles, including Playa Del Rey, Manhattan Beach, and surrounding areas.",
    body: {
      availability_note:
        "Private training remains intentionally limited. Coaching and select brand bookings are reviewed with the same care.",
      location_signature: "Los Angeles / Playa Del Rey / Manhattan Beach",
    },
    meta: {},
    isVisible: true,
  },
};

function getDefaultSnapshot(): SummerPublicSnapshot {
  return {
    siteTitle: "Summer Loffler",
    heroHeading: "Private training with strength, discipline, and presence.",
    heroSubheading:
      "A refined approach to coaching for clients who want serious guidance, polished presentation, and lasting results on and off camera.",
    primaryCtaLabel: "Apply for Private Training",
    primaryCtaHref: "#contact",
    secondaryCtaLabel: "View Portfolio",
    secondaryCtaHref: "#portfolio",
    trainingCtaText: "Apply for Private Training",
    bookingCtaText: "Discuss a booking",
    contactEmail: null,
    instagramUrl: null,
    heroSlides: defaultHeroSlides,
    about: {
      section: DEFAULT_SECTIONS.about,
      images: aboutImages,
      points: aboutPoints,
    },
    offersIntro: DEFAULT_SECTIONS.offers_intro,
    offers: defaultOffers.map((offer) => ({
      title: offer.title,
      subtitle: null,
      description: offer.description,
      detail: offer.detail,
      cta: offer.cta,
      href: "#contact",
      badge: offer.featured ? "Most Exclusive" : null,
      featured: offer.featured,
      visible: true,
      bullets: [],
    })),
    trainWithMe: {
      section: DEFAULT_SECTIONS.train_with_me,
      leadCard: String(DEFAULT_SECTIONS.train_with_me.body.lead_card || ""),
      pillars: (DEFAULT_SECTIONS.train_with_me.body.pillars as string[]) || [],
      cards: trainingCards,
    },
    signature: DEFAULT_SECTIONS.signature,
    galleryIntro: DEFAULT_SECTIONS.gallery_intro,
    galleryItems: defaultGalleryItems,
    contact: DEFAULT_SECTIONS.contact_cta,
  };
}

function normalizeSection(row: SummerSectionContent | null, fallback: SummerPublicSection) {
  if (!row) {
    return fallback;
  }

  return {
    eyebrow: row.eyebrow || fallback.eyebrow,
    heading: row.heading || fallback.heading,
    subheading: row.subheading || fallback.subheading,
    body: row.body || fallback.body,
    meta: row.meta || fallback.meta,
    isVisible: row.is_visible,
  };
}

function assetUrl(asset: SummerMediaAsset | undefined) {
  return asset?.public_url || asset?.file_path || "";
}

function assetObjectPosition(asset: SummerMediaAsset | undefined, fallback: string) {
  const objectPosition = asset?.metadata?.objectPosition;
  return typeof objectPosition === "string" ? `object-[${objectPosition.replace(/ /g, "_")}]` : fallback;
}

function mapHeroSlides(heroItems: SummerHeroItem[], assets: SummerMediaAsset[]) {
  const byId = new Map(assets.map((asset) => [asset.id, asset]));

  const mapped = heroItems
    .filter((item) => item.is_visible)
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((item, index) => {
      const desktopAsset = item.desktop_media_asset_id ? byId.get(item.desktop_media_asset_id) : undefined;
      const mobileAsset = item.mobile_media_asset_id ? byId.get(item.mobile_media_asset_id) : undefined;

      if (!desktopAsset || !mobileAsset) {
        return null;
      }

      return {
        id: item.id,
        desktopSrc: assetUrl(desktopAsset),
        mobileSrc: assetUrl(mobileAsset),
        desktopAlt: desktopAsset.alt_text || defaultHeroSlides[index]?.desktopAlt || "Hero image",
        mobileAlt: mobileAsset.alt_text || defaultHeroSlides[index]?.mobileAlt || "Hero image",
        desktopPosition: assetObjectPosition(desktopAsset, defaultHeroSlides[index]?.desktopPosition || "object-center"),
        mobilePosition: assetObjectPosition(mobileAsset, defaultHeroSlides[index]?.mobilePosition || "object-center"),
      };
    })
    .filter((item): item is (typeof defaultHeroSlides)[number] => item !== null);

  return mapped.length ? mapped : defaultHeroSlides;
}

function mapGalleryItems(rows: SummerGalleryItem[], assets: SummerMediaAsset[]) {
  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const layoutMap: Record<string, { aspectClass: string; spanClass: string }> = {
    portrait: { aspectClass: "aspect-[4/5]", spanClass: "xl:col-span-4" },
    wide: { aspectClass: "aspect-[16/10]", spanClass: "xl:col-span-8" },
    feature: { aspectClass: "aspect-[16/10]", spanClass: "xl:col-span-7" },
  };

  const mapped = rows
    .filter((item) => item.is_visible)
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((item, index) => {
      const asset = item.media_asset_id ? byId.get(item.media_asset_id) : undefined;

      if (!asset) {
        return null;
      }

      const layout = layoutMap[item.layout_size || "wide"] || layoutMap.wide;

      return {
        title: item.title || defaultGalleryItems[index]?.title || asset.title || "Gallery item",
        category: item.category || defaultGalleryItems[index]?.category || asset.category || "Gallery",
        imageSrc: assetUrl(asset),
        imageAlt: asset.alt_text || defaultGalleryItems[index]?.imageAlt || item.title || "Gallery image",
        aspectClass: layout.aspectClass,
        spanClass: layout.spanClass,
        imagePosition: assetObjectPosition(asset, defaultGalleryItems[index]?.imagePosition || "object-center"),
      };
    })
    .filter((item): item is (typeof defaultGalleryItems)[number] => item !== null);

  return mapped.length ? mapped : defaultGalleryItems;
}

function mapOffers(rows: SummerOfferRecord[]) {
  const mapped = rows
    .filter((offer) => offer.is_visible)
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((offer) => ({
      id: offer.id,
      title: offer.title,
      subtitle: offer.subtitle,
      description: offer.description || "",
      detail: offer.bullets?.join(" ") || offer.subtitle || "",
      cta: offer.cta_label || "Learn more",
      href: offer.cta_href || "#contact",
      badge: offer.badge,
      featured: offer.is_featured,
      visible: offer.is_visible,
      bullets: Array.isArray(offer.bullets) ? offer.bullets : [],
    }));

  return mapped.length ? mapped : getDefaultSnapshot().offers;
}

export async function getSummerPublicSnapshot() {
  const defaults = getDefaultSnapshot();

  if (!hasSummerSupabaseAdminConfig()) {
    return defaults;
  }

  try {
    const [settings, sections, offers, mediaAssets, heroItems, galleryRows] = await Promise.all([
      selectSummerSingle<SummerSiteSettings>("site_settings", { order: "updated_at.desc" }),
      selectSummerRows<SummerSectionContent>("section_content", { order: "sort_order.asc" }),
      selectSummerRows<SummerOfferRecord>("offers", { order: "sort_order.asc" }),
      selectSummerRows<SummerMediaAsset>("media_assets", { is_visible: "eq.true", order: "sort_order.asc" }),
      selectSummerRows<SummerHeroItem>("hero_items", { order: "sort_order.asc" }),
      selectSummerRows<SummerGalleryItem>("gallery_items", { order: "sort_order.asc" }),
    ]);

    const sectionMap = new Map(sections.map((section) => [section.section_key, section]));

    return {
      siteTitle: settings?.site_title || defaults.siteTitle,
      heroHeading: settings?.hero_heading || defaults.heroHeading,
      heroSubheading: settings?.hero_subheading || defaults.heroSubheading,
      primaryCtaLabel: settings?.primary_cta_label || defaults.primaryCtaLabel,
      primaryCtaHref: settings?.primary_cta_href || defaults.primaryCtaHref,
      secondaryCtaLabel: settings?.secondary_cta_label || defaults.secondaryCtaLabel,
      secondaryCtaHref: settings?.secondary_cta_href || defaults.secondaryCtaHref,
      trainingCtaText: settings?.training_cta_text || defaults.trainingCtaText,
      bookingCtaText: settings?.booking_cta_text || defaults.bookingCtaText,
      contactEmail: settings?.contact_email || defaults.contactEmail,
      instagramUrl: settings?.instagram_url || defaults.instagramUrl,
      heroSlides: mapHeroSlides(heroItems, mediaAssets),
      about: {
        section: normalizeSection(sectionMap.get("about") || null, defaults.about.section),
        images: defaults.about.images,
        points: (sectionMap.get("about")?.body?.points as string[]) || defaults.about.points,
      },
      offersIntro: normalizeSection(sectionMap.get("offers_intro") || null, defaults.offersIntro),
      offers: mapOffers(offers),
      trainWithMe: {
        section: normalizeSection(sectionMap.get("train_with_me") || null, defaults.trainWithMe.section),
        leadCard:
          (sectionMap.get("train_with_me")?.body?.lead_card as string) || defaults.trainWithMe.leadCard,
        pillars:
          (sectionMap.get("train_with_me")?.body?.pillars as string[]) || defaults.trainWithMe.pillars,
        cards: defaults.trainWithMe.cards,
      },
      signature: normalizeSection(sectionMap.get("signature") || null, defaults.signature),
      galleryIntro: normalizeSection(sectionMap.get("gallery_intro") || null, defaults.galleryIntro),
      galleryItems: mapGalleryItems(galleryRows, mediaAssets),
      contact: normalizeSection(sectionMap.get("contact_cta") || null, defaults.contact),
    } satisfies SummerPublicSnapshot;
  } catch {
    return defaults;
  }
}
