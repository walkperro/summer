create extension if not exists pgcrypto;

create schema if not exists summer;

create or replace function summer.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists summer.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists summer.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text,
  hero_heading text,
  hero_subheading text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  contact_email text,
  instagram_url text,
  training_cta_text text,
  booking_cta_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.section_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  eyebrow text,
  heading text,
  subheading text,
  body jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.offers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  bullets jsonb not null default '[]'::jsonb,
  cta_label text,
  cta_href text,
  badge text,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text unique,
  category text,
  section_key text,
  file_path text not null,
  public_url text,
  mime_type text,
  width int,
  height int,
  aspect_ratio text,
  source_type text,
  alt_text text,
  tags jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  is_approved boolean not null default false,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.gallery_items (
  id uuid primary key default gen_random_uuid(),
  media_asset_id uuid references summer.media_assets(id) on delete cascade,
  title text,
  category text,
  layout_size text,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null,
  full_name text,
  email text,
  phone text,
  instagram_handle text,
  message text,
  goals text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new',
  notes_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references summer.inquiries(id) on delete cascade,
  body text not null,
  author_email text,
  created_at timestamptz not null default now()
);

create table if not exists summer.image_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  status text not null default 'queued',
  source_asset_id uuid references summer.media_assets(id) on delete set null,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  prompt_text text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.image_outputs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references summer.image_jobs(id) on delete set null,
  media_asset_id uuid references summer.media_assets(id) on delete set null,
  output_path text,
  public_url text,
  title text,
  aspect_ratio text,
  output_type text,
  metadata jsonb not null default '{}'::jsonb,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists summer.hero_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  desktop_media_asset_id uuid references summer.media_assets(id) on delete set null,
  mobile_media_asset_id uuid references summer.media_assets(id) on delete set null,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summer.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  media_asset_id uuid references summer.media_assets(id) on delete cascade,
  title text,
  category text,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_summer_section_content_sort on summer.section_content(sort_order);
create index if not exists idx_summer_offers_sort on summer.offers(sort_order);
create index if not exists idx_summer_media_assets_category on summer.media_assets(category);
create index if not exists idx_summer_media_assets_section_key on summer.media_assets(section_key);
create index if not exists idx_summer_gallery_items_sort on summer.gallery_items(sort_order);
create index if not exists idx_summer_inquiries_status on summer.inquiries(status);
create index if not exists idx_summer_inquiries_type on summer.inquiries(inquiry_type);
create index if not exists idx_summer_image_jobs_status on summer.image_jobs(status);
create index if not exists idx_summer_hero_items_sort on summer.hero_items(sort_order);
create index if not exists idx_summer_portfolio_items_sort on summer.portfolio_items(sort_order);

drop trigger if exists trg_summer_site_settings_updated_at on summer.site_settings;
create trigger trg_summer_site_settings_updated_at
before update on summer.site_settings
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_section_content_updated_at on summer.section_content;
create trigger trg_summer_section_content_updated_at
before update on summer.section_content
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_offers_updated_at on summer.offers;
create trigger trg_summer_offers_updated_at
before update on summer.offers
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_media_assets_updated_at on summer.media_assets;
create trigger trg_summer_media_assets_updated_at
before update on summer.media_assets
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_gallery_items_updated_at on summer.gallery_items;
create trigger trg_summer_gallery_items_updated_at
before update on summer.gallery_items
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_inquiries_updated_at on summer.inquiries;
create trigger trg_summer_inquiries_updated_at
before update on summer.inquiries
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_image_jobs_updated_at on summer.image_jobs;
create trigger trg_summer_image_jobs_updated_at
before update on summer.image_jobs
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_hero_items_updated_at on summer.hero_items;
create trigger trg_summer_hero_items_updated_at
before update on summer.hero_items
for each row execute function summer.set_updated_at();

drop trigger if exists trg_summer_portfolio_items_updated_at on summer.portfolio_items;
create trigger trg_summer_portfolio_items_updated_at
before update on summer.portfolio_items
for each row execute function summer.set_updated_at();

grant usage on schema summer to authenticated, service_role;
grant select on summer.site_settings to authenticated;
grant select on summer.section_content to authenticated;
grant select on summer.offers to authenticated;
grant select on summer.media_assets to authenticated;
grant select on summer.gallery_items to authenticated;
grant select on summer.hero_items to authenticated;
grant select on summer.portfolio_items to authenticated;
grant all privileges on all tables in schema summer to service_role;

insert into summer.site_settings (
  site_title,
  hero_heading,
  hero_subheading,
  primary_cta_label,
  primary_cta_href,
  secondary_cta_label,
  secondary_cta_href,
  training_cta_text,
  booking_cta_text
)
select
  'Summer',
  'Editorial fitness. Private coaching. Real presence.',
  'A refined approach to training and image-making for clients, brands, and private bookings that value discipline, detail, and calm confidence.',
  'Apply for Private Training',
  '#contact',
  'View Portfolio',
  '#portfolio',
  'Apply for Private Training',
  'Discuss a booking'
where not exists (select 1 from summer.site_settings);

insert into summer.section_content (section_key, eyebrow, heading, subheading, body, meta, sort_order)
values
  (
    'about',
    'About / Trust',
    'Discipline, detail, and a highly personal standard.',
    'Summer brings a rare balance of polished presence and real coaching credibility. Every client touchpoint is considered, hands-on, and intentionally private.',
    jsonb_build_object(
      'paragraphs', jsonb_build_array(
        'Her approach is selective by design. Training is structured, communication is direct, and the experience stays calm from first inquiry to final session.',
        'For private clients, that means tailored programming and real accountability. For creative partners, it means reliability, consistency, and a strong visual presence on set.'
      ),
      'points', jsonb_build_array(
        'Selective client roster with close personal oversight.',
        'Technique-led coaching that prioritizes structure and consistency.',
        'A calm, polished standard across training, presentation, and brand work.'
      )
    ),
    '{}'::jsonb,
    10
  ),
  (
    'offers_intro',
    'Offers',
    'A focused set of ways to work together.',
    'The offer is intentionally restrained: campaign bookings, remote coaching, and a limited private training roster built around tailored attention.',
    '{}'::jsonb,
    '{}'::jsonb,
    20
  ),
  (
    'train_with_me',
    'Train With Me',
    'Private coaching with structure, precision, and real accountability.',
    'This is disciplined coaching for clients who want serious guidance. Programming stays intentional, feedback stays honest, and every session serves a clear purpose.',
    jsonb_build_object(
      'pillars', jsonb_build_array(
        'Technique is coached closely.',
        'Consistency is expected.',
        'Support stays tailored and private.'
      ),
      'lead_card', 'Serious progress comes from repeatable execution. The work is focused, measured, and shaped around the person in front of you.'
    ),
    '{}'::jsonb,
    30
  ),
  (
    'signature',
    'Signature',
    'A disciplined body. A calm mind. A strong presence.',
    null,
    '{}'::jsonb,
    '{}'::jsonb,
    40
  ),
  (
    'gallery_intro',
    'Gallery / Portfolio',
    'A visual mix of performance, portraiture, and campaign polish.',
    'The portfolio balances athletic credibility with an editorial finish. It is designed to feel cohesive on mobile, spacious on desktop, and strong across both brand and private-training contexts.',
    '{}'::jsonb,
    '{}'::jsonb,
    50
  ),
  (
    'contact_cta',
    'Contact / Inquiry',
    'Start with a thoughtful inquiry.',
    'Share a few details and a polished inquiry draft opens in your preferred mail app. It keeps the first step simple while preserving a more private booking experience.',
    jsonb_build_object(
      'availability_note', 'Private training remains intentionally limited. Brand, coaching, and general inquiries are reviewed with equal care.'
    ),
    '{}'::jsonb,
    60
  )
on conflict (section_key) do nothing;

insert into summer.offers (slug, title, subtitle, description, bullets, cta_label, cta_href, badge, is_featured, is_visible, sort_order)
values
  (
    'brand-campaign-bookings',
    'Brand / Campaign Bookings',
    'Editorial, campaign, and creative partnerships',
    'For editorial shoots, campaigns, creative partnerships, and fitness or lifestyle brand storytelling.',
    jsonb_build_array(
      'Camera-ready direction and reliable on-set presence.',
      'Premium visual point of view from first brief to final frame.',
      'Strong fit for editorial, sports, and lifestyle creative.'
    ),
    'Discuss a booking',
    '#contact',
    null,
    false,
    true,
    10
  ),
  (
    'online-coaching',
    'Online Coaching',
    'Remote structure with personal oversight',
    'Remote programming with measured accountability, weekly structure, and lifestyle guidance that stays personal.',
    jsonb_build_array(
      'Structured programming built for consistency.',
      'Clear feedback without generic templates.',
      'Lifestyle guidance that still feels private and tailored.'
    ),
    'Explore coaching',
    '#contact',
    null,
    false,
    true,
    20
  ),
  (
    'private-training',
    'Private Training',
    'A limited one-to-one training experience',
    'A limited one-to-one training experience shaped around your schedule, training level, and performance goals.',
    jsonb_build_array(
      'Hands-on coaching and protected attention.',
      'Tailored programming built around your goals.',
      'Serious support in a focused private environment.'
    ),
    'Apply privately',
    '#contact',
    'Most Exclusive',
    true,
    true,
    30
  )
on conflict (slug) do nothing;

insert into summer.media_assets (title, slug, category, section_key, file_path, public_url, mime_type, width, height, aspect_ratio, source_type, alt_text, tags, metadata, is_approved, is_visible, sort_order)
values
  ('Hero Portrait Desktop', 'summer-hero-bw-1-desktop', 'hero', 'hero', '/images/summer/hero/summer_hero_bw_1_desktop.jpg', '/images/summer/hero/summer_hero_bw_1_desktop.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Black and white portrait of Summer with a direct, composed expression.', '[]'::jsonb, jsonb_build_object('variant', 'desktop', 'objectPosition', '72% 35%'), true, true, 10),
  ('Hero Portrait Mobile', 'summer-hero-bw-1-mobile', 'hero', 'hero', '/images/summer/hero/summer_hero_bw_1_mobile.png', '/images/summer/hero/summer_hero_bw_1_mobile.png', 'image/png', 928, 1152, '4:5', 'public_asset', 'Close black and white mobile portrait of Summer.', '[]'::jsonb, jsonb_build_object('variant', 'mobile', 'objectPosition', '50% 50%'), true, true, 11),
  ('Hero Training Desktop', 'summer-hero-bw-2-desktop', 'hero', 'hero', '/images/summer/hero/summer_hero_bw_2_desktop.png', '/images/summer/hero/summer_hero_bw_2_desktop.png', 'image/png', 1376, 768, '16:9', 'public_asset', 'Black and white profile image of Summer in a sculptural training space.', '[]'::jsonb, jsonb_build_object('variant', 'desktop', 'objectPosition', '66% 38%'), true, true, 20),
  ('Hero Training Mobile', 'summer-hero-bw-2-mobile', 'hero', 'hero', '/images/summer/hero/summer_hero_bw_2_mobile.jpg', '/images/summer/hero/summer_hero_bw_2_mobile.jpg', 'image/jpeg', 928, 1152, '4:5', 'public_asset', 'Mobile crop of Summer in profile inside an architectural training environment.', '[]'::jsonb, jsonb_build_object('variant', 'mobile', 'objectPosition', '56% 35%'), true, true, 21),
  ('Hero Studio Desktop', 'summer-hero-bw-3-desktop', 'hero', 'hero', '/images/summer/hero/summer_hero_bw_3_desktop.jpg', '/images/summer/hero/summer_hero_bw_3_desktop.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Black and white studio image of Summer standing in a refined private gym.', '[]'::jsonb, jsonb_build_object('variant', 'desktop', 'objectPosition', '68% 30%'), true, true, 30),
  ('Hero Studio Mobile', 'summer-hero-bw-3-mobile', 'hero', 'hero', '/images/summer/hero/summer_hero_bw_3_mobile.jpg', '/images/summer/hero/summer_hero_bw_3_mobile.jpg', 'image/jpeg', 614, 768, '4:5', 'public_asset', 'Mobile crop of Summer standing in a private training studio.', '[]'::jsonb, jsonb_build_object('variant', 'mobile', 'objectPosition', '58% 28%'), true, true, 31),
  ('About Main', 'summer-about-main', 'about', 'about', '/images/summer/about/summer_about_main.jpg', '/images/summer/about/summer_about_main.jpg', 'image/jpeg', 928, 1152, '4:5', 'public_asset', 'Warm portrait of Summer in a neutral knit, framed closely and calmly.', '[]'::jsonb, '{}'::jsonb, true, true, 40),
  ('About Supporting', 'summer-about-supporting', 'about', 'about', '/images/summer/about/summer_about_supporting.jpg', '/images/summer/about/summer_about_supporting.jpg', 'image/jpeg', 928, 1152, '4:5', 'public_asset', 'Three-quarter portrait of Summer standing against stone architecture.', '[]'::jsonb, '{}'::jsonb, true, true, 41),
  ('Accent Wide', 'summer-accent-wide', 'accent', 'signature', '/images/summer/accent/signature_16_9_aspect_ratio.jpg', '/images/summer/accent/signature_16_9_aspect_ratio.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Summer standing in a refined monochrome training space.', '[]'::jsonb, '{}'::jsonb, true, true, 50),
  ('Accent Portrait', 'summer-accent-portrait', 'accent', 'signature', '/images/summer/accent/signature_4_5_aspect_ratio.jpg', '/images/summer/accent/signature_4_5_aspect_ratio.jpg', 'image/jpeg', 614, 768, '4:5', 'public_asset', 'Portrait signature image of Summer standing with calm confidence.', '[]'::jsonb, '{}'::jsonb, true, true, 51),
  ('Contact Portrait', 'summer-contact', 'contact', 'contact_cta', '/images/summer/contact/summer_contact.jpg', '/images/summer/contact/summer_contact.jpg', 'image/jpeg', 614, 768, '4:5', 'public_asset', 'Summer seated in a calm interior, ready for inquiries.', '[]'::jsonb, '{}'::jsonb, true, true, 60),
  ('Train Lead', 'summer-train-lead', 'train_with_me', 'train_with_me', '/images/summer/train_with_me/summer_train_lead.jpg', '/images/summer/train_with_me/summer_train_lead.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Summer performing a push-up on a court, showing strength and control.', '[]'::jsonb, '{}'::jsonb, true, true, 70),
  ('Train Support 1', 'summer-train-support-1', 'train_with_me', 'train_with_me', '/images/summer/train_with_me/summer_train_supporting_1.jpg', '/images/summer/train_with_me/summer_train_supporting_1.jpg', 'image/jpeg', 928, 1152, '4:5', 'public_asset', 'Summer seated on a gym floor after training, composed and focused.', '[]'::jsonb, '{}'::jsonb, true, true, 71),
  ('Train Support 2', 'summer-train-support-2', 'train_with_me', 'train_with_me', '/images/summer/train_with_me/summer_train_supporting_2.jpg', '/images/summer/train_with_me/summer_train_supporting_2.jpg', 'image/jpeg', 832, 1040, '4:5', 'public_asset', 'Summer training outdoors with resistance work in an athletic editorial frame.', '[]'::jsonb, '{}'::jsonb, true, true, 72),
  ('Train Support 3', 'summer-train-support-3', 'train_with_me', 'train_with_me', '/images/summer/train_with_me/summer_train_supporting_3.jpg', '/images/summer/train_with_me/summer_train_supporting_3.jpg', 'image/jpeg', 912, 1155, '4:5', 'public_asset', 'Summer standing in a refined activewear portrait after a training session.', '[]'::jsonb, '{}'::jsonb, true, true, 73),
  ('Gallery Fitness 1', 'summer-gallery-fitness-1', 'gallery', 'gallery', '/images/summer/gallery/summer_gallery_fitness_1.jpg', '/images/summer/gallery/summer_gallery_fitness_1.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Summer performing a low push-up in a premium sports campaign style.', '[]'::jsonb, jsonb_build_object('layoutSize', 'wide'), true, true, 80),
  ('Gallery Fitness 2', 'summer-gallery-fitness-2', 'gallery', 'gallery', '/images/summer/gallery/summer_gallery_fitness_2.jpg', '/images/summer/gallery/summer_gallery_fitness_2.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Summer in an athletic campaign frame that emphasizes form and control.', '[]'::jsonb, jsonb_build_object('layoutSize', 'wide'), true, true, 81),
  ('Gallery Glam 1', 'summer-gallery-glam-1', 'gallery', 'gallery', '/images/summer/gallery/summer_gallery_glam_1.jpg', '/images/summer/gallery/summer_gallery_glam_1.jpg', 'image/jpeg', 928, 1152, '4:5', 'public_asset', 'Black and white editorial portrait of Summer in a black high-neck top.', '[]'::jsonb, jsonb_build_object('layoutSize', 'portrait'), true, true, 82),
  ('Gallery Glam 2', 'summer-gallery-glam-2', 'gallery', 'gallery', '/images/summer/gallery/summer_gallery_glam_2.jpg', '/images/summer/gallery/summer_gallery_glam_2.jpg', 'image/jpeg', 614, 768, '4:5', 'public_asset', 'Warm indoor portrait of Summer seated in a navy top and denim.', '[]'::jsonb, jsonb_build_object('layoutSize', 'portrait'), true, true, 83),
  ('Gallery Lifestyle', 'summer-gallery-lifestyle', 'gallery', 'gallery', '/images/summer/gallery/summer_gallery_lifestyle.jpg', '/images/summer/gallery/summer_gallery_lifestyle.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Summer seated in a calm interior setting with strong natural light.', '[]'::jsonb, jsonb_build_object('layoutSize', 'wide'), true, true, 84),
  ('Gallery Signature', 'summer-gallery-signature', 'gallery', 'gallery', '/images/summer/gallery/summer_gallery_signature.jpg', '/images/summer/gallery/summer_gallery_signature.jpg', 'image/jpeg', 1376, 768, '16:9', 'public_asset', 'Black and white signature image of Summer in a blazer and black top.', '[]'::jsonb, jsonb_build_object('layoutSize', 'wide'), true, true, 85)
on conflict (slug) do nothing;

insert into summer.hero_items (title, desktop_media_asset_id, mobile_media_asset_id, is_visible, sort_order)
select 'Hero Concept 1', d.id, m.id, true, 10
from summer.media_assets d, summer.media_assets m
where d.slug = 'summer-hero-bw-1-desktop'
  and m.slug = 'summer-hero-bw-1-mobile'
  and not exists (select 1 from summer.hero_items where title = 'Hero Concept 1')
union all
select 'Hero Concept 2', d.id, m.id, true, 20
from summer.media_assets d, summer.media_assets m
where d.slug = 'summer-hero-bw-2-desktop'
  and m.slug = 'summer-hero-bw-2-mobile'
  and not exists (select 1 from summer.hero_items where title = 'Hero Concept 2')
union all
select 'Hero Concept 3', d.id, m.id, true, 30
from summer.media_assets d, summer.media_assets m
where d.slug = 'summer-hero-bw-3-desktop'
  and m.slug = 'summer-hero-bw-3-mobile'
  and not exists (select 1 from summer.hero_items where title = 'Hero Concept 3');

insert into summer.gallery_items (media_asset_id, title, category, layout_size, is_visible, sort_order)
select id, 'Performance Feature', 'Fitness', 'wide', true, 10 from summer.media_assets where slug = 'summer-gallery-fitness-1' and not exists (select 1 from summer.gallery_items where title = 'Performance Feature')
union all
select id, 'Studio Portrait', 'Editorial', 'portrait', true, 20 from summer.media_assets where slug = 'summer-gallery-glam-1' and not exists (select 1 from summer.gallery_items where title = 'Studio Portrait')
union all
select id, 'Refined Presence', 'Lifestyle', 'portrait', true, 30 from summer.media_assets where slug = 'summer-gallery-glam-2' and not exists (select 1 from summer.gallery_items where title = 'Refined Presence')
union all
select id, 'Signature Frame', 'Campaign', 'wide', true, 40 from summer.media_assets where slug = 'summer-gallery-signature' and not exists (select 1 from summer.gallery_items where title = 'Signature Frame')
union all
select id, 'Private Setting', 'Lifestyle', 'wide', true, 50 from summer.media_assets where slug = 'summer-gallery-lifestyle' and not exists (select 1 from summer.gallery_items where title = 'Private Setting')
union all
select id, 'Athletic Campaign', 'Fitness', 'wide', true, 60 from summer.media_assets where slug = 'summer-gallery-fitness-2' and not exists (select 1 from summer.gallery_items where title = 'Athletic Campaign');

insert into summer.portfolio_items (media_asset_id, title, category, is_visible, sort_order)
select media_asset_id, title, category, is_visible, sort_order
from summer.gallery_items
where not exists (select 1 from summer.portfolio_items);
