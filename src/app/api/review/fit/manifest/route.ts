import { NextResponse } from "next/server";

import { isBlobStorageConfigured } from "@/lib/blob-storage";
import {
  FIT_ASPECT_RATIOS,
  FIT_ENHANCEMENT_MODES,
  FIT_OUTPUT_MODES,
  FIT_PROMPT_REFERENCE_RECOMMENDATIONS,
  getFitCampaignPromptEntries,
  getFitEnhancementPromptEntry,
  listSummerFitReferences,
} from "@/lib/summer-fit";

export const runtime = "nodejs";

export async function GET() {
  const referenceManifest = await listSummerFitReferences();
  const enhancementPrompt = getFitEnhancementPromptEntry();

  return NextResponse.json({
    fitCampaignPrompts: getFitCampaignPromptEntries().map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      use_case: prompt.use_case,
      recommended_framing: prompt.recommended_framing,
      export_goal: prompt.export_goal,
      prompt: prompt.prompt,
      recommendedReferenceIds: FIT_PROMPT_REFERENCE_RECOMMENDATIONS[prompt.id] || [],
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
    references: referenceManifest.references,
    referenceSource: referenceManifest.source,
    storageConfigured: isBlobStorageConfigured(),
  });
}
