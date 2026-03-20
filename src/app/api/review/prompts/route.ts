import { NextResponse } from "next/server";

import { getPromptEntries } from "@/lib/prompt-pack";
import { getPromptReferenceManifest } from "@/lib/reference-images";

export const runtime = "nodejs";

export async function GET() {
  const prompts = await Promise.all(
    getPromptEntries()
      .filter((prompt) => prompt.workflow === "generate_with_references")
      .map(async (prompt) => {
      const manifest = await getPromptReferenceManifest(prompt.id);

      return {
        id: prompt.id,
        title: prompt.title,
        section: prompt.section,
        workflow: prompt.workflow,
        use_case: prompt.use_case,
        aspect_ratio: prompt.aspect_ratio,
        prompt: prompt.prompt,
        avoid: prompt.avoid,
        recommended_framing: prompt.recommended_framing,
        export_goal: prompt.export_goal,
        creative_direction: prompt.creative_direction,
        reference_root: manifest.referenceRootLabel,
        attachments: manifest.attachments,
      };
      }),
  );

  return NextResponse.json({ prompts });
}
