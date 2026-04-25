-- =============================================================================
-- Fix: Offers had grown to 4-5 rows because an earlier migration (20260424010000)
-- inserted a separate `online-classes` row alongside the `online-coaching` row
-- (which had been repurposed to carry "Online Classes" copy). Result: the home
-- Offers section showed two cards titled "Online Classes".
--
-- We're keeping the Online Classes title + description on the existing
-- `online-coaching` slug (it's the version we want to render) and hiding the
-- duplicate `online-classes` row + the extra `guides-and-plans` row so the
-- home page sits at three offers (Private Training, Online Classes, Brand /
-- Campaign Bookings).
-- =============================================================================

-- Make sure the `online-coaching` row carries the Online Classes copy explicitly,
-- and is visible/sorted at position 20 (between Private Training and Brand).
update summer.offers
set
  title = 'Online Classes',
  subtitle = 'The library, on your schedule.',
  description = 'A subscription to Summer''s full class library — heavy lifting foundations, glute-focused sessions, and finishers shot in clean, full frame so you can see every cue.',
  bullets = jsonb_build_array(
    'Full class library + new drops each week.',
    'Weekly live classes on Signature and Inner Circle tiers.',
    'Private community + priority booking.',
    'From $29 / month — cancel anytime.'
  ),
  cta_label = 'See Subscriptions',
  cta_href = '/classes',
  badge = null,
  is_featured = false,
  is_visible = true,
  sort_order = 20
where slug = 'online-coaching';

-- Hide the duplicate Online Classes row + the extra Guides & Meal Plans row.
update summer.offers
set is_visible = false
where slug in ('online-classes', 'guides-and-plans');

insert into summer._migrations (name) values ('20260425200000_fix_offers_dedupe')
on conflict (name) do nothing;
