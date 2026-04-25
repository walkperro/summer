-- =============================================================================
-- Train With Me copy polish
-- =============================================================================
-- Replace generic methodology copy with concrete, voice-aligned coach prose.
-- Idempotent: pure UPDATE, safe to re-run.

update summer.section_content
set
  body = jsonb_build_object(
    'pillars', jsonb_build_array(
      'Squat, hinge, press — coached rep by rep, with the cue you need that day.',
      'Posterior-chain work programmed to move the lift, not pad the hour.',
      'Nutrition that survives a real week — protein, training-day calories, honest check-ins.'
    ),
    'lead_card', 'Most programs are loud. The ones that work are patient — heavy lifts, watched closely, repeated until the form is yours.'
  )
where section_key = 'train_with_me';
