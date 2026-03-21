import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

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
};

export type LikenessReference = ReferenceImageClient;

export type LoadedLikenessReference = LikenessReference & {
  mimeType: string;
  dataBase64: string;
};

const LOCAL_LIKENESS_REFERENCE_ROOT = path.join(process.cwd(), "public", "references", "summer_final_likeness");

const LIKENESS_REFERENCE_METADATA: Record<
  string,
  {
    title: string;
    tags: string[];
    description: string;
    promptUsage: string;
  }
> = {
  likeness_black_closeup: {
    title: "Black Closeup",
    tags: ["closeup", "face", "eyes", "jawline", "identity-anchor"],
    description: "Strong close facial anchor with clear eye shape, brow structure, lip shape, and jawline definition.",
    promptUsage: "Use for strongest face lock, eye shape/color, brow detail, lips, jawline, and age consistency.",
  },
  likeness_black_top_midshot: {
    title: "Black Top Midshot",
    tags: ["midshot", "face", "hairline", "identity-anchor"],
    description: "Mid-shot likeness bridge with solid facial accuracy and clean hairline-to-face relationship.",
    promptUsage: "Use for face identity plus hairline, neck, and upper-body-to-face continuity.",
  },
  likeness_peach_closeup_mid_shot: {
    title: "Peach Closeup Mid Shot",
    tags: ["closeup", "warm", "face", "tattoo-logic"],
    description: "Warm close likeness anchor with soft editorial light and visible facial proportions.",
    promptUsage: "Use for warmer facial fidelity, lip shape, cheek structure, and subtle identity softness without drift.",
  },
  likeness_peach_mid_shot_2: {
    title: "Peach Mid Shot 2",
    tags: ["midshot", "warm", "identity-anchor"],
    description: "Warm mid-shot likeness support for facial continuity and adult age consistency.",
    promptUsage: "Use for mid-shot identity support when face and body need to stay coherent together.",
  },
  likeness_purple_closeup_1: {
    title: "Purple Closeup 1",
    tags: ["closeup", "ponytail", "face", "eyes"],
    description: "Sharp athletic closeup with clear eyes, brows, and ponytail hairline structure.",
    promptUsage: "Use for athletic close face lock, ponytail hairline logic, and direct eye fidelity.",
  },
  likeness_purple_closeup_2: {
    title: "Purple Closeup 2",
    tags: ["closeup", "face", "brows", "eyes"],
    description: "Secondary close facial anchor with good brow and eye-shape reinforcement.",
    promptUsage: "Use as a supporting face anchor when the model starts to drift around eyes or brows.",
  },
  likeness_purple_closeup_3: {
    title: "Purple Closeup 3",
    tags: ["closeup", "face", "lips", "jawline"],
    description: "Secondary close facial anchor with useful lip and jawline consistency cues.",
    promptUsage: "Use for lip shape and jawline correction when face consistency softens.",
  },
  likeness_purple_closeup_4: {
    title: "Purple Closeup 4",
    tags: ["closeup", "profile", "face", "jawline"],
    description: "Close likeness anchor with strong profile nuance and facial edge structure.",
    promptUsage: "Use for side-angle facial identity, jaw taper, and profile-based face lock.",
  },
  likeness_yellow_on_black_midshot: {
    title: "Yellow On Black Midshot",
    tags: ["midshot", "face", "identity-anchor"],
    description: "Clean mid-shot facial support with readable face proportions and balanced editorial identity.",
    promptUsage: "Use for broader face continuity when a mid-shot likeness anchor is more helpful than a tight closeup.",
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

function deriveId(fileName: string) {
  return `likeness_${fileName.replace(/\.[^.]+$/, "")}`;
}

async function listLocalLikenessReferenceFiles() {
  if (!(await exists(LOCAL_LIKENESS_REFERENCE_ROOT))) {
    return [];
  }

  const entries = await readdir(LOCAL_LIKENESS_REFERENCE_ROOT, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && /\.(png|jpg|jpeg|webp)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

export async function listLikenessReferences() {
  const files = await listLocalLikenessReferenceFiles();

  const references = files.map((fileName) => {
    const id = deriveId(fileName);
    const metadata = LIKENESS_REFERENCE_METADATA[id];

    return {
      id,
      title: metadata?.title || fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
      previewUrl: `/references/summer_final_likeness/${fileName}`,
      available: true,
      tags: metadata?.tags || ["likeness", "face"],
      description: metadata?.description,
    } satisfies ReferenceImageManifestEntry;
  });

  return {
    source: "local_public" as const,
    references,
  };
}

export async function loadLikenessReferences(referenceIds: string[]): Promise<LoadedLikenessReference[]> {
  const manifest = await listLikenessReferences();

  return Promise.all(
    referenceIds.map(async (referenceId) => {
      const reference = manifest.references.find((entry) => entry.id === referenceId);

      if (!reference) {
        throw new Error(`Unknown likeness reference: ${referenceId}`);
      }

      const fileName = reference.previewUrl.split("/").pop();

      if (!fileName) {
        throw new Error(`Invalid likeness preview URL for ${referenceId}.`);
      }

      const sourcePath = path.join(LOCAL_LIKENESS_REFERENCE_ROOT, fileName);
      const fileBuffer = await readFile(sourcePath);

      return {
        ...reference,
        mimeType: getMimeType(sourcePath),
        dataBase64: fileBuffer.toString("base64"),
      } satisfies LoadedLikenessReference;
    }),
  );
}

export function getLikenessReferencePromptUsage(referenceId: string) {
  return LIKENESS_REFERENCE_METADATA[referenceId]?.promptUsage;
}
