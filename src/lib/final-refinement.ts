type PreserveFlags = {
  preserve_face: boolean;
  preserve_composition: boolean;
  preserve_background: boolean;
  preserve_outfit: boolean;
  preserve_body_shape: boolean;
  preserve_pose: boolean;
  allow_reframing: boolean;
  allow_perspective_shift: boolean;
};

type CameraAngleId =
  | "keep_original_angle"
  | "eye_level"
  | "low_angle_heroic"
  | "high_angle"
  | "three_quarter_portrait"
  | "side_profile"
  | "floor_level"
  | "overhead"
  | "dutch_tilt"
  | "close_crop_beauty"
  | "wide_environmental";

type LensLookId =
  | "keep_original_lens_feel"
  | "24mm_wide_editorial"
  | "35mm_cinematic"
  | "50mm_natural"
  | "85mm_portrait"
  | "135mm_compressed_portrait"
  | "macro_close_detail"
  | "fisheye";

type ReframeIntensity = "subtle" | "moderate" | "strong";

type CameraOption = {
  id: string;
  title: string;
  description: string;
  previewLabel: string;
  previewAccent: string;
};

type CameraRecipe = {
  id: "premium_portrait" | "cinematic_fitness" | "editorial_environmental" | "experimental_fisheye";
  title: string;
  camera_angle: CameraAngleId;
  lens_look: LensLookId;
  reframe_intensity: ReframeIntensity;
};

type RefinementPresetId =
  | "final_bw_editorial"
  | "final_4k_upscale"
  | "final_remove_tattoos"
  | "final_remove_logos"
  | "final_soften_expression"
  | "final_add_slight_smile"
  | "final_skin_detail"
  | "final_sweat_detail"
  | "final_clean_hair"
  | "final_clean_hands"
  | "final_luxury_finish"
  | "final_custom_instruction";

type RefinementPreset = {
  id: RefinementPresetId;
  title: string;
  summary: string;
  recommendedUse: string;
  instructions: string[];
  orderGuidance: string;
};

type RefinementRecipe = {
  id: "train_with_me_final" | "bw_glam_final" | "lifestyle_final";
  title: string;
  stack: RefinementPresetId[];
};

type StackWarning = {
  id: string;
  level: "warning";
  message: string;
};

export const DEFAULT_PRESERVE_FLAGS: PreserveFlags = {
  preserve_face: true,
  preserve_composition: true,
  preserve_background: true,
  preserve_outfit: true,
  preserve_body_shape: true,
  preserve_pose: true,
  allow_reframing: false,
  allow_perspective_shift: false,
};

export const CAMERA_ANGLE_OPTIONS: CameraOption[] = [
  { id: "keep_original_angle", title: "Keep Original Angle", description: "Preserve the current camera angle and framing logic.", previewLabel: "Original", previewAccent: "#c9b18a" },
  { id: "eye_level", title: "Eye Level", description: "Balanced, natural perspective with straightforward editorial clarity.", previewLabel: "Eye Level", previewAccent: "#b7c4d6" },
  { id: "low_angle_heroic", title: "Low Angle Heroic", description: "Adds premium power and a subtle heroic campaign feel.", previewLabel: "Low Hero", previewAccent: "#9aa7c9" },
  { id: "high_angle", title: "High Angle", description: "Looks slightly down at the subject for softer spatial hierarchy.", previewLabel: "High Angle", previewAccent: "#c7c2de" },
  { id: "three_quarter_portrait", title: "Three-Quarter Portrait", description: "Elegant portrait framing with premium shoulder and face geometry.", previewLabel: "3/4", previewAccent: "#d6b5b2" },
  { id: "side_profile", title: "Side Profile", description: "Profile-led composition that emphasizes sculptural facial and body lines.", previewLabel: "Profile", previewAccent: "#cbb996" },
  { id: "floor_level", title: "Floor Level", description: "Grounded sports-campaign angle with dramatic low perspective.", previewLabel: "Floor", previewAccent: "#9fb7aa" },
  { id: "overhead", title: "Overhead", description: "Top-down editorial reframe for graphic composition and shape control.", previewLabel: "Overhead", previewAccent: "#aebfc9" },
  { id: "dutch_tilt", title: "Dutch Tilt", description: "Intentional stylized tilt for kinetic editorial mood.", previewLabel: "Tilt", previewAccent: "#d8b48f" },
  { id: "close_crop_beauty", title: "Close Crop Beauty", description: "Face-led close crop with beauty/editorial focus and premium intimacy.", previewLabel: "Close", previewAccent: "#d5a8a8" },
  { id: "wide_environmental", title: "Wide Environmental", description: "Shows more environment and spatial drama around the subject.", previewLabel: "Wide", previewAccent: "#a6c6cf" },
];

export const LENS_LOOK_OPTIONS: CameraOption[] = [
  { id: "keep_original_lens_feel", title: "Keep Original Lens Feel", description: "Preserve the current lens feel and perspective behavior.", previewLabel: "Original Lens", previewAccent: "#c9b18a" },
  { id: "24mm_wide_editorial", title: "24mm Wide Editorial", description: "More environment, more spatial drama, broader editorial sweep.", previewLabel: "24mm", previewAccent: "#9ebfd2" },
  { id: "35mm_cinematic", title: "35mm Cinematic", description: "Versatile cinematic storytelling look with premium movement feel.", previewLabel: "35mm", previewAccent: "#b5badc" },
  { id: "50mm_natural", title: "50mm Natural", description: "Balanced natural perspective with restrained editorial polish.", previewLabel: "50mm", previewAccent: "#c1cfb4" },
  { id: "85mm_portrait", title: "85mm Portrait", description: "Flattering portrait compression and premium face-led refinement.", previewLabel: "85mm", previewAccent: "#d7b4b4" },
  { id: "135mm_compressed_portrait", title: "135mm Compressed Portrait", description: "Long-lens compression with elegant background flattening.", previewLabel: "135mm", previewAccent: "#cab2d8" },
  { id: "macro_close_detail", title: "Macro Close Detail", description: "Close-detail interpretation for texture, skin, or material-led finals.", previewLabel: "Macro", previewAccent: "#d3c39f" },
  { id: "fisheye", title: "Fisheye", description: "Extreme stylized distortion; use sparingly and only when clearly intentional.", previewLabel: "Fisheye", previewAccent: "#e2a57b" },
];

export const CAMERA_RECIPES: CameraRecipe[] = [
  { id: "premium_portrait", title: "Premium Portrait", camera_angle: "eye_level", lens_look: "85mm_portrait", reframe_intensity: "subtle" },
  { id: "cinematic_fitness", title: "Cinematic Fitness", camera_angle: "low_angle_heroic", lens_look: "35mm_cinematic", reframe_intensity: "moderate" },
  { id: "editorial_environmental", title: "Editorial Environmental", camera_angle: "wide_environmental", lens_look: "24mm_wide_editorial", reframe_intensity: "moderate" },
  { id: "experimental_fisheye", title: "Experimental Fisheye", camera_angle: "floor_level", lens_look: "fisheye", reframe_intensity: "strong" },
];

export const FINAL_REFINEMENT_PRESETS: RefinementPreset[] = [
  {
    id: "final_bw_editorial",
    title: "Final B/W Editorial",
    summary: "Refined black-and-white conversion with rich tonal depth.",
    recommendedUse: "Convert glam portraits or premium lifestyle images into black-and-white finals.",
    orderGuidance: "Usually near the end, after cleanup and before or just ahead of final upscale.",
    instructions: [
      "convert the image to refined black and white",
      "keep rich tonal contrast and premium editorial depth",
      "preserve pores and skin realism",
      "avoid muddy blacks and avoid flat grayscale",
    ],
  },
  {
    id: "final_4k_upscale",
    title: "Final 4K Upscale",
    summary: "Prepare the image for final 4K website delivery.",
    recommendedUse: "Upscale final homepage, hero, and campaign assets to 4K.",
    orderGuidance: "Usually last in the stack.",
    instructions: [
      "upscale the image to a 4K-ready final",
      "preserve fine skin detail and reduce softness or compression artifacts",
      "avoid oversharpened halos, fake texture, and artificial detail invention",
    ],
  },
  {
    id: "final_remove_tattoos",
    title: "Remove Tattoos",
    summary: "Remove visible tattoos cleanly while keeping skin natural.",
    recommendedUse: "Remove tattoos on fitness images before website use.",
    orderGuidance: "Run early, before finish, detail, and upscale steps.",
    instructions: [
      "remove visible tattoos cleanly",
      "preserve natural skin tone and skin texture",
      "do not alter anatomy and do not over-soften the skin",
    ],
  },
  {
    id: "final_remove_logos",
    title: "Remove Logos",
    summary: "Clean away visible branding while keeping garments realistic.",
    recommendedUse: "Remove brand logos or marks from outfit materials before launch.",
    orderGuidance: "Run early, before black-and-white conversion and upscale.",
    instructions: [
      "remove visible brand logos or marks",
      "keep outfit material realistic and preserve seams and folds",
      "do not create fake fabric patches or blurred clothing artifacts",
    ],
  },
  {
    id: "final_soften_expression",
    title: "Soften Expression",
    summary: "Slightly soften a severe expression without changing identity.",
    recommendedUse: "Soften overly stern portrait expressions while preserving the same woman.",
    orderGuidance: "Run before final luxury polish and before upscale.",
    instructions: [
      "soften the expression slightly while preserving the exact same woman",
      "do not widen the face, do not change age, and do not create a fake smile",
    ],
  },
  {
    id: "final_add_slight_smile",
    title: "Add Slight Smile",
    summary: "Add a very subtle natural smile.",
    recommendedUse: "Add subtle smile only on lifestyle or about images.",
    orderGuidance: "Run before final polish and before upscale.",
    instructions: [
      "add only a subtle natural smile",
      "preserve her identity, age, and facial structure",
      "do not widen the face and do not create a fake teeth-smile if the mouth should remain mostly closed",
    ],
  },
  {
    id: "final_skin_detail",
    title: "Skin Detail",
    summary: "Increase natural pores and premium human skin realism.",
    recommendedUse: "Increase skin realism and pores without beauty-filter smoothing.",
    orderGuidance: "Usually after cleanup steps and before final upscale.",
    instructions: [
      "increase natural pores and skin realism",
      "keep skin premium but human",
      "avoid airbrushed beauty retouching and avoid plastic smoothing",
    ],
  },
  {
    id: "final_sweat_detail",
    title: "Sweat Detail",
    summary: "Add subtle believable sweat sheen.",
    recommendedUse: "Add subtle believable sweat to fitness assets that need more athletic finish.",
    orderGuidance: "Usually after cleanup and alongside skin/luxury finish, before upscale.",
    instructions: [
      "add subtle believable sweat sheen only where natural",
      "avoid oily or glossy overdone skin",
      "preserve realism and skin texture",
    ],
  },
  {
    id: "final_clean_hair",
    title: "Clean Hair",
    summary: "Reduce flyaways without over-perfecting hair.",
    recommendedUse: "Clean flyaway hairs on polished campaign portraits.",
    orderGuidance: "Run early, before final finish and upscale.",
    instructions: [
      "reduce distracting flyaway hairs",
      "preserve natural hairline, texture, and believable grooming",
      "do not make the hair look overly perfect or helmet-like",
    ],
  },
  {
    id: "final_clean_hands",
    title: "Clean Hands",
    summary: "Fix distracting hand or finger issues while preserving pose.",
    recommendedUse: "Clean malformed or distracting fingers before final website use.",
    orderGuidance: "Run early, before finish and upscale.",
    instructions: [
      "improve fingers and hands if malformed or distracting",
      "preserve pose, hand size, and anatomy",
      "keep realism high and handle tattoos consistently with the selected preset",
    ],
  },
  {
    id: "final_luxury_finish",
    title: "Luxury Finish",
    summary: "Premium editorial finishing pass with realism preserved.",
    recommendedUse: "Apply final premium polish to chosen website-ready assets.",
    orderGuidance: "Usually late in the stack, before final upscale.",
    instructions: [
      "apply premium editorial polish with refined contrast and clean skin texture",
      "add subtle tonal depth and luxury campaign finish",
      "preserve realism and avoid fake poster energy",
    ],
  },
  {
    id: "final_custom_instruction",
    title: "Custom Instruction",
    summary: "Freeform controlled finishing pass.",
    recommendedUse: "Use when you need a specific final cleanup instruction not covered above.",
    orderGuidance: "Can be placed anywhere, but check for conflicts with nearby presets.",
    instructions: [
      "apply only the explicitly requested refinements",
      "preserve the original shot unless clearly instructed otherwise",
    ],
  },
];

export const FINAL_REFINEMENT_RECIPES: RefinementRecipe[] = [
  {
    id: "train_with_me_final",
    title: "Train With Me Final",
    stack: [
      "final_remove_tattoos",
      "final_clean_hands",
      "final_skin_detail",
      "final_sweat_detail",
      "final_luxury_finish",
      "final_4k_upscale",
    ],
  },
  {
    id: "bw_glam_final",
    title: "BW Glam Final",
    stack: ["final_bw_editorial", "final_skin_detail", "final_luxury_finish", "final_4k_upscale"],
  },
  {
    id: "lifestyle_final",
    title: "Lifestyle Final",
    stack: ["final_clean_hair", "final_soften_expression", "final_skin_detail", "final_luxury_finish", "final_4k_upscale"],
  },
];

export const FINAL_REFINEMENT_HELP = [
  "remove tattoos on fitness images before website use",
  "convert glam portraits to black and white",
  "upscale final homepage images to 4K",
  "add subtle smile only on lifestyle/about images",
  "keep push-up and Train With Me images serious and intense",
];

export function getCameraAngleOption(cameraAngle: string) {
  return CAMERA_ANGLE_OPTIONS.find((option) => option.id === cameraAngle);
}

export function getLensLookOption(lensLook: string) {
  return LENS_LOOK_OPTIONS.find((option) => option.id === lensLook);
}

export function getCameraRecipe(recipeId: string) {
  return CAMERA_RECIPES.find((recipe) => recipe.id === recipeId);
}

export function getFinalRefinementPreset(presetId: string) {
  return FINAL_REFINEMENT_PRESETS.find((preset) => preset.id === presetId);
}

export function getFinalRefinementRecipe(recipeId: string) {
  return FINAL_REFINEMENT_RECIPES.find((recipe) => recipe.id === recipeId);
}

export function getFinalRefinementStackWarnings(stack: RefinementPresetId[], customInstruction?: string) {
  const warnings: StackWarning[] = [];
  const bwIndex = stack.indexOf("final_bw_editorial");
  const upscaleIndex = stack.indexOf("final_4k_upscale");
  const removeLogosIndex = stack.indexOf("final_remove_logos");
  const softenExpressionIndex = stack.indexOf("final_soften_expression");
  const slightSmileIndex = stack.indexOf("final_add_slight_smile");
  const customIndex = stack.indexOf("final_custom_instruction");

  if (softenExpressionIndex !== -1 && slightSmileIndex !== -1) {
    warnings.push({
      id: "expression-conflict",
      level: "warning",
      message: "`Soften Expression` and `Add Slight Smile` are both stacked. They can conflict, so verify the final face edit stays subtle and identity-safe.",
    });
  }

  if (bwIndex !== -1 && removeLogosIndex !== -1 && bwIndex < removeLogosIndex) {
    warnings.push({
      id: "bw-before-logo",
      level: "warning",
      message: "`Final B/W Editorial` appears before `Remove Logos`. Logo cleanup usually works better before black-and-white conversion because color and material cues are still intact.",
    });
  }

  if (bwIndex !== -1 && stack.slice(bwIndex + 1).some((presetId) => ["final_remove_logos", "final_remove_tattoos"].includes(presetId))) {
    warnings.push({
      id: "bw-before-color-dependent-cleanup",
      level: "warning",
      message: "`Final B/W Editorial` is placed before cleanup steps that may rely on color/material cues. Consider moving black-and-white closer to the end.",
    });
  }

  if (upscaleIndex !== -1 && upscaleIndex !== stack.length - 1) {
    warnings.push({
      id: "upscale-not-last",
      level: "warning",
      message: "`Final 4K Upscale` is not the last step. It usually works best as the final operation in the stack.",
    });
  }

  if (customIndex !== -1 && customInstruction?.trim()) {
    warnings.push({
      id: "custom-may-conflict",
      level: "warning",
      message: "`Custom Instruction` is in the stack. Review it carefully to avoid conflicts with the preset steps around it.",
    });
  }

  return warnings;
}

export function getCameraDirectionWarnings(options: {
  cameraAngle: CameraAngleId;
  lensLook: LensLookId;
  reframeIntensity: ReframeIntensity;
  preserveFlags: PreserveFlags;
}) {
  const warnings: StackWarning[] = [];
  const nonOriginalCamera =
    options.cameraAngle !== "keep_original_angle" || options.lensLook !== "keep_original_lens_feel";

  if (nonOriginalCamera && options.preserveFlags.preserve_composition && options.reframeIntensity === "strong") {
    warnings.push({
      id: "composition-vs-strong-camera",
      level: "warning",
      message: "`preserve composition` is ON while a strong camera reinterpretation is selected. Results will likely stay subtle unless you allow reframing.",
    });
  }

  if (nonOriginalCamera && !options.preserveFlags.allow_reframing) {
    warnings.push({
      id: "camera-without-reframing",
      level: "warning",
      message: "A new camera angle or lens is selected, but `allow reframing` is OFF. Camera direction will behave like mild lens/angle influence only.",
    });
  }

  if (nonOriginalCamera && options.preserveFlags.allow_reframing) {
    warnings.push({
      id: "camera-reinterpretation-enabled",
      level: "warning",
      message: "`allow reframing` is ON, so the result may become a controlled reinterpretation rather than pure cleanup.",
    });
  }

  if (options.lensLook === "fisheye") {
    warnings.push({
      id: "fisheye-warning",
      level: "warning",
      message: "Experimental effect — best for special editorial use, not standard portraits.",
    });
  }

  return warnings;
}

export function buildFinalRefinementPrompt(options: {
  stack: RefinementPresetId[];
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  sourceTitle: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  export4k: boolean;
  keepOriginalAspectRatio: boolean;
  cameraAngle: CameraAngleId;
  lensLook: LensLookId;
  reframeIntensity: ReframeIntensity;
}) {
  const presets = options.stack.map((presetId) => getFinalRefinementPreset(presetId)).filter(Boolean) as RefinementPreset[];

  if (presets.length === 0) {
    throw new Error("Refinement stack cannot be empty.");
  }

  const preserveInstructions = Object.entries(options.preserveFlags)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key.replace(/_/g, " "));
  const stackWarnings = getFinalRefinementStackWarnings(options.stack, options.customInstruction);
  const cameraWarnings = getCameraDirectionWarnings({
    cameraAngle: options.cameraAngle,
    lensLook: options.lensLook,
    reframeIntensity: options.reframeIntensity,
    preserveFlags: options.preserveFlags,
  });
  const cameraAngle = getCameraAngleOption(options.cameraAngle);
  const lensLook = getLensLookOption(options.lensLook);
  const keepOriginalCamera = options.cameraAngle === "keep_original_angle" && options.lensLook === "keep_original_lens_feel";

  return [
    `Refine the attached image as a premium editorial finishing pass for a website-ready final asset.`,
    `This is a stacked refinement workflow, not a request for a new composition. The selected source image is the primary source of truth.`,
    `Source image title: ${options.sourceTitle}`,
    `Source type: ${options.sourceType}`,
    `Ordered refinement stack: ${presets.map((preset, index) => `${index + 1}. ${preset.title}`).join(" -> ")}`,
    `Keep original aspect ratio: ${options.keepOriginalAspectRatio ? "yes" : "no"}`,
    `Export 4K: ${options.export4k ? "yes" : "no"}`,
    `Camera angle: ${cameraAngle?.title || options.cameraAngle}`,
    `Lens look: ${lensLook?.title || options.lensLook}`,
    `Reframe intensity: ${options.reframeIntensity}`,
    "",
    "Retouching language:",
    "- Use premium Nike-style editorial sports campaign or luxury portrait retouch language depending on the image.",
    "- Preserve the same exact woman.",
    "- Do not age her up.",
    "- Do not overfill lips.",
    "- Do not change facial structure.",
    "- Do not make skin plastic.",
    "- Do not create a fake beauty-filter look.",
    "- Do not change the composition unless explicitly instructed.",
    "- Do not introduce fake text or logos.",
    "- Do not overdo sweat or sharpening.",
    "- Do not distort anatomy badly.",
    "",
    ...(keepOriginalCamera
      ? [
          "Camera direction:",
          "- Keep the original angle and original lens feel.",
          "- Do not introduce composition changes or camera reinterpretation.",
          "",
        ]
      : [
          "Camera direction:",
          `- Apply a controlled camera reinterpretation toward ${cameraAngle?.title || options.cameraAngle}.`,
          `- Shape the lens feel toward ${lensLook?.title || options.lensLook}.`,
          `- Reframe intensity: ${options.reframeIntensity}.`,
          options.preserveFlags.allow_reframing
            ? "- Reframing is allowed, but identity, realism, and anatomy must stay controlled."
            : "- Reframing is not allowed, so treat camera direction as subtle influence only.",
          options.preserveFlags.allow_perspective_shift
            ? "- Mild perspective shift is allowed if it remains tasteful and anatomically believable."
            : "- Do not introduce noticeable perspective shift.",
          options.lensLook === "fisheye"
            ? "- If using fisheye, keep it tasteful, intentional, and editorial rather than gimmicky."
            : "- Keep lens reinterpretation premium and realistic rather than gimmicky.",
          "- Preserve the same exact woman and keep facial identity dominant.",
          "",
        ]),
    "Execute these refinement steps in the following order as one controlled finishing instruction set:",
    ...presets.flatMap((preset, index) => [
      `${index + 1}. ${preset.title}`,
      ...preset.instructions.map((instruction) => `- ${instruction}`),
    ]),
    ...(options.customInstruction ? [`- Custom instruction: ${options.customInstruction}`] : []),
    "",
    "Preserve rules:",
    ...(preserveInstructions.length > 0
      ? preserveInstructions.map((instruction) => `- preserve ${instruction}`)
      : ["- no preserve rules enabled; still avoid unnecessary shot changes"]),
    "",
    "Realism and finishing rules:",
    "- Keep realism high and preserve the same environment unless explicitly requested otherwise.",
    "- Preserve the original composition and overall shot.",
    "- Improve skin, hands, hair, fabric, tonal depth, and polish only where requested by the stack.",
    "- Keep pores, subtle skin texture, and believable sweat sheen premium but human.",
    ...(options.export4k ? ["- Prepare the output for 4K delivery with clean detail and no fake texture."] : []),
    ...([...(stackWarnings.length > 0 ? stackWarnings : []), ...(cameraWarnings.length > 0 ? cameraWarnings : [])].length > 0
      ? [
          "",
          "Internal warnings to respect while executing:",
          ...[...stackWarnings, ...cameraWarnings].map((warning) => `- ${warning.message}`),
        ]
      : []),
  ].join("\n");
}

export type {
  CameraAngleId,
  CameraOption,
  CameraRecipe,
  LensLookId,
  PreserveFlags,
  ReframeIntensity,
  RefinementPreset,
  RefinementPresetId,
  RefinementRecipe,
  StackWarning,
};
