-- =============================================================================
-- Fix: Offers had grown to 4-5 rows because an earlier migration (20260424010000)
-- accidentally double-wrote the `online-coaching` slug with "Online Classes"
-- content (the "safety no-op" block) and then inserted a separate `online-classes`
-- row alongside it. Result: the home Offers section showed two cards titled
-- "Online Classes" and the canonical Online Coaching content was lost.
--
-- This migration restores Online Coaching content on the `online-coaching` slug
-- and hides the duplicate `online-classes` row + the `guides-and-plans` row so
-- the home page lands back at the original three offers (Private Training,
-- Online Coaching, Brand / Campaign Bookings).
-- =============================================================================

update summer.offers
set
  title = 'Online Coaching',
  subtitle = 'Remote structure, personal oversight.',
  description = 'Remote programming with structured heavy lifting, glute-focused work, and nutrition guidance that stays personal. For clients who want the real thing without generic templates.',
  bullets = jsonb_build_array(
    'Programming built for consistency and visible progress.',
    'Form review and weekly adjustments on the lifts that matter.',
    'Nutrition guidance that respects how you live.',
    'From $349 / month — 8-week minimum.'
  ),
  cta_label = 'Explore coaching',
  cta_href = '#contact',
  badge = null,
  is_featured = false,
  is_visible = true,
  sort_order = 20
where slug = 'online-coaching';

update summer.offers
set is_visible = false
where slug in ('online-classes', 'guides-and-plans');

insert into summer._migrations (name) values ('20260425200000_fix_offers_dedupe')
on conflict (name) do nothing;
