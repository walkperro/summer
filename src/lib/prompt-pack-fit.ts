import type { PromptPackEntry } from "@/lib/prompt-pack";

export const fitPromptEntries: PromptPackEntry[] = [
  {
    id: "train_with_me_pushup_intensity",
    title: "Train With Me / Pushup Intensity",
    section: "train_with_me",
    workflow: "fit_generate_campaign",
    language_system_version: "2.1",
    use_case: "Train With Me hero sequence, strength-forward campaign frame, or cinematic performance opener.",
    prompt:
      "Create a cinematic Nike-style editorial sports campaign image of the attached woman in a low-to-the-ground pushup-intensity moment inspired by the imported court and plank references. Preserve the exact same woman with strong likeness fidelity, adult athletic elegance, believable effort, and premium modeling-plus-fitness crossover energy. The frame should feel captured mid-session rather than posed, with direct focus, authentic shoulder and torso loading, realistic pores, subtle skin texture, believable sweat sheen, premium directional lighting, and a clean luxury sports environment. Avoid generic standing fitness poses, fake gym-poster energy, fake background text, fake brand logos, tattoo drift, oversized tattoos, or synthetic plastic skin. Keep the image premium, cinematic, active, and campaign-ready.",
    avoid: [
      "generic standing gym pose",
      "fake motivational poster look",
      "fake background typography",
      "fake brand logos",
      "tattoo drift",
      "oversized tattoos",
      "plastic skin",
      "awkward body mechanics",
    ],
    aspect_ratio: "16:9",
    recommended_framing:
      "wide editorial action frame with grounded body mechanics, premium negative space, and campaign-safe composition",
    likeness_priority: "highest",
    generation_stage: "approval_round_native_high_res_then_4k",
    export_goal:
      "Approve as a signature Train With Me action frame, then extend into a matched campaign family across widescreen and 4K outputs.",
    creative_direction: {
      subject_lock: {
        identity_anchor:
          "Preserve the same exact woman across all Train With Me outputs with likeness-first face fidelity, athletic realism, and believable asymmetry.",
        facial_feature_preservation: [
          "preserve her exact eye structure, jaw taper, refined nose line, and natural lip proportions",
          "keep the body athletic, feminine, strong, and realistic rather than bodybuilder-stylized",
          "maintain tattoo placement, size, and subtle visibility without drift",
        ],
        anti_drift: [
          "likeness outranks all sports-campaign stylization",
          "do not drift into generic fitness-ad sameness or influencer-face beauty filtering",
        ],
      },
      camera_language: {
        capture_feel: "cinematic campaign still captured during a low-ground effort beat rather than a static demo pose",
        lens_behavior: "35mm to 50mm editorial sport perspective with honest anatomy and premium spatial depth",
        focus_strategy: "crisp facial plane, loaded shoulder tension, and court-or-ground texture with controlled environmental falloff",
      },
      lighting_language: {
        key_light_character: "premium directional sports lighting with sculpted highlights and believable sheen",
        shadow_behavior: "clean athletic shadow shape that supports movement without harsh poster contrast",
        skin_treatment: "retain realistic pores, subtle sweat sheen, and authentic skin texture",
      },
      styling_language: {
        wardrobe: "clean luxury activewear with minimal or no visible branding",
        grooming: "controlled athletic grooming with natural movement and no beauty-filter polish",
        makeup: "subtle editorial sports finish, never influencer glam",
      },
      environment_language: {
        spatial_mood: "clean luxury performance environment with court or lawn logic and no visual clutter",
        background_strategy: "keep backgrounds free of fake text, fake signage, and distracting gym noise while preserving premium athletic realism",
      },
      cinematic_language: {
        visual_arc: "effort and focus rendered as premium campaign storytelling",
        editorial_energy: "Nike-style editorial sports campaign realism with luxury restraint",
      },
      composition_language: {
        text_safe_guidance:
          "Keep one clean side lane or upper field available for campaign typography without making the frame feel like a poster template.",
        mobile_crop_safety_guidance:
          "Protect the face, working torso, and strongest limb line inside the central crop-safe corridor for social and vertical adaptations.",
        subject_placement: "dynamic off-center placement with believable tension and premium negative space",
      },
      realism_guards: {
        skin_texture_rules: [
          "preserve visible pores and subtle real skin texture",
          "keep believable sweat response rather than oily glamour shine",
          "do not overdefine abs or overcarve muscles",
        ],
        anti_generic_ai_face_negatives: [
          "no generic athlete-ad face",
          "no doll symmetry",
          "no beauty-filter smoothing",
          "no fake anatomy or limb distortion",
        ],
      },
    },
    google_ai_studio_attachments: {
      likeness: [],
      body: [],
      style: [],
      attachment_notes:
        "Select 2 to 4 summer_fit reference images in the fit campaign workflow. Prioritize one likeness-stable anchor, one movement anchor, and one environment or styling anchor.",
    },
  },
  {
    id: "train_with_me_concrete_seated",
    title: "Train With Me / Concrete Seated",
    section: "train_with_me",
    workflow: "fit_generate_campaign",
    language_system_version: "2.1",
    use_case: "Premium seated recovery image, intro card, or luxury coaching campaign portrait.",
    prompt:
      "Create a cinematic Nike-style editorial sports campaign image of the attached woman seated in a curved concrete or similarly architectural environment, using the imported red-top seated reference as the emotional benchmark for calm post-session authority. Preserve the same exact woman with strong likeness, realistic pores, subtle skin texture, believable sweat sheen, clean activewear styling, and premium lighting. The scene should feel like a luxury editorial sports campaign with direct presence and polished restraint, not a generic gym poster or casual lifestyle snapshot. Keep the pose grounded, nuanced, and natural rather than stiff or awkward. Avoid fake background text, fake brand logos, tattoo drift, oversized tattoos, or artificial retouching.",
    avoid: [
      "generic seated Instagram pose",
      "fake gym poster styling",
      "fake text in concrete background",
      "fake brand logos",
      "tattoo drift",
      "oversized tattoos",
      "plastic skin",
      "awkward static posture",
    ],
    aspect_ratio: "16:9",
    recommended_framing:
      "three-quarter seated editorial composition with architectural breathing room and premium campaign balance",
    likeness_priority: "highest",
    generation_stage: "approval_round_native_high_res_then_4k",
    export_goal:
      "Approve as a calm premium Train With Me support frame that still holds campaign-family likeness and finish.",
    creative_direction: {
      subject_lock: {
        identity_anchor:
          "Keep the same exact woman as the campaign lead with facial structure and athletic body realism preserved before all styling choices.",
        facial_feature_preservation: [
          "preserve her real face shape, eyes, jawline, lips, and nose line",
          "keep her body proportions long, athletic, feminine, and believable",
          "maintain tattoo scale and placement realistically",
        ],
        anti_drift: [
          "do not soften the identity into generic wellness-campaign prettiness",
          "avoid over-retouched skin or fashion-only detachment from fitness realism",
        ],
      },
      camera_language: {
        capture_feel: "editorial sports portrait with cinematic calm, direct presence, and physical credibility",
        lens_behavior: "50mm to 70mm premium perspective with honest seated anatomy and spatial clarity",
        focus_strategy: "sharp face and fabric detail with graceful environmental falloff",
      },
      lighting_language: {
        key_light_character: "premium natural or architectural light with refined skin separation",
        shadow_behavior: "soft sculpting that keeps the image grounded and expensive",
        skin_treatment: "retain visible pores, subtle sweat, and natural tonal transitions",
      },
      styling_language: {
        wardrobe: "clean luxury activewear with sophisticated restraint and no loud branding",
        grooming: "athletic polish with believable flyaways and effort-informed realism",
        makeup: "subtle editorial sports finish with no heavy contour",
      },
      environment_language: {
        spatial_mood: "architectural, clean, premium, disciplined, slightly monolithic",
        background_strategy: "curved concrete or minimal structured surfaces with no distracting signage or fake typography",
      },
      cinematic_language: {
        visual_arc: "recovery and command after effort",
        editorial_energy: "luxury sports campaign restraint with human realism",
      },
      composition_language: {
        text_safe_guidance: "Preserve a calm architectural lane for web headline placement without turning the frame into ad artifice.",
        mobile_crop_safety_guidance:
          "Keep head, shoulders, torso, and seated pose geometry intact in the central crop-safe zone.",
        subject_placement: "anchored asymmetrically within a refined architectural frame",
      },
      realism_guards: {
        skin_texture_rules: [
          "show real pores and subtle skin texture",
          "keep believable sweat sheen and fabric response",
          "avoid smoothing away training realism",
        ],
        anti_generic_ai_face_negatives: [
          "no generic sportswear model face",
          "no symmetry artifacts",
          "no fake luxury gloss skin",
        ],
      },
    },
    google_ai_studio_attachments: {
      likeness: [],
      body: [],
      style: [],
      attachment_notes:
        "Select 2 to 4 summer_fit references that combine a seated concrete pose anchor with one close likeness anchor and one styling or environment anchor.",
    },
  },
  {
    id: "train_with_me_band_squat",
    title: "Train With Me / Band Squat",
    section: "train_with_me",
    workflow: "fit_generate_campaign",
    language_system_version: "2.1",
    use_case: "Lower-body training hero, section opener, or movement-specific campaign visual.",
    prompt:
      "Create a cinematic Nike-style editorial sports campaign image of the attached woman performing a resistance-band squat or closely related lower-body training action, using the imported white-seamless profile squat reference as the movement benchmark. Preserve the same exact woman, realistic athletic proportions, believable effort, visible pores, subtle sweat sheen, and clean activewear styling. The frame should feel premium and cinematic with authentic body mechanics, honest knee-and-hip alignment, and luxury fitness environment control, never like a stock workout poster. Avoid fake brand logos, fake background text, stiff demo-form posing, tattoo drift, oversized tattoos, exaggerated musculature, or plastic retouching.",
    avoid: [
      "generic squat demo pose",
      "fake gym poster energy",
      "fake background text",
      "fake brand logos",
      "tattoo drift",
      "oversized tattoos",
      "bodybuilder bulk",
      "plastic skin",
    ],
    aspect_ratio: "16:9",
    recommended_framing:
      "wide or mid-wide training composition with grounded leg mechanics and clean luxury negative space",
    likeness_priority: "highest",
    generation_stage: "approval_round_native_high_res_then_4k",
    export_goal:
      "Approve as a matched movement-focused campaign image that stays consistent with the Train With Me family.",
    creative_direction: {
      subject_lock: {
        identity_anchor:
          "Preserve the same exact woman with strong face continuity, realistic athletic body mechanics, and subtle tattoo accuracy.",
        facial_feature_preservation: [
          "keep facial identity intact even in a movement-led frame",
          "preserve long athletic proportions and feminine strength without exaggeration",
          "keep tattoo placement natural and subordinate to the overall image",
        ],
        anti_drift: [
          "movement intensity must not cause anatomy drift",
          "do not turn the subject into a generic commercial athlete archetype",
        ],
      },
      camera_language: {
        capture_feel: "editorial training still with real momentum and physical credibility",
        lens_behavior: "35mm to 50mm campaign perspective with accurate limb scale and luxury depth",
        focus_strategy: "keep face, torso, and band interaction readable while letting the background fall away cleanly",
      },
      lighting_language: {
        key_light_character: "premium sport lighting with clean edge definition and realistic sheen",
        shadow_behavior: "sculpted but believable shadows that honor movement mechanics",
        skin_treatment: "visible pores, subtle sweat, and honest texture without over-sharpening",
      },
      styling_language: {
        wardrobe: "clean activewear with luxury cut, minimal branding, and no distracting graphics",
        grooming: "performance-ready grooming that still feels editorial and premium",
        makeup: "light sports editorial finish, not glamour-beauty makeup",
      },
      environment_language: {
        spatial_mood: "clean luxury training environment with white-seamless or disciplined studio order",
        background_strategy: "remove clutter and fake signage while keeping the setting credible and premium",
      },
      cinematic_language: {
        visual_arc: "controlled lower-body power with campaign composure",
        editorial_energy: "premium sports-campaign realism with cinematic discipline",
      },
      composition_language: {
        text_safe_guidance:
          "Leave one clean negative-space zone for section copy without flattening the movement rhythm.",
        mobile_crop_safety_guidance:
          "Protect face, hips, knees, and resistance-band gesture inside the crop-safe core for vertical adaptations.",
        subject_placement: "balanced dynamic placement with movement line traveling through the frame",
      },
      realism_guards: {
        skin_texture_rules: [
          "preserve visible pores and realistic leg skin texture",
          "keep sweat subtle and believable",
          "avoid cartoon muscle separation or fake hyper-definition",
        ],
        anti_generic_ai_face_negatives: [
          "no generic trainer face",
          "no anatomy distortions",
          "no over-smoothed campaign skin",
        ],
      },
    },
    google_ai_studio_attachments: {
      likeness: [],
      body: [],
      style: [],
      attachment_notes:
        "Select 2 to 4 summer_fit references with one squat or band movement anchor, one strong likeness anchor, and optional environment guidance.",
    },
  },
  {
    id: "train_with_me_side_profile_architectural",
    title: "Train With Me / Side Profile Architectural",
    section: "train_with_me",
    workflow: "fit_generate_campaign",
    language_system_version: "2.1",
    use_case: "Campaign transition frame, section image, or premium side-profile sports editorial.",
    prompt:
      "Create a cinematic Nike-style editorial sports campaign image of the attached woman in a side-profile fitness composition against an architectural setting, using the imported peach parking-structure reference as the silhouette benchmark. Preserve the same exact woman, realistic athletic silhouette, believable pores, subtle sweat sheen, and strong facial likeness even from a profile-led angle. The image should feel premium, sculptural, and campaign-ready with clean luxury fitness environments and refined activewear, not like a static catalog pose. Avoid fake background text, fake logos, tattoo drift, oversized tattoos, awkward posture, or generic stock-fitness composition.",
    avoid: [
      "generic side-profile catalog pose",
      "fake architectural text",
      "fake brand logos",
      "tattoo drift",
      "oversized tattoos",
      "awkward static posture",
      "plastic skin",
      "stock fitness ad energy",
    ],
    aspect_ratio: "16:9",
    recommended_framing:
      "architectural side-profile composition with elegant silhouette separation and premium negative space",
    likeness_priority: "highest",
    generation_stage: "approval_round_native_high_res_then_4k",
    export_goal:
      "Approve as a sculptural side-profile campaign frame that broadens the Train With Me family without identity drift.",
    creative_direction: {
      subject_lock: {
        identity_anchor:
          "Maintain exact face and body identity from the reference set, even when the pose leans profile and silhouette-driven.",
        facial_feature_preservation: [
          "preserve profile nose line, jaw shape, brow relationship, and neck-to-shoulder structure",
          "keep the body elongated, athletic, and believable rather than stylized or over-curved",
          "maintain realistic tattoo scale and placement",
        ],
        anti_drift: [
          "profile view must still read as the same exact woman",
          "do not drift into architectural fashion-model detachment from fitness realism",
        ],
      },
      camera_language: {
        capture_feel: "sculptural editorial sports still with campaign-level polish",
        lens_behavior: "50mm to 85mm perspective with clean profile geometry and elegant compression",
        focus_strategy: "lock profile features and shoulder line while keeping the architecture refined and secondary",
      },
      lighting_language: {
        key_light_character: "premium directional light that carves the profile and preserves skin realism",
        shadow_behavior: "controlled tonal architecture with crisp but natural edge separation",
        skin_treatment: "show pores, subtle sheen, and believable tonal detail without glamour over-retouching",
      },
      styling_language: {
        wardrobe: "clean luxury activewear with minimal branding, precise silhouette, and monochrome or tonal discipline",
        grooming: "editorial athletic grooming that remains believable and clean",
        makeup: "restrained premium sports makeup with no heavy fashion distortion",
      },
      environment_language: {
        spatial_mood: "architectural calm, luxury discipline, modern athletic polish, and parking-structure scale",
        background_strategy: "clean walls, deep structural forms, or disciplined concrete architecture with zero fake signage or text clutter",
      },
      cinematic_language: {
        visual_arc: "strength expressed through sculptural stillness and spatial control",
        editorial_energy: "premium sports-fashion crossover grounded in realism",
      },
      composition_language: {
        text_safe_guidance:
          "Preserve a broad calm field within the architecture for campaign copy without flattening the sculptural composition.",
        mobile_crop_safety_guidance:
          "Keep the face profile, torso line, and strongest silhouette edges within the crop-safe vertical corridor.",
        subject_placement: "profile-led asymmetry with architectural negative space",
      },
      realism_guards: {
        skin_texture_rules: [
          "preserve visible pores even in profile light",
          "keep sweat sheen subtle and plausible",
          "avoid porcelain smoothing or fake fashion-skin retouching",
        ],
        anti_generic_ai_face_negatives: [
          "no generic profile beauty face",
          "no distorted nose or jawline",
          "no anatomy drift",
        ],
      },
    },
    google_ai_studio_attachments: {
      likeness: [],
      body: [],
      style: [],
      attachment_notes:
        "Select 2 to 4 summer_fit references with one side-profile anchor, one close likeness anchor, and one architectural or styling anchor.",
    },
  },
  {
    id: "train_with_me_stretch_recovery",
    title: "Train With Me / Stretch Recovery",
    section: "train_with_me",
    workflow: "fit_generate_campaign",
    language_system_version: "2.1",
    use_case: "Recovery frame, section closer, or premium movement-rest editorial image.",
    prompt:
      "Create a cinematic Nike-style editorial sports campaign image of the attached woman in a stretch or recovery moment, using the imported standing quad-stretch lawn reference as the realism benchmark. Preserve the same exact woman with strong likeness, believable athletic body mechanics, realistic pores, subtle skin texture, and a light believable sweat sheen. The frame should feel premium, cinematic, and calm after effort, with clean resort-lawn or luxury fitness-environment cues and elevated activewear styling. Keep the pose authentic and anatomically credible rather than generic or yoga-stock static. Avoid fake logos, fake text, tattoo drift, oversized tattoos, awkward limb positions, or over-smoothed skin.",
    avoid: [
      "generic yoga stock pose",
      "fake wellness poster energy",
      "fake background text",
      "fake brand logos",
      "tattoo drift",
      "oversized tattoos",
      "plastic skin",
      "awkward limb positions",
    ],
    aspect_ratio: "16:9",
    recommended_framing:
      "wide editorial recovery frame with elegant line of stretch and calm premium negative space",
    likeness_priority: "highest",
    generation_stage: "approval_round_native_high_res_then_4k",
    export_goal:
      "Approve as the softer recovery image in the Train With Me family while keeping identity and campaign finish consistent.",
    creative_direction: {
      subject_lock: {
        identity_anchor:
          "Keep the same exact woman recognizable across recovery imagery, with likeness and body realism preserved ahead of mood styling.",
        facial_feature_preservation: [
          "preserve her exact facial structure and profile relationships",
          "keep body stretch lines believable and naturally athletic",
          "maintain subtle tattoo accuracy without enlarging or multiplying tattoos",
        ],
        anti_drift: [
          "do not let softer recovery mood become generic wellness-brand sameness",
          "maintain adult athletic realism rather than ethereal yoga stylization",
        ],
      },
      camera_language: {
        capture_feel: "premium editorial recovery still with honest post-training calm",
        lens_behavior: "35mm to 65mm perspective with graceful line control and grounded anatomy",
        focus_strategy: "maintain face and stretch geometry clarity while keeping the environment refined and secondary",
      },
      lighting_language: {
        key_light_character: "premium soft directional light with clean skin separation and subtle sheen control",
        shadow_behavior: "gentle tonal shaping that supports rest and realism",
        skin_treatment: "preserve visible pores, believable sweat sheen, and natural skin transitions",
      },
      styling_language: {
        wardrobe: "clean activewear styling with luxury restraint and no loud branding",
        grooming: "natural athletic polish with believable post-session detail",
        makeup: "minimal editorial sports refinement, not beauty-ad finish",
      },
      environment_language: {
        spatial_mood: "clean, quiet, premium, restorative, and outdoor-luxury when appropriate",
        background_strategy: "luxury lawn or fitness environment with no distracting text, signage, or prop clutter",
      },
      cinematic_language: {
        visual_arc: "recovery as part of the training narrative",
        editorial_energy: "cinematic sports-campaign calm with realism and polish",
      },
      composition_language: {
        text_safe_guidance:
          "Keep one side or upper field calm for section messaging while preserving the stretch line as the compositional lead.",
        mobile_crop_safety_guidance:
          "Protect face, torso, and main stretch geometry in the central crop-safe corridor for vertical reuse.",
        subject_placement: "flowing diagonal or asymmetrical placement with relaxed control",
      },
      realism_guards: {
        skin_texture_rules: [
          "show visible pores and subtle skin texture",
          "keep sweat believable and restrained",
          "avoid plastic retouching or fake wellness glow",
        ],
        anti_generic_ai_face_negatives: [
          "no generic yoga-ad face",
          "no limb distortions",
          "no airbrushed perfection",
        ],
      },
    },
    google_ai_studio_attachments: {
      likeness: [],
      body: [],
      style: [],
      attachment_notes:
        "Select 2 to 4 summer_fit references with one recovery or stretch pose anchor, one close likeness anchor, and one environment or styling anchor.",
    },
  },
  {
    id: "fit_ref_enhance_editorial",
    title: "Fit Ref Enhance / Editorial Sports Finish",
    section: "train_with_me",
    workflow: "fit_enhance_reference",
    language_system_version: "2.1",
    use_case: "Enhance a selected summer_fit original while preserving pose, framing, and identity.",
    prompt:
      "Enhance the attached original reference image of the same woman into a premium editorial sports finish while preserving the original pose, framing, composition, environment logic, and identity. Improve lighting, sharpness, skin detail, subtle sweat realism, background cleanliness, and overall image polish without changing the core shot. Keep realistic pores, subtle skin texture, clean luxury fitness environment cues, and a cinematic Nike-style editorial sports campaign finish. Preserve the truth of the source scene whether it is a court, white seamless studio, curved concrete corner, parking structure, or resort lawn. Do not invent a new composition, do not change the woman, do not introduce fake logos or fake text, and do not alter tattoo placement or scale.",
    avoid: [
      "new composition",
      "heavy pose change",
      "identity drift",
      "fake text",
      "fake logos",
      "tattoo drift",
      "oversized tattoos",
      "plastic skin",
    ],
    aspect_ratio: "source_preserved",
    recommended_framing: "preserve original framing and camera relationship",
    likeness_priority: "highest",
    generation_stage: "source_locked_enhancement_pass",
    export_goal:
      "Improve the original fit reference for premium review and download without materially changing the source composition.",
    creative_direction: {
      subject_lock: {
        identity_anchor:
          "Preserve the same exact woman from the source image with no compositional reinvention and no facial drift.",
        facial_feature_preservation: [
          "keep face, body shape, tattoo placement, and core wardrobe intact",
          "retain original pose and framing with only subtle polish improvements",
        ],
        anti_drift: [
          "do not generate a new scene",
          "do not over-retouch the source into a synthetic poster image",
        ],
      },
      camera_language: {
        capture_feel: "source-faithful editorial refinement",
        lens_behavior: "preserve the original perspective and framing relationships",
        focus_strategy: "upgrade sharpness and local clarity while protecting natural skin and facial detail",
      },
      lighting_language: {
        key_light_character: "premium cleaned-up sports editorial light consistent with the source",
        shadow_behavior: "preserve original shape while reducing distracting muddiness or flatness",
        skin_treatment: "retain realistic pores, subtle sheen, and believable tonal nuance",
      },
      styling_language: {
        wardrobe: "preserve original activewear styling and clean it up rather than redesign it",
        grooming: "retain source grooming while making it feel more premium and intentional",
        makeup: "source-faithful light polish only",
      },
      environment_language: {
        spatial_mood: "same environment, cleaner and more premium",
        background_strategy: "reduce distractions while preserving the original scene identity",
      },
      cinematic_language: {
        visual_arc: "same image, upgraded into premium editorial sports polish",
        editorial_energy: "cinematic but source-faithful enhancement rather than reinvention",
      },
      composition_language: {
        text_safe_guidance: "Preserve the existing composition and negative space rather than inventing new layout logic.",
        mobile_crop_safety_guidance: "Keep all original core content intact for before-and-after review consistency.",
        subject_placement: "source composition preserved",
      },
      realism_guards: {
        skin_texture_rules: [
          "preserve pores and natural skin detail",
          "keep sweat sheen subtle and believable",
          "avoid over-sharpening or plastic smoothing",
        ],
        anti_generic_ai_face_negatives: [
          "no face replacement",
          "no beauty-filter retouching",
          "no anatomy drift",
        ],
      },
    },
    google_ai_studio_attachments: {
      likeness: [],
      body: [],
      style: [],
      attachment_notes:
        "Attach the single selected summer_fit source image as the primary source. Enhancement mode should refine the shot while preserving composition, identity, and pose.",
    },
  },
];
