import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { getPromptEntry } from "@/lib/prompt-pack";

export type ResolvedAttachment = {
  role: "likeness" | "body" | "style";
  sourcePath: string;
  fileName: string;
  mimeType: string;
  dataBase64: string;
};

const DEFAULT_REFERENCE_ROOT =
  process.env.REFERENCE_IMAGE_ROOT || path.join(process.cwd(), "public", "references");

function getMimeType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";

  return "application/octet-stream";
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getPromptReferenceManifest(promptId: string) {
  const prompt = getPromptEntry(promptId);

  if (!prompt) {
    throw new Error(`Unknown prompt id: ${promptId}`);
  }

  const roles = [
    ["likeness", prompt.google_ai_studio_attachments.likeness],
    ["body", prompt.google_ai_studio_attachments.body],
    ["style", prompt.google_ai_studio_attachments.style],
  ] as const;

  const manifest = await Promise.all(
    roles.flatMap(([role, relativePaths]) =>
      relativePaths.map(async (relativePath) => {
        const absolutePath = path.join(DEFAULT_REFERENCE_ROOT, relativePath);
        return {
          role,
          relativePath,
          absolutePath,
          exists: await fileExists(absolutePath),
        };
      }),
    ),
  );

  return {
    referenceRoot: DEFAULT_REFERENCE_ROOT,
    attachments: manifest,
  };
}

export async function loadPromptReferenceImages(promptId: string): Promise<ResolvedAttachment[]> {
  const prompt = getPromptEntry(promptId);

  if (!prompt) {
    throw new Error(`Unknown prompt id: ${promptId}`);
  }

  const roles = [
    ["likeness", prompt.google_ai_studio_attachments.likeness],
    ["body", prompt.google_ai_studio_attachments.body],
    ["style", prompt.google_ai_studio_attachments.style],
  ] as const;

  const resolved = await Promise.all(
    roles.flatMap(([role, relativePaths]) =>
      relativePaths.map(async (relativePath) => {
        const absolutePath = path.join(DEFAULT_REFERENCE_ROOT, relativePath);
        const fileBuffer = await readFile(absolutePath);

        return {
          role,
          sourcePath: absolutePath,
          fileName: path.basename(absolutePath),
          mimeType: getMimeType(absolutePath),
          dataBase64: fileBuffer.toString("base64"),
        } satisfies ResolvedAttachment;
      }),
    ),
  );

  return resolved;
}
