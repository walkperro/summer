import promptPack from "../../prompt_pack_v1.json";

export type PromptAttachmentSet = {
  likeness: string[];
  body: string[];
  style: string[];
  attachment_notes: string;
};

export type PromptCreativeDirection = {
  subject_lock: {
    identity_anchor: string;
    facial_feature_preservation: string[];
    anti_drift: string[];
  };
  camera_language: {
    capture_feel: string;
    lens_behavior: string;
    focus_strategy: string;
  };
  lighting_language: {
    key_light_character: string;
    shadow_behavior: string;
    skin_treatment: string;
  };
  styling_language: {
    wardrobe: string;
    grooming: string;
    makeup: string;
  };
  environment_language: {
    spatial_mood: string;
    background_strategy: string;
  };
  cinematic_language: {
    visual_arc: string;
    editorial_energy: string;
  };
  composition_language: {
    text_safe_guidance: string;
    mobile_crop_safety_guidance: string;
    subject_placement: string;
  };
  realism_guards: {
    skin_texture_rules: string[];
    anti_generic_ai_face_negatives: string[];
  };
};

export type PromptPackEntry = {
  id: string;
  title: string;
  section: string;
  workflow: string;
  language_system_version: string;
  use_case: string;
  prompt: string;
  avoid: string[];
  aspect_ratio: string;
  recommended_framing: string;
  likeness_priority: string;
  generation_stage: string;
  export_goal: string;
  creative_direction: PromptCreativeDirection;
  google_ai_studio_attachments: PromptAttachmentSet;
};

export type PromptPack = {
  pack_id: string;
  intended_platform: string;
  core_generation_rules: {
    likeness_priority: string;
    consistency_over_variance: boolean;
    reference_usage: string;
    fine_tune_workflow_included: boolean;
    prose_standard: string;
    required_prompt_sections: string[];
    required_output_guards: string[];
  };
  prompts: PromptPackEntry[];
};

export const imagePromptPack = promptPack as PromptPack;

export function getPromptEntries() {
  return imagePromptPack.prompts;
}

export function getPromptEntry(promptId: string) {
  return imagePromptPack.prompts.find((prompt) => prompt.id === promptId);
}

export function buildGeminiPrompt(prompt: PromptPackEntry) {
  const direction = prompt.creative_direction;

  return [
    prompt.prompt,
    "",
    `Use case: ${prompt.use_case}`,
    `Section: ${prompt.section}`,
    `Aspect ratio target: ${prompt.aspect_ratio}`,
    `Recommended framing: ${prompt.recommended_framing}`,
    `Export goal: ${prompt.export_goal}`,
    "",
    "Subject lock:",
    `- ${direction.subject_lock.identity_anchor}`,
    ...direction.subject_lock.facial_feature_preservation.map((item) => `- ${item}`),
    ...direction.subject_lock.anti_drift.map((item) => `- ${item}`),
    "",
    "Camera language:",
    `- ${direction.camera_language.capture_feel}`,
    `- ${direction.camera_language.lens_behavior}`,
    `- ${direction.camera_language.focus_strategy}`,
    "",
    "Lighting language:",
    `- ${direction.lighting_language.key_light_character}`,
    `- ${direction.lighting_language.shadow_behavior}`,
    `- ${direction.lighting_language.skin_treatment}`,
    "",
    "Styling language:",
    `- Wardrobe: ${direction.styling_language.wardrobe}`,
    `- Grooming: ${direction.styling_language.grooming}`,
    `- Makeup: ${direction.styling_language.makeup}`,
    "",
    "Environment language:",
    `- ${direction.environment_language.spatial_mood}`,
    `- ${direction.environment_language.background_strategy}`,
    "",
    "Cinematic language:",
    `- ${direction.cinematic_language.visual_arc}`,
    `- ${direction.cinematic_language.editorial_energy}`,
    "",
    "Composition guidance:",
    `- Text-safe composition guidance: ${direction.composition_language.text_safe_guidance}`,
    `- Mobile crop safety guidance: ${direction.composition_language.mobile_crop_safety_guidance}`,
    `- Subject placement: ${direction.composition_language.subject_placement}`,
    "",
    "Realism guards:",
    ...direction.realism_guards.skin_texture_rules.map((item) => `- Skin texture realism rule: ${item}`),
    ...direction.realism_guards.anti_generic_ai_face_negatives.map(
      (item) => `- Anti-generic-AI-face negative: ${item}`,
    ),
    ...prompt.avoid.map((item) => `- Avoid: ${item}`),
    "",
    "Reference usage:",
    `- ${imagePromptPack.core_generation_rules.reference_usage}`,
    `- ${prompt.google_ai_studio_attachments.attachment_notes}`,
    "",
    "Return an image-first result with photorealistic editorial realism. Do not produce a generic AI beauty face. Keep the result premium, elegant, athletic, feminine, and website-safe.",
  ].join("\n");
}
