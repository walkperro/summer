export type PreserveFlags = {
  preserve_face: boolean;
  preserve_composition: boolean;
  preserve_background: boolean;
  preserve_outfit: boolean;
  preserve_body_shape: boolean;
  preserve_pose: boolean;
  allow_reframing: boolean;
  allow_perspective_shift: boolean;
};

export type CameraAngleId =
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

export type LensLookId =
  | "keep_original_lens_feel"
  | "24mm_wide_editorial"
  | "35mm_cinematic"
  | "50mm_natural"
  | "85mm_portrait"
  | "135mm_compressed_portrait"
  | "macro_close_detail"
  | "fisheye";

export type CameraDirectionPresetId = CameraAngleId | LensLookId;
export type ReframeIntensity = "subtle" | "moderate" | "strong";
export type CameraDirectionKind = "angle" | "lens";
export type CameraDirectionCategory = "angle_core" | "framing_modifier" | "lens_core" | "experimental_modifier";

export type CameraOption = {
  id: CameraDirectionPresetId;
  title: string;
  description: string;
  shortDescription: string;
  previewLabel: string;
  previewAccent: string;
  previewImageUrl: string;
  previewAlt: string;
  kind: CameraDirectionKind;
  category: CameraDirectionCategory;
  promptPhrase: string;
  dominant?: boolean;
};

export type CameraRecipe = {
  id: "premium_portrait" | "cinematic_fitness" | "editorial_environmental" | "experimental_fisheye";
  title: string;
  preset_ids: CameraDirectionPresetId[];
  reframe_intensity: ReframeIntensity;
};

export type CameraSelectionWarning = {
  id: string;
  level: "warning";
  message: string;
};

export type CameraSelectionSummary = {
  selectedPresetIds: CameraDirectionPresetId[];
  activePresets: CameraOption[];
  primaryAngle: CameraOption;
  primaryLens: CameraOption;
  modifiers: CameraOption[];
  hasNonOriginalSelection: boolean;
  narrative: string;
};

export type CameraPreviewGenerationPlan = {
  presetId: CameraDirectionPresetId;
  fallbackPreviewUrl: string;
  outputPathname: string;
  likenessReferenceIds: string[];
  jsonPlan: Record<string, unknown>;
  finalPrompt: string;
  revision: null;
};

const DEFAULT_ANGLE_ID: CameraAngleId = "keep_original_angle";
const DEFAULT_LENS_ID: LensLookId = "keep_original_lens_feel";

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

const CAMERA_DIRECTION_PRESETS: CameraOption[] = [
  {
    id: "keep_original_angle",
    title: "Keep Original Angle",
    description: "Preserve the current camera angle and framing logic with only minimal reinterpretation.",
    shortDescription: "neutral baseline, closest to the source framing",
    previewLabel: "Original",
    previewAccent: "#c9b18a",
    previewImageUrl: "/references/summer_final_likeness/yellow_on_black_midshot.png",
    previewAlt: "Summer neutral baseline camera-angle preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "the original camera angle with restrained reframing",
  },
  {
    id: "eye_level",
    title: "Eye Level",
    description: "Balanced, natural perspective with straightforward editorial clarity and calm confidence.",
    shortDescription: "balanced viewpoint, clean and natural editorial read",
    previewLabel: "Eye Level",
    previewAccent: "#b7c4d6",
    previewImageUrl: "/references/summer_final_likeness/black_top_midshot.png",
    previewAlt: "Summer eye-level editorial preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "an eye-level editorial perspective",
  },
  {
    id: "low_angle_heroic",
    title: "Low Angle Heroic",
    description: "Adds premium power and a subtle heroic campaign feel from a lower camera position.",
    shortDescription: "powerful upward perspective with campaign energy",
    previewLabel: "Low Hero",
    previewAccent: "#9aa7c9",
    previewImageUrl: "/references/summer_fit/fit_pushup_intensity_close.jpg",
    previewAlt: "Summer low-angle heroic preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "a low-angle heroic perspective",
  },
  {
    id: "high_angle",
    title: "High Angle",
    description: "Looks slightly down at Summer for a softer hierarchy and more delicate spatial read.",
    shortDescription: "slightly elevated viewpoint with softer hierarchy",
    previewLabel: "High Angle",
    previewAccent: "#c7c2de",
    previewImageUrl: "/references/summer_final_style/peach_on_yellow.png",
    previewAlt: "Summer high-angle preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "a high-angle editorial perspective",
  },
  {
    id: "three_quarter_portrait",
    title: "Three-Quarter Portrait",
    description: "Elegant portrait framing with premium shoulder, cheekbone, and face geometry.",
    shortDescription: "classic three-quarter portrait with elegant face geometry",
    previewLabel: "3/4",
    previewAccent: "#d6b5b2",
    previewImageUrl: "/references/summer_final_style/black_cutout_top.png",
    previewAlt: "Summer three-quarter portrait preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "a three-quarter portrait perspective",
  },
  {
    id: "side_profile",
    title: "Side Profile",
    description: "Profile-led composition that emphasizes sculptural facial edge, posture, and silhouette.",
    shortDescription: "clean profile perspective with sculptural lines",
    previewLabel: "Profile",
    previewAccent: "#cbb996",
    previewImageUrl: "/references/summer_fit/fit_side_profile_architectural.jpg",
    previewAlt: "Summer side-profile preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "a side-profile perspective",
  },
  {
    id: "floor_level",
    title: "Floor Level",
    description: "Grounded sports-campaign angle with dramatic low perspective and strong athletic presence.",
    shortDescription: "grounded floor-level perspective with athletic drama",
    previewLabel: "Floor",
    previewAccent: "#9fb7aa",
    previewImageUrl: "/references/summer_fit/fit_pushup_intensity_profile.jpg",
    previewAlt: "Summer floor-level preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "a floor-level campaign perspective",
  },
  {
    id: "overhead",
    title: "Overhead",
    description: "Top-down editorial reframe for graphic composition, shape control, and designed negative space.",
    shortDescription: "top-down graphic composition with strong shape control",
    previewLabel: "Overhead",
    previewAccent: "#aebfc9",
    previewImageUrl: "/references/summer_final_body/grass_stretch_standing.png",
    previewAlt: "Summer overhead-style preview",
    kind: "angle",
    category: "angle_core",
    promptPhrase: "an overhead editorial perspective",
  },
  {
    id: "dutch_tilt",
    title: "Dutch Tilt",
    description: "Intentional stylized tilt for kinetic editorial energy layered on top of an allowed base angle.",
    shortDescription: "kinetic tilt modifier with controlled editorial tension",
    previewLabel: "Tilt",
    previewAccent: "#d8b48f",
    previewImageUrl: "/references/summer_final_style/black_and_white_pose.png",
    previewAlt: "Summer dutch-tilt preview",
    kind: "angle",
    category: "experimental_modifier",
    promptPhrase: "a restrained dutch-tilt modifier",
  },
  {
    id: "close_crop_beauty",
    title: "Close Crop Beauty",
    description: "Face-led close crop with premium intimacy, beauty focus, and tighter composition language.",
    shortDescription: "closer beauty crop with face-led intimacy",
    previewLabel: "Close",
    previewAccent: "#d5a8a8",
    previewImageUrl: "/references/summer_final_likeness/black_closeup.png",
    previewAlt: "Summer close-crop beauty preview",
    kind: "angle",
    category: "framing_modifier",
    promptPhrase: "a close beauty crop",
  },
  {
    id: "wide_environmental",
    title: "Wide Environmental",
    description: "Shows more environment and spatial drama around Summer while keeping her visually dominant.",
    shortDescription: "wider crop with more environment and spatial drama",
    previewLabel: "Wide",
    previewAccent: "#a6c6cf",
    previewImageUrl: "/references/summer_fit/fit_stretch_recovery_standing.jpg",
    previewAlt: "Summer wide-environmental preview",
    kind: "angle",
    category: "framing_modifier",
    promptPhrase: "a wide environmental framing modifier",
  },
  {
    id: "keep_original_lens_feel",
    title: "Keep Original Lens Feel",
    description: "Preserve the current lens feel and perspective behavior as the baseline.",
    shortDescription: "neutral baseline, closest to the source optics",
    previewLabel: "Original Lens",
    previewAccent: "#c9b18a",
    previewImageUrl: "/references/summer_final_likeness/peach_mid_shot_2.png",
    previewAlt: "Summer neutral baseline lens preview",
    kind: "lens",
    category: "lens_core",
    promptPhrase: "the original lens behavior",
  },
  {
    id: "24mm_wide_editorial",
    title: "24mm Wide Editorial",
    description: "More environment, more spatial drama, and a broader premium editorial sweep.",
    shortDescription: "more environment, more spatial drama",
    previewLabel: "24mm",
    previewAccent: "#9ebfd2",
    previewImageUrl: "/references/summer_fit/fit_stretch_recovery_standing.jpg",
    previewAlt: "Summer 24mm wide editorial preview",
    kind: "lens",
    category: "lens_core",
    promptPhrase: "a 24mm wide editorial lens feel",
  },
  {
    id: "35mm_cinematic",
    title: "35mm Cinematic",
    description: "Versatile cinematic storytelling look with a premium sense of movement and presence.",
    shortDescription: "cinematic balance between subject and environment",
    previewLabel: "35mm",
    previewAccent: "#b5badc",
    previewImageUrl: "/references/summer_final_style/peach_rooftop.png",
    previewAlt: "Summer 35mm cinematic preview",
    kind: "lens",
    category: "lens_core",
    promptPhrase: "a 35mm cinematic lens feel",
  },
  {
    id: "50mm_natural",
    title: "50mm Natural",
    description: "Balanced natural perspective with restrained premium polish and believable realism.",
    shortDescription: "natural perspective with restrained editorial polish",
    previewLabel: "50mm",
    previewAccent: "#bfc4b1",
    previewImageUrl: "/references/summer_final_style/jeans_sitting.png",
    previewAlt: "Summer 50mm natural preview",
    kind: "lens",
    category: "lens_core",
    promptPhrase: "a 50mm natural lens feel",
  },
  {
    id: "85mm_portrait",
    title: "85mm Portrait",
    description: "Flattering compression with premium face-led portrait hierarchy and elegant separation.",
    shortDescription: "flattering compression, premium face-led portrait",
    previewLabel: "85mm",
    previewAccent: "#d1b2c4",
    previewImageUrl: "/references/summer_final_likeness/purple_closeup_1.png",
    previewAlt: "Summer 85mm portrait preview",
    kind: "lens",
    category: "lens_core",
    promptPhrase: "an 85mm portrait lens feel",
  },
  {
    id: "135mm_compressed_portrait",
    title: "135mm Compressed Portrait",
    description: "Tighter portrait compression with elegant background flattening and polished facial emphasis.",
    shortDescription: "tighter portrait compression with elegant flattening",
    previewLabel: "135mm",
    previewAccent: "#cab2d8",
    previewImageUrl: "/references/summer_final_likeness/purple_closeup_3.png",
    previewAlt: "Summer 135mm compressed portrait preview",
    kind: "lens",
    category: "lens_core",
    promptPhrase: "a 135mm compressed portrait lens feel",
  },
  {
    id: "macro_close_detail",
    title: "Macro Close Detail",
    description: "Close-detail interpretation for texture, skin, or material-led finals with premium realism.",
    shortDescription: "macro detail emphasis for skin and material texture",
    previewLabel: "Macro",
    previewAccent: "#d3c39f",
    previewImageUrl: "/references/summer_final_likeness/peach_closeup_mid_shot.png",
    previewAlt: "Summer macro close-detail preview",
    kind: "lens",
    category: "lens_core",
    promptPhrase: "a macro close-detail lens feel",
  },
  {
    id: "fisheye",
    title: "Fisheye",
    description: "Extreme stylized distortion with experimental editorial energy that should be used sparingly.",
    shortDescription: "experimental distortion, dramatic and intentionally stylized",
    previewLabel: "Fisheye",
    previewAccent: "#e2a57b",
    previewImageUrl: "/references/summer_fit/fit_pushup_intensity_close.jpg",
    previewAlt: "Summer fisheye-style preview",
    kind: "lens",
    category: "experimental_modifier",
    promptPhrase: "a controlled fisheye lens treatment",
    dominant: true,
  },
];

const CAMERA_PRESET_ORDER = CAMERA_DIRECTION_PRESETS.map((preset) => preset.id);
const CAMERA_PRESET_MAP = new Map(CAMERA_DIRECTION_PRESETS.map((preset) => [preset.id, preset]));

export const CAMERA_ANGLE_OPTIONS = CAMERA_DIRECTION_PRESETS.filter((preset) => preset.kind === "angle");
export const LENS_LOOK_OPTIONS = CAMERA_DIRECTION_PRESETS.filter((preset) => preset.kind === "lens");

export const CAMERA_RECIPES: CameraRecipe[] = [
  { id: "premium_portrait", title: "Premium Portrait", preset_ids: ["eye_level", "85mm_portrait"], reframe_intensity: "subtle" },
  { id: "cinematic_fitness", title: "Cinematic Fitness", preset_ids: ["low_angle_heroic", "35mm_cinematic"], reframe_intensity: "moderate" },
  { id: "editorial_environmental", title: "Editorial Environmental", preset_ids: ["wide_environmental", "24mm_wide_editorial"], reframe_intensity: "moderate" },
  { id: "experimental_fisheye", title: "Experimental Fisheye", preset_ids: ["floor_level", "fisheye"], reframe_intensity: "strong" },
];

export const CAMERA_PREVIEW_LIKENESS_REFERENCE_IDS = [
  "likeness_black_closeup",
  "likeness_black_top_midshot",
  "likeness_peach_mid_shot_2",
];

function getPreset(id: CameraDirectionPresetId) {
  const preset = CAMERA_PRESET_MAP.get(id);

  if (!preset) {
    throw new Error(`Unknown camera preset: ${id}`);
  }

  return preset;
}

function sortPresetIds(ids: CameraDirectionPresetId[]) {
  return [...ids].sort((left, right) => CAMERA_PRESET_ORDER.indexOf(left) - CAMERA_PRESET_ORDER.indexOf(right));
}

function dedupe(ids: CameraDirectionPresetId[]) {
  return [...new Set(ids)];
}

function isAngleCore(id: CameraDirectionPresetId) {
  const preset = getPreset(id);
  return preset.kind === "angle" && preset.category === "angle_core";
}

function isLensPrimary(id: CameraDirectionPresetId) {
  const preset = getPreset(id);
  return preset.kind === "lens";
}

function isFramingModifier(id: CameraDirectionPresetId) {
  const preset = getPreset(id);
  return preset.category === "framing_modifier";
}

function isAngleExperimentalModifier(id: CameraDirectionPresetId) {
  const preset = getPreset(id);
  return preset.kind === "angle" && preset.category === "experimental_modifier";
}

function hasPair(ids: CameraDirectionPresetId[], left: CameraDirectionPresetId, right: CameraDirectionPresetId) {
  return ids.includes(left) && ids.includes(right);
}

function getCrossConflict(candidateId: CameraDirectionPresetId, currentIds: CameraDirectionPresetId[]) {
  const nextIds = [...currentIds, candidateId];

  if (hasPair(nextIds, "macro_close_detail", "wide_environmental")) {
    return "`Macro Close Detail` conflicts with `Wide Environmental`. Macro wants intimate detail while Wide Environmental wants broader spatial context.";
  }

  if (hasPair(nextIds, "fisheye", "macro_close_detail")) {
    return "`Fisheye` conflicts with `Macro Close Detail`. One is strongly distorted and the other is precision close-detail.";
  }

  if (hasPair(nextIds, "fisheye", "close_crop_beauty")) {
    return "`Fisheye` conflicts with `Close Crop Beauty`. Beauty crops need flattering restraint, while fisheye pushes distortion.";
  }

  if (hasPair(nextIds, "fisheye", "dutch_tilt")) {
    return "`Fisheye` plus `Dutch Tilt` is too destabilizing for this workflow. Keep one experimental modifier at a time.";
  }

  return null;
}

export function normalizeCameraPresetIds(presetIds: CameraDirectionPresetId[]) {
  const uniqueIds = dedupe(presetIds).filter((id) => CAMERA_PRESET_MAP.has(id));
  const nonDefaultAngleCore = uniqueIds.find((id) => isAngleCore(id) && id !== DEFAULT_ANGLE_ID);
  const nonDefaultLens = uniqueIds.find((id) => isLensPrimary(id) && id !== DEFAULT_LENS_ID);
  const framingModifier = uniqueIds.filter(isFramingModifier).slice(-1);
  const angleExperimentalModifiers = uniqueIds.filter(isAngleExperimentalModifier).slice(-1);

  const normalized: CameraDirectionPresetId[] = [
    nonDefaultAngleCore || DEFAULT_ANGLE_ID,
    nonDefaultLens || DEFAULT_LENS_ID,
    ...framingModifier,
    ...angleExperimentalModifiers,
  ];

  return sortPresetIds(dedupe(normalized));
}

export function applyCameraPresetToggle(currentPresetIds: CameraDirectionPresetId[], candidateId: CameraDirectionPresetId) {
  const current = normalizeCameraPresetIds(currentPresetIds);

  if (current.includes(candidateId)) {
    return {
      selection: normalizeCameraPresetIds(current.filter((id) => id !== candidateId)),
      warning: null,
    };
  }

  let next = [...current];
  const candidate = getPreset(candidateId);

  if (candidate.kind === "angle" && candidate.category === "angle_core") {
    next = next.filter((id) => !isAngleCore(id));
  }

  if (candidate.kind === "lens") {
    next = next.filter((id) => !isLensPrimary(id));
  }

  if (candidate.category === "framing_modifier") {
    next = next.filter((id) => !isFramingModifier(id));
  }

  if (candidate.kind === "angle" && candidate.category === "experimental_modifier") {
    next = next.filter((id) => !isAngleExperimentalModifier(id));
  }

  const conflict = getCrossConflict(candidateId, next);

  if (conflict) {
    return {
      selection: current,
      warning: {
        id: `camera-conflict-${candidateId}`,
        level: "warning" as const,
        message: conflict,
      },
    };
  }

  return {
    selection: normalizeCameraPresetIds([...next, candidateId]),
    warning: null,
  };
}

export function getCameraAngleOption(cameraAngle: string) {
  return CAMERA_ANGLE_OPTIONS.find((option) => option.id === cameraAngle);
}

export function getLensLookOption(lensLook: string) {
  return LENS_LOOK_OPTIONS.find((option) => option.id === lensLook);
}

export function getCameraRecipe(recipeId: string) {
  return CAMERA_RECIPES.find((recipe) => recipe.id === recipeId);
}

export function getCameraDirectionPreset(presetId: string) {
  return CAMERA_PRESET_MAP.get(presetId as CameraDirectionPresetId);
}

export function getCameraSelectionSummary(presetIds: CameraDirectionPresetId[]): CameraSelectionSummary {
  const selectedPresetIds = normalizeCameraPresetIds(presetIds);
  const activePresets = selectedPresetIds.map((presetId) => getPreset(presetId));
  const primaryAngle = activePresets.find((preset) => preset.kind === "angle" && preset.category === "angle_core") || getPreset(DEFAULT_ANGLE_ID);
  const primaryLens = activePresets.find((preset) => preset.kind === "lens") || getPreset(DEFAULT_LENS_ID);
  const modifiers = activePresets.filter((preset) => ![primaryAngle.id, primaryLens.id].includes(preset.id));
  const phrases = [primaryAngle.promptPhrase, primaryLens.promptPhrase, ...modifiers.map((modifier) => modifier.promptPhrase)].filter(
    Boolean,
  );

  return {
    selectedPresetIds,
    activePresets,
    primaryAngle,
    primaryLens,
    modifiers,
    hasNonOriginalSelection:
      primaryAngle.id !== DEFAULT_ANGLE_ID || primaryLens.id !== DEFAULT_LENS_ID || modifiers.length > 0,
    narrative: phrases.join(", "),
  };
}

export function getCameraDirectionWarnings(options: {
  presetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
  preserveFlags: PreserveFlags;
}) {
  const warnings: CameraSelectionWarning[] = [];
  const summary = getCameraSelectionSummary(options.presetIds);

  if (summary.hasNonOriginalSelection && options.preserveFlags.preserve_composition && options.reframeIntensity === "strong") {
    warnings.push({
      id: "composition-vs-strong-camera",
      level: "warning",
      message: "`preserve composition` is ON while a strong camera reinterpretation is selected. Results will likely stay subtle unless you allow reframing.",
    });
  }

  if (summary.hasNonOriginalSelection && !options.preserveFlags.allow_reframing) {
    warnings.push({
      id: "camera-without-reframing",
      level: "warning",
      message: "A new angle, framing modifier, or lens is selected, but `allow reframing` is OFF. Camera direction will behave like mild influence only.",
    });
  }

  if (summary.hasNonOriginalSelection && options.preserveFlags.allow_reframing) {
    warnings.push({
      id: "camera-reinterpretation-enabled",
      level: "warning",
      message: "`allow reframing` is ON, so the result may become a controlled reinterpretation rather than pure cleanup.",
    });
  }

  if (summary.primaryLens.id === "fisheye") {
    warnings.push({
      id: "fisheye-warning",
      level: "warning",
      message: "Fisheye is experimental and best used sparingly for intentional editorial distortion, not standard portraits.",
    });
  }

  if (summary.modifiers.length > 1) {
    warnings.push({
      id: "modifier-stacking-note",
      level: "warning",
      message: "Multiple modifiers are active. Keep the result coordinated and avoid over-stylizing the shot.",
    });
  }

  return warnings;
}

export function buildCameraDirectionPromptLines(options: {
  presetIds: CameraDirectionPresetId[];
  reframeIntensity: ReframeIntensity;
  preserveFlags: PreserveFlags;
}) {
  const summary = getCameraSelectionSummary(options.presetIds);

  if (!summary.hasNonOriginalSelection) {
    return [
      "Camera direction:",
      "- Keep the original angle and original lens feel.",
      "- Do not introduce composition changes or camera reinterpretation.",
      "",
    ];
  }

  return [
    "Camera direction:",
    `- Coordinate the camera language as ${summary.narrative}.`,
    `- Primary angle: ${summary.primaryAngle.title}.`,
    `- Primary lens: ${summary.primaryLens.title}.`,
    summary.modifiers.length > 0
      ? `- Active modifiers: ${summary.modifiers.map((modifier) => modifier.title).join(" • ")}.`
      : "- Active modifiers: none.",
    `- Reframe intensity: ${options.reframeIntensity}.`,
    options.preserveFlags.allow_reframing
      ? "- Reframing is allowed, but identity, realism, body proportions, and anatomy must stay controlled."
      : "- Reframing is not allowed, so treat camera direction as subtle influence only.",
    options.preserveFlags.allow_perspective_shift
      ? "- Mild perspective shift is allowed if it remains tasteful and anatomically believable."
      : "- Do not introduce noticeable perspective shift.",
    summary.primaryLens.id === "fisheye"
      ? "- Keep fisheye intentional, premium, and editorial rather than gimmicky."
      : "- Keep lens reinterpretation premium and realistic rather than gimmicky.",
    "- Preserve the same exact woman, preserve body proportions, and keep facial identity dominant.",
    "",
  ];
}

export function getCameraPreviewGenerationPlan(presetId: CameraDirectionPresetId): CameraPreviewGenerationPlan {
  const preset = getPreset(presetId);
  const jsonPlan = {
    task: "generate_with_references",
    verb: "Create",
    section: "about",
    goal: "premium internal camera-language preview",
    subject: {
      primary: "Summer, the same exact woman from the attached likeness references",
      secondary: [],
      attributes: ["premium feminine athletic energy", "simple editorial styling", "same exact woman across the preview library"],
    },
    subject_lock: {
      identity_anchor: "The exact same woman from the Summer likeness references must remain unchanged across all previews.",
      immutable_features: ["same face", "same age", "same facial proportions", "same body proportions", "same realistic skin texture"],
      facial_feature_preservation: ["eye shape", "brow structure", "lip shape", "jawline", "hairline"],
      body_truths: ["athletic feminine proportions", "believable anatomy", "premium but realistic skin texture"],
      anti_drift: ["do not generate a different woman", "do not age her up", "do not plasticize skin", "do not invent fake text or graphics"],
    },
    action: "Hold a calm editorial pose designed to clearly demonstrate the selected camera language.",
    scene: {
      location: "minimal premium editorial studio",
      environment: "consistent neutral architectural backdrop with clean tonal variation and no visible branding",
      time_of_day: "soft daylight",
    },
    composition: {
      shot_type: "editorial portrait study",
      framing: preset.title,
      angle: preset.title,
      depth: "controlled shallow-to-medium depth depending on the selected lens behavior",
    },
    composition_language: {
      visual_hierarchy: "Summer remains dominant and centered within a clean premium image architecture.",
      text_safe_guidance: "Keep the frame free of fake text, fake logos, or graphic clutter.",
      mobile_crop_safety_guidance: "Keep Summer readable and recognizable in a tighter mobile crop.",
      subject_placement: "Keep Summer clearly readable with enough surrounding space to understand the camera-language shift.",
      eye_line: "Keep eye-line calm and editorial.",
    },
    style: {
      visual_direction: "luxury realism",
      editorial_reference: "premium editorial fitness portraiture",
      mood: "calm, cinematic, premium, and believable",
    },
    camera: {
      lens: preset.title,
      aperture: "clean editorial depth with sharp facial detail",
      rendering: "photorealistic premium internal camera-language library preview",
    },
    camera_language: {
      capture_feel: `Demonstrate ${preset.title} clearly while keeping the same exact woman and a premium internal-library feel.`,
      lens_behavior: preset.shortDescription,
      focus_strategy: "Keep facial identity sharp and clear while the framing and optical behavior communicate the preset.",
      motion_treatment: "still portrait precision",
    },
    lighting_language: {
      key_light_character: "soft daylight with premium contour and no harsh flash feel",
      shadow_behavior: "clean controlled shadows with believable depth",
      highlight_behavior: "subtle highlights with no fake gloss",
      skin_treatment: "visible pores and believable human skin texture",
    },
    styling_language: {
      wardrobe: "simple clean premium editorial activewear or neutral fitted styling with no visible logos",
      grooming: "clean polished grooming with natural hair and no overdone glam",
      makeup: "subtle editorial realism",
      overall_finish: "premium internal camera-language library reference image",
    },
    environment_language: {
      spatial_mood: "quiet premium studio calm",
      background_strategy: "keep the same neutral background family across previews so the camera differences read clearly",
      surface_materials: "soft concrete, plaster, and premium neutral surfaces",
      color_world: "warm neutrals, soft blacks, muted stone, and editorial skin tones",
    },
    cinematic_language: {
      visual_arc: "camera-language demonstration rather than narrative storytelling",
      emotional_temperature: "confident, poised, and premium",
      editorial_energy: "controlled editorial clarity",
      luxury_signal: "believable luxury realism instead of generic AI gloss",
    },
    realism_guards: {
      skin_texture_rules: ["keep natural pores", "do not smooth skin into plastic", "keep believable facial detail"],
      facial_feature_preservation_rules: ["preserve the same eyes", "preserve brow shape", "preserve lips", "preserve jawline"],
      anatomy_rules: ["preserve body proportions", "preserve realistic anatomy", "avoid warped limbs and hands"],
      anti_drift_instructions: ["the likeness references must dominate identity", "do not generate a different face", "do not change her age"],
      anti_generic_ai_face_negatives: ["generic AI face", "plastic skin", "invented text", "fake logos"],
    },
    materials: ["soft concrete", "matte fabric", "neutral editorial surfaces"],
    references: CAMERA_PREVIEW_LIKENESS_REFERENCE_IDS,
    text_overlay_zone: {
      placement: "none",
      purpose: "internal preview reference only",
      keep_clean: true,
    },
    edit: {
      change: [`Show ${preset.title} clearly through composition, crop, or lens behavior.`],
      preserve: ["same exact woman", "same age", "same premium realism", "same neutral background family"],
    },
    constraints: {
      aspect_ratio: "4:5",
      must_have: [
        "same exact woman across every preview",
        "clear visual demonstration of the selected preset",
        "premium internal camera-language library look",
      ],
      avoid: ["fake text", "fake logos", "stock-photo energy", "overdone tattoos", "plastic skin"],
    },
  };

  const finalPrompt = [
    "Create a premium internal camera-language preview image using the attached Summer likeness references.",
    `Demonstrate ${preset.title} with ${preset.shortDescription}.`,
    "Keep the same exact woman from the likeness references with strong face preservation, the same age, realistic pores, and believable anatomy.",
    "Use simple clean premium editorial styling, a consistent neutral architectural background family, and soft daylight so the camera-language difference reads clearly.",
    "Do not add fake text, fake logos, heavy tattoos, or generic AI gloss.",
  ].join(" ");

  return {
    presetId,
    fallbackPreviewUrl: preset.previewImageUrl,
    outputPathname: `review/camera-previews/${presetId}`,
    likenessReferenceIds: CAMERA_PREVIEW_LIKENESS_REFERENCE_IDS,
    jsonPlan,
    finalPrompt,
    revision: null,
  };
}

export function getCameraPreviewGenerationPlans(presetIds: CameraDirectionPresetId[] = CAMERA_DIRECTION_PRESETS.map((preset) => preset.id)) {
  return presetIds.map((presetId) => getCameraPreviewGenerationPlan(presetId));
}
