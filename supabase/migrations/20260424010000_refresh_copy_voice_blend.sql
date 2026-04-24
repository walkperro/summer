-- =============================================================================
-- Copy refresh: blend Summer's authentic voice (from my-summer-body.com) with
-- the refined Hollywood-editorial brand. Updates site_settings, section_content,
-- and offers. Additive where possible, overwrites where needed.
-- =============================================================================

-- Hero + global CTAs ----------------------------------------------------------
update summer.site_settings
set
  hero_heading = 'Private training with presence. Results you carry into the rest of your life.',
  hero_subheading = 'Refined coaching in Los Angeles and online — strength, glute-focused work, and nutrition guidance from Playa Del Rey to Manhattan Beach.',
  primary_cta_label = coalesce(primary_cta_label, 'Apply for Private Training'),
  secondary_cta_label = coalesce(secondary_cta_label, 'Explore Subscriptions'),
  secondary_cta_href = '/classes',
  training_cta_text = coalesce(training_cta_text, 'Apply for Private Training'),
  booking_cta_text = coalesce(booking_cta_text, 'Discuss a booking')
where id = (select id from summer.site_settings order by updated_at desc limit 1);

-- About — blend her real voice (heal, rebuild, heavy lifting, glutes) --------
update summer.section_content
set
  heading = 'Rebuilt from the inside out.',
  subheading = 'A heavy-lifting and glutes specialist coaching private clients in Los Angeles and online — built on a belief that real strength is how you move through everything else.',
  body = jsonb_build_object(
    'paragraphs', jsonb_build_array(
      'Summer grew up in Atlanta and landed in Los Angeles, carrying with her a respect for resilience, discipline, and self-possession that shows up in every session.',
      'Loss and hardship changed the way she saw herself. Fitness became a form of grounding — not an escape, but a way to heal and rebuild strength from the inside out, physically and mentally.',
      'Today she coaches women the way she once needed to be coached: heavy lifting built around form you can trust, glute-focused programming that respects the individual, and nutrition guidance that stays realistic.',
      'Her mission is simple. Help you become stronger in your body and in your head, and carry that strength into every part of your life.'
    ),
    'points', jsonb_build_array(
      'Private training with real accountability, close personal oversight, and a polished standard.',
      'Heavy lifting, glute-focused programming, and conditioning shaped to the person in front of her.',
      'Nutrition guidance that respects how you actually live — no crash plans, no performative restriction.',
      'Coaching built on the belief that you heal and find strength by caring for your body and mind together.'
    )
  )
where section_key = 'about';

-- Offers intro ---------------------------------------------------------------
update summer.section_content
set
  eyebrow = 'Ways to Work Together',
  heading = 'Four ways to train with Summer.',
  subheading = 'Private one-to-one coaching in LA, a subscription library of classes, digital guides you can buy and keep, and brand collaborations — each priced to match the depth of attention.'
where section_key = 'offers_intro';

-- Training / Train With Me ---------------------------------------------------
update summer.section_content
set
  heading = 'Private and online coaching, built on strength, clarity, and repeatable standards.',
  subheading = 'For clients who want hands-on programming, glute-focused work, and nutrition guidance delivered with structure and care.',
  body = jsonb_build_object(
    'pillars', jsonb_build_array(
      'Heavy lifting coached closely — progressions you can hold under pressure.',
      'Glute-focused programming where it actually serves the goal.',
      'Nutrition guidance and accountability that stay realistic.'
    ),
    'lead_card', 'Progress comes from disciplined, repeatable work. Each session is tailored, closely coached, and built to move you forward with clarity — not noise.'
  )
where section_key = 'train_with_me';

-- Signature / mindset pull-quote ---------------------------------------------
update summer.section_content
set
  eyebrow = 'Mindset',
  heading = 'My summer body isn''t a deadline.',
  subheading = 'It''s a way of moving through the year — stronger, grounded, and built to last past August.',
  body = '{}'::jsonb
where section_key = 'signature';

-- Gallery intro --------------------------------------------------------------
update summer.section_content
set
  heading = 'The work, in a few frames.',
  subheading = 'Shot in Playa Del Rey, Venice, and Manhattan Beach — performance, portraiture, and the small cues that separate a coach from a face.'
where section_key = 'gallery_intro';

-- Contact CTA ---------------------------------------------------------------
update summer.section_content
set
  heading = 'Start the conversation.',
  subheading = 'Share a few details about what you''re training for — Summer will follow up personally with the right next step for private training, online coaching, subscriptions, or bookings.',
  body = jsonb_build_object(
    'availability_note', 'Private training is intentionally limited. Online coaching and brand bookings are reviewed with the same care.',
    'location_signature', 'Los Angeles · Playa Del Rey · Manhattan Beach · Venice · Santa Monica'
  )
where section_key = 'contact_cta';

-- Offers: sharper bullets, price hints, better CTAs -------------------------
update summer.offers
set
  title = 'Private Training',
  subtitle = 'Hands-on, in LA, close to home.',
  description = 'In-person coaching for clients who want Summer''s eye on every rep and a training program built around you — from warm-up to macros.',
  bullets = jsonb_build_array(
    'One-on-one sessions with Summer in Playa Del Rey and Manhattan Beach.',
    'Heavy lifting + glute-focused programming built around your goals.',
    'Nutrition guidance and weekly adjustments — no templated work.',
    'From $149 / session — packages available.'
  ),
  cta_label = 'Apply for Private Training',
  cta_href = '#contact',
  badge = 'Most Exclusive',
  is_featured = true
where slug = 'private-training';

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
  cta_href = '#contact'
where slug = 'online-coaching';

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
  cta_href = '/classes'
where slug = 'online-coaching'; -- updated above; this block is a safety no-op

-- Add a new offer row if it doesn't exist for Online Classes
insert into summer.offers (slug, title, subtitle, description, bullets, cta_label, cta_href, badge, is_featured, is_visible, sort_order)
values (
  'online-classes',
  'Online Classes',
  'The library, on your schedule.',
  'A subscription to Summer''s full class library — heavy lifting foundations, glute-focused sessions, and finishers shot in clean, full frame so you can see every cue.',
  jsonb_build_array(
    'Full class library + new drops each week.',
    'Weekly live classes on Signature and Inner Circle tiers.',
    'Private community + priority booking.',
    'From $29 / month — cancel anytime.'
  ),
  'See Subscriptions',
  '/classes',
  null,
  false,
  true,
  25
)
on conflict (slug) do nothing;

-- Guides & Meal Plans offer row ----------------------------------------------
insert into summer.offers (slug, title, subtitle, description, bullets, cta_label, cta_href, badge, is_featured, is_visible, sort_order)
values (
  'guides-and-plans',
  'Guides & Meal Plans',
  'Her own programs, printable.',
  'The glute guide, the nutrition starter, the 7-day reset — the specific tools Summer reaches for with her private clients, packaged so you can actually use them.',
  jsonb_build_array(
    'One-time purchase, yours to keep.',
    'Printable PDFs with tracking sheets.',
    'Priced from $29 — start anywhere.',
    'Bundle with a subscription to compound results.'
  ),
  'Browse Guides',
  '/plans',
  null,
  false,
  true,
  28
)
on conflict (slug) do nothing;

-- Brand / Campaign Bookings — keep, sharpen -----------------------------------
update summer.offers
set
  title = 'Brand / Campaign Bookings',
  subtitle = 'Editorial, campaign, creative partnerships.',
  description = 'For fitness and lifestyle work that needs a strong, directable on-camera presence. Consistent from first concept to final frame.',
  bullets = jsonb_build_array(
    'Comfortable on set, easy to direct.',
    'LA-based, available with light travel.',
    'Fit for fitness, wellness, fashion, and beauty campaigns.'
  ),
  cta_label = 'Discuss a booking',
  cta_href = '#contact'
where slug = 'brand-campaign-bookings';

-- Mark migration applied -----------------------------------------------------
insert into summer._migrations (name) values ('20260424010000_refresh_copy_voice_blend')
on conflict (name) do nothing;
