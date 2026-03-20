import { NextRequest, NextResponse } from "next/server";

import { buildGeminiPrompt, getPromptEntry } from "@/lib/prompt-pack";
import { loadPromptReferenceImages } from "@/lib/reference-images";

export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = (
  process.env.NANO_BANANA_MODEL ||
  process.env.GEMINI_IMAGE_MODEL ||
  "gemini-2.5-flash-image-preview"
)
  .trim()
  .replace(/^models\//, "");
const GEMINI_API_BASE = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta";

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

function extractImagePart(parts: GeminiPart[]) {
  for (const part of parts) {
    if ("inlineData" in part) {
      return part.inlineData;
    }
  }

  return null;
}

function extractTextPart(parts: GeminiPart[]) {
  return parts
    .filter((part): part is { text: string } => "text" in part)
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY environment variable." },
      { status: 500 },
    );
  }

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
    const requestParts: GeminiPart[] = [
      ...references.map((reference) => ({
        inlineData: {
          mimeType: reference.mimeType,
          data: reference.dataBase64,
        },
      })),
      { text: buildGeminiPrompt(prompt) },
    ];

    const response = await fetch(
      `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: requestParts,
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "Gemini API request failed.",
          status: response.status,
          details: errorText,
        },
        { status: 500 },
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: GeminiPart[];
        };
      }>;
    };

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const image = extractImagePart(parts);
    const text = extractTextPart(parts);

    if (!image) {
      return NextResponse.json(
        {
          error: "Gemini did not return an image part.",
          text,
          raw: data,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      promptId,
      model: GEMINI_MODEL,
      prompt: buildGeminiPrompt(prompt),
      referenceCount: references.length,
      imageDataUrl: `data:${image.mimeType};base64,${image.data}`,
      responseText: text,
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
