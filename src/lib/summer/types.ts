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
