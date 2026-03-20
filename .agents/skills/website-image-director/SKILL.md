---
name: website-image-director
version: "2.0.0"
description: "Generate cinematic, editorial-grade website image prompts for Nano Banana and Gemini with structured JSON planning, luxury creative-direction prose, realism guards, and revision objects."
argument-hint: "black-and-white hero image, edit homepage portrait, reference-driven editorial fitness about photo"
user-invocable: true
---

# Website Image Director

Create premium website image prompts for Nano Banana Pro and Gemini image workflows.

Use this skill when the user wants:
- homepage hero imagery
- about page portraits
- services section visuals
- testimonial portraits
- CTA section images
- image edits
- reference-driven prompt construction
- image prompts that feel more cinematic, photorealistic, editorial, and luxury-led

## Goals
- Produce website-ready prompts that feel premium, cohesive, conversion-friendly, and editorial.
- Make prompts more cinematic, visually literate, and photorealistic without drifting into generic AI gloss.
- Preserve identity, facial structure, skin realism, and believable styling.
- Keep outputs reusable through a structured JSON planning layer.

## Supported Workflows
- `generate` — create a new image from scratch
- `edit` — refine or transform an existing image
- `generate_with_references` — combine reference images with a new scenario

## Non-Negotiable Rules
- Always return:
  1. a structured JSON planning object
  2. a final optimized prose prompt
  3. an optional revision object
- For edits, always separate:
  - `edit.change[]`
  - `edit.preserve[]`
- Every JSON plan must include these structured sections:
  - `subject_lock`
  - `camera_language`
  - `lighting_language`
  - `styling_language`
  - `environment_language`
  - `cinematic_language`
  - `composition_language`
  - `realism_guards`
- Every output must explicitly include:
  - text-safe composition guidance
  - mobile crop safety guidance
  - skin texture realism rules
  - facial-feature preservation rules
  - anti-drift instructions
  - anti-generic-AI-face negatives
- Default quality targets:
  - luxury realism
  - sharp facial detail
  - cohesive editorial style
  - believable lighting
  - website-safe composition
  - premium feminine athletic energy
- Prioritize usable website compositions over experimental art direction.
- Preserve negative space when the section needs text overlay.
- Write prompts like a luxury creative director briefing a top-tier photographer and retoucher, not a generic AI prompt writer.

## Required Inputs To Infer Or Ask For
When possible, infer these from the user request. If critical information is missing, ask briefly.

- `section`: `hero`, `about`, `services`, `testimonial`, or `cta`
- `workflow`: `generate`, `edit`, or `generate_with_references`
- `subject`
- `brand tone`
- `environment`
- `aspect ratio`
- `text overlay needs`
- `mobile crop priority`
- `references` if applicable

## Section Defaults

### Hero
- premium, aspirational, emotionally strong
- room for headline and CTA copy
- clean focal hierarchy
- bold image architecture with graceful negative space

### About
- warm, human, credible
- authentic but elevated
- trust-building body language
- portrait-led realism over campaign drama

### Services
- demonstrate service in action
- polished environment and readable composition
- competence, care, and premium detail
- dynamic but still controlled and website-safe

### Testimonial
- portrait-driven trust and confidence
- natural smile or calm expression
- premium but believable realism
- direct emotional readability at smaller crop sizes

### CTA
- visually simple and conversion-focused
- deliberate whitespace
- bold focal point with minimal distraction
- immediate readability for overlay copy and buttons

## Output Format

Return exactly these sections in order:

### 1. JSON Plan
Return a valid JSON object that follows `json-plan.schema.json`.

### 2. Final Prompt
Return one optimized prose prompt derived from the JSON plan.

### 3. Optional Revision
Return either:
- a revision JSON object with deltas, or
- `null` if no revision is needed yet

## Canonical JSON Shape

```json
{
  "task": "generate",
  "verb": "Create",
  "section": "hero",
  "goal": "premium cinematic website image",
  "subject": {
    "primary": "...",
    "secondary": [],
    "attributes": []
  },
  "subject_lock": {
    "identity_anchor": "...",
    "immutable_features": [],
    "facial_feature_preservation": [],
    "body_truths": [],
    "anti_drift": []
  },
  "action": "...",
  "scene": {
    "location": "...",
    "environment": "...",
    "time_of_day": "..."
  },
  "composition": {
    "shot_type": "...",
    "framing": "...",
    "angle": "...",
    "depth": "..."
  },
  "composition_language": {
    "visual_hierarchy": "...",
    "text_safe_guidance": "...",
    "mobile_crop_safety_guidance": "...",
    "subject_placement": "...",
    "eye_line": "..."
  },
  "style": {
    "visual_direction": "luxury realism",
    "editorial_reference": "premium editorial photography",
    "mood": "..."
  },
  "camera": {
    "lens": "...",
    "aperture": "...",
    "rendering": "..."
  },
  "camera_language": {
    "capture_feel": "...",
    "lens_behavior": "...",
    "focus_strategy": "...",
    "motion_treatment": "..."
  },
  "lighting": {
    "setup": "...",
    "quality": "...",
    "priority": "sharp facial detail"
  },
  "lighting_language": {
    "key_light_character": "...",
    "shadow_behavior": "...",
    "highlight_behavior": "...",
    "skin_treatment": "..."
  },
  "styling_language": {
    "wardrobe": "...",
    "grooming": "...",
    "makeup": "...",
    "overall_finish": "..."
  },
  "environment_language": {
    "spatial_mood": "...",
    "background_strategy": "...",
    "surface_materials": "...",
    "color_world": "..."
  },
  "cinematic_language": {
    "visual_arc": "...",
    "emotional_temperature": "...",
    "editorial_energy": "...",
    "luxury_signal": "..."
  },
  "realism_guards": {
    "skin_texture_rules": [],
    "facial_feature_preservation_rules": [],
    "anatomy_rules": [],
    "anti_drift_instructions": [],
    "anti_generic_ai_face_negatives": []
  },
  "materials": [],
  "references": [],
  "text_overlay_zone": {
    "placement": "...",
    "purpose": "...",
    "keep_clean": true
  },
  "edit": {
    "change": [],
    "preserve": []
  },
  "constraints": {
    "aspect_ratio": "...",
    "must_have": [],
    "avoid": []
  }
}
```

## Field Guidance

### `subject_lock`
- Lock identity before styling.
- State what cannot drift: face shape, eye spacing, nose line, lip shape, jaw taper, skin tone family, hair tone family, tattoos if visible, body proportions if visible.
- If references are provided, tell the model to treat likeness references as authoritative over mood references.
- Use `anti_drift[]` for instructions such as keeping the subject adult, athletic, feminine, elegant, and recognizable across retries.

### `camera_language`
- Describe the image like a photographer would: lens compression, focal falloff, sensor realism, focus plane, micro-contrast, motion restraint.
- Prefer language such as `85mm portrait compression`, `medium-format editorial clarity`, `soft edge rolloff`, `clean focus lock on near eye`.

### `lighting_language`
- Specify the character of light, not just the source.
- Define how highlights sit on skin, how shadows sculpt the face, and whether the light feels polished, directional, airy, moody, or luminous.
- Keep beauty lighting believable and dimensional.

### `styling_language`
- Keep tone premium, elegant, athletic, feminine, editorial.
- Wardrobe should feel elevated and body-aware without becoming overtly sexualized.
- Makeup and grooming should preserve bone structure and realism, never flatten or genericize the face.

### `environment_language`
- Treat the environment like part of the brand system.
- Describe spatial restraint, surfaces, architecture, tonal palette, and what stays intentionally out of focus.
- Avoid clutter, cheap props, and generic lifestyle filler.

### `cinematic_language`
- Add story tension, emotional temperature, and luxury image grammar.
- Use phrases like `old-Hollywood restraint`, `campaign-level stillness`, `quiet power`, `editorial calm`, `cinematic shadow architecture`, `polished monochrome discipline` when relevant.

### `composition_language`
- Always include explicit `text_safe_guidance`.
- Always include explicit `mobile_crop_safety_guidance`.
- State subject placement, eye-line logic, and how the crop should survive desktop and mobile versions.
- Protect forehead, chin, hands, and shoulder line from awkward crop risk.

### `realism_guards`
- Always include skin texture realism rules.
- Always include facial-feature preservation rules.
- Always include anti-drift instructions.
- Always include anti-generic-AI-face negatives.
- Use negatives that prevent: widened eyes, shrunk nose, overfilled lips, porcelain skin, symmetry artifacts, waxy retouching, inflated curves, extra fingers, glam-filter smoothing, uncanny beauty-ad sameness.

## Workflow Rules

### Generate
- Build around subject, action, scene, composition, style, lighting, and website use case.
- Reserve copy space when relevant.
- Use premium commercial and editorial photography language.

### Edit
- Keep the base image logic intact.
- Always define edits with:
  - `edit.change[]`
  - `edit.preserve[]`
- Be explicit about what must remain identical.
- Preserve original identity lock unless the user explicitly asks to change it.

### Reference-Driven
- Use `references[]` with a clear `role` for each image.
- Good roles include:
  - `subject`
  - `style`
  - `wardrobe`
  - `product`
  - `environment`
  - `composition`
- Explain how each reference should influence the result.
- State priority when references compete: likeness first, then composition, then style finish.

## Prompt Construction Rules
- The final prompt must read like a premium creative-direction brief.
- Open with the subject, scenario, and image intent.
- Then move through camera, lighting, styling, environment, cinematic tone, and composition.
- Fold in realism guards as explicit preservation language, not as an afterthought.
- Include a final negatives sentence that blocks generic AI beauty drift.
- Keep prose elegant and specific. Avoid bloated comma-stacks and generic adjectives.
- Name physical image qualities when possible: tonal separation, highlight restraint, pore detail, fabric response, lens compression, atmospheric depth, shadow contour.

## Prompt Optimization Rules
- Prefer believable premium photography over generic AI aesthetics.
- Prioritize realistic skin texture, natural hands, clean eyes, refined material detail, and accurate anatomy.
- For humans, specify posture, expression, wardrobe, framing, and environment.
- For web usage, include negative space, overlay planning, and mobile crop survivability.
- Avoid cheap stock-photo energy unless requested.
- Avoid influencer-glam language unless the user explicitly wants that direction.

## Revision Rules
- Use revisions only for deltas from the approved direction.
- Keep successful elements locked in `revision.preserve[]`.
- Change one major visual dimension at a time where possible.
- Never loosen subject-lock rules during revision unless the user explicitly requests a different identity read.

## Response Template

```md
## JSON Plan
{valid JSON}

## Final Prompt
{optimized prose prompt}

## Optional Revision
{revision JSON object or null}
```

## Example Outputs

### 1. Black-and-White Hollywood Glam Hero

#### JSON Plan

```json
{
  "task": "generate_with_references",
  "verb": "Create",
  "section": "hero",
  "goal": "premium cinematic website hero with old-Hollywood glamour and strong text-safe architecture",
  "subject": {
    "primary": "athletic feminine founder portrait",
    "secondary": [],
    "attributes": [
      "elegant",
      "strong",
      "editorial",
      "timeless"
    ]
  },
  "subject_lock": {
    "identity_anchor": "Preserve the reference subject exactly as an adult, elegant, athletic blonde-bronde woman with refined bone structure and believable facial asymmetry.",
    "immutable_features": [
      "long oval face shape",
      "defined cheekbones",
      "clean feminine jaw taper",
      "straight refined nose",
      "natural lip shape with fuller lower lip",
      "light eyes translated into luminous grayscale separation"
    ],
    "facial_feature_preservation": [
      "keep eye spacing realistic and calm",
      "do not shrink the nose or round the tip",
      "do not inflate the lips",
      "do not erase cheekbone structure"
    ],
    "body_truths": [
      "maintain lean athletic neck and shoulder line",
      "keep posture poised and elongated, never brittle or over-arched"
    ],
    "anti_drift": [
      "likeness references override all glam and monochrome styling cues",
      "keep her recognizable across retries",
      "keep the result adult, disciplined, feminine, and editorial rather than doll-like"
    ]
  },
  "action": "Hold a poised still portrait with direct eye contact and a quiet, commanding expression.",
  "scene": {
    "location": "controlled editorial studio",
    "environment": "minimal black backdrop with soft tonal separation",
    "time_of_day": "studio-controlled timeless night"
  },
  "composition": {
    "shot_type": "tight hero portrait",
    "framing": "head-and-shoulders with elegant headroom",
    "angle": "slight three-quarter turn toward camera",
    "depth": "shallow but not dreamy, crisp focus on the near eye"
  },
  "composition_language": {
    "visual_hierarchy": "eyes first, cheekbone structure second, hair silhouette third",
    "text_safe_guidance": "Keep a clean low-detail negative-space lane on frame left for headline and CTA copy without bright highlights or stray hair.",
    "mobile_crop_safety_guidance": "Protect the full forehead, both eyes, nose line, chin, and top of shoulders inside a centered vertical safe zone so a 9:16 hero crop still feels complete.",
    "subject_placement": "subject offset slightly right of center",
    "eye_line": "direct lens connection for instant homepage impact"
  },
  "style": {
    "visual_direction": "luxury realism",
    "editorial_reference": "black-and-white Hollywood portraiture interpreted through modern fashion-editorial discipline",
    "mood": "iconic, restrained, expensive"
  },
  "camera": {
    "lens": "85mm portrait lens",
    "aperture": "f/4",
    "rendering": "medium-format clarity with rich grayscale tonality"
  },
  "camera_language": {
    "capture_feel": "precise studio portrait with expensive optical discipline",
    "lens_behavior": "subtle portrait compression with clean facial proportions and soft edge falloff",
    "focus_strategy": "lock critical focus on the near eye and keep lips and cheek contour clean",
    "motion_treatment": "no motion blur, only calm stillness"
  },
  "lighting": {
    "setup": "large directional key with controlled fill and gentle hair separation",
    "quality": "sculpted, luminous, dimensional",
    "priority": "sharp facial detail"
  },
  "lighting_language": {
    "key_light_character": "soft but directional beauty light that shapes cheekbones and jaw without flattening the face",
    "shadow_behavior": "velvety falloff with cinematic density, never muddy under the eyes",
    "highlight_behavior": "silver-rich highlights on eyes, lips, and hair with restraint",
    "skin_treatment": "retain pores and natural tonal transitions, never waxy or over-polished"
  },
  "styling_language": {
    "wardrobe": "minimal black styling with clean neckline and no distracting embellishment",
    "grooming": "polished editorial hair with controlled volume and glossy texture",
    "makeup": "classic sculpting translated into believable monochrome contrast, not retro costume makeup",
    "overall_finish": "timeless, feminine, athletic, premium"
  },
  "environment_language": {
    "spatial_mood": "quiet studio drama with no clutter",
    "background_strategy": "deep monochrome field with enough tonal lift to separate hair and shoulder line",
    "surface_materials": "matte black and satin tonal response only",
    "color_world": "full black-and-white grayscale with luxurious silver separation"
  },
  "cinematic_language": {
    "visual_arc": "from stillness to iconography in a single frame",
    "emotional_temperature": "cool, composed, quietly magnetic",
    "editorial_energy": "campaign-level restraint with old-Hollywood poise",
    "luxury_signal": "precision, polish, and tonal discipline rather than overt spectacle"
  },
  "realism_guards": {
    "skin_texture_rules": [
      "preserve fine skin texture and natural pore detail",
      "keep realistic under-eye texture and lip texture",
      "avoid plastic smoothing, porcelain blur, or AI beauty-filter skin"
    ],
    "facial_feature_preservation_rules": [
      "preserve face length, cheekbone width, jaw taper, and nose line exactly",
      "preserve natural lip proportions and cupid's bow",
      "preserve believable asymmetry instead of perfect mirror symmetry"
    ],
    "anatomy_rules": [
      "keep neck length, shoulder slope, and clavicle structure believable",
      "avoid exaggerated curves or doll-like proportions"
    ],
    "anti_drift_instructions": [
      "do not let glam styling replace identity",
      "do not age the subject down or up unnaturally",
      "do not drift into vintage cosplay or generic beauty-campaign sameness"
    ],
    "anti_generic_ai_face_negatives": [
      "no widened eyes",
      "no button nose",
      "no overfilled lips",
      "no frozen symmetry",
      "no plastic skin",
      "no influencer-glam face swap"
    ]
  },
  "materials": [
    "matte black backdrop",
    "soft glossy hair texture"
  ],
  "references": [
    {
      "role": "subject",
      "influence": "lock facial identity and bone structure"
    },
    {
      "role": "style",
      "influence": "steer monochrome Hollywood glam tone without overriding likeness"
    }
  ],
  "text_overlay_zone": {
    "placement": "left third",
    "purpose": "headline and CTA",
    "keep_clean": true
  },
  "edit": {
    "change": [],
    "preserve": []
  },
  "constraints": {
    "aspect_ratio": "16:9",
    "must_have": [
      "editorial-grade grayscale separation",
      "recognizable likeness",
      "headline-safe negative space"
    ],
    "avoid": [
      "camp retro styling",
      "waxy skin",
      "generic AI glamour",
      "harsh fitness-ad grit"
    ]
  }
}
```

#### Final Prompt

Create a cinematic black-and-white homepage hero portrait of the reference subject as an elegant, athletic, feminine founder rendered with old-Hollywood restraint and modern editorial precision. Preserve her exact long-oval face shape, cheekbone definition, jaw taper, straight refined nose, natural lip shape, believable asymmetry, and recognizable adult identity; likeness references must override all mood styling. Frame her in a tight head-and-shoulders composition, slightly right of center, with direct eye contact and quiet command, leaving a clean low-detail lane on the left for headline and CTA copy. Shoot with the feel of an 85mm portrait lens at roughly f/4, medium-format clarity, crisp focus on the near eye, subtle portrait compression, and calm stillness with no artificial motion blur. Use sculpted luminous studio lighting with a soft directional key, controlled fill, graceful shadow falloff, and restrained silver highlights that shape the cheekbones and jaw while keeping skin dimensional and real. Style the image with polished editorial hair, minimal black wardrobe, and classic monochrome beauty treatment that feels timeless, expensive, strong, and feminine without tipping into retro costume or over-sexualized glam. Keep the background quiet, dark, and tonally separated so the hair and shoulder line read cleanly. Preserve fine pore detail, natural lip texture, and realistic under-eye texture; do not smooth the skin into plastic perfection. Protect the full face and shoulder line inside a centered vertical safe zone so the image survives a mobile 9:16 crop without clipping the forehead, chin, or eyes. Avoid widened eyes, button-nose drift, overfilled lips, frozen symmetry, influencer-glam polish, waxy retouching, or any generic AI beauty-face result.

#### Optional Revision

`null`

### 2. Warm Neutral Editorial Fitness Portrait

#### JSON Plan

```json
{
  "task": "generate_with_references",
  "verb": "Create",
  "section": "about",
  "goal": "warm neutral editorial fitness portrait for trust-building website use",
  "subject": {
    "primary": "athletic female founder portrait",
    "secondary": [],
    "attributes": [
      "approachable",
      "disciplined",
      "premium",
      "warm"
    ]
  },
  "subject_lock": {
    "identity_anchor": "Preserve the subject as the same elegant athletic woman from the likeness references, with no beauty-filter drift.",
    "immutable_features": [
      "long oval face",
      "defined cheekbones",
      "light eyes",
      "straight refined nose",
      "natural lip shape",
      "blonde-bronde hair family"
    ],
    "facial_feature_preservation": [
      "keep the jaw feminine and defined",
      "keep the lips soft and real",
      "keep the eyes calm rather than widened",
      "keep the nose elegant rather than shortened"
    ],
    "body_truths": [
      "lean athletic shoulders and arms",
      "balanced feminine proportions",
      "posture reads strong and grounded rather than posed for seduction"
    ],
    "anti_drift": [
      "maintain likeness across warm color grading and fitness styling",
      "do not genericize the face into wellness-ad sameness",
      "keep the expression credible and human"
    ]
  },
  "action": "Stand or sit with relaxed upright posture and direct but welcoming eye contact.",
  "scene": {
    "location": "refined training studio or minimalist editorial interior",
    "environment": "clean warm-neutral space with soft depth",
    "time_of_day": "late-morning natural light feel"
  },
  "composition": {
    "shot_type": "chest-up editorial fitness portrait",
    "framing": "4:5 vertical with breathing room around head and shoulders",
    "angle": "straight-on with slight body turn",
    "depth": "moderate depth, subject crisp against softly diffused background"
  },
  "composition_language": {
    "visual_hierarchy": "eyes first, expression second, athletic posture third",
    "text_safe_guidance": "Keep one outer side of the frame calm and uncluttered for optional biography copy or quote overlay.",
    "mobile_crop_safety_guidance": "Keep head, shoulders, and upper torso centered inside a tall safe zone so vertical crops retain the subject's posture and facial balance.",
    "subject_placement": "near center with slight offset for layout flexibility",
    "eye_line": "direct, warm, credible"
  },
  "style": {
    "visual_direction": "luxury realism",
    "editorial_reference": "warm neutral fitness editorial portraiture with premium magazine restraint",
    "mood": "grounded, elevated, trustworthy"
  },
  "camera": {
    "lens": "85mm or 100mm portrait lens",
    "aperture": "f/3.5 to f/4.5",
    "rendering": "high-end editorial clarity with natural tonal softness"
  },
  "camera_language": {
    "capture_feel": "polished editorial portrait with intimate realism",
    "lens_behavior": "flattering compression with honest facial proportions",
    "focus_strategy": "sharp eyes, clean skin detail, gentle falloff through ears and background",
    "motion_treatment": "still and composed"
  },
  "lighting": {
    "setup": "large soft key with subtle bounce and ambient window-light influence",
    "quality": "warm, clean, flattering, dimensional",
    "priority": "sharp facial detail"
  },
  "lighting_language": {
    "key_light_character": "creamy directional softness that wraps the face without flattening bone structure",
    "shadow_behavior": "delicate shadow contour under cheekbones and jaw with no muddy cast",
    "highlight_behavior": "gentle skin highlights with no oily glare",
    "skin_treatment": "natural texture, healthy warmth, and realistic tonal variation"
  },
  "styling_language": {
    "wardrobe": "elevated neutral activewear or minimalist fitted styling in beige, stone, taupe, or soft black",
    "grooming": "clean polished hair with natural movement",
    "makeup": "subtle editorial grooming that enhances structure without influencer-glam heaviness",
    "overall_finish": "premium, feminine, athletic, approachable"
  },
  "environment_language": {
    "spatial_mood": "minimal, warm, airy, expensive",
    "background_strategy": "soft architectural or studio cues kept out of focus and uncluttered",
    "surface_materials": "stone, plaster, brushed neutral textures, refined fitness equipment only if elegant",
    "color_world": "warm beige, oat, sand, stone, and soft shadow neutrals"
  },
  "cinematic_language": {
    "visual_arc": "personal trust portrait with campaign polish",
    "emotional_temperature": "warm, calm, self-possessed",
    "editorial_energy": "magazine-level restraint with wellness-luxury clarity",
    "luxury_signal": "tasteful minimalism, not flash"
  },
  "realism_guards": {
    "skin_texture_rules": [
      "retain pores, natural cheek texture, and lip texture",
      "keep realistic tonal transitions around nose, mouth, and under-eyes",
      "no airbrushed plastic smoothing"
    ],
    "facial_feature_preservation_rules": [
      "preserve eye spacing, jaw taper, cheekbone structure, and nose length",
      "preserve the real lip proportions and cupid's bow",
      "preserve believable asymmetry and expression lines"
    ],
    "anatomy_rules": [
      "keep shoulders, arms, and torso slim-athletic and believable",
      "avoid cartoon abs, exaggerated bust, or inflated glutes"
    ],
    "anti_drift_instructions": [
      "do not turn the subject into a generic wellness influencer",
      "do not over-soften facial structure",
      "do not over-glamorize hair, makeup, or body shape"
    ],
    "anti_generic_ai_face_negatives": [
      "no doll-like symmetry",
      "no enlarged eyes",
      "no tiny nose",
      "no overfilled lips",
      "no fake-lash beauty-ad face",
      "no waxy skin"
    ]
  },
  "materials": [
    "soft matte activewear",
    "neutral architectural surfaces"
  ],
  "references": [
    {
      "role": "subject",
      "influence": "preserve face and body truth"
    },
    {
      "role": "wardrobe",
      "influence": "steer elevated fitness styling"
    },
    {
      "role": "environment",
      "influence": "maintain warm neutral editorial space"
    }
  ],
  "text_overlay_zone": {
    "placement": "outer side margin",
    "purpose": "optional quote or bio copy",
    "keep_clean": true
  },
  "edit": {
    "change": [],
    "preserve": []
  },
  "constraints": {
    "aspect_ratio": "4:5",
    "must_have": [
      "trust-building expression",
      "real skin texture",
      "premium fitness-editorial styling"
    ],
    "avoid": [
      "cheap gym look",
      "stock-photo smile",
      "heavy contour makeup",
      "generic wellness-ad face"
    ]
  }
}
```

#### Final Prompt

Create a warm neutral editorial fitness portrait for an about-page or founder-profile placement, featuring the reference subject as a disciplined, feminine, athletic woman rendered with premium magazine realism and immediate trust. Preserve her exact face shape, cheekbone structure, jaw taper, straight refined nose, real lip proportions, light eyes, blonde-bronde hair family, and believable adult asymmetry; the likeness references must stay authoritative over all styling choices. Compose the image as a chest-up 4:5 portrait with relaxed upright posture, a slight body turn, direct but welcoming eye contact, and enough calm outer-frame space for optional biography copy. Capture it with the feel of an 85mm to 100mm portrait lens at roughly f/4, with flattering compression, sharp focus in the eyes, honest facial proportions, and soft background falloff. Light the portrait with a large warm-soft directional key and subtle bounce so the face feels dimensional, polished, and alive, with delicate cheekbone contour, restrained highlights, and realistic tonal transitions around the mouth, nose, and under-eyes. Style her in elevated neutral activewear or minimalist fitted wardrobe in stone, oat, beige, taupe, or soft black, with clean polished hair and subtle editorial grooming that enhances structure without drifting into influencer glam. Keep the environment minimal, airy, and expensive, with refined neutral surfaces and only the lightest hint of elegant fitness context. Preserve natural pores, lip texture, and authentic skin variation; do not airbrush the face into plastic smoothness. Keep the full head, shoulders, and upper torso protected inside a vertical safe zone so mobile crops retain posture and facial balance. Avoid widened eyes, tiny-nose drift, overfilled lips, fake-lash beauty-ad styling, doll-like symmetry, cartoon abs, inflated curves, or any generic AI wellness-face result.

#### Optional Revision

`null`

### 3. Selective-Color Statement Hero

#### JSON Plan

```json
{
  "task": "generate_with_references",
  "verb": "Create",
  "section": "hero",
  "goal": "statement website hero with mostly monochrome treatment and one restrained accent color",
  "subject": {
    "primary": "iconic athletic-feminine hero portrait",
    "secondary": [],
    "attributes": [
      "bold",
      "luxury",
      "editorial",
      "controlled"
    ]
  },
  "subject_lock": {
    "identity_anchor": "Keep the subject unmistakably tied to the likeness references, with facial structure preserved ahead of all color and styling effects.",
    "immutable_features": [
      "face length and cheekbones",
      "jawline taper",
      "straight refined nose",
      "real lip shape",
      "light-eye structure",
      "athletic feminine body proportions"
    ],
    "facial_feature_preservation": [
      "do not inflate lips",
      "do not shrink the nose",
      "do not over-round the face",
      "do not widen the eyes or erase asymmetry"
    ],
    "body_truths": [
      "lean athletic silhouette with elegant shoulder line",
      "strong but feminine posture",
      "no exaggerated curves"
    ],
    "anti_drift": [
      "selective color is secondary to likeness",
      "keep the result premium and restrained rather than gimmicky",
      "maintain the same recognizable subject through all hero variations"
    ]
  },
  "action": "Hold a strong still pose with direct eye contact or slightly off-axis gaze, depending which creates better text-safe balance.",
  "scene": {
    "location": "editorial studio or minimal architectural setting",
    "environment": "mostly monochrome luxury environment with one intentional accent-color element",
    "time_of_day": "controlled cinematic light"
  },
  "composition": {
    "shot_type": "wide statement hero portrait",
    "framing": "waist-up or three-quarter composition with strong negative space",
    "angle": "slightly low or level for authority",
    "depth": "subject crisp, background simplified"
  },
  "composition_language": {
    "visual_hierarchy": "face first, accent color second, silhouette third",
    "text_safe_guidance": "Reserve one broad calm field for headline copy so the accent color never competes with typography.",
    "mobile_crop_safety_guidance": "Keep face, upper torso, and accent-color cue inside the central vertical corridor so the hero still reads when cropped tightly for mobile.",
    "subject_placement": "offset composition with deliberate luxury negative space",
    "eye_line": "strong and readable at homepage scale"
  },
  "style": {
    "visual_direction": "luxury realism",
    "editorial_reference": "modern monochrome campaign imagery with one restrained selective-color statement",
    "mood": "bold, elegant, iconic"
  },
  "camera": {
    "lens": "70mm to 90mm portrait lens",
    "aperture": "f/4 to f/5.6",
    "rendering": "high-end commercial sharpness with cinematic tonal control"
  },
  "camera_language": {
    "capture_feel": "campaign-ready still frame with controlled authority",
    "lens_behavior": "clean proportions, elegant compression, polished edge separation",
    "focus_strategy": "face and accent-color detail remain crisp",
    "motion_treatment": "still, graphic, intentional"
  },
  "lighting": {
    "setup": "sculpted directional key with shaped contrast and subtle fill",
    "quality": "graphic, premium, dimensional",
    "priority": "sharp facial detail"
  },
  "lighting_language": {
    "key_light_character": "controlled cinematic light with crisp facial modeling",
    "shadow_behavior": "deep but readable shadow architecture",
    "highlight_behavior": "restrained highlights that support luxury polish without turning metallic",
    "skin_treatment": "real skin with detail preserved through monochrome grading"
  },
  "styling_language": {
    "wardrobe": "sleek black, charcoal, silver, or ivory styling with one accent-color element only if elegant",
    "grooming": "clean editorial hair and refined grooming",
    "makeup": "minimal but structured, premium, and believable",
    "overall_finish": "sharp, feminine, athletic, luxurious"
  },
  "environment_language": {
    "spatial_mood": "quiet luxury with graphic discipline",
    "background_strategy": "simplified monochrome architecture or studio space with no clutter",
    "surface_materials": "matte black, soft concrete, brushed metal, satin fabric, or polished stone",
    "color_world": "predominantly monochrome with one controlled accent such as deep red, emerald, or muted gold"
  },
  "cinematic_language": {
    "visual_arc": "heroic stillness with a single visual hook",
    "emotional_temperature": "cool confidence with sensual restraint",
    "editorial_energy": "high-fashion campaign discipline with athletic edge",
    "luxury_signal": "minimalism, precision, and restraint"
  },
  "realism_guards": {
    "skin_texture_rules": [
      "maintain natural pore detail and realistic tonal transitions even under monochrome treatment",
      "do not posterize or over-smooth skin",
      "keep lips and eyes textured and alive"
    ],
    "facial_feature_preservation_rules": [
      "preserve the exact face architecture from the likeness references",
      "preserve natural asymmetry and facial maturity",
      "preserve athletic elegance rather than turning the subject into a generic glam archetype"
    ],
    "anatomy_rules": [
      "keep body proportions slender-athletic and believable",
      "avoid impossible waist, chest, or glute exaggeration"
    ],
    "anti_drift_instructions": [
      "do not let selective color become a gimmick",
      "do not drift into cyberpunk, poster art, or synthetic beauty-campaign aesthetics",
      "do not let style references replace identity"
    ],
    "anti_generic_ai_face_negatives": [
      "no generic AI blonde",
      "no enlarged eyes",
      "no overfilled lips",
      "no shrunken nose",
      "no frozen symmetry",
      "no plastic skin",
      "no beauty-filter perfection"
    ]
  },
  "materials": [
    "matte monochrome wardrobe",
    "single accent-color detail",
    "polished luxury surfaces"
  ],
  "references": [
    {
      "role": "subject",
      "influence": "lock identity and facial proportions"
    },
    {
      "role": "style",
      "influence": "guide monochrome luxury and selective-color restraint"
    },
    {
      "role": "composition",
      "influence": "support negative-space hero framing"
    }
  ],
  "text_overlay_zone": {
    "placement": "clean side field or upper quadrant",
    "purpose": "homepage headline and CTA",
    "keep_clean": true
  },
  "edit": {
    "change": [],
    "preserve": []
  },
  "constraints": {
    "aspect_ratio": "16:9",
    "must_have": [
      "single accent color only",
      "hero-safe negative space",
      "recognizable likeness",
      "premium campaign realism"
    ],
    "avoid": [
      "multiple accent colors",
      "neon treatment",
      "cyberpunk mood",
      "posterized skin",
      "generic AI glamour"
    ]
  }
}
```

#### Final Prompt

Create a statement homepage hero portrait of the reference subject with a predominantly monochrome luxury palette and only one restrained accent color used as a deliberate visual hook. Preserve her exact face architecture, cheekbone structure, jaw taper, straight refined nose, natural lip shape, believable asymmetry, light-eye structure, and elegant athletic body proportions; the likeness references must remain authoritative and selective-color styling must never override identity. Build the composition as a wide hero frame with strong negative space for typography, offsetting the subject so the face lands first, the accent color lands second, and the silhouette reads cleanly at a distance. Keep the face, upper torso, and accent-color cue inside the central vertical corridor so the image can be cropped for mobile without losing the hero idea. Capture the image with the feel of a high-end commercial portrait lens in the 70mm to 90mm range at roughly f/4 to f/5.6, with clean compression, crisp facial detail, and graphic stillness. Use sculpted directional lighting with deep but readable shadow architecture, disciplined highlights, and dimensional skin rendering that keeps pores, lips, and eyes alive through the monochrome treatment. Style the subject in sleek black, charcoal, silver, ivory, or similarly refined tones, introducing a single elegant accent such as deep red, muted emerald, or restrained gold only if it strengthens the composition. Keep the environment minimal, architectural, and expensive, with no clutter and no gimmick. Preserve real skin texture and believable anatomy; avoid posterized grading, cyberpunk color language, plastic retouching, widened eyes, tiny-nose drift, overfilled lips, frozen symmetry, inflated curves, or any generic AI beauty-face result.

#### Optional Revision

`null`
