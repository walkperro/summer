update summer.section_content
set
  eyebrow = 'Ways to Work Together',
  heading = 'Ways to Work Together',
  subheading = 'Each service is built around focused attention, clear structure, and real results — whether you''re training in person, working remotely, or booking for a campaign.'
where section_key = 'offers_intro';

update summer.offers
set
  description = 'Private training in Los Angeles for clients who want hands-on coaching, strength training, and lasting results built with care.',
  bullets = jsonb_build_array(
    'Hands-on coaching and protected attention.',
    'Tailored programming built around your goals.',
    'Available for select clients across Los Angeles, including Playa Del Rey and Manhattan Beach.'
  ),
  cta_label = 'Apply for Private Training',
  is_featured = true,
  badge = 'Most Exclusive',
  sort_order = 10
where slug = 'private-training';

update summer.offers
set sort_order = 20
where slug = 'online-coaching';

update summer.offers
set
  description = 'For brand campaigns, partnerships, and fitness or lifestyle work that requires a strong on-camera presence and professional direction.',
  bullets = jsonb_build_array(
    'Comfortable on set, easy to direct, and consistent from first concept to final frame.'
  ),
  cta_label = 'Discuss a booking',
  is_featured = false,
  badge = null,
  sort_order = 30
where slug = 'brand-campaign-bookings';
