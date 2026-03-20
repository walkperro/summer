import { NextRequest, NextResponse } from "next/server";

import { buildGeminiPrompt, getPromptEntry } from "@/lib/prompt-pack";
import { generateGeminiImage } from "@/lib/gemini-image";
import { loadPromptReferenceImages } from "@/lib/reference-images";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { promptId } = (await request.json()) as { promptId?: string };

  if (!promptId) {
    return NextResponse.json({ error: "Missing promptId." }, { status: 400 });
  }

  const prompt = getPromptEntry(promptId);

  if (!prompt) {
    return NextResponse.json({ error: `Unknown prompt id: ${promptId}` }, { status: 404 });
  }

  try {
    const references = await loadPromptReferenceImages(promptId);
    const promptText = buildGeminiPrompt(prompt);
    const result = await generateGeminiImage([
      ...references.map((reference) => ({
        inlineData: {
          mimeType: reference.mimeType,
          data: reference.dataBase64,
        },
      })),
      { text: promptText },
    ]);

    return NextResponse.json({
      promptId,
      model: result.model,
      prompt: promptText,
      referenceCount: references.length,
      imageDataUrl: `data:${result.image.mimeType};base64,${result.image.data}`,
      responseText: result.text,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown generation error.",
      },
      { status: 500 },
    );
  }
}
