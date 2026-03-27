import { NextRequest, NextResponse } from "next/server";

import { uploadBinaryAsset, uploadJsonAsset } from "@/lib/blob-storage";
import { GeminiImageError, generateGeminiImage } from "@/lib/gemini-image";
import { listLikenessReferences, loadLikenessReferences } from "@/lib/likeness-references";
import { completeSummerImageJob, createSummerImageJob, failSummerImageJob } from "@/lib/summer/image-jobs";
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
  const { promptId, fitReferenceIds, likenessReferenceIds, aspectRatio, outputMode } = (await request.json()) as {
    promptId?: string;
    fitReferenceIds?: string[];
    likenessReferenceIds?: string[];
    aspectRatio?: string;
    outputMode?: string;
  };

  if (!promptId) {
    return NextResponse.json({ error: "Missing promptId." }, { status: 400 });
  }

  if (!fitReferenceIds || fitReferenceIds.length < 1 || fitReferenceIds.length > 3) {
    return NextResponse.json({ error: "Select between 1 and 3 fit references." }, { status: 400 });
  }

  if (likenessReferenceIds && likenessReferenceIds.length > 2) {
    return NextResponse.json({ error: "Select no more than 2 likeness references." }, { status: 400 });
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

  let jobId: string | null = null;

  try {
    const fitReferences = await loadSummerFitReferences(fitReferenceIds);
    const likenessReferences = await loadLikenessReferences(likenessReferenceIds || []);
    const promptText = buildFitCampaignPrompt(prompt, {
      aspectRatio: resolvedAspectRatio,
      outputModeId: resolvedOutputMode,
      selectedFitReferences: fitReferences,
      selectedLikenessReferences: likenessReferences,
    });
    const job = await createSummerImageJob({
      jobType: "fit_generate_campaign",
      inputPayload: {
        promptId,
        fitReferenceIds,
        likenessReferenceIds: likenessReferenceIds || [],
        aspectRatio: resolvedAspectRatio,
        outputMode: resolvedOutputMode,
      },
      promptText,
    });
    jobId = job?.id || null;
    const result = await generateGeminiImage([
      ...likenessReferences.map((reference) => ({
        inlineData: {
          mimeType: reference.mimeType,
          data: reference.dataBase64,
        },
      })),
      ...fitReferences.map((reference) => ({
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
    const [fitReferenceManifest, likenessReferenceManifest] = await Promise.all([
      listSummerFitReferences(),
      listLikenessReferences(),
    ]);
    const fitRefsUsed = fitReferenceManifest.references.filter((reference) => fitReferenceIds.includes(reference.id));
    const likenessRefsUsed = likenessReferenceManifest.references.filter((reference) => (likenessReferenceIds || []).includes(reference.id));
    const metadataRecord = await uploadJsonAsset(
      `review/fit-campaign/${sanitizeSlug(promptId)}-${Date.now()}-metadata.json`,
      {
        promptId,
        aspectRatio: resolvedAspectRatio,
        outputMode: resolvedOutputMode,
        fit_refs_used: fitRefsUsed.map((reference) => ({ id: reference.id, title: reference.title })),
        likeness_refs_used: likenessRefsUsed.map((reference) => ({ id: reference.id, title: reference.title })),
        model: result.model,
        assetPathname: uploaded.pathname,
        createdAt: new Date().toISOString(),
      },
    );

    await completeSummerImageJob({
      jobId,
      status: "completed",
      outputPayload: {
        promptId,
        model: result.model,
        aspectRatio: resolvedAspectRatio,
        outputMode: resolvedOutputMode,
        assetPathname: uploaded.pathname,
        assetUrl: uploaded.url,
      },
      output: {
        outputPath: uploaded.pathname,
        publicUrl: uploaded.url,
        title: prompt.title,
        aspectRatio: resolvedAspectRatio,
        outputType: "fit_generate_campaign",
        metadata: {
          metadataRecord,
          fitReferenceIds,
          likenessReferenceIds: likenessReferenceIds || [],
        },
      },
    });

    return NextResponse.json({
      promptId,
      model: result.model,
      prompt: promptText,
      aspectRatio: resolvedAspectRatio,
      outputMode: resolvedOutputMode,
      referenceCount: fitReferences.length + likenessReferences.length,
      fit_refs_used: fitRefsUsed,
      likeness_refs_used: likenessRefsUsed,
      asset: uploaded,
      metadataRecord,
      responseText: result.text,
      warning:
        likenessRefsUsed.length === 0
          ? "No likeness refs were selected. Face accuracy may drift because only fit/action refs were provided."
          : null,
    });
  } catch (error) {
    await failSummerImageJob(jobId, error instanceof Error ? error.message : "Unknown fit campaign generation error.");
    if (error instanceof GeminiImageError && error.temporaryOverload) {
      return NextResponse.json(
        {
          error: error.message,
          temporaryOverload: true,
          retriesAttempted: error.retriesAttempted,
          fallbackAction: "rerun_at_2k",
          suggestedOutputMode: "high_end",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown fit campaign generation error.",
      },
      { status: 500 },
    );
  }
}
