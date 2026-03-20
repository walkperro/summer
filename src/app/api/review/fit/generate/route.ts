import { NextRequest, NextResponse } from "next/server";

import { uploadBinaryAsset } from "@/lib/blob-storage";
import { generateGeminiImage } from "@/lib/gemini-image";
import {
  buildFitCampaignPrompt,
  FIT_ASPECT_RATIOS,
  FIT_OUTPUT_MODES,
  getFitCampaignPromptEntries,
  listSummerFitReferences,
  loadSummerFitReferences,
} from "@/lib/summer-fit";

export const runtime = "nodejs";

function sanitizeSlug(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export async function POST(request: NextRequest) {
  const { promptId, referenceIds, aspectRatio, outputMode } = (await request.json()) as {
    promptId?: string;
    referenceIds?: string[];
    aspectRatio?: string;
    outputMode?: string;
  };

  if (!promptId) {
    return NextResponse.json({ error: "Missing promptId." }, { status: 400 });
  }

  if (!referenceIds || referenceIds.length < 2 || referenceIds.length > 4) {
    return NextResponse.json({ error: "Select between 2 and 4 summer_fit references." }, { status: 400 });
  }

  const resolvedAspectRatio = FIT_ASPECT_RATIOS.find((entry) => entry.id === aspectRatio)?.id;

  if (!resolvedAspectRatio) {
    return NextResponse.json({ error: "Invalid aspect ratio." }, { status: 400 });
  }

  const resolvedOutputMode = FIT_OUTPUT_MODES.find((entry) => entry.id === outputMode)?.id;

  if (!resolvedOutputMode) {
    return NextResponse.json({ error: "Invalid output mode." }, { status: 400 });
  }

  const prompt = getFitCampaignPromptEntries().find((entry) => entry.id === promptId);

  if (!prompt) {
    return NextResponse.json({ error: `Unknown fit prompt id: ${promptId}` }, { status: 404 });
  }

  try {
    const references = await loadSummerFitReferences(referenceIds);
    const promptText = buildFitCampaignPrompt(prompt, {
      aspectRatio: resolvedAspectRatio,
      outputModeId: resolvedOutputMode,
      selectedReferences: references,
    });
    const result = await generateGeminiImage([
      ...references.map((reference) => ({
        inlineData: {
          mimeType: reference.mimeType,
          data: reference.dataBase64,
        },
      })),
      { text: promptText },
    ]);

    const extension = result.image.mimeType === "image/jpeg" ? "jpg" : result.image.mimeType.split("/")[1] || "png";
    const uploaded = await uploadBinaryAsset(
      `review/fit-campaign/${sanitizeSlug(promptId)}-${Date.now()}.${extension}`,
      Buffer.from(result.image.data, "base64"),
      result.image.mimeType,
    );
    const referenceManifest = await listSummerFitReferences();

    return NextResponse.json({
      promptId,
      model: result.model,
      prompt: promptText,
      aspectRatio: resolvedAspectRatio,
      outputMode: resolvedOutputMode,
      referenceCount: references.length,
      references: referenceManifest.references.filter((reference) => referenceIds.includes(reference.id)),
      asset: uploaded,
      responseText: result.text,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown fit campaign generation error.",
      },
      { status: 500 },
    );
  }
}
