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

type RenderAspectRatio = "source_auto" | "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "9:16" | "16:9" | "21:9";

type CropPosition = "smart_auto" | "center" | "top" | "bottom" | "left" | "right";

type AspectRatioMode = "exact_crop" | "recompose" | "guided_reframe";

type RecomposeFramingPreference =
  | "keep_original_center_balance"
  | "add_space_left_right_evenly"
  | "add_negative_space_for_text"
  | "favor_top_preservation"
  | "favor_bottom_preservation";

type RecomposeSubjectProtection = {
  protectFace: boolean;
  protectUpperBody: boolean;
  protectFullBodyIfVisible: boolean;
  protectHands: boolean;
  protectHairSilhouette: boolean;
};

type SourceImageAnalysis = {
  isMonochrome: boolean;
  monochromeConfidence: number;
  averageSaturation: number;
  estimatedToneFamily: "monochrome" | "color";
  width: number;
  height: number;
};

type FinalRenderControls = {
  aspectRatio: RenderAspectRatio;
  cropPosition: CropPosition;
  aspectRatioMode: AspectRatioMode;
  framingPreference: RecomposeFramingPreference;
  subjectProtection: RecomposeSubjectProtection;
  toneStyleLock: "strict";
  temperature: number;
  topP: number;
};

type CustomInstructionIntent =
  | "remove_tattoos"
  | "remove_logos"
  | "add_smile"
  | "black_and_white"
  | "dramatic_reframe"
  | "preserve_composition"
  | "fisheye"
  | "overhead_angle"
  | "floor_level_angle"
  | "compressed_portrait_lens"
  | "wide_editorial_lens";

type FinalImageValidationIssue = {
  id: string;
  level: "blocking" | "warning";
  message: string;
  reason: string;
  fix: string;
};

type FinalImageValidationResult = {
  blockingIssues: FinalImageValidationIssue[];
  warningIssues: FinalImageValidationIssue[];
  customInstructionIntents: CustomInstructionIntent[];
  isBlocked: boolean;
};

type FinalImageExecutionMode = "exact_crop" | "aspect_ratio_recompose" | "refine" | "reframe";

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
  renderControls: FinalRenderControls;
  validation: FinalImageValidationResult;
  monochromeLockEnabled: boolean;
  appendedStyleFragments: string[];
  postProcessingSteps: string[];
};

export const FINAL_RENDER_ASPECT_RATIOS: Array<{ id: RenderAspectRatio; title: string; help: string }> = [
  { id: "source_auto", title: "Source / Auto", help: "Best default when you want the result to stay closest to the original framing." },
  { id: "1:1", title: "1:1", help: "Square crop for product or profile-style delivery." },
  { id: "2:3", title: "2:3", help: "Classic portrait ratio for taller editorial crops." },
  { id: "3:2", title: "3:2", help: "Balanced landscape ratio for wider section imagery." },
  { id: "3:4", title: "3:4", help: "Slightly taller portrait crop." },
  { id: "4:3", title: "4:3", help: "Traditional landscape composition for flexible website layouts." },
  { id: "4:5", title: "4:5", help: "Editorial portrait default for premium feed crops." },
  { id: "9:16", title: "9:16", help: "Vertical stories and reels framing." },
  { id: "16:9", title: "16:9", help: "Wide campaign and hero layout." },
  { id: "21:9", title: "21:9", help: "Ultra-wide cinematic framing." },
];

export const DEFAULT_RENDER_CONTROLS: FinalRenderControls = {
  aspectRatio: "source_auto",
  cropPosition: "smart_auto",
  aspectRatioMode: "recompose",
  framingPreference: "keep_original_center_balance",
  subjectProtection: {
    protectFace: true,
    protectUpperBody: true,
    protectFullBodyIfVisible: true,
    protectHands: true,
    protectHairSilhouette: true,
  },
  toneStyleLock: "strict",
  temperature: 0.7,
  topP: 0.95,
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeRenderControls(renderControls?: Partial<FinalRenderControls>): FinalRenderControls {
  const aspectRatio = FINAL_RENDER_ASPECT_RATIOS.some((entry) => entry.id === renderControls?.aspectRatio)
    ? (renderControls?.aspectRatio as RenderAspectRatio)
    : DEFAULT_RENDER_CONTROLS.aspectRatio;
  const cropPosition = ["smart_auto", "center", "top", "bottom", "left", "right"].includes(String(renderControls?.cropPosition))
    ? (renderControls?.cropPosition as CropPosition)
    : DEFAULT_RENDER_CONTROLS.cropPosition;
  const aspectRatioMode = ["exact_crop", "recompose", "guided_reframe"].includes(String(renderControls?.aspectRatioMode))
    ? (renderControls?.aspectRatioMode as AspectRatioMode)
    : DEFAULT_RENDER_CONTROLS.aspectRatioMode;
  const framingPreference = [
    "keep_original_center_balance",
    "add_space_left_right_evenly",
    "add_negative_space_for_text",
    "favor_top_preservation",
    "favor_bottom_preservation",
  ].includes(String(renderControls?.framingPreference))
    ? (renderControls?.framingPreference as RecomposeFramingPreference)
    : DEFAULT_RENDER_CONTROLS.framingPreference;
  const subjectProtection = {
    ...DEFAULT_RENDER_CONTROLS.subjectProtection,
    ...(renderControls?.subjectProtection || {}),
  };

  return {
    aspectRatio,
    cropPosition,
    aspectRatioMode,
    framingPreference,
    subjectProtection,
    toneStyleLock: "strict",
    temperature: clamp(renderControls?.temperature ?? DEFAULT_RENDER_CONTROLS.temperature, 0, 1),
    topP: clamp(renderControls?.topP ?? DEFAULT_RENDER_CONTROLS.topP, 0.1, 1),
  };
}

function getCropPositionLabel(cropPosition: CropPosition) {
  if (cropPosition === "smart_auto") return "Smart / Auto";
  return cropPosition.charAt(0).toUpperCase() + cropPosition.slice(1);
}

function getFramingPreferenceLabel(framingPreference: RecomposeFramingPreference) {
  if (framingPreference === "keep_original_center_balance") return "Keep original center balance";
  if (framingPreference === "add_space_left_right_evenly") return "Add space left/right evenly";
  if (framingPreference === "add_negative_space_for_text") return "Add more negative space for text";
  if (framingPreference === "favor_top_preservation") return "Favor top preservation";
  return "Favor bottom preservation";
}

function getSubjectProtectionLines(subjectProtection: RecomposeSubjectProtection) {
  return [
    subjectProtection.protectFace ? "Protect face and keep facial framing intact." : null,
    subjectProtection.protectUpperBody ? "Protect full upper body framing if visible." : null,
    subjectProtection.protectFullBodyIfVisible ? "Protect full body framing if the full figure is visible." : null,
    subjectProtection.protectHands ? "Protect hands and avoid cutting or distorting them." : null,
    subjectProtection.protectHairSilhouette ? "Protect hair silhouette and avoid clipping important hair shape." : null,
  ].filter((line): line is string => Boolean(line));
}

function isStyleChangingPreset(presetId: RefinementPresetId) {
  return ["final_bw_editorial", "final_luxury_finish", "final_skin_detail", "final_sweat_detail", "final_soften_expression", "final_add_slight_smile"].includes(presetId);
}

function shouldEnableMonochromeLock(options: {
  executionMode: FinalImageExecutionMode;
  stack: RefinementPresetId[];
  sourceAnalysis?: SourceImageAnalysis;
}) {
  return options.executionMode === "aspect_ratio_recompose" && Boolean(options.sourceAnalysis?.isMonochrome) && !options.stack.some(isStyleChangingPreset);
}

function getAiActivePresetIds(stack: RefinementPresetId[]) {
  return stack.filter((presetId) => presetId !== "final_4k_upscale");
}

function hasAiRefinementRequest(options: {
  stack: RefinementPresetId[];
  customInstruction?: string;
  cameraPresetIds: CameraDirectionPresetId[];
  preserveFlags: PreserveFlags;
  reframeIntensity: ReframeIntensity;
  renderControls?: Partial<FinalRenderControls>;
}) {
  const renderControls = normalizeRenderControls(options.renderControls);
  const hasAiPresets = getAiActivePresetIds(options.stack).length > 0;
  const hasCustomInstruction = Boolean(options.customInstruction?.trim());
  const cameraSummary = getCameraSelectionSummary(normalizeCameraPresetIds(options.cameraPresetIds));
  const hasCameraDirection = cameraSummary.hasNonOriginalSelection;
  const hasReframeBehavior =
    hasCameraDirection ||
    options.preserveFlags.allow_reframing ||
    options.preserveFlags.allow_perspective_shift ||
    options.reframeIntensity !== "subtle";
  const wantsAspectRatioRecompose = renderControls.aspectRatio !== "source_auto" && renderControls.aspectRatioMode === "recompose";

  return {
    hasAiPresets,
    hasCustomInstruction,
    hasCameraDirection,
    hasReframeBehavior,
    wantsAspectRatioRecompose,
    hasAnyAiRequest: hasAiPresets || hasCustomInstruction || hasReframeBehavior || wantsAspectRatioRecompose,
  };
}

function getAspectRatioPromptLines(renderControls: FinalRenderControls) {
  if (renderControls.aspectRatio === "source_auto") {
    return [
      "Aspect ratio direction: stay closest to the source framing and preserve the natural source canvas behavior.",
      "Model support note: Source / Auto is treated as the most composition-faithful option for this execution path.",
    ];
  }

  if (renderControls.aspectRatio === "4:5") {
    return [
      "Aspect ratio direction: target a 4:5 website portrait crop. This path uses prompt-guided framing for 4:5 rather than a native Gemini aspect-ratio lock.",
      "Model support note: 4:5 is treated as a website crop target for composition guidance and may still need downstream crop discipline if the model drifts.",
    ];
  }

  return [
    `Aspect ratio direction: target a ${renderControls.aspectRatio} final frame composition. Compose for this frame intentionally instead of relying on accidental crop fragments.`,
    "Model support note: Aspect ratio is requested through composition guidance in this refine/reframe path and may still be limited by preserve rules.",
  ];
}

function parseCustomInstructionIntents(customInstruction?: string) {
  const normalized = (customInstruction || "").toLowerCase();
  const intents = new Set<CustomInstructionIntent>();

  if (/(remove|clean).*(tattoo)|tattoo.*(remove|clean)/.test(normalized)) {
    intents.add("remove_tattoos");
  }

  if (/(remove|clean).*(logo|brand)|logo.*(remove|clean)/.test(normalized)) {
    intents.add("remove_logos");
  }

  if (/(smile|smiling|slight smile)/.test(normalized)) {
    intents.add("add_smile");
  }

  if (/(black and white|black-and-white|b\/w|monochrome)/.test(normalized)) {
    intents.add("black_and_white");
  }

  if (/(dramatic reframe|change the angle|change angle dramatically|re-shot|reframe strongly|strong reframe)/.test(normalized)) {
    intents.add("dramatic_reframe");
  }

  if (/(exact composition|keep the same composition|preserve composition)/.test(normalized)) {
    intents.add("preserve_composition");
  }

  if (/fisheye/.test(normalized)) {
    intents.add("fisheye");
  }

  if (/(overhead|top-down|top down)/.test(normalized)) {
    intents.add("overhead_angle");
  }

  if (/(floor level|ground level|low to the ground)/.test(normalized)) {
    intents.add("floor_level_angle");
  }

  if (/(135mm|compressed portrait|tight compression)/.test(normalized)) {
    intents.add("compressed_portrait_lens");
  }

  if (/(24mm|wide editorial|wide lens)/.test(normalized)) {
    intents.add("wide_editorial_lens");
  }

  return [...intents];
}

function pushValidationIssue(
  issues: FinalImageValidationIssue[],
  issue: FinalImageValidationIssue,
) {
  if (!issues.some((entry) => entry.id === issue.id)) {
    issues.push(issue);
  }
}

export function validateFinalImageRequest(options: {
  stack: RefinementPresetId[];
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  cameraPresetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
  renderControls?: Partial<FinalRenderControls>;
  sourceAnalysis?: SourceImageAnalysis;
}) {
  const blockingIssues: FinalImageValidationIssue[] = [];
  const warningIssues: FinalImageValidationIssue[] = [];
  const normalizedCameraPresetIds = normalizeCameraPresetIds(options.cameraPresetIds);
  const cameraSummary = getCameraSelectionSummary(normalizedCameraPresetIds);
  const stack = options.stack;
  const renderControls = normalizeRenderControls(options.renderControls);
  const customInstructionIntents = parseCustomInstructionIntents(options.customInstruction);
  const hasVisibleCameraDirection = cameraSummary.hasNonOriginalSelection;
  const aiRequest = hasAiRefinementRequest({ ...options, renderControls });
  const wantsStrongReframe = options.reframeIntensity === "strong" || options.preserveFlags.allow_perspective_shift || customInstructionIntents.includes("dramatic_reframe");

  if (renderControls.aspectRatioMode === "exact_crop") {
    if (aiRequest.hasAnyAiRequest) {
      pushValidationIssue(blockingIssues, {
        id: "exact-crop-vs-ai-transformations",
        level: "blocking",
        message: "Exact Crop can still use your selected aspect ratio, but it cannot apply AI transformations.",
        reason: "Exact Crop is deterministic crop/export only, so camera changes, cleanup instructions, expression edits, presets, and other AI reinterpretation requests do not run in this mode.",
        fix: "Keep Exact Crop for crop-only output, or switch to Full Guided Reframe if you want transformations in the same aspect ratio.",
      });
    }
  }

  if (renderControls.aspectRatioMode === "recompose") {
    if (hasVisibleCameraDirection || wantsStrongReframe) {
      pushValidationIssue(blockingIssues, {
        id: "recompose-vs-camera-reinterpretation",
        level: "blocking",
        message: "This request can still use your selected aspect ratio, but it requires Full Guided Reframe.",
        reason: "Aspect Ratio Recompose preserves the same photograph geometry and original lens feel, but your camera/lens selections ask for a stronger reinterpretation.",
        fix: "Switch to Full Guided Reframe, or remove the camera/lens reinterpretation request.",
      });
    }

    if (options.stack.some(isStyleChangingPreset)) {
      pushValidationIssue(blockingIssues, {
        id: "recompose-vs-style-preset",
        level: "blocking",
        message: "This request can still use your selected aspect ratio, but it requires Full Guided Reframe.",
        reason: "Aspect Ratio Recompose is meant to preserve the same exact photo feel, not restyle the image.",
        fix: "Switch to Full Guided Reframe, or remove the style-changing presets.",
      });
    }

    if (customInstructionIntents.some((intent) => ["dramatic_reframe", "fisheye", "overhead_angle", "floor_level_angle", "compressed_portrait_lens", "wide_editorial_lens"].includes(intent))) {
      pushValidationIssue(blockingIssues, {
        id: "recompose-vs-custom-camera-instruction",
        level: "blocking",
        message: "This request can still use your selected aspect ratio, but it requires Full Guided Reframe.",
        reason: "Aspect Ratio Recompose allows controlled frame expansion, not a new camera language or strong visual reinterpretation.",
        fix: "Switch to Full Guided Reframe, or remove the camera/lens-style custom instruction.",
      });
    }

    if ((options.customInstruction || "").match(/new pose|different pose|change pose|restyle|new wardrobe|warm it up|sepia|bronze|beige/i)) {
      pushValidationIssue(blockingIssues, {
        id: "recompose-vs-style-or-pose-instruction",
        level: "blocking",
        message: "This request can still use your selected aspect ratio, but it requires Full Guided Reframe.",
        reason: "Aspect Ratio Recompose is for preserving the same photograph feel, not changing pose, styling, or warmth.",
        fix: "Switch to Full Guided Reframe, or remove the pose/style instruction.",
      });
    }
  }

  if (aiRequest.hasAnyAiRequest && stack.includes("final_soften_expression") && stack.includes("final_add_slight_smile")) {
    pushValidationIssue(blockingIssues, {
      id: "expression-preset-conflict",
      level: "blocking",
      message: "`Add Slight Smile` conflicts with `Soften Expression` in the current stack.",
      reason: "They push the mouth and expression in different directions, so the result becomes inconsistent.",
      fix: "Keep one expression preset and remove the other before rendering.",
    });
  }

  const bwIndex = stack.indexOf("final_bw_editorial");
  const removeLogosIndex = stack.indexOf("final_remove_logos");
  if (aiRequest.hasAnyAiRequest && bwIndex !== -1 && removeLogosIndex !== -1 && bwIndex < removeLogosIndex) {
    pushValidationIssue(blockingIssues, {
      id: "bw-before-logo-block",
      level: "blocking",
      message: "`Final B/W Editorial` conflicts with `Remove Logos` in the current order.",
      reason: "Logo cleanup works better before black-and-white conversion, when color and material cues are still available.",
      fix: "Move `Remove Logos` before `Final B/W Editorial`, or remove one of those steps.",
    });
  }

  if (aiRequest.hasReframeBehavior && hasVisibleCameraDirection && options.reframeIntensity === "strong" && options.preserveFlags.preserve_composition) {
    pushValidationIssue(blockingIssues, {
      id: "strong-reframe-vs-preserve-composition",
      level: "blocking",
      message: "Strong camera or lens changes are blocked while `Preserve Composition` is ON.",
      reason: "A strong reframe needs visible crop and perspective movement, but preserve composition keeps the source shot architecture locked.",
      fix: "Turn `Preserve Composition` off, or lower reframe intensity to `subtle` or `moderate`.",
    });
  }

  if (aiRequest.hasReframeBehavior && wantsStrongReframe && options.preserveFlags.preserve_composition && options.preserveFlags.preserve_pose && options.preserveFlags.preserve_background) {
    pushValidationIssue(blockingIssues, {
      id: "reframe-vs-strict-preserve-rules",
      level: "blocking",
      message: "Visible reframing is blocked by your current preserve rules.",
      reason: "The request asks for visible camera reinterpretation, but composition, pose, and background are all locked too tightly.",
      fix: "Relax at least one of `Preserve Composition`, `Preserve Pose`, or `Preserve Background`, or reduce the reframe request.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("add_smile") && stack.includes("final_soften_expression")) {
    pushValidationIssue(blockingIssues, {
      id: "custom-smile-vs-expression-direction",
      level: "blocking",
      message: "Your custom smile instruction conflicts with the current expression direction.",
      reason: "The active stack is steering expression restraint while the custom instruction asks for a smile.",
      fix: "Remove the smile instruction or remove the conflicting expression preset before rendering.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("dramatic_reframe") && options.preserveFlags.preserve_composition) {
    pushValidationIssue(blockingIssues, {
      id: "custom-reframe-vs-preserve-composition",
      level: "blocking",
      message: "The custom instruction requests a strong camera change while `Preserve Composition` is ON.",
      reason: "A dramatic reframe and exact composition preservation cannot both be satisfied honestly.",
      fix: "Turn `Preserve Composition` off, or simplify the custom instruction so it asks for a subtler change.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("preserve_composition") && (options.reframeIntensity === "strong" || options.preserveFlags.allow_reframing)) {
    pushValidationIssue(blockingIssues, {
      id: "custom-preserve-vs-strong-reframe",
      level: "blocking",
      message: "The custom instruction asks to keep the exact composition, but strong reframing is selected.",
      reason: "These directions conflict because one locks the shot while the other asks to reinterpret it visibly.",
      fix: "Remove the exact-composition instruction or reduce the reframe settings.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("fisheye") && cameraSummary.primaryLens.id === "135mm_compressed_portrait") {
    pushValidationIssue(blockingIssues, {
      id: "custom-fisheye-vs-compressed-lens",
      level: "blocking",
      message: "The custom fisheye request conflicts with `135mm Compressed Portrait`.",
      reason: "Fisheye distortion and compressed portrait optics are opposite lens directions.",
      fix: "Choose one lens direction: keep `135mm Compressed Portrait` or switch the active lens to `Fisheye`.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("overhead_angle") && cameraSummary.primaryAngle.id === "floor_level") {
    pushValidationIssue(blockingIssues, {
      id: "custom-overhead-vs-floor-level",
      level: "blocking",
      message: "The custom overhead request conflicts with `Floor Level`.",
      reason: "A top-down angle and a floor-level angle cannot both be the primary camera position.",
      fix: "Remove the overhead instruction or replace `Floor Level` with an overhead-compatible angle.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("floor_level_angle") && cameraSummary.primaryAngle.id === "overhead") {
    pushValidationIssue(blockingIssues, {
      id: "custom-floor-vs-overhead",
      level: "blocking",
      message: "The custom floor-level request conflicts with `Overhead`.",
      reason: "A floor-level angle and a top-down angle cannot both define the same shot.",
      fix: "Remove the floor-level instruction or replace `Overhead` with a compatible angle.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("wide_editorial_lens") && cameraSummary.primaryLens.id === "135mm_compressed_portrait") {
    pushValidationIssue(blockingIssues, {
      id: "custom-wide-vs-compressed-lens",
      level: "blocking",
      message: "The custom wide-lens request conflicts with `135mm Compressed Portrait`.",
      reason: "Wide editorial perspective and compressed portrait perspective are opposite optical directions.",
      fix: "Choose one lens direction and remove the conflicting one.",
    });
  }

  if (aiRequest.hasAnyAiRequest && customInstructionIntents.includes("compressed_portrait_lens") && cameraSummary.primaryLens.id === "24mm_wide_editorial") {
    pushValidationIssue(blockingIssues, {
      id: "custom-compressed-vs-wide-lens",
      level: "blocking",
      message: "The custom compressed-lens request conflicts with `24mm Wide Editorial`.",
      reason: "Compressed portrait optics and wide editorial optics create opposite spatial behavior.",
      fix: "Keep one lens direction and remove the conflicting request.",
    });
  }

  if (aiRequest.hasAnyAiRequest && renderControls.aspectRatio !== "source_auto" && options.preserveFlags.preserve_composition && hasVisibleCameraDirection) {
    pushValidationIssue(warningIssues, {
      id: "aspect-ratio-vs-preserve-composition",
      level: "warning",
      message: "The chosen aspect ratio may be limited while `Preserve Composition` is ON.",
      reason: "A locked composition leaves less room for intentional crop changes into a new frame shape.",
      fix: "Use `Source / Auto`, or relax `Preserve Composition` if you want a more assertive reframe.",
    });
  }

  return {
    blockingIssues,
    warningIssues,
    customInstructionIntents,
    isBlocked: blockingIssues.length > 0,
  } satisfies FinalImageValidationResult;
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
  renderControls: FinalRenderControls;
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
    `Crop position: ${getCropPositionLabel(options.renderControls.cropPosition)}`,
    `Export 4K: ${options.export4k ? "yes" : "no"}`,
    `Temperature: ${options.renderControls.temperature.toFixed(2)}`,
    `Top P: ${options.renderControls.topP.toFixed(2)}`,
    "",
    "Render controls:",
    ...getAspectRatioPromptLines(options.renderControls).map((line) => `- ${line}`),
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

function buildAspectRatioRecomposePrompt(options: {
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  sourceTitle: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  export4k: boolean;
  renderControls: FinalRenderControls;
  monochromeLockEnabled: boolean;
}) {
  const subjectProtectionLines = getSubjectProtectionLines(options.renderControls.subjectProtection);

  return [
    "Recompose this exact source image to fit the target aspect ratio while preserving the same photograph feel.",
    "Execution mode: Aspect Ratio Recompose Mode.",
    `Source image title: ${options.sourceTitle}`,
    `Source type: ${options.sourceType}`,
    `Target aspect ratio: ${options.renderControls.aspectRatio}`,
    `Framing preference: ${getFramingPreferenceLabel(options.renderControls.framingPreference)}`,
    `Crop expansion preference: ${getCropPositionLabel(options.renderControls.cropPosition)}`,
    "Tone/style lock: strict.",
    "Reinterpretation level: minimal.",
    "Goal: preserve the same image while fitting the new frame.",
    "",
    "Core recompose instructions:",
    "- Preserve the same exact woman, same face, same expression, same outfit, same pose intent, same lighting direction, and the same existing finish already present in the source image.",
    "- Do not reinterpret the shot as a new image.",
    "- Do not change the color palette or black-and-white balance.",
    "- Do not add cinematic warmth, editorial warmth, tonal polish, skin glow, luxury finish, or any new style treatment.",
    "- Do not crop off important parts of the body or face.",
    "- Expand and rebalance the composition naturally so the image fits the new frame while remaining visually the same photograph.",
    "- Keep realism high and preserve the original perceived image quality without adding a new look.",
    "- Preserve the same environment family and background style.",
    "- Preserve softness/sharpness feel, contrast structure, and overall visual mood.",
    ...(options.monochromeLockEnabled
      ? [
          "- Preserve the exact monochrome tonality.",
          "- Do not warm the image.",
          "- Do not introduce sepia, bronze, cream, beige, or skin-warming tones.",
          "- Preserve the same black point, white point, and neutral grayscale balance.",
          "- Do not brighten, darken, warm, cool, tint, or recolor the image.",
          "- Recompose only; do not restyle.",
        ]
      : []),
    "",
    "Allowed adjustments:",
    "- Extend the frame.",
    "- Add missing side space, top space, or bottom space as needed.",
    "- Rebalance subject placement subtly to fit the new frame.",
    "- Complete background/context naturally without introducing visual junk.",
    "",
    "Subject protection priority:",
    ...subjectProtectionLines.map((line) => `- ${line}`),
    "",
    "Preserve rules:",
    ...getPreserveRuleInstructions(options.preserveFlags, "refine").map((instruction) => `- ${instruction}`),
    ...buildCustomInstructionLines(options.customInstruction),
    ...(options.export4k ? ["- Prepare the recomposed output for final 4K delivery without changing the underlying image feel."] : []),
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
  renderControls: FinalRenderControls;
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
    `Crop position: ${getCropPositionLabel(options.renderControls.cropPosition)}`,
    `Export 4K: ${options.export4k ? "yes" : "no"}`,
    `Temperature: ${options.renderControls.temperature.toFixed(2)}`,
    `Top P: ${options.renderControls.topP.toFixed(2)}`,
    "",
    "Render controls:",
    ...getAspectRatioPromptLines(options.renderControls).map((line) => `- ${line}`),
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
  stack: RefinementPresetId[];
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  cameraPresetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
  renderControls?: Partial<FinalRenderControls>;
}) {
  const renderControls = normalizeRenderControls(options.renderControls);
  const aiRequest = hasAiRefinementRequest({ ...options, renderControls });
  const normalizedCameraPresetIds = normalizeCameraPresetIds(options.cameraPresetIds);
  const triggerReasons: string[] = [];

  if (aiRequest.hasCameraDirection) {
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

  if (aiRequest.hasCustomInstruction) {
    triggerReasons.push("custom instruction is selected");
  }

  if (aiRequest.hasAiPresets) {
    triggerReasons.push("AI refinement presets are selected");
  }

  if (aiRequest.wantsAspectRatioRecompose) {
    triggerReasons.push("aspect ratio recomposition is selected");
  }

  if (renderControls.aspectRatioMode === "exact_crop") {
    return {
      executionMode: "exact_crop" as const,
      reframeTriggered: false,
      triggerReasons: ["Exact Crop render mode is selected"],
      normalizedCameraPresetIds,
    };
  }

  if (renderControls.aspectRatioMode === "recompose") {
    return {
      executionMode: "aspect_ratio_recompose" as const,
      reframeTriggered: false,
      triggerReasons: [
        renderControls.aspectRatio !== "source_auto"
          ? "Aspect Ratio Recompose render mode is selected with a target aspect ratio"
          : "Aspect Ratio Recompose render mode is selected",
      ],
      normalizedCameraPresetIds,
    };
  }

  if (renderControls.aspectRatioMode === "guided_reframe") {
    if (renderControls.aspectRatio !== "source_auto") {
      triggerReasons.push("target aspect ratio will be fulfilled inside Full Guided Reframe");
    }

    if (renderControls.aspectRatio !== "source_auto" || aiRequest.hasReframeBehavior) {
      return {
        executionMode: "reframe" as const,
        reframeTriggered: true,
        triggerReasons: triggerReasons.length > 0 ? triggerReasons : ["Full Guided Reframe render mode is selected"],
        normalizedCameraPresetIds,
      };
    }
  }

  if (!aiRequest.hasAnyAiRequest) {
    return {
      executionMode: "exact_crop" as const,
      reframeTriggered: false,
      triggerReasons: ["exact crop/export only"],
      normalizedCameraPresetIds,
    };
  }

  return {
    executionMode: aiRequest.hasReframeBehavior ? ("reframe" as const) : ("refine" as const),
    reframeTriggered: aiRequest.hasReframeBehavior,
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
  renderControls?: Partial<FinalRenderControls>;
  sourceAnalysis?: SourceImageAnalysis;
}) {
  const presets = options.stack.map((presetId) => getFinalRefinementPreset(presetId)).filter(Boolean) as RefinementPreset[];

  const mode = getFinalImageExecutionMode({
    stack: options.stack,
    customInstruction: options.customInstruction,
    preserveFlags: options.preserveFlags,
    cameraPresetIds: options.cameraPresetIds,
    reframeIntensity: options.reframeIntensity,
    renderControls: options.renderControls,
  });
  const stackWarnings = getFinalRefinementStackWarnings(options.stack, options.customInstruction);
  const renderControls = normalizeRenderControls(options.renderControls);
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
  const validation = validateFinalImageRequest({
    stack: options.stack,
    customInstruction: options.customInstruction,
    preserveFlags: options.preserveFlags,
    cameraPresetIds: mode.normalizedCameraPresetIds,
    reframeIntensity: options.reframeIntensity,
    renderControls,
    sourceAnalysis: options.sourceAnalysis,
  });
  const monochromeLockEnabled = shouldEnableMonochromeLock({
    executionMode: mode.executionMode,
    stack: options.stack,
    sourceAnalysis: options.sourceAnalysis,
  });
  const activePreserveRules = getPreserveRuleInstructions(options.preserveFlags, mode.executionMode);
  const activeCameraInstructions = [
    `Primary angle: ${cameraSummary.primaryAngle.title}`,
    `Primary lens: ${cameraSummary.primaryLens.title}`,
    `Modifiers: ${cameraSummary.modifiers.length > 0 ? cameraSummary.modifiers.map((modifier) => modifier.title).join(" • ") : "none"}`,
    `Reframe intensity: ${options.reframeIntensity}`,
    `Crop position: ${getCropPositionLabel(renderControls.cropPosition)}`,
    `Aspect handling: ${renderControls.aspectRatioMode === "recompose" ? "Aspect Ratio Recompose" : renderControls.aspectRatioMode === "guided_reframe" ? "Full Guided Reframe" : "Exact Crop"}`,
    `Framing preference: ${getFramingPreferenceLabel(renderControls.framingPreference)}`,
    `Tone/style lock: ${renderControls.toneStyleLock}`,
  ];
  const activeCustomInstructions = getNormalizedCustomInstructions(options.customInstruction);
  const promptText =
    mode.executionMode === "exact_crop"
      ? "No AI prompt used. Exact Crop Mode preserves the original image and applies only deterministic crop/export changes."
      : mode.executionMode === "aspect_ratio_recompose"
        ? buildAspectRatioRecomposePrompt({
            customInstruction: options.customInstruction,
            preserveFlags: options.preserveFlags,
            sourceTitle: options.sourceTitle,
          sourceType: options.sourceType,
          export4k: options.export4k,
          renderControls,
          monochromeLockEnabled,
        })
      : mode.executionMode === "reframe"
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
          renderControls,
        })
      : buildRefineModePrompt({
          stack: presets,
          customInstruction: options.customInstruction,
          preserveFlags: options.preserveFlags,
          sourceTitle: options.sourceTitle,
          sourceType: options.sourceType,
          export4k: options.export4k,
          keepOriginalAspectRatio: options.keepOriginalAspectRatio,
          renderControls,
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
    renderControls,
    validation,
    monochromeLockEnabled,
    appendedStyleFragments: [],
    postProcessingSteps: [mode.executionMode === "aspect_ratio_recompose" ? "no post-processing applied after Gemini output" : "no post-processing applied"],
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
  renderControls?: Partial<FinalRenderControls>;
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
  RenderAspectRatio,
  AspectRatioMode,
  FinalRenderControls,
  CropPosition,
  RecomposeFramingPreference,
  RecomposeSubjectProtection,
  SourceImageAnalysis,
  FinalImageValidationIssue,
  FinalImageValidationResult,
  FinalImageExecutionMode,
  FinalImageExecutionPlan,
  CustomInstructionIntent,
  ReframeIntensity,
  RefinementPreset,
  RefinementPresetId,
  RefinementRecipe,
  StackWarning,
};
