-- =============================================================================
-- Seed the 5 imported photos from my-summer-body.com into summer.media_assets
-- so the site can reference them by slug from the DB (in addition to
-- the in-code defaults in site-data.ts).
-- Re-run safe.
-- =============================================================================

insert into summer.media_assets
  (title, slug, category, section_key, file_path, public_url, mime_type, width, height, aspect_ratio, source_type, alt_text, tags, metadata, is_approved, is_visible, sort_order)
values
  (
    'Hero — Action (Venice net jump)',
    'summer-hero-action',
    'hero',
    'hero',
    '/images/summer/imported/summer-hero-action.png',
    '/images/summer/imported/summer-hero-action.png',
    'image/png',
    668, 835,
    '4:5',
    'imported',
    'Summer Loffler mid-air over a tennis net in black athletic wear, dynamic action on an outdoor LA court.',
    jsonb_build_array('action', 'hero', 'la', 'imported'),
    jsonb_build_object('origin', 'my-summer-body', 'objectPosition', '50% 30%'),
    true, true, 5
  ),
  (
    'Rings at Venice Beach',
    'summer-rings-venice',
    'classes',
    'classes_intro',
    '/images/summer/imported/summer-rings-venice.png',
    '/images/summer/imported/summer-rings-venice.png',
    'image/png',
    669, 837,
    '4:5',
    'imported',
    'Summer on gymnastic rings at Venice Beach with palm trees behind her, soft afternoon light.',
    jsonb_build_array('venice', 'strength', 'outdoor', 'imported'),
    jsonb_build_object('origin', 'my-summer-body', 'objectPosition', '50% 35%'),
    true, true, 10
  ),
  (
    'Splits on parallel bars — Venice',
    'summer-splits-venice',
    'gallery',
    'gallery',
    '/images/summer/imported/summer-splits-venice.png',
    '/images/summer/imported/summer-splits-venice.png',
    'image/png',
    642, 833,
    '4:5',
    'imported',
    'Summer in a full split across parallel bars on the Venice Beach boardwalk, arms overhead, palm trees behind.',
    jsonb_build_array('venice', 'mobility', 'editorial', 'imported'),
    jsonb_build_object('origin', 'my-summer-body', 'objectPosition', '50% 40%'),
    true, true, 20
  ),
  (
    'Pink mat portrait',
    'summer-mat-portrait',
    'about',
    'about',
    '/images/summer/imported/summer-mat-portrait.png',
    '/images/summer/imported/summer-mat-portrait.png',
    'image/png',
    665, 722,
    '16:17',
    'imported',
    'Close portrait of Summer on a pink yoga mat, stretching forward, direct eye contact.',
    jsonb_build_array('portrait', 'about', 'mat', 'imported'),
    jsonb_build_object('origin', 'my-summer-body', 'objectPosition', '50% 30%'),
    true, true, 30
  ),
  (
    'Training with a partner',
    'summer-partner-train',
    'classes',
    'classes_intro',
    '/images/summer/imported/summer-partner-train.png',
    '/images/summer/imported/summer-partner-train.png',
    'image/png',
    663, 828,
    '4:5',
    'imported',
    'Summer training with a partner in matched planks, hands pressed together, athletic editorial composition.',
    jsonb_build_array('partner', 'community', 'training', 'imported'),
    jsonb_build_object('origin', 'my-summer-body', 'objectPosition', '50% 40%'),
    true, true, 40
  )
on conflict (slug) do update set
  file_path = excluded.file_path,
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  metadata = excluded.metadata,
  is_approved = excluded.is_approved,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order;

-- Replace hero carousel with new action-forward slides -----------------------
-- We KEEP the three black-and-white slides (signature Loffler brand) and ADD
-- the Venice action image as the 4th rotation.
insert into summer.hero_items (title, desktop_media_asset_id, mobile_media_asset_id, is_visible, sort_order)
select 'Venice Action', m.id, m.id, true, 40
from summer.media_assets m
where m.slug = 'summer-hero-action'
  and not exists (select 1 from summer.hero_items where title = 'Venice Action');

-- Add the Venice rings + splits to the gallery -------------------------------
insert into summer.gallery_items (media_asset_id, title, category, layout_size, is_visible, sort_order)
select id, 'Venice Rings', 'Strength', 'portrait', true, 15
from summer.media_assets
where slug = 'summer-rings-venice'
  and not exists (select 1 from summer.gallery_items where title = 'Venice Rings');

insert into summer.gallery_items (media_asset_id, title, category, layout_size, is_visible, sort_order)
select id, 'Venice Mobility', 'Performance', 'portrait', true, 25
from summer.media_assets
where slug = 'summer-splits-venice'
  and not exists (select 1 from summer.gallery_items where title = 'Venice Mobility');

-- Nano Banana 2 refined variants --------------------------------------------
-- These are the reframed versions used on the live site. Each "imported" source
-- is processed into 2 target aspect ratios.
insert into summer.media_assets
  (title, slug, category, section_key, file_path, public_url, mime_type, aspect_ratio, source_type, alt_text, tags, metadata, is_approved, is_visible, sort_order)
values
  -- hero-action
  ('Hero Action — 16:9', 'summer-hero-action-desktop', 'hero', 'hero', '/images/summer/refined/summer-hero-action-desktop.png', '/images/summer/refined/summer-hero-action-desktop.png', 'image/png', '16:9', 'nano_banana_refine', 'Summer mid-air over a tennis net in dynamic action, refined 16:9 landscape.', jsonb_build_array('action','hero','refined','16x9'), jsonb_build_object('parent_slug','summer-hero-action','model','gemini-3.1-flash-image-preview','objectPosition','50% 30%'), true, true, 101),
  ('Hero Action — 4:5', 'summer-hero-action-mobile', 'hero', 'hero', '/images/summer/refined/summer-hero-action-mobile.png', '/images/summer/refined/summer-hero-action-mobile.png', 'image/png', '4:5', 'nano_banana_refine', 'Summer mid-air over a tennis net, refined 4:5 portrait.', jsonb_build_array('action','hero','refined','4x5'), jsonb_build_object('parent_slug','summer-hero-action','model','gemini-3.1-flash-image-preview'), true, true, 102),
  -- rings-venice
  ('Rings Venice — 16:9 hero', 'summer-rings-venice-hero', 'classes', 'classes_intro', '/images/summer/refined/summer-rings-venice-hero.png', '/images/summer/refined/summer-rings-venice-hero.png', 'image/png', '16:9', 'nano_banana_refine', 'Summer on rings at Venice Beach, refined 16:9 landscape with palm trees.', jsonb_build_array('venice','strength','refined','16x9'), jsonb_build_object('parent_slug','summer-rings-venice','model','gemini-3.1-flash-image-preview'), true, true, 111),
  ('Rings Venice — 4:5 card', 'summer-rings-venice-card', 'classes', 'classes_intro', '/images/summer/refined/summer-rings-venice-card.png', '/images/summer/refined/summer-rings-venice-card.png', 'image/png', '4:5', 'nano_banana_refine', 'Summer on rings at Venice Beach, refined 4:5 card.', jsonb_build_array('venice','strength','refined','4x5'), jsonb_build_object('parent_slug','summer-rings-venice','model','gemini-3.1-flash-image-preview'), true, true, 112),
  -- splits-venice
  ('Splits Venice — 16:9 feature', 'summer-splits-venice-feature', 'gallery', 'gallery', '/images/summer/refined/summer-splits-venice-feature.png', '/images/summer/refined/summer-splits-venice-feature.png', 'image/png', '16:9', 'nano_banana_refine', 'Summer in a full split across parallel bars at Venice, refined 16:9 feature.', jsonb_build_array('venice','mobility','refined','16x9'), jsonb_build_object('parent_slug','summer-splits-venice','model','gemini-3.1-flash-image-preview'), true, true, 121),
  ('Splits Venice — 4:5 portrait', 'summer-splits-venice-portrait', 'about', 'about', '/images/summer/refined/summer-splits-venice-portrait.png', '/images/summer/refined/summer-splits-venice-portrait.png', 'image/png', '4:5', 'nano_banana_refine', 'Summer in full split across parallel bars at Venice, refined 4:5 portrait.', jsonb_build_array('venice','mobility','refined','4x5'), jsonb_build_object('parent_slug','summer-splits-venice','model','gemini-3.1-flash-image-preview'), true, true, 122),
  -- mat-portrait
  ('Mat Portrait — 4:5 about', 'summer-mat-portrait-about', 'about', 'about', '/images/summer/refined/summer-mat-portrait-about.png', '/images/summer/refined/summer-mat-portrait-about.png', 'image/png', '4:5', 'nano_banana_refine', 'Close portrait on a pink yoga mat, refined 4:5 about crop.', jsonb_build_array('portrait','about','refined','4x5'), jsonb_build_object('parent_slug','summer-mat-portrait','model','gemini-3.1-flash-image-preview'), true, true, 131),
  ('Mat Portrait — 1:1 square', 'summer-mat-portrait-square', 'about', 'about', '/images/summer/refined/summer-mat-portrait-square.png', '/images/summer/refined/summer-mat-portrait-square.png', 'image/png', '1:1', 'nano_banana_refine', 'Close portrait on a pink yoga mat, refined 1:1 square.', jsonb_build_array('portrait','about','refined','1x1'), jsonb_build_object('parent_slug','summer-mat-portrait','model','gemini-3.1-flash-image-preview'), true, true, 132),
  -- partner-train
  ('Partner Train — 16:9 landscape', 'summer-partner-train-landscape', 'classes', 'classes_intro', '/images/summer/refined/summer-partner-train-landscape.png', '/images/summer/refined/summer-partner-train-landscape.png', 'image/png', '16:9', 'nano_banana_refine', 'Summer training a partner in matched planks, refined 16:9 landscape.', jsonb_build_array('partner','community','refined','16x9'), jsonb_build_object('parent_slug','summer-partner-train','model','gemini-3.1-flash-image-preview'), true, true, 141),
  ('Partner Train — 4:5 portrait', 'summer-partner-train-portrait', 'classes', 'classes_intro', '/images/summer/refined/summer-partner-train-portrait.png', '/images/summer/refined/summer-partner-train-portrait.png', 'image/png', '4:5', 'nano_banana_refine', 'Summer training a partner in matched planks, refined 4:5 portrait.', jsonb_build_array('partner','community','refined','4x5'), jsonb_build_object('parent_slug','summer-partner-train','model','gemini-3.1-flash-image-preview'), true, true, 142)
on conflict (slug) do update set
  file_path = excluded.file_path,
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  metadata = excluded.metadata,
  is_approved = excluded.is_approved,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order;

insert into summer._migrations (name) values ('20260424020000_seed_imported_media')
on conflict (name) do nothing;
