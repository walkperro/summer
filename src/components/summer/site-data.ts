export type HeroSlide = {
  id: string;
  desktopSrc: string;
  mobileSrc: string;
  desktopAlt: string;
  mobileAlt: string;
  desktopPosition: string;
  mobilePosition: string;
};

export type Offer = {
  title: string;
  description: string;
  detail: string;
  cta: string;
  featured?: boolean;
};

export type TrainingCard = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: string;
};

export type GalleryItem = {
  title: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  aspectClass: string;
  spanClass: string;
  imagePosition: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-portrait",
    desktopSrc: "/images/summer/hero/summer_hero_bw_1_desktop.jpg",
    mobileSrc: "/images/summer/hero/summer_hero_bw_1_mobile.png",
    desktopAlt: "Black and white portrait of Summer Loffler with a direct, composed expression.",
    mobileAlt: "Close black and white portrait of Summer Loffler on mobile.",
    desktopPosition: "object-[72%_35%]",
    mobilePosition: "object-center",
  },
  {
    id: "hero-training",
    desktopSrc: "/images/summer/hero/summer_hero_bw_2_desktop.png",
    mobileSrc: "/images/summer/hero/summer_hero_bw_2_mobile.jpg",
    desktopAlt: "Black and white profile image of Summer Loffler in a sculptural training space.",
    mobileAlt: "Mobile crop of Summer Loffler in profile inside an architectural training environment.",
    desktopPosition: "object-[66%_38%]",
    mobilePosition: "object-[56%_35%]",
  },
  {
    id: "hero-studio",
    desktopSrc: "/images/summer/hero/summer_hero_bw_3_desktop.jpg",
    mobileSrc: "/images/summer/hero/summer_hero_bw_3_mobile.jpg",
    desktopAlt: "Black and white studio image of Summer Loffler standing in a refined private gym.",
    mobileAlt: "Mobile crop of Summer Loffler standing in a private training studio.",
    desktopPosition: "object-[68%_30%]",
    mobilePosition: "object-[58%_28%]",
  },
];

export const aboutImages = {
  main: {
    src: "/images/summer/about/summer_about_main.jpg",
    alt: "Warm portrait of Summer Loffler in a neutral knit, framed closely and calmly.",
  },
  supporting: {
    src: "/images/summer/about/summer_about_supporting.jpg",
    alt: "Three-quarter portrait of Summer Loffler standing against stone architecture.",
  },
};

export const aboutPoints = [
  "Private training with close personal oversight and real accountability.",
  "Strength training, glute-focused work, and fitness coaching shaped around the individual.",
  "A polished standard across coaching, nutrition guidance, and editorial bookings.",
];

export const offers: Offer[] = [
  {
    title: "Private Training",
    description:
      "Private training in Los Angeles for clients who want hands-on coaching, strength training, and lasting results built with care.",
    detail: "Available for select clients across Los Angeles, with particular relevance to Playa Del Rey and Manhattan Beach.",
    cta: "Apply for Private Training",
    featured: true,
  },
  {
    title: "Online Coaching",
    description:
      "Remote fitness coaching with structured programming, strength training, glute-focused work, and nutrition guidance that stays personal.",
    detail: "Built for clients who want real accountability, clear feedback, and a more considered alternative to generic online coaching.",
    cta: "Explore coaching",
  },
  {
    title: "Brand / Campaign Bookings",
    description:
      "For brand campaigns, partnerships, and fitness or lifestyle work that requires a strong on-camera presence and professional direction.",
    detail: "Comfortable on set, easy to direct, and consistent from first concept to final frame.",
    cta: "Discuss a booking",
  },
];

export const trainingCards: TrainingCard[] = [
  {
    title: "Form that holds on the last rep.",
    description: "Bracing, bar path, tempo — coached set by set, not summarized at the end of the hour.",
    imageSrc: "/images/summer/train_with_me/summer_train_supporting_1.jpg",
    imageAlt: "Summer Loffler seated on a gym floor after training, composed and focused.",
    imagePosition: "object-[60%_28%]",
  },
  {
    title: "Programs written for your lifts — not pulled off a shelf.",
    description: "Twelve-week blocks built around what you're chasing, what your joints will tolerate, and how often you can actually train. Re-cut weekly.",
    imageSrc: "/images/summer/train_with_me/summer_train_supporting_2.jpg",
    imageAlt: "Summer Loffler training outdoors with resistance work in an athletic editorial frame.",
    imagePosition: "object-center",
  },
  {
    title: "A coach who reads the room.",
    description: "Form-check videos returned same day. Weekly check-ins. Plain answers when a lift, a meal, or a week isn't working.",
    imageSrc: "/images/summer/train_with_me/summer_train_supporting_3.jpg",
    imageAlt: "Summer Loffler standing in a refined activewear portrait after a training session.",
    imagePosition: "object-[52%_26%]",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    title: "Performance Feature",
    category: "Fitness",
    imageSrc: "/images/summer/gallery/summer_gallery_fitness_1.jpg",
    imageAlt: "Summer Loffler performing a low push-up in a premium refined fitness image.",
    aspectClass: "aspect-[16/10]",
    spanClass: "xl:col-span-8",
    imagePosition: "object-[38%_38%]",
  },
  {
    title: "Refined Presence",
    category: "Lifestyle",
    imageSrc: "/images/summer/gallery/summer_gallery_glam_2.jpg",
    imageAlt: "Warm indoor portrait of Summer Loffler seated in a navy top and denim.",
    aspectClass: "aspect-[4/5]",
    spanClass: "xl:col-span-4",
    imagePosition: "object-center",
  },
  {
    title: "Private Setting",
    category: "Lifestyle",
    imageSrc: "/images/summer/gallery/summer_gallery_lifestyle.jpg",
    imageAlt: "Summer Loffler seated in a calm interior setting with strong natural light.",
    aspectClass: "aspect-[16/10]",
    spanClass: "xl:col-span-12",
    imagePosition: "object-[34%_32%]",
  },
];

export const inquiryOptions = [
  "Private Training",
  "Online Coaching",
  "Brand / Campaign Booking",
  "General Inquiry",
] as const;
