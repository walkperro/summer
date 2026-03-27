import "server-only";

import { hasSummerSupabaseAdminConfig, insertSummerRows, selectSummerSingle, updateSummerRows } from "@/lib/summer/supabase";
import type { SummerImageJob, SummerImageOutput } from "@/lib/summer/types";

export async function createSummerImageJob(input: {
  jobType: string;
  sourceAssetId?: string | null;
  inputPayload?: Record<string, unknown>;
  promptText?: string | null;
}) {
  if (!hasSummerSupabaseAdminConfig()) {
    return null;
  }

  try {
    const rows = await insertSummerRows<SummerImageJob>("image_jobs", [
      {
        job_type: input.jobType,
        status: "queued",
        source_asset_id: input.sourceAssetId || null,
        input_payload: input.inputPayload || {},
        prompt_text: input.promptText || null,
      },
    ]);

    return rows?.[0] || null;
  } catch (error) {
    console.error("Failed to create Summer image job", error);
    return null;
  }
}

export async function completeSummerImageJob(input: {
  jobId?: string | null;
  status?: string;
  outputPayload?: Record<string, unknown>;
  errorMessage?: string | null;
  output?: {
    outputPath?: string | null;
    publicUrl?: string | null;
    title?: string | null;
    aspectRatio?: string | null;
    outputType?: string | null;
    metadata?: Record<string, unknown>;
  };
}) {
  if (!hasSummerSupabaseAdminConfig() || !input.jobId) {
    return null;
  }

  try {
    await updateSummerRows<SummerImageJob>(
      "image_jobs",
      { id: `eq.${input.jobId}` },
      {
        status: input.status || "completed",
        output_payload: input.outputPayload || {},
        error_message: input.errorMessage || null,
      },
    );

    if (input.output) {
      const rows = await insertSummerRows<SummerImageOutput>("image_outputs", [
        {
          job_id: input.jobId,
          output_path: input.output.outputPath || null,
          public_url: input.output.publicUrl || null,
          title: input.output.title || null,
          aspect_ratio: input.output.aspectRatio || null,
          output_type: input.output.outputType || null,
          metadata: input.output.metadata || {},
        },
      ]);

      return rows?.[0] || null;
    }
  } catch (error) {
    console.error("Failed to complete Summer image job", error);
  }

  return null;
}

export async function failSummerImageJob(jobId: string | null | undefined, errorMessage: string) {
  if (!hasSummerSupabaseAdminConfig() || !jobId) {
    return;
  }

  try {
    await updateSummerRows<SummerImageJob>(
      "image_jobs",
      { id: `eq.${jobId}` },
      {
        status: "failed",
        error_message: errorMessage,
      },
    );
  } catch (error) {
    console.error("Failed to mark Summer image job failed", error);
  }
}

export async function approveSummerImageOutputByPath(assetPathname: string, assetUrl?: string | null) {
  if (!hasSummerSupabaseAdminConfig()) {
    return null;
  }

  try {
    const output =
      (await selectSummerSingle<SummerImageOutput>("image_outputs", { output_path: `eq.${assetPathname}` })) ||
      (assetUrl ? await selectSummerSingle<SummerImageOutput>("image_outputs", { public_url: `eq.${assetUrl}` }) : null);

    if (!output) {
      return null;
    }

    const rows = await updateSummerRows<SummerImageOutput>("image_outputs", { id: `eq.${output.id}` }, { is_approved: true });
    return rows?.[0] || null;
  } catch (error) {
    console.error("Failed to approve Summer image output", error);
    return null;
  }
}
