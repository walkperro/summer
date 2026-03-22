import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { getLikenessReferencePromptUsage } from "@/lib/likeness-references";
import { buildGeminiPrompt, getPromptEntry, type PromptPackEntry } from "@/lib/prompt-pack";

type ReferenceImageClient = {
  id: string;
  title: string;
  previewUrl: string;
  available: boolean;
  tags: string[];
  description?: string;
};

type ReferenceImageManifestEntry = ReferenceImageClient & {
  mimeType?: string;
  downloadUrl?: string;
};

export type SummerFitReference = ReferenceImageClient;

export type LoadedSummerFitReference = SummerFitReference & {
  mimeType: string;
  dataBase64: string;
};

type EnhancementMode = {
  id: "natural_cleanup" | "editorial_cleanup" | "sports_detail" | "luxury_fitness_grade";
  title: string;
  instruction: string;
};

const LOCAL_REFERENCE_ROOT = path.join(process.cwd(), "public", "references", "summer_fit");
const MANIFEST_REFERENCE_JSON = process.env.SUMMER_FIT_REFERENCE_MANIFEST_JSON;

export const FIT_ASPECT_RATIOS = [
  { id: "1:1", title: "1:1 Square", quickPickLabel: "Square", treatment: "prompt_guided" },
  { id: "2:3", title: "2:3 Portrait", quickPickLabel: null, treatment: "prompt_guided" },
  { id: "3:2", title: "3:2 Landscape", quickPickLabel: null, treatment: "prompt_guided" },
  { id: "3:4", title: "3:4 Portrait", quickPickLabel: null, treatment: "prompt_guided" },
  { id: "4:3", title: "4:3 Landscape", quickPickLabel: null, treatment: "prompt_guided" },
  { id: "4:5", title: "4:5 Editorial Portrait", quickPickLabel: "Hero Mobile / Portrait Section", treatment: "website_crop_target" },
  { id: "9:16", title: "9:16 Story / Vertical", quickPickLabel: "Story / Vertical", treatment: "prompt_guided" },
  { id: "16:9", title: "16:9 Hero / Wide Section", quickPickLabel: "Hero Desktop / Wide Section", treatment: "prompt_guided" },
  { id: "21:9", title: "21:9 Cinematic Wide", quickPickLabel: null, treatment: "prompt_guided" },
] as const;

export const FIT_OUTPUT_MODES = [
  {
    id: "high_end",
    title: "2K Iteration",
    instruction:
      "Generate at a reliable 2K-class iteration target with premium detail, campaign polish, and clean sharpening discipline. Use this for normal iteration and approvals.",
  },
  {
    id: "campaign_4k",
    title: "4K Campaign Finish — Final export only",
    instruction:
      "Compose for a final 4K campaign finish. Prioritize detail that will hold at 3840x2160 or equivalent 4K delivery without fake oversharpening. 4K may be slower and may temporarily fail under high demand, so use it for final approved images only.",
  },
];

export const FIT_ENHANCEMENT_MODES: EnhancementMode[] = [
  {
    id: "natural_cleanup",
    title: "Natural Cleanup",
    instruction: "Clean up lighting, distractions, and overall clarity while keeping the source natural and minimally altered.",
  },
  {
    id: "editorial_cleanup",
    title: "Editorial Cleanup",
    instruction: "Add premium editorial polish, refined contrast, and cleaner tonal separation while preserving the original shot.",
  },
  {
    id: "sports_detail",
    title: "Sports Detail",
    instruction: "Emphasize believable athletic texture, fabric detail, subtle sweat realism, and body-mechanics clarity without creating a new image.",
  },
  {
    id: "luxury_fitness_grade",
    title: "Luxury Fitness Grade",
    instruction: "Apply a clean luxury fitness campaign grade with richer premium lighting, refined contrast, and controlled background cleanup.",
  },
];

export const FIT_PROMPT_REFERENCE_RECOMMENDATIONS: Record<
  string,
  { fitReferenceIds: string[]; likenessReferenceIds: string[] }
> = {
  train_with_me_pushup_intensity: {
    fitReferenceIds: ["fit_pushup_intensity_close", "fit_pushup_intensity_profile"],
    likenessReferenceIds: ["likeness_black_closeup", "likeness_purple_closeup_1"],
  },
  train_with_me_concrete_seated: {
    fitReferenceIds: ["fit_concrete_seated_editorial", "fit_side_profile_architectural"],
    likenessReferenceIds: ["likeness_black_closeup", "likeness_peach_closeup_mid_shot"],
  },
  train_with_me_band_squat: {
    fitReferenceIds: ["fit_band_squat_profile", "fit_pushup_intensity_close"],
    likenessReferenceIds: ["likeness_black_closeup", "likeness_black_top_midshot"],
  },
  train_with_me_side_profile_architectural: {
    fitReferenceIds: ["fit_side_profile_architectural", "fit_concrete_seated_editorial"],
    likenessReferenceIds: ["likeness_purple_closeup_4", "likeness_black_closeup"],
  },
  train_with_me_stretch_recovery: {
    fitReferenceIds: ["fit_stretch_recovery_standing", "fit_pushup_intensity_profile"],
    likenessReferenceIds: ["likeness_black_closeup", "likeness_yellow_on_black_midshot"],
  },
};

const SUMMER_FIT_REFERENCE_METADATA: Record<
  string,
  {
    title: string;
    tags: string[];
    description: string;
    promptUsage: string;
  }
> = {
  fit_pushup_intensity_close: {
    title: "Pushup Intensity Close",
    tags: ["pushup", "close", "face", "court", "intensity"],
    description:
      "Low-angle front pushup on a court with direct eye-line intensity, compressed athletic effort, and strong face visibility.",
    promptUsage:
      "Use for face-locked training intensity, low-ground pressure, direct eye-line energy, and premium court-performance realism.",
  },
  fit_pushup_intensity_profile: {
    title: "Pushup Intensity Profile",
    tags: ["pushup", "profile", "plank", "lawn", "resort"],
    description:
      "Long side-profile plank outdoors on a manicured lawn with resort architecture behind her and a clean full-body athletic line.",
    promptUsage:
      "Use for authentic plank mechanics, side-profile body line, and outdoor luxury-fitness environment cues.",
  },
  fit_band_squat_profile: {
    title: "Band Squat Profile",
    tags: ["band", "squat", "profile", "studio", "white-seamless"],
    description:
      "Profile resistance-band squat on a bright white seamless set with clear lower-body mechanics and long athletic proportions.",
    promptUsage:
      "Use for grounded squat mechanics, controlled studio minimalism, and premium movement detail without gym clutter.",
  },
  fit_concrete_seated_editorial: {
    title: "Concrete Seated Editorial",
    tags: ["concrete", "seated", "editorial", "face", "red-top"],
    description:
      "Seated editorial portrait against curved concrete with red activewear, strong face visibility, premium calm, and believable sheen.",
    promptUsage:
      "Use for strongest face/identity lock, premium seated calm, concrete editorial finish, and realistic post-session skin detail.",
  },
  fit_side_profile_architectural: {
    title: "Side Profile Architectural",
    tags: ["side", "profile", "architectural", "parking-structure", "peach-set"],
    description:
      "Clean side-profile standing frame in peach activewear inside a dark architectural parking structure with sculptural silhouette separation.",
    promptUsage:
      "Use for profile fidelity, peach-monochrome activewear cues, and premium architectural sports-campaign atmosphere.",
  },
  fit_stretch_recovery_standing: {
    title: "Stretch Recovery Standing",
    tags: ["stretch", "recovery", "standing", "lawn", "resort"],
    description:
      "Standing quad stretch on a lawn with resort architecture, long clean body line, and relaxed recovery energy.",
    promptUsage:
      "Use for believable recovery posture, outdoor luxury-fitness calm, and full-body athletic proportion reference.",
  },
};

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getMimeType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";

  return "application/octet-stream";
}

function formatTitle(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\.[^.]+$/, "")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

async function walkImageFiles(directory: string, relativePrefix = ""): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = path.join(relativePrefix, entry.name);
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walkImageFiles(absolutePath, relativePath);
      }

      if (/\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        return [relativePath];
      }

      return [];
    }),
  );

  return files.flat().sort();
}

function deriveTags(relativePath: string) {
  const id = relativePath.replace(/\.[^.]+$/, "");
  const metadata = SUMMER_FIT_REFERENCE_METADATA[id];

  if (metadata) {
    return metadata.tags;
  }

  const source = relativePath.toLowerCase();
  return ["pushup", "concrete", "seated", "band", "squat", "side", "profile", "architectural", "stretch", "recovery"]
    .filter((tag) => source.includes(tag));
}

async function listLocalSummerFitReferences(): Promise<ReferenceImageManifestEntry[]> {
  if (!(await exists(LOCAL_REFERENCE_ROOT))) {
    return [];
  }

  const files = await walkImageFiles(LOCAL_REFERENCE_ROOT);

  return files.map((relativePath) => {
    const id = relativePath.replace(/\.[^.]+$/, "");
    const metadata = SUMMER_FIT_REFERENCE_METADATA[id];

    return {
      id,
      title: metadata?.title || formatTitle(path.basename(relativePath)),
      previewUrl: `/references/summer_fit/${relativePath.split(path.sep).join("/")}`,
      available: true,
      tags: metadata?.tags || deriveTags(relativePath),
      description: metadata?.description,
      mimeType: getMimeType(relativePath),
    };
  });
}

function listManifestSummerFitReferences(): ReferenceImageManifestEntry[] {
  if (!MANIFEST_REFERENCE_JSON) {
    return [];
  }

  try {
    const parsed = JSON.parse(MANIFEST_REFERENCE_JSON) as ReferenceImageManifestEntry[];
    return parsed.map((entry) => ({
      ...entry,
      available: entry.available ?? true,
      tags: entry.tags ?? [],
    }));
  } catch {
    return [];
  }
}

async function getSummerFitManifestEntries() {
  const localReferences = await listLocalSummerFitReferences();

  if (localReferences.length > 0) {
    return {
      source: "local_public" as const,
      references: localReferences,
    };
  }

  const manifestReferences = listManifestSummerFitReferences();

  if (manifestReferences.length > 0) {
    return {
      source: "manifest" as const,
      references: manifestReferences,
    };
  }

  return {
    source: "unavailable" as const,
    references: [] as ReferenceImageManifestEntry[],
  };
}

export async function listSummerFitReferences() {
  return getSummerFitManifestEntries();
}

export async function loadSummerFitReferences(referenceIds: string[]): Promise<LoadedSummerFitReference[]> {
  const manifest = await getSummerFitManifestEntries();

  const selectedReferences = referenceIds.map((referenceId) => {
    const match = manifest.references.find((reference) => reference.id === referenceId);

    if (!match) {
      throw new Error(`Unknown summer_fit reference: ${referenceId}`);
    }

    return match;
  });

  if (manifest.source === "local_public") {
    return Promise.all(
      selectedReferences.map(async (reference) => {
        const fileName = `${reference.id}${path.extname(reference.previewUrl) || ".png"}`;
        const sourcePath = path.join(LOCAL_REFERENCE_ROOT, fileName);
        const fileBuffer = await readFile(sourcePath);

        return {
          id: reference.id,
          title: reference.title,
          previewUrl: reference.previewUrl,
          available: true,
          tags: reference.tags,
          mimeType: getMimeType(sourcePath),
          dataBase64: fileBuffer.toString("base64"),
        } satisfies LoadedSummerFitReference;
      }),
    );
  }

  if (manifest.source === "manifest") {
    return Promise.all(
      selectedReferences.map(async (reference) => {
        if (!reference.downloadUrl) {
          throw new Error(`Manifest-backed reference ${reference.id} is missing downloadUrl.`);
        }

        const response = await fetch(reference.downloadUrl, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to load reference ${reference.id} from manifest source.`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return {
          id: reference.id,
          title: reference.title,
          previewUrl: reference.previewUrl,
          available: true,
          tags: reference.tags,
          mimeType: reference.mimeType || response.headers.get("content-type") || "image/png",
          dataBase64: Buffer.from(arrayBuffer).toString("base64"),
        } satisfies LoadedSummerFitReference;
      }),
    );
  }

  throw new Error("No summer_fit references are available. Add local files under public/references/summer_fit or provide SUMMER_FIT_REFERENCE_MANIFEST_JSON.");
}

export function getFitCampaignPromptEntries() {
  return [
    "train_with_me_pushup_intensity",
    "train_with_me_concrete_seated",
    "train_with_me_band_squat",
    "train_with_me_side_profile_architectural",
    "train_with_me_stretch_recovery",
  ]
    .map((promptId) => getPromptEntry(promptId))
    .filter((prompt): prompt is PromptPackEntry => Boolean(prompt));
}

export function getFitEnhancementPromptEntry() {
  const prompt = getPromptEntry("fit_ref_enhance_editorial");

  if (!prompt) {
    throw new Error("Missing fit_ref_enhance_editorial prompt entry.");
  }

  return prompt;
}

export function buildFitCampaignPrompt(
  prompt: PromptPackEntry,
  options: {
    aspectRatio: string;
    outputModeId: string;
    selectedFitReferences: Array<Pick<SummerFitReference, "id" | "title" | "tags" | "description">>;
    selectedLikenessReferences: Array<{
      id: string;
      title: string;
      tags: string[];
      description?: string;
    }>;
  },
) {
  const outputMode = FIT_OUTPUT_MODES.find((mode) => mode.id === options.outputModeId) ?? FIT_OUTPUT_MODES[0];
  const aspectRatioEntry = FIT_ASPECT_RATIOS.find((entry) => entry.id === options.aspectRatio);
  const fitReferenceSummary = options.selectedFitReferences
    .map((reference) => `${reference.title}${reference.tags.length > 0 ? ` [${reference.tags.join(", ")}]` : ""}`)
    .join("; ");
  const fitReferenceGuidance = options.selectedFitReferences
    .map((reference) => {
      const metadata = SUMMER_FIT_REFERENCE_METADATA[reference.id];
      return metadata ? `- ${reference.title}: ${metadata.promptUsage}` : null;
    })
    .filter((entry): entry is string => Boolean(entry));
  const likenessReferenceSummary = options.selectedLikenessReferences
    .map((reference) => `${reference.title}${reference.tags.length > 0 ? ` [${reference.tags.join(", ")}]` : ""}`)
    .join("; ");
  const likenessReferenceGuidance = options.selectedLikenessReferences
    .map((reference) => {
      const usage = getLikenessReferencePromptUsage(reference.id);
      return usage ? `- ${reference.title}: ${usage}` : null;
    })
    .filter((entry): entry is string => Boolean(entry));

  return [
    buildGeminiPrompt(prompt),
    "",
    "Train With Me campaign directives:",
    `- Aspect ratio: ${options.aspectRatio}`,
    `- Aspect ratio handling: ${aspectRatioEntry?.treatment === "website_crop_target" ? "website crop target with prompt-guided framing, not a native Gemini ratio lock" : "prompt-guided composition target"}`,
    `- Output mode: ${outputMode.title}`,
    `- ${outputMode.instruction}`,
    "- Build the image as part of a matched campaign family with the same exact woman across adjacent outputs.",
    "- Attached fit references define pose blueprint, movement realism, body angle, athletic intent, workout posture, and environment inspiration.",
    "- Attached likeness references define exact facial identity and must dominate face accuracy, eye shape, brows, lips, jawline, age consistency, and hairline fidelity.",
    "- Preserve the same exact woman from the likeness references.",
    "- Preserve the workout action, body posture, and athletic intent from the fit references.",
    "- Do not let athletic fit references overwrite facial identity.",
    "- Prioritize modeling-plus-fitness crossover with premium editorial sports polish.",
    "- Read the court, white-seamless studio, curved concrete, parking-structure, and resort-lawn cues as premium environmental anchors when those references are present.",
    "- Favor low-to-ground pressure, side-profile athletic lines, seated post-session calm, and recovery realism from this actual reference set rather than inventing generic workout poses.",
    "- Keep the result cinematic, realistic, athletic, and luxury-forward rather than posterized or stock-commercial.",
    `- Fit refs: ${fitReferenceSummary || "none selected"}`,
    `- Likeness refs: ${likenessReferenceSummary || "none selected"}`,
    ...(fitReferenceGuidance.length > 0 ? ["- Fit reference guidance:", ...fitReferenceGuidance] : []),
    ...(likenessReferenceGuidance.length > 0 ? ["- Likeness reference guidance:", ...likenessReferenceGuidance] : []),
  ].join("\n");
}

export function buildFitEnhancementPrompt(
  prompt: PromptPackEntry,
  enhancementModeId: EnhancementMode["id"],
  referenceId: string,
  referenceTitle: string,
) {
  const mode = FIT_ENHANCEMENT_MODES.find((entry) => entry.id === enhancementModeId);

  if (!mode) {
    throw new Error(`Unknown enhancement mode: ${enhancementModeId}`);
  }

  const metadata = SUMMER_FIT_REFERENCE_METADATA[referenceId];

  return [
    buildGeminiPrompt(prompt),
    "",
    "Source-preserved enhancement directives:",
    `- Selected source reference: ${referenceTitle}`,
    `- Enhancement mode: ${mode.title}`,
    `- ${mode.instruction}`,
    "- Keep the original pose, framing, camera relationship, and core composition intact.",
    "- Improve lighting, sharpness, texture clarity, distraction cleanup, and premium editorial sports finish without inventing a new image.",
    ...(metadata
      ? [
          `- Preserve the source scene logic: ${metadata.description}`,
          `- Source-specific enhancement focus: ${metadata.promptUsage}`,
        ]
      : []),
  ].join("\n");
}
