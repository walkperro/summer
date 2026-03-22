import {
  CAMERA_ANGLE_OPTIONS,
  CAMERA_RECIPES,
  DEFAULT_PRESERVE_FLAGS,
  getCameraAngleOption,
  getCameraDirectionWarnings,
  getCameraPreviewGenerationPlan,
  getCameraPreviewGenerationPlans,
  getCameraRecipe,
  getCameraSelectionSummary,
  getLensLookOption,
  LENS_LOOK_OPTIONS,
  normalizeCameraPresetIds,
  type CameraAngleId,
  type CameraDirectionPresetId,
  type CameraOption,
  type CameraPreviewGenerationPlan,
  type CameraRecipe,
  type LensLookId,
  type PreserveFlags,
  type ReframeIntensity,
} from "@/lib/camera-direction";

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

type FinalImageExecutionMode = "refine" | "reframe";

type FinalImageExecutionPlan = {
  executionMode: FinalImageExecutionMode;
  reframeTriggered: boolean;
  triggerReasons: string[];
  normalizedCameraPresetIds: CameraDirectionPresetId[];
  activePreserveRules: string[];
  activeCameraInstructions: string[];
  activeCustomInstructions: string[];
  customInstructionWarnings: StackWarning[];
  promptText: string;
  stackWarnings: StackWarning[];
  cameraWarnings: StackWarning[];
};

export {
  CAMERA_ANGLE_OPTIONS,
  CAMERA_RECIPES,
  DEFAULT_PRESERVE_FLAGS,
  LENS_LOOK_OPTIONS,
  getCameraAngleOption,
  getCameraDirectionWarnings,
  getCameraPreviewGenerationPlan,
  getCameraPreviewGenerationPlans,
  getCameraRecipe,
  getCameraSelectionSummary,
  getLensLookOption,
  normalizeCameraPresetIds,
};

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

function getIntensityLanguage(reframeIntensity: ReframeIntensity) {
  if (reframeIntensity === "subtle") {
    return "light reinterpretation with restrained crop and perspective movement";
  }

  if (reframeIntensity === "moderate") {
    return "visible but controlled camera reinterpretation with a clear editorial shift";
  }

  return "clear re-shoot energy with a strong visible change in framing, perspective, and optical feel";
}

function getPreserveRuleInstructions(preserveFlags: PreserveFlags, executionMode: FinalImageExecutionMode) {
  const instructions: string[] = [];

  if (preserveFlags.preserve_face) {
    instructions.push("Preserve the same exact woman with strong face lock, age consistency, eye shape, brow structure, lips, and jawline.");
  } else {
    instructions.push("Keep identity close to the source woman, but do not let facial detail become generic or drift into a different person.");
  }

  if (preserveFlags.preserve_body_shape) {
    instructions.push("Preserve body proportions, athletic shape, and anatomy.");
  } else {
    instructions.push("Body framing may reinterpret, but anatomy must stay realistic and premium.");
  }

  if (preserveFlags.preserve_pose) {
    instructions.push("Keep the pose and body intent essentially the same.");
  } else if (executionMode === "reframe") {
    instructions.push("A light pose adjustment is allowed only if needed to support the new camera language while preserving the same scene intent.");
  }

  if (preserveFlags.preserve_outfit) {
    instructions.push("Keep the same outfit and wardrobe logic.");
  } else if (executionMode === "reframe") {
    instructions.push("Wardrobe should remain close to the source, but very light cleanup-level reinterpretation is allowed if needed for realism.");
  }

  if (preserveFlags.preserve_background) {
    instructions.push("Keep the same environment family and background identity.");
  } else if (executionMode === "reframe") {
    instructions.push("The environment may be reframed or spatially reinterpreted, but it should still feel like the same scene family.");
  }

  if (preserveFlags.preserve_composition) {
    instructions.push("Keep the original composition architecture largely intact, so crop and perspective changes stay subtle.");
  } else if (executionMode === "reframe") {
    instructions.push("Meaningful composition shifts are allowed, including a visibly different crop, framing balance, and subject placement.");
  }

  if (preserveFlags.allow_reframing) {
    instructions.push("Reframing is explicitly allowed, so the model may reinterpret the shot more strongly.");
  }

  if (preserveFlags.allow_perspective_shift) {
    instructions.push("Perspective shift is explicitly allowed, so camera angle and optical feel should visibly affect spatial compression and depth.");
  }

  return instructions;
}

function getNormalizedCustomInstructions(customInstruction?: string) {
  return (customInstruction || "")
    .split(/[\n;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCustomInstructionWarnings(options: {
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  stack: RefinementPresetId[];
}) {
  const warnings: StackWarning[] = [];
  const custom = (options.customInstruction || "").toLowerCase();

  if (!custom.trim()) {
    return warnings;
  }

  if (
    options.preserveFlags.preserve_composition &&
    /(change angle|dramatic|reframe|wider|closer|lower angle|higher angle|overhead|floor level|dutch tilt|fisheye|change perspective|change lens)/.test(custom)
  ) {
    warnings.push({
      id: "custom-vs-preserve-composition",
      level: "warning",
      message: "Custom instruction may be limited by preserve composition.",
    });
  }

  if (/smile/.test(custom) && options.stack.includes("final_soften_expression")) {
    warnings.push({
      id: "custom-smile-vs-expression-stack",
      level: "warning",
      message: "Smile instruction may conflict with expression presets.",
    });
  }

  if (/remove tattoo|remove tattoos|tattoo/.test(custom) && options.stack.some((presetId) => ["final_skin_detail", "final_sweat_detail"].includes(presetId))) {
    warnings.push({
      id: "custom-tattoo-vs-skin-detail",
      level: "warning",
      message: "Tattoo removal may be limited if skin preservation is too strict.",
    });
  }

  return warnings;
}

function buildCustomInstructionLines(customInstruction?: string) {
  const instructions = getNormalizedCustomInstructions(customInstruction);

  if (instructions.length === 0) {
    return [];
  }

  return [
    "High-priority custom direction:",
    "- The following user custom instructions must materially affect the output unless they directly conflict with preserve rules, identity safety, or realism constraints.",
    ...instructions.map((instruction) => `- ${instruction}`),
    "",
  ];
}

function buildRefineModePrompt(options: {
  stack: RefinementPreset[];
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  sourceTitle: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  export4k: boolean;
  keepOriginalAspectRatio: boolean;
}) {
  const preserveRuleInstructions = getPreserveRuleInstructions(options.preserveFlags, "refine");

  return [
    "Refine the attached image as a premium editorial finishing pass for a website-ready final asset.",
    "Execution mode: Refine Mode.",
    "This is a local composition-preserving edit workflow, not a new camera reinterpretation or re-shoot.",
    `Source image title: ${options.sourceTitle}`,
    `Source type: ${options.sourceType}`,
    `Ordered refinement stack: ${options.stack.map((preset, index) => `${index + 1}. ${preset.title}`).join(" -> ")}`,
    `Keep original aspect ratio: ${options.keepOriginalAspectRatio ? "yes" : "no"}`,
    `Export 4K: ${options.export4k ? "yes" : "no"}`,
    "",
    "Retouching language:",
    "- Use premium Nike-style editorial sports campaign or luxury portrait retouch language depending on the image.",
    "- This should feel like a local finishing pass on the existing shot.",
    "- Do not invent a new composition.",
    "- Do not introduce visible reframing or a new lens interpretation.",
    "- Preserve identity, realism, and anatomy.",
    "- Do not make skin plastic.",
    "- Do not introduce fake text, logos, or graphics.",
    "",
    ...buildCustomInstructionLines(options.customInstruction),
    "Preserve rules:",
    ...preserveRuleInstructions.map((instruction) => `- ${instruction}`),
    "",
    "Execute these refinement steps in the following order as one controlled finishing instruction set:",
    ...options.stack.flatMap((preset, index) => [
      `${index + 1}. ${preset.title}`,
      ...preset.instructions.map((instruction) => `- ${instruction}`),
    ]),
    "",
    "Realism and finishing rules:",
    "- Keep realism high and preserve the original composition and overall shot.",
    "- Improve skin, hands, hair, fabric, tonal depth, and polish only where requested by the stack.",
    "- Keep pores, subtle skin texture, and believable sweat sheen premium but human.",
    ...(options.export4k ? ["- Prepare the output for 4K delivery with clean detail and no fake texture."] : []),
  ].join("\n");
}

function buildReframeModePrompt(options: {
  stack: RefinementPreset[];
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  sourceTitle: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  export4k: boolean;
  keepOriginalAspectRatio: boolean;
  cameraPresetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
}) {
  const cameraSummary = getCameraSelectionSummary(options.cameraPresetIds);
  const preserveRuleInstructions = getPreserveRuleInstructions(options.preserveFlags, "reframe");
  const activeCameraInstructions = [
    `Primary camera angle: ${cameraSummary.primaryAngle.title}`,
    `Primary lens look: ${cameraSummary.primaryLens.title}`,
    `Framing modifiers: ${cameraSummary.modifiers.length > 0 ? cameraSummary.modifiers.map((modifier) => modifier.title).join(" • ") : "none"}`,
    `Reframe intensity: ${options.reframeIntensity} (${getIntensityLanguage(options.reframeIntensity)})`,
  ];
  const mainReframeSentence = [
    `Reinterpret this source image as if it were re-shot from a ${cameraSummary.primaryAngle.title} camera angle`,
    `with a ${cameraSummary.primaryLens.title} lens feel`,
    cameraSummary.modifiers.length > 0 ? `plus ${cameraSummary.modifiers.map((modifier) => modifier.title).join(" and ")}` : null,
    `${options.reframeIntensity} reframe intensity`,
    options.preserveFlags.preserve_face
      ? "while preserving the same exact woman"
      : "while staying close to the source identity",
    options.preserveFlags.preserve_outfit ? "preserving the same outfit" : null,
    options.preserveFlags.preserve_body_shape ? "preserving body proportions" : null,
    options.preserveFlags.allow_perspective_shift
      ? "and allowing a visible change in perspective, crop, and optical feel."
      : "and allowing a visible change in framing and crop while keeping perspective controlled.",
  ]
    .filter(Boolean)
    .join(", ");

  return [
    "Reframe the attached image as a controlled editorial re-shoot based on the source image.",
    "Execution mode: Reframe Mode.",
    "The attached source image is an identity, pose-intent, wardrobe, and scene anchor, but it is not a hard lock on the original composition.",
    "This must not behave like a tiny retouch pass. It should read as a visible camera reinterpretation when the chosen settings call for it.",
    `Source image title: ${options.sourceTitle}`,
    `Source type: ${options.sourceType}`,
    `Keep original aspect ratio: ${options.keepOriginalAspectRatio ? "yes" : "no"}`,
    `Export 4K: ${options.export4k ? "yes" : "no"}`,
    "",
    "Core reframe instruction:",
    `- ${mainReframeSentence}`,
    "- Treat this as a controlled editorial re-shoot from the source image, not as UI-only metadata.",
    "- Visible changes in framing, crop, apparent lens behavior, spatial compression, and camera perspective are expected when compatible with the selected settings.",
    "- Preserve identity, realism, anatomy, and premium editorial quality.",
    "",
    ...buildCustomInstructionLines(options.customInstruction),
    "Active camera language:",
    ...activeCameraInstructions.map((instruction) => `- ${instruction}`),
    ...(options.preserveFlags.preserve_composition
      ? ["- Composition preservation is ON, so strong camera changes are limited and must stay more subtle."]
      : ["- Composition preservation is OFF, so meaningful reframing and crop changes are allowed."]),
    ...(options.preserveFlags.allow_reframing
      ? ["- Reframing is ON, so stronger shot reinterpretation is explicitly allowed."]
      : ["- Reframing is OFF, so keep the reinterpretation tasteful and anchored to the source."]),
    ...(options.preserveFlags.allow_perspective_shift
      ? ["- Perspective shift is ON, so camera angle and lens feel should visibly affect depth, compression, and spatial feel."]
      : ["- Perspective shift is OFF, so keep optical reinterpretation controlled rather than dramatic."]),
    "",
    "Preserve rules:",
    ...preserveRuleInstructions.map((instruction) => `- ${instruction}`),
    "",
    "Finishing stack after the reframe:",
    ...options.stack.flatMap((preset, index) => [
      `${index + 1}. ${preset.title}`,
      ...preset.instructions.map((instruction) => `- ${instruction}`),
    ]),
    "",
    "Realism and reframe rules:",
    "- Preserve the same exact woman or the closest possible identity anchor from the source image.",
    "- Preserve body proportions and believable anatomy.",
    "- Do not age her up.",
    "- Do not make skin plastic.",
    "- Do not invent fake text, fake logos, or fake graphics.",
    "- Do not let the image become generic AI portraiture.",
    "- Keep the result premium, cinematic, realistic, and editorial.",
    ...(options.export4k ? ["- Prepare the output for 4K delivery with clean detail and no fake texture."] : []),
  ].join("\n");
}

export function getFinalImageExecutionMode(options: {
  preserveFlags: PreserveFlags;
  cameraPresetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
}) {
  const normalizedCameraPresetIds = normalizeCameraPresetIds(options.cameraPresetIds);
  const cameraSummary = getCameraSelectionSummary(normalizedCameraPresetIds);
  const triggerReasons: string[] = [];

  if (cameraSummary.hasNonOriginalSelection) {
    triggerReasons.push("non-default camera direction is selected");
  }

  if (options.preserveFlags.allow_reframing) {
    triggerReasons.push("allow reframing is ON");
  }

  if (options.preserveFlags.allow_perspective_shift) {
    triggerReasons.push("allow perspective shift is ON");
  }

  if (options.reframeIntensity === "moderate" || options.reframeIntensity === "strong") {
    triggerReasons.push(`${options.reframeIntensity} reframe intensity is selected`);
  }

  return {
    executionMode: triggerReasons.length > 0 ? ("reframe" as const) : ("refine" as const),
    reframeTriggered: triggerReasons.length > 0,
    triggerReasons,
    normalizedCameraPresetIds,
  };
}

export function buildFinalImageExecutionPlan(options: {
  stack: RefinementPresetId[];
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  sourceTitle: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  export4k: boolean;
  keepOriginalAspectRatio: boolean;
  cameraPresetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
}) {
  const presets = options.stack.map((presetId) => getFinalRefinementPreset(presetId)).filter(Boolean) as RefinementPreset[];

  if (presets.length === 0) {
    throw new Error("Refinement stack cannot be empty.");
  }

  const mode = getFinalImageExecutionMode({
    preserveFlags: options.preserveFlags,
    cameraPresetIds: options.cameraPresetIds,
    reframeIntensity: options.reframeIntensity,
  });
  const stackWarnings = getFinalRefinementStackWarnings(options.stack, options.customInstruction);
  const cameraWarnings = getCameraDirectionWarnings({
    presetIds: mode.normalizedCameraPresetIds,
    reframeIntensity: options.reframeIntensity,
    preserveFlags: options.preserveFlags,
  });
  const customInstructionWarnings = getCustomInstructionWarnings({
    customInstruction: options.customInstruction,
    preserveFlags: options.preserveFlags,
    stack: options.stack,
  });
  const cameraSummary = getCameraSelectionSummary(mode.normalizedCameraPresetIds);
  const activePreserveRules = getPreserveRuleInstructions(options.preserveFlags, mode.executionMode);
  const activeCameraInstructions = [
    `Primary angle: ${cameraSummary.primaryAngle.title}`,
    `Primary lens: ${cameraSummary.primaryLens.title}`,
    `Modifiers: ${cameraSummary.modifiers.length > 0 ? cameraSummary.modifiers.map((modifier) => modifier.title).join(" • ") : "none"}`,
    `Reframe intensity: ${options.reframeIntensity}`,
  ];
  const activeCustomInstructions = getNormalizedCustomInstructions(options.customInstruction);
  const promptText =
    mode.executionMode === "reframe"
      ? buildReframeModePrompt({
          stack: presets,
          customInstruction: options.customInstruction,
          preserveFlags: options.preserveFlags,
          sourceTitle: options.sourceTitle,
          sourceType: options.sourceType,
          export4k: options.export4k,
          keepOriginalAspectRatio: options.keepOriginalAspectRatio,
          cameraPresetIds: mode.normalizedCameraPresetIds,
          reframeIntensity: options.reframeIntensity,
        })
      : buildRefineModePrompt({
          stack: presets,
          customInstruction: options.customInstruction,
          preserveFlags: options.preserveFlags,
          sourceTitle: options.sourceTitle,
          sourceType: options.sourceType,
          export4k: options.export4k,
          keepOriginalAspectRatio: options.keepOriginalAspectRatio,
        });

  return {
    executionMode: mode.executionMode,
    reframeTriggered: mode.reframeTriggered,
    triggerReasons: mode.triggerReasons,
    normalizedCameraPresetIds: mode.normalizedCameraPresetIds,
    activePreserveRules,
    activeCameraInstructions,
    activeCustomInstructions,
    customInstructionWarnings,
    promptText,
    stackWarnings,
    cameraWarnings,
  } satisfies FinalImageExecutionPlan;
}

export function buildFinalRefinementPrompt(options: {
  stack: RefinementPresetId[];
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  sourceTitle: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  export4k: boolean;
  keepOriginalAspectRatio: boolean;
  cameraPresetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
}) {
  return buildFinalImageExecutionPlan(options).promptText;
}

export type {
  CameraAngleId,
  CameraDirectionPresetId,
  CameraOption,
  CameraPreviewGenerationPlan,
  CameraRecipe,
  LensLookId,
  PreserveFlags,
  FinalImageExecutionMode,
  FinalImageExecutionPlan,
  ReframeIntensity,
  RefinementPreset,
  RefinementPresetId,
  RefinementRecipe,
  StackWarning,
};
