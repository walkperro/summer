-- =============================================================================
-- Train With Me heading + subheading polish
-- =============================================================================
-- Replace the abstract "strength, clarity, repeatable standards" heading and
-- the listy "delivered with structure and care" subheading with concrete,
-- voice-aligned copy. Idempotent: pure UPDATE, safe to re-run.

update summer.section_content
set
  heading = 'A small coaching practice. In the room, or in your phone.',
  subheading = 'A handful of private clients in LA. A smaller online roster. Same eye on every lift, same answer to every check-in.'
where section_key = 'train_with_me';
