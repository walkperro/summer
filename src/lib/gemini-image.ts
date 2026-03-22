const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = (
  process.env.NANO_BANANA_MODEL ||
  process.env.GEMINI_IMAGE_MODEL ||
  "gemini-3.1-flash-image-preview"
)
  .trim()
  .replace(/\\n/g, "")
  .replace(/^models\//, "");
const GEMINI_API_BASE = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta";

export type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export type GeminiImageResult = {
  model: string;
  image: { mimeType: string; data: string };
  text: string;
  raw: unknown;
};

export type GeminiImageOptions = {
  temperature?: number;
  topP?: number;
};

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

export function assertGeminiConfigured() {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }
}

export async function generateGeminiImage(parts: GeminiPart[], options: GeminiImageOptions = {}): Promise<GeminiImageResult> {
  assertGeminiConfigured();

  const response = await fetch(`${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
        ...(typeof options.temperature === "number" ? { temperature: options.temperature } : {}),
        ...(typeof options.topP === "number" ? { topP: options.topP } : {}),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API request failed with status ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: GeminiPart[];
      };
    }>;
  };

  const responseParts = data.candidates?.[0]?.content?.parts ?? [];
  const image = extractImagePart(responseParts);
  const text = extractTextPart(responseParts);

  if (!image) {
    throw new Error(text ? `Gemini did not return an image part. ${text}` : "Gemini did not return an image part.");
  }

  return {
    model: GEMINI_MODEL,
    image,
    text,
    raw: data,
  };
}
