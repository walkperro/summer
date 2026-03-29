update summer.site_settings
set
  site_title = 'Summer Loffler',
  hero_heading = 'Private training with strength, discipline, and presence.',
  hero_subheading = 'A refined approach to coaching for clients who want serious guidance, polished presentation, and lasting results on and off camera.',
  primary_cta_label = 'Apply for Private Training',
  primary_cta_href = '#contact',
  secondary_cta_label = 'View Portfolio',
  secondary_cta_href = '#portfolio',
  training_cta_text = 'Apply for Private Training'
where true;

update summer.section_content
set
  eyebrow = 'About Summer Loffler',
  heading = 'Grounded by hardship. Guided by discipline.',
  subheading = 'Private training and coaching in Los Angeles, shaped by Atlanta roots, lived experience, and a clear respect for what real strength requires.',
  body = jsonb_build_object(
    'paragraphs', jsonb_build_array(
      'Summer Loffler grew up in Atlanta before moving to Los Angeles, carrying with her a deep respect for resilience, discipline, and self-possession.',
      'Loss and hardship changed the way she saw herself and the world around her. Fitness became a form of grounding — not an escape, but a way to rebuild strength from the inside out.',
      'That experience shaped the way she coaches today. Her work blends private training, online coaching, strength training, glute-focused programming, and nutrition guidance with close attention to the person in front of her.',
      'Her mission is simple: help people become stronger physically and mentally, and carry that strength into every part of their lives.'
    ),
    'points', jsonb_build_array(
      'Private training with close personal oversight and real accountability.',
      'Strength training, glute-focused work, and fitness coaching shaped around the individual.',
      'A polished standard across coaching, nutrition guidance, and editorial bookings.'
    )
  )
where section_key = 'about';

update summer.section_content
set
  eyebrow = 'Ways to Work Together',
  heading = 'Ways to Work Together',
  subheading = 'Each service is built around focused attention, clear structure, and real results — whether you''re training in person, working remotely, or booking for a campaign.'
where section_key = 'offers_intro';

update summer.section_content
set
  eyebrow = 'Private Training / Online Coaching',
  heading = 'Personal training and coaching built on strength, discipline, and clarity.',
  subheading = 'For clients who want private training, online coaching, strength training, glute-focused programming, and nutrition guidance delivered with structure and real attention.',
  body = jsonb_build_object(
    'pillars', jsonb_build_array(
      'Strength training coached closely.',
      'Glute-focused work where it serves the goal.',
      'Nutrition guidance and accountability that stay realistic.'
    ),
    'lead_card', 'Progress comes from disciplined, repeatable work. Each session is tailored, closely coached, and built to move you forward with clarity.'
  )
where section_key = 'train_with_me';

update summer.section_content
set
  eyebrow = 'Mindset',
  heading = 'The body is capable. The mind decides.',
  subheading = 'Real change starts in the mind. The body follows.'
where section_key = 'signature';

update summer.section_content
set
  eyebrow = 'Gallery / Portfolio',
  heading = 'Editorial Fitness Portfolio',
  subheading = 'A closer look at the work — performance, portraiture, and polished campaign imagery shaped by strength and presence.',
  body = jsonb_build_object(
    'supporting_sentence', 'Each image reflects a balance of athletic credibility, clean presentation, and editorial restraint.'
  )
where section_key = 'gallery_intro';

update summer.section_content
set
  eyebrow = 'Contact / Inquiry',
  heading = 'Start the conversation.',
  subheading = 'Share a few details about what you''re looking for, and Summer will follow up with the best next step for private training, coaching, or bookings in Los Angeles, including Playa Del Rey, Manhattan Beach, and surrounding areas.',
  body = jsonb_build_object(
    'availability_note', 'Private training remains intentionally limited. Coaching and select brand bookings are reviewed with the same care.',
    'location_signature', 'Los Angeles / Playa Del Rey / Manhattan Beach'
  )
where section_key = 'contact_cta';

update summer.offers
set
  description = 'For brand campaigns, partnerships, and fitness or lifestyle work that requires a strong on-camera presence and professional direction.',
  bullets = jsonb_build_array(
    'Comfortable on set, easy to direct, and consistent from first concept to final frame.'
  )
where slug = 'brand-campaign-bookings';

update summer.offers
set
  description = 'Remote fitness coaching with structured programming, strength training, glute-focused work, and nutrition guidance that stays personal.',
  bullets = jsonb_build_array(
    'Structured programming built for consistency and real progress.',
    'Clear feedback without generic templates.',
    'Nutrition guidance and accountability that still feel private and tailored.'
  )
where slug = 'online-coaching';

update summer.offers
set
  description = 'Private training in Los Angeles for clients who want hands-on coaching, strength training, and lasting results built with care.',
  bullets = jsonb_build_array(
    'Hands-on coaching and protected attention.',
    'Tailored programming built around your goals.',
    'Available for select clients across Los Angeles, including Playa Del Rey and Manhattan Beach.'
  ),
  cta_label = 'Apply for Private Training'
where slug = 'private-training';

update summer.offers set sort_order = 10 where slug = 'private-training';
update summer.offers set sort_order = 20 where slug = 'online-coaching';
update summer.offers set sort_order = 30 where slug = 'brand-campaign-bookings';


update summer.media_assets
set alt_text = 'Summer Loffler seated in a calm interior, ready for inquiries about private training or bookings in Los Angeles.'
where slug = 'summer-contact';

update summer.media_assets
set alt_text = 'Summer Loffler performing a low push-up in a premium editorial fitness image.'
where slug = 'summer-gallery-fitness-1';

update summer.media_assets
set alt_text = 'Black and white editorial portrait of Summer Loffler in a black high-neck top.'
where slug = 'summer-gallery-glam-1';

update summer.media_assets
set alt_text = 'Black and white campaign portrait of Summer Loffler in a blazer and black top.'
where slug = 'summer-gallery-signature';
