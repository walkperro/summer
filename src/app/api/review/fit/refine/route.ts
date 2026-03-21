import { NextRequest, NextResponse } from "next/server";

import { isBlobStorageConfigured, uploadBinaryAsset, uploadJsonAsset } from "@/lib/blob-storage";
import { buildFinalRefinementPrompt, type PreserveFlags } from "@/lib/final-refinement";
import { generateGeminiImage } from "@/lib/gemini-image";

export const runtime = "nodejs";

type RefineRequest = {
  sourceImageId?: string;
  sourceType?: "generated" | "enhanced" | "uploaded";
  sourceTitle?: string;
  sourceImageDataUrl?: string;
  refinementPreset?: string;
  customInstruction?: string;
  preserveFlags?: PreserveFlags;
  export4k?: boolean;
  keepOriginalAspectRatio?: boolean;
};

function sanitizeSlug(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid sourceImageDataUrl format.");
  }

  return {
    mimeType: match[1],
    dataBase64: match[2],
  };
}

export async function POST(request: NextRequest) {
  const {
    sourceImageId,
    sourceType,
    sourceTitle,
    sourceImageDataUrl,
    refinementPreset,
    customInstruction,
    preserveFlags,
    export4k,
    keepOriginalAspectRatio,
  } = (await request.json()) as RefineRequest;

  if (!sourceImageId || !sourceType || !sourceTitle || !sourceImageDataUrl || !refinementPreset || !preserveFlags) {
    return NextResponse.json({ error: "Missing required refinement payload fields." }, { status: 400 });
  }

  try {
    const sourceImage = parseDataUrl(sourceImageDataUrl);
    const promptText = buildFinalRefinementPrompt({
      presetId: refinementPreset,
      customInstruction,
      preserveFlags,
      sourceTitle,
      sourceType,
      export4k: Boolean(export4k),
      keepOriginalAspectRatio: keepOriginalAspectRatio !== false,
    });

    const result = await generateGeminiImage([
      {
        inlineData: {
          mimeType: sourceImage.mimeType,
          data: sourceImage.dataBase64,
        },
      },
      { text: promptText },
    ]);

    const outputSize = export4k ? "4k" : "source_preserved";
    const metadata = {
      source_image_id: sourceImageId,
      source_type: sourceType,
      refinement_preset: refinementPreset,
      custom_instruction: customInstruction || "",
      preserve_flags: preserveFlags,
      output_size: outputSize,
      created_at: new Date().toISOString(),
      source_title: sourceTitle,
      keep_original_aspect_ratio: keepOriginalAspectRatio !== false,
      model: result.model,
    };

    if (isBlobStorageConfigured()) {
      const extension = result.image.mimeType === "image/jpeg" ? "jpg" : result.image.mimeType.split("/")[1] || "png";
      const uploaded = await uploadBinaryAsset(
        `review/final-refine/${sanitizeSlug(sourceTitle)}-${sanitizeSlug(refinementPreset)}-${Date.now()}.${extension}`,
        Buffer.from(result.image.data, "base64"),
        result.image.mimeType,
      );
      const metadataRecord = await uploadJsonAsset(
        `review/final-refine/${sanitizeSlug(sourceTitle)}-${sanitizeSlug(refinementPreset)}-${Date.now()}-metadata.json`,
        {
          ...metadata,
          asset_pathname: uploaded.pathname,
        },
      );

      return NextResponse.json({
        savedToBlob: true,
        asset: uploaded,
        metadata,
        metadataRecord,
        responseText: result.text,
      });
    }

    return NextResponse.json({
      savedToBlob: false,
      temporary: true,
      imageDataUrl: `data:${result.image.mimeType};base64,${result.image.data}`,
      metadata,
      responseText: result.text,
      warning: "Blob is not configured, so this refined result is temporary and available only in the current session.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown final refinement error.",
      },
      { status: 500 },
    );
  }
}
