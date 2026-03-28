import { NextRequest, NextResponse } from "next/server";

import { isBlobStorageConfigured, uploadBinaryAsset, uploadJsonAsset } from "@/lib/blob-storage";
import { generateGeminiImage } from "@/lib/gemini-image";
import {
  getCameraPreviewGenerationPlans,
  type CameraDirectionPresetId,
} from "@/lib/final-refinement";
import { loadLikenessReferences } from "@/lib/likeness-references";
import { requireSummerAdminApiSession } from "@/lib/summer/admin-auth";

export const runtime = "nodejs";

type GenerateCameraPreviewRequest = {
  presetIds?: CameraDirectionPresetId[];
};

function sanitizeSlug(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export async function POST(request: NextRequest) {
  const authResponse = await requireSummerAdminApiSession();

  if (authResponse) {
    return authResponse;
  }

  const body = (await request.json().catch(() => ({}))) as GenerateCameraPreviewRequest;
  const presetIds = body.presetIds?.length ? body.presetIds : undefined;
  const plans = getCameraPreviewGenerationPlans(presetIds);

  try {
    const likenessReferences = await loadLikenessReferences(plans[0]?.likenessReferenceIds || []);
    const previews = [];

    for (const plan of plans) {
      const result = await generateGeminiImage([
        ...likenessReferences.map((reference) => ({
          inlineData: {
            mimeType: reference.mimeType,
            data: reference.dataBase64,
          },
        })),
        { text: plan.finalPrompt },
      ]);

      const baseMetadata = {
        preset_id: plan.presetId,
        fallback_preview_url: plan.fallbackPreviewUrl,
        likeness_reference_ids: plan.likenessReferenceIds,
        json_plan: plan.jsonPlan,
        prompt: plan.finalPrompt,
        model: result.model,
        created_at: new Date().toISOString(),
      };

      if (isBlobStorageConfigured()) {
        const extension = result.image.mimeType === "image/jpeg" ? "jpg" : result.image.mimeType.split("/")[1] || "png";
        const uploaded = await uploadBinaryAsset(
          `${plan.outputPathname}/${sanitizeSlug(plan.presetId)}-${Date.now()}.${extension}`,
          Buffer.from(result.image.data, "base64"),
          result.image.mimeType,
        );
        const metadata = await uploadJsonAsset(
          `${plan.outputPathname}/${sanitizeSlug(plan.presetId)}-${Date.now()}-metadata.json`,
          {
            ...baseMetadata,
            asset_pathname: uploaded.pathname,
            asset_url: uploaded.url,
          },
        );

        previews.push({
          presetId: plan.presetId,
          savedToBlob: true,
          asset: uploaded,
          metadata,
          fallbackPreviewUrl: plan.fallbackPreviewUrl,
          responseText: result.text,
        });
        continue;
      }

      previews.push({
        presetId: plan.presetId,
        savedToBlob: false,
        temporary: true,
        imageDataUrl: `data:${result.image.mimeType};base64,${result.image.data}`,
        metadata: baseMetadata,
        fallbackPreviewUrl: plan.fallbackPreviewUrl,
        responseText: result.text,
      });
    }

    return NextResponse.json({
      previews,
      warning: isBlobStorageConfigured()
        ? null
        : "Blob is not configured, so generated camera previews are temporary unless you save them externally.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown camera-preview generation error.",
      },
      { status: 500 },
    );
  }
}
