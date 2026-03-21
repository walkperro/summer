type PreserveFlags = {
  preserve_face: boolean;
  preserve_composition: boolean;
  preserve_background: boolean;
  preserve_outfit: boolean;
  preserve_body_shape: boolean;
  preserve_pose: boolean;
};

type RefinementPreset = {
  id:
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
  title: string;
  summary: string;
  recommendedUse: string;
  instructions: string[];
};

export const DEFAULT_PRESERVE_FLAGS: PreserveFlags = {
  preserve_face: true,
  preserve_composition: true,
  preserve_background: true,
  preserve_outfit: true,
  preserve_body_shape: true,
  preserve_pose: true,
};

export const FINAL_REFINEMENT_PRESETS: RefinementPreset[] = [
  {
    id: "final_bw_editorial",
    title: "Final B/W Editorial",
    summary: "Refined black-and-white conversion with rich tonal depth.",
    recommendedUse: "Convert glam portraits or premium lifestyle images into black-and-white finals.",
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
    instructions: [
      "apply only the explicitly requested refinements",
      "preserve the original shot unless clearly instructed otherwise",
    ],
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

export function buildFinalRefinementPrompt(options: {
  presetId: string;
  customInstruction?: string;
  preserveFlags: PreserveFlags;
  sourceTitle: string;
  sourceType: "generated" | "enhanced" | "uploaded";
  export4k: boolean;
  keepOriginalAspectRatio: boolean;
}) {
  const preset = getFinalRefinementPreset(options.presetId);

  if (!preset) {
    throw new Error(`Unknown refinement preset: ${options.presetId}`);
  }

  const preserveInstructions = Object.entries(options.preserveFlags)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key.replace(/_/g, " "));

  return [
    `Refine the attached image as a premium editorial finishing pass for a website-ready final asset.`,
    `This is not a request for a new composition. The selected source image is the primary source of truth.`,
    `Source image title: ${options.sourceTitle}`,
    `Source type: ${options.sourceType}`,
    `Refinement preset: ${preset.title}`,
    `Keep original aspect ratio: ${options.keepOriginalAspectRatio ? "yes" : "no"}`,
    `Export 4K: ${options.export4k ? "yes" : "no"}`,
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
    "",
    "Requested refinement instructions:",
    ...preset.instructions.map((instruction) => `- ${instruction}`),
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
    "- Improve skin, hands, hair, fabric, tonal depth, and polish only where requested.",
    "- Keep pores, subtle skin texture, and believable sweat sheen premium but human.",
    ...(options.export4k
      ? ["- Prepare the output for 4K delivery with clean detail and no fake texture."]
      : []),
  ].join("\n");
}

export type { PreserveFlags, RefinementPreset };
