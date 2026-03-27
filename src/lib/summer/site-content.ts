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
    eyebrow: "About / Trust",
    heading: "Discipline, detail, and a highly personal standard.",
    subheading:
      "Summer brings a rare balance of polished presence and real coaching credibility. Every client touchpoint is considered, hands-on, and intentionally private.",
    body: {
      paragraphs: [
        "Her approach is selective by design. Training is structured, communication is direct, and the experience stays calm from first inquiry to final session.",
        "For private clients, that means tailored programming and real accountability. For creative partners, it means reliability, consistency, and a strong visual presence on set.",
      ],
      points: aboutPoints,
    },
    meta: {},
    isVisible: true,
  },
  offers_intro: {
    eyebrow: "Offers",
    heading: "A focused set of ways to work together.",
    subheading:
      "The offer is intentionally restrained: campaign bookings, remote coaching, and a limited private training roster built around tailored attention.",
    body: {},
    meta: {},
    isVisible: true,
  },
  train_with_me: {
    eyebrow: "Train With Me",
    heading: "Private coaching with structure, precision, and real accountability.",
    subheading:
      "This is disciplined coaching for clients who want serious guidance. Programming stays intentional, feedback stays honest, and every session serves a clear purpose.",
    body: {
      pillars: ["Technique is coached closely.", "Consistency is expected.", "Support stays tailored and private."],
      lead_card:
        "Serious progress comes from repeatable execution. The work is focused, measured, and shaped around the person in front of you.",
    },
    meta: {},
    isVisible: true,
  },
  signature: {
    eyebrow: "Signature",
    heading: "A disciplined body. A calm mind. A strong presence.",
    subheading: "",
    body: {},
    meta: {},
    isVisible: true,
  },
  gallery_intro: {
    eyebrow: "Gallery / Portfolio",
    heading: "A visual mix of performance, portraiture, and campaign polish.",
    subheading:
      "The portfolio balances athletic credibility with an editorial finish. It is designed to feel cohesive on mobile, spacious on desktop, and strong across both brand and private-training contexts.",
    body: {},
    meta: {},
    isVisible: true,
  },
  contact_cta: {
    eyebrow: "Contact / Inquiry",
    heading: "Start with a thoughtful inquiry.",
    subheading:
      "Share a few details and we will review your inquiry with care. Private training remains intentionally limited.",
    body: {
      availability_note:
        "Private training remains intentionally limited. Brand, coaching, and general inquiries are reviewed with equal care.",
    },
    meta: {},
    isVisible: true,
  },
};

function getDefaultSnapshot(): SummerPublicSnapshot {
  return {
    siteTitle: "Summer",
    heroHeading: "Editorial fitness. Private coaching. Real presence.",
    heroSubheading:
      "A refined approach to training and image-making for clients, brands, and private bookings that value discipline, detail, and calm confidence.",
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
