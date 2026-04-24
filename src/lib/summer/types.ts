export const SUMMER_SCHEMA = "summer";

export type SummerAdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export type SummerSiteSettings = {
  id: string;
  site_title: string | null;
  hero_heading: string | null;
  hero_subheading: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  contact_email: string | null;
  instagram_url: string | null;
  training_cta_text: string | null;
  booking_cta_text: string | null;
  created_at: string;
  updated_at: string;
};

export type SummerSectionContent = {
  id: string;
  section_key: string;
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
  body: Record<string, unknown>;
  meta: Record<string, unknown>;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerOfferRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  bullets: string[];
  cta_label: string | null;
  cta_href: string | null;
  badge: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerMediaAsset = {
  id: string;
  title: string | null;
  slug: string | null;
  category: string | null;
  section_key: string | null;
  file_path: string;
  public_url: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  aspect_ratio: string | null;
  source_type: string | null;
  alt_text: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  is_approved: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerGalleryItem = {
  id: string;
  media_asset_id: string | null;
  title: string | null;
  category: string | null;
  layout_size: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerHeroItem = {
  id: string;
  title: string | null;
  desktop_media_asset_id: string | null;
  mobile_media_asset_id: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerInquiry = {
  id: string;
  inquiry_type: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  instagram_handle: string | null;
  message: string | null;
  goals: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string;
  notes_count: number;
  created_at: string;
  updated_at: string;
};

export type SummerInquiryNote = {
  id: string;
  inquiry_id: string;
  body: string;
  author_email: string | null;
  created_at: string;
};

export type SummerImageJob = {
  id: string;
  job_type: string;
  status: string;
  source_asset_id: string | null;
  input_payload: Record<string, unknown>;
  output_payload: Record<string, unknown>;
  prompt_text: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type SummerImageOutput = {
  id: string;
  job_id: string | null;
  media_asset_id: string | null;
  output_path: string | null;
  public_url: string | null;
  title: string | null;
  aspect_ratio: string | null;
  output_type: string | null;
  metadata: Record<string, unknown>;
  is_approved: boolean;
  created_at: string;
};

export type SummerPortfolioItem = {
  id: string;
  media_asset_id: string;
  title: string | null;
  category: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// -- Monetization + client portal --------------------------------------------

export type SummerClient = {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  instagram_handle: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  timezone: string | null;
  lifecycle_status: string;
  onboarding_payload: Record<string, unknown>;
  notes: string | null;
  inquiry_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SummerSubscriptionTier = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price_cents: number;
  interval: string;
  stripe_price_id: string | null;
  features: string[];
  access_level: number;
  badge: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerSubscription = {
  id: string;
  client_id: string;
  tier_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type SummerClass = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  cover_media_id: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  difficulty: string | null;
  category: string | null;
  access_level_min: number;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerClassSession = {
  id: string;
  class_id: string;
  title: string | null;
  starts_at: string;
  duration_minutes: number | null;
  zoom_url: string | null;
  capacity: number | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerClassEnrollment = {
  id: string;
  client_id: string;
  class_id: string | null;
  session_id: string | null;
  status: string;
  created_at: string;
};

export type SummerDigitalProduct = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price_cents: number;
  stripe_price_id: string | null;
  cover_media_id: string | null;
  file_url: string | null;
  page_count: number | null;
  preview_url: string | null;
  includes: string[];
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerPurchase = {
  id: string;
  client_id: string;
  product_id: string | null;
  amount_cents: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  status: string;
  download_url: string | null;
  download_expires_at: string | null;
  created_at: string;
};

export type SummerTestimonial = {
  id: string;
  client_id: string | null;
  name: string | null;
  location: string | null;
  quote: string;
  rating: number | null;
  before_media_id: string | null;
  after_media_id: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerClientMessage = {
  id: string;
  client_id: string;
  from_role: "client" | "coach";
  body: string;
  read_at: string | null;
  created_at: string;
};

export type SummerAdminTip = {
  id: string;
  page_key: string;
  title: string;
  body: string;
  cta_label: string | null;
  cta_href: string | null;
  icon: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SummerFaqItem = {
  id: string;
  topic: string | null;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};
