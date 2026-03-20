import { NextRequest, NextResponse } from "next/server";

import { uploadBinaryAsset } from "@/lib/blob-storage";
import { generateGeminiImage } from "@/lib/gemini-image";
import {
  buildFitEnhancementPrompt,
  FIT_ENHANCEMENT_MODES,
  getFitEnhancementPromptEntry,
  listSummerFitReferences,
  loadSummerFitReferences,
} from "@/lib/summer-fit";

export const runtime = "nodejs";

function sanitizeSlug(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export async function POST(request: NextRequest) {
  const { sourceId, enhancementMode } = (await request.json()) as {
    sourceId?: string;
    enhancementMode?: string;
  };

  if (!sourceId) {
    return NextResponse.json({ error: "Missing sourceId." }, { status: 400 });
  }

  if (!FIT_ENHANCEMENT_MODES.some((entry) => entry.id === enhancementMode)) {
    return NextResponse.json({ error: "Invalid enhancement mode." }, { status: 400 });
  }

  try {
    const [sourceReference] = await loadSummerFitReferences([sourceId]);
    const prompt = getFitEnhancementPromptEntry();
    const promptText = buildFitEnhancementPrompt(
      prompt,
      enhancementMode as never,
      sourceReference.id,
      sourceReference.title,
    );
    const result = await generateGeminiImage([
      {
        inlineData: {
          mimeType: sourceReference.mimeType,
          data: sourceReference.dataBase64,
        },
      },
      { text: promptText },
    ]);

    const extension = result.image.mimeType === "image/jpeg" ? "jpg" : result.image.mimeType.split("/")[1] || "png";
    const uploaded = await uploadBinaryAsset(
      `review/fit-enhance/${sanitizeSlug(sourceId)}-${Date.now()}.${extension}`,
      Buffer.from(result.image.data, "base64"),
      result.image.mimeType,
    );
    const referenceManifest = await listSummerFitReferences();
    const source = referenceManifest.references.find((reference) => reference.id === sourceId);

    return NextResponse.json({
      sourceId,
      model: result.model,
      prompt: promptText,
      enhancementMode,
      source,
      asset: uploaded,
      responseText: result.text,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown fit enhancement error.",
      },
      { status: 500 },
    );
  }
}
