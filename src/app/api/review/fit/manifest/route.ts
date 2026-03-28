import { NextResponse } from "next/server";

import { isBlobStorageConfigured } from "@/lib/blob-storage";
import { getApprovedCameraPreviewRegistry } from "@/lib/camera-preview-registry";
import {
  CAMERA_ANGLE_OPTIONS,
  CAMERA_RECIPES,
  DEFAULT_PRESERVE_FLAGS,
  FINAL_REFINEMENT_HELP,
  FINAL_REFINEMENT_PRESETS,
  FINAL_REFINEMENT_RECIPES,
  LENS_LOOK_OPTIONS,
} from "@/lib/final-refinement";
import { listLikenessReferences } from "@/lib/likeness-references";
import {
  FIT_ASPECT_RATIOS,
  FIT_ENHANCEMENT_MODES,
  FIT_OUTPUT_MODES,
  FIT_PROMPT_REFERENCE_RECOMMENDATIONS,
  getFitCampaignPromptEntries,
  getFitEnhancementPromptEntry,
  listSummerFitReferences,
} from "@/lib/summer-fit";
import { requireSummerAdminApiSession } from "@/lib/summer/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  const authResponse = await requireSummerAdminApiSession();

  if (authResponse) {
    return authResponse;
  }

  const fitReferenceManifest = await listSummerFitReferences();
  const likenessReferenceManifest = await listLikenessReferences();
  const enhancementPrompt = getFitEnhancementPromptEntry();

  return NextResponse.json({
    fitCampaignPrompts: getFitCampaignPromptEntries().map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      use_case: prompt.use_case,
      recommended_framing: prompt.recommended_framing,
      export_goal: prompt.export_goal,
      prompt: prompt.prompt,
      recommendedFitReferenceIds: FIT_PROMPT_REFERENCE_RECOMMENDATIONS[prompt.id]?.fitReferenceIds || [],
      recommendedLikenessReferenceIds: FIT_PROMPT_REFERENCE_RECOMMENDATIONS[prompt.id]?.likenessReferenceIds || [],
    })),
    fitEnhancementPrompt: {
      id: enhancementPrompt.id,
      title: enhancementPrompt.title,
      use_case: enhancementPrompt.use_case,
      prompt: enhancementPrompt.prompt,
    },
    aspectRatios: FIT_ASPECT_RATIOS,
    outputModes: FIT_OUTPUT_MODES,
    enhancementModes: FIT_ENHANCEMENT_MODES,
    fitReferences: fitReferenceManifest.references,
    fitReferenceSource: fitReferenceManifest.source,
    likenessReferences: likenessReferenceManifest.references,
    likenessReferenceSource: likenessReferenceManifest.source,
    refinementPresets: FINAL_REFINEMENT_PRESETS,
    refinementRecipes: FINAL_REFINEMENT_RECIPES,
    cameraAngleOptions: CAMERA_ANGLE_OPTIONS,
    lensLookOptions: LENS_LOOK_OPTIONS,
    cameraRecipes: CAMERA_RECIPES,
    cameraPreviewRegistry: getApprovedCameraPreviewRegistry().map((entry) => ({
      preset_id: entry.preset_id,
      preset_type: entry.preset_type,
      title: entry.title,
      description: entry.description,
      preview_image_url: entry.preview_image_url,
      preview_generation_notes: entry.preview_generation_notes,
    })),
    defaultPreserveFlags: DEFAULT_PRESERVE_FLAGS,
    refinementHelp: FINAL_REFINEMENT_HELP,
    storageConfigured: isBlobStorageConfigured(),
  });
}
