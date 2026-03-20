import { NextRequest, NextResponse } from "next/server";

import { uploadJsonAsset } from "@/lib/blob-storage";

export const runtime = "nodejs";

type DecisionPayload = {
  decision?: "approve" | "reject";
  workflow?: "fit_generate_campaign" | "fit_enhance_reference";
  assetPathname?: string;
  assetUrl?: string;
  context?: Record<string, unknown>;
};

function sanitizeSlug(value: string) {
  return value.replace(/[^a-z0-9-_/.]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as DecisionPayload;

  if (!payload.decision || !payload.workflow || !payload.assetPathname) {
    return NextResponse.json({ error: "Missing decision, workflow, or assetPathname." }, { status: 400 });
  }

  try {
    const uploaded = await uploadJsonAsset(
      `review/decisions/${payload.workflow}/${sanitizeSlug(payload.assetPathname)}-${payload.decision}.json`,
      {
        ...payload,
        decidedAt: new Date().toISOString(),
      },
    );

    return NextResponse.json({ ok: true, record: uploaded });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown decision persistence error.",
      },
      { status: 500 },
    );
  }
}
