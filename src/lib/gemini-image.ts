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
const RETRY_DELAYS_MS = [3000, 8000, 15000] as const;

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

export class GeminiImageError extends Error {
  status?: number;
  temporaryOverload: boolean;
  retriesAttempted: number;

  constructor(
    message: string,
    options: {
      status?: number;
      temporaryOverload?: boolean;
      retriesAttempted?: number;
    } = {},
  ) {
    super(message);
    this.name = "GeminiImageError";
    this.status = options.status;
    this.temporaryOverload = options.temporaryOverload ?? false;
    this.retriesAttempted = options.retriesAttempted ?? 0;
  }
}

function sleep(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function isTemporaryOverload(status: number, bodyText: string) {
  return status === 503 || /UNAVAILABLE|overloaded|temporar/i.test(bodyText);
}

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

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
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
      const responseText = await response.text();
      const overload = isTemporaryOverload(response.status, responseText);

      if (overload && attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt]);
        continue;
      }

      if (overload) {
        throw new GeminiImageError(
          "Gemini is temporarily overloaded. Retries were exhausted. Try again or rerun at 2K for a more reliable pass.",
          {
            status: response.status,
            temporaryOverload: true,
            retriesAttempted: RETRY_DELAYS_MS.length,
          },
        );
      }

      throw new GeminiImageError(`Gemini API request failed with status ${response.status}: ${responseText}`, {
        status: response.status,
        retriesAttempted: attempt,
      });
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
      throw new GeminiImageError(text ? `Gemini did not return an image part. ${text}` : "Gemini did not return an image part.");
    }

    return {
      model: GEMINI_MODEL,
      image,
      text,
      raw: data,
    };
  }

  throw new GeminiImageError("Gemini image generation failed unexpectedly.");
}
