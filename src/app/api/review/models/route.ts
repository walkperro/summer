import { NextResponse } from "next/server";

import { requireSummerAdminApiSession } from "@/lib/summer/admin-auth";

export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_BASE = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta";

export async function GET() {
  const authResponse = await requireSummerAdminApiSession();

  if (authResponse) {
    return authResponse;
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const response = await fetch(`${GEMINI_API_BASE}/models?key=${GEMINI_API_KEY}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();

    return NextResponse.json(
      {
        error: "Failed to list Gemini models.",
        status: response.status,
        details,
      },
      { status: 500 },
    );
  }

  const data = (await response.json()) as {
    models?: Array<{
      name?: string;
      displayName?: string;
      description?: string;
      supportedGenerationMethods?: string[];
    }>;
  };

  return NextResponse.json({
    models:
      data.models
        ?.filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
        .map((model) => ({
          name: model.name,
          displayName: model.displayName,
          description: model.description,
          supportedGenerationMethods: model.supportedGenerationMethods,
        })) ?? [],
  });
}
