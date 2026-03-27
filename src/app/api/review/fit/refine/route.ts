import { NextRequest, NextResponse } from "next/server";

import { isBlobStorageConfigured, uploadBinaryAsset, uploadJsonAsset } from "@/lib/blob-storage";
import {
  buildFinalImageExecutionPlan,
  DEFAULT_RENDER_CONTROLS,
  getCameraSelectionSummary,
  normalizeCameraPresetIds,
  validateFinalImageRequest,
  type CameraDirectionPresetId,
  type FinalRenderControls,
  type PreserveFlags,
  type RefinementPresetId,
  type ReframeIntensity,
  type SourceImageAnalysis,
} from "@/lib/final-refinement";
import { GeminiImageError, generateGeminiImage } from "@/lib/gemini-image";
import { completeSummerImageJob, createSummerImageJob, failSummerImageJob } from "@/lib/summer/image-jobs";

export const runtime = "nodejs";

type RefineRequest = {
  sourceImageId?: string;
  sourceType?: "generated" | "enhanced" | "uploaded";
  sourceTitle?: string;
  sourceImageDataUrl?: string;
  refinementStack?: RefinementPresetId[];
  customInstruction?: string;
  preserveFlags?: PreserveFlags;
  export4k?: boolean;
  keepOriginalAspectRatio?: boolean;
  cameraPresetIds?: CameraDirectionPresetId[];
  reframeIntensity?: ReframeIntensity;
  renderControls?: Partial<FinalRenderControls>;
  sourceAnalysis?: SourceImageAnalysis;
  debugToneDriftDiagnostic?: boolean;
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
    refinementStack,
    customInstruction,
    preserveFlags,
    export4k,
    keepOriginalAspectRatio,
    cameraPresetIds,
    reframeIntensity,
    renderControls,
    sourceAnalysis,
    debugToneDriftDiagnostic,
  } = (await request.json()) as RefineRequest;

  if (
    !sourceImageId ||
    !sourceType ||
    !sourceTitle ||
    !sourceImageDataUrl ||
    !refinementStack ||
    !preserveFlags ||
    !cameraPresetIds ||
    cameraPresetIds.length === 0 ||
    !reframeIntensity
  ) {
    return NextResponse.json({ error: "Missing required refinement payload fields." }, { status: 400 });
  }

  let jobId: string | null = null;

  try {
    const sourceImage = parseDataUrl(sourceImageDataUrl);
    const normalizedCameraPresetIds = normalizeCameraPresetIds(cameraPresetIds);
    const resolvedRenderControls = {
      ...DEFAULT_RENDER_CONTROLS,
      ...renderControls,
    };
    const validation = validateFinalImageRequest({
      stack: refinementStack,
      customInstruction,
      preserveFlags,
      cameraPresetIds: normalizedCameraPresetIds,
      reframeIntensity,
      renderControls: resolvedRenderControls,
      sourceAnalysis,
    });

    if (validation.isBlocked) {
      return NextResponse.json(
        {
          error: "Render blocked until conflicts are fixed.",
          validation,
        },
        { status: 400 },
      );
    }

    const cameraSummary = getCameraSelectionSummary(normalizedCameraPresetIds);
    const executionPlan = buildFinalImageExecutionPlan({
      stack: refinementStack,
      customInstruction,
      preserveFlags,
      sourceTitle,
      sourceType,
      export4k: Boolean(export4k),
      keepOriginalAspectRatio: keepOriginalAspectRatio !== false,
      cameraPresetIds: normalizedCameraPresetIds,
      reframeIntensity,
      renderControls: resolvedRenderControls,
      sourceAnalysis,
    });

    if (executionPlan.executionMode === "exact_crop") {
      return NextResponse.json(
        {
          error: "Exact Crop Mode should run through the local exact crop/export pipeline, not Gemini.",
        },
        { status: 400 },
      );
    }

    const promptText = executionPlan.promptText;
    const job = await createSummerImageJob({
      jobType: "fit_refine_final",
      inputPayload: {
        sourceImageId,
        sourceType,
        sourceTitle,
        refinementStack,
        export4k: Boolean(export4k),
        keepOriginalAspectRatio: keepOriginalAspectRatio !== false,
        cameraPresetIds: normalizedCameraPresetIds,
        reframeIntensity,
      },
      promptText,
    });
    jobId = job?.id || null;

    const result = await generateGeminiImage([
      {
        inlineData: {
          mimeType: sourceImage.mimeType,
          data: sourceImage.dataBase64,
        },
      },
      { text: promptText },
    ], {
      temperature: executionPlan.renderControls.temperature,
      topP: executionPlan.renderControls.topP,
    });

    const outputSize =
      executionPlan.executionMode === "aspect_ratio_recompose"
        ? export4k || refinementStack.includes("final_4k_upscale")
          ? "4k_recompose_export"
          : "2k_recompose_export"
        : export4k || refinementStack.includes("final_4k_upscale")
          ? "4k_final_export"
          : "2k_iteration";
    const stackWarnings = executionPlan.stackWarnings;
    const cameraWarnings = executionPlan.cameraWarnings;
    const sourceDataUrl = `data:${sourceImage.mimeType};base64,${sourceImage.dataBase64}`;
    const rawGeminiOutputDataUrl = `data:${result.image.mimeType};base64,${result.image.data}`;
    const metadata = {
      source_image_id: sourceImageId,
      source_type: sourceType,
      refinement_stack: refinementStack,
      custom_instruction_text: customInstruction || "",
      preserve_flags: preserveFlags,
      output_size: outputSize,
      created_at: new Date().toISOString(),
      source_title: sourceTitle,
      keep_original_aspect_ratio: keepOriginalAspectRatio !== false,
      aspect_ratio: executionPlan.renderControls.aspectRatio,
      crop_position: executionPlan.renderControls.cropPosition,
      aspect_ratio_mode: executionPlan.renderControls.aspectRatioMode,
      framing_preference: executionPlan.renderControls.framingPreference,
      subject_protection: executionPlan.renderControls.subjectProtection,
      tone_style_lock: executionPlan.renderControls.toneStyleLock,
      reinterpretation_level: executionPlan.executionMode === "aspect_ratio_recompose" ? "minimal" : executionPlan.executionMode === "reframe" ? "high" : "local_only",
      goal:
        executionPlan.executionMode === "aspect_ratio_recompose"
          ? "preserve same image while fitting new frame"
          : executionPlan.executionMode === "reframe"
            ? "stronger camera-language reinterpretation"
            : "local refinement or exact preservation",
      ai_refinement_used: true,
      model_render_used: true,
      validation_status: executionPlan.validation.isBlocked ? "blocked" : "ready",
      camera_preset_ids: normalizedCameraPresetIds,
      camera_angle: cameraSummary.primaryAngle.id,
      lens_look: cameraSummary.primaryLens.id,
      camera_modifiers: cameraSummary.modifiers.map((modifier) => modifier.id),
      camera_direction_narrative: cameraSummary.narrative,
      execution_mode: executionPlan.executionMode,
      execution_trigger_reasons: executionPlan.triggerReasons,
      active_preserve_rules: executionPlan.activePreserveRules,
      active_camera_instructions: executionPlan.activeCameraInstructions,
      active_custom_instructions: executionPlan.activeCustomInstructions,
      custom_instruction_warnings: executionPlan.customInstructionWarnings.map((warning) => warning.message),
      debug_prompt_text: promptText,
      debug_validation: executionPlan.validation,
      reframe_mode_triggered: executionPlan.reframeTriggered,
      reframe_intensity: reframeIntensity,
      allow_reframing: preserveFlags.allow_reframing,
      allow_perspective_shift: preserveFlags.allow_perspective_shift,
      model: result.model,
      monochrome_lock_enabled: executionPlan.monochromeLockEnabled,
      hidden_style_fragments_appended: executionPlan.appendedStyleFragments,
      source_format: sourceImage.mimeType,
      source_color_space: sourceAnalysis ? "browser-estimated-on-client" : "unavailable",
      source_icc_info: "unavailable",
      output_format: result.image.mimeType,
      output_color_space: executionPlan.monochromeLockEnabled
        ? "provider-returned-unknown; neutral grayscale lock may be applied in client finalization"
        : "provider-returned-unknown",
      output_icc_handling: executionPlan.monochromeLockEnabled
        ? "no explicit ICC conversion on server; client may apply strict monochrome neutralization for final preview/download"
        : "no explicit ICC conversion applied",
      post_processing_steps: executionPlan.postProcessingSteps,
      diagnostic_requested: Boolean(debugToneDriftDiagnostic),
    };

    const debugArtifacts = {
      source: {
        label: "Source image",
        url: sourceDataUrl,
      },
      rawGeminiOutput: {
        label: "Raw Gemini output before post-processing",
        url: rawGeminiOutputDataUrl,
      },
      finalOutput: {
        label: executionPlan.monochromeLockEnabled
          ? "Final output after monochrome lock"
          : "Final output after all processing",
        url: rawGeminiOutputDataUrl,
      },
    };

    if (isBlobStorageConfigured()) {
      const timestamp = Date.now();
      const sourceExtension = sourceImage.mimeType === "image/jpeg" ? "jpg" : sourceImage.mimeType.split("/")[1] || "png";
      const extension = result.image.mimeType === "image/jpeg" ? "jpg" : result.image.mimeType.split("/")[1] || "png";
      const basePath = `review/final-${executionPlan.executionMode}/${sanitizeSlug(sourceTitle)}-${sanitizeSlug(refinementStack.join("-") || "no-stack")}-${timestamp}`;
      const sourceArtifact =
        executionPlan.executionMode === "aspect_ratio_recompose"
          ? await uploadBinaryAsset(`${basePath}-source.${sourceExtension}`, Buffer.from(sourceImage.dataBase64, "base64"), sourceImage.mimeType)
          : null;
      const rawGeminiArtifact =
        executionPlan.executionMode === "aspect_ratio_recompose"
          ? await uploadBinaryAsset(`${basePath}-raw.${extension}`, Buffer.from(result.image.data, "base64"), result.image.mimeType)
          : null;
      const uploaded = await uploadBinaryAsset(
        `${basePath}.${extension}`,
        Buffer.from(result.image.data, "base64"),
        result.image.mimeType,
      );
      const metadataRecord = await uploadJsonAsset(
        `${basePath}-metadata.json`,
        {
          ...metadata,
          asset_pathname: uploaded.pathname,
          source_artifact_url: sourceArtifact?.url || sourceDataUrl,
          raw_gemini_output_url: rawGeminiArtifact?.url || rawGeminiOutputDataUrl,
          final_output_url: uploaded.url,
          preview_asset_url: uploaded.url,
          download_asset_url: uploaded.downloadUrl || uploaded.url,
        },
      );

      await completeSummerImageJob({
        jobId,
        status: "completed",
        outputPayload: {
          sourceImageId,
          sourceTitle,
          executionMode: executionPlan.executionMode,
          assetPathname: uploaded.pathname,
          assetUrl: uploaded.url,
        },
        output: {
          outputPath: uploaded.pathname,
          publicUrl: uploaded.url,
          title: sourceTitle,
          aspectRatio: String(executionPlan.renderControls.aspectRatio),
          outputType: "fit_refine_final",
          metadata: {
            metadataRecord,
            sourceImageId,
            sourceType,
            refinementStack,
          },
        },
      });

      return NextResponse.json({
        savedToBlob: true,
        asset: uploaded,
        metadata: {
          ...metadata,
          source_artifact_url: sourceArtifact?.url || sourceDataUrl,
          raw_gemini_output_url: rawGeminiArtifact?.url || rawGeminiOutputDataUrl,
          final_output_url: uploaded.url,
          preview_asset_url: uploaded.url,
          download_asset_url: uploaded.downloadUrl || uploaded.url,
        },
        metadataRecord,
        stackWarnings: [...stackWarnings, ...cameraWarnings, ...executionPlan.customInstructionWarnings],
        responseText: result.text,
        debug: {
          ...executionPlan,
          sourceAnalysis,
          diagnosticRequested: Boolean(debugToneDriftDiagnostic),
        },
        debugArtifacts: {
          source: {
            label: "Source image",
            url: sourceDataUrl,
          },
          rawGeminiOutput: {
            label: "Raw Gemini output before post-processing",
            url: rawGeminiOutputDataUrl,
          },
          finalOutput: {
            label: executionPlan.monochromeLockEnabled
              ? "Server final before monochrome lock correction"
              : "Final output after all processing",
            url: rawGeminiOutputDataUrl,
          },
        },
      });
    }

    await completeSummerImageJob({
      jobId,
      status: "completed",
      outputPayload: {
        sourceImageId,
        sourceTitle,
        executionMode: executionPlan.executionMode,
        temporary: true,
      },
      output: {
        outputPath: null,
        publicUrl: null,
        title: sourceTitle,
        aspectRatio: String(executionPlan.renderControls.aspectRatio),
        outputType: "fit_refine_final_temporary",
        metadata: {
          sourceImageId,
          sourceType,
          refinementStack,
          temporary: true,
        },
      },
    });

    return NextResponse.json({
      savedToBlob: false,
      temporary: true,
      imageDataUrl: `data:${result.image.mimeType};base64,${result.image.data}`,
      metadata: {
        ...metadata,
        source_artifact_url: sourceDataUrl,
        raw_gemini_output_url: rawGeminiOutputDataUrl,
        final_output_url: rawGeminiOutputDataUrl,
        preview_asset_url: rawGeminiOutputDataUrl,
        download_asset_url: rawGeminiOutputDataUrl,
      },
      stackWarnings: [...stackWarnings, ...cameraWarnings, ...executionPlan.customInstructionWarnings],
      responseText: result.text,
      debug: {
        ...executionPlan,
        sourceAnalysis,
        diagnosticRequested: Boolean(debugToneDriftDiagnostic),
      },
      debugArtifacts,
      warning: "Blob is not configured, so this refined result is temporary and available only in the current session.",
    });
  } catch (error) {
    await failSummerImageJob(jobId, error instanceof Error ? error.message : "Unknown final refinement error.");
    if (error instanceof GeminiImageError && error.temporaryOverload) {
      return NextResponse.json(
        {
          error: error.message,
          temporaryOverload: true,
          retriesAttempted: error.retriesAttempted,
          fallbackAction: "rerun_at_2k",
          suggestedExport4k: false,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown final refinement error.",
      },
      { status: 500 },
    );
  }
}
