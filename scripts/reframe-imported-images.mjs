#!/usr/bin/env node
// =============================================================================
// reframe-imported-images.mjs
// =============================================================================
// Runs each PNG in public/images/summer/imported/ through Google's Nano Banana 2
// (gemini-3.1-flash-image-preview) to clean up lighting, reframe to target
// aspect ratios, and save as polished site assets under public/images/summer/refined/.
//
// Env required:
//   GEMINI_API_KEY
//   NANO_BANANA_MODEL (optional, defaults to gemini-3.1-flash-image-preview)
//   GEMINI_API_BASE   (optional)
//
// If the Gemini call fails, falls back to a pass-through copy so the ship
// pipeline never stalls on a missing key or rate limit.
// =============================================================================

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const IMPORT_DIR = path.join(repoRoot, "public", "images", "summer", "imported");
const REFINE_DIR = path.join(repoRoot, "public", "images", "summer", "refined");

async function loadEnvLocal() {
  const envPath = path.join(repoRoot, ".env.local");
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    /* noop */
  }
}

const BASE_PROMPT =
  "You are a premium fitness / fashion editorial retoucher. Treat this as a hand-edit, not a regeneration. " +
  "Gently clean up lighting, soften harsh shadows only where natural, and remove small distracting elements " +
  "in the background if any. Preserve subject identity, skin tone, tattoos, hair, and outfit exactly. " +
  "Keep the athletic editorial tone. Do not add props, text, or watermarks. Do not stylize — the original " +
  "photograph should still look like a photograph, just a cleaner version of itself. " +
  "Render at the requested resolution with crisp detail and sharp focus throughout — do not soften the subject.";

const TARGETS = {
  // { slug: [{ ratio, width, height, crop hint }] }
  "summer-hero-action": [
    { suffix: "desktop", aspect: "16:9", width: 1920, height: 1080, crop: "keep subject centered, allow breathing room on sides, maintain full body" },
    { suffix: "mobile", aspect: "4:5", width: 1080, height: 1350, crop: "portrait crop, subject full body, vertical" },
  ],
  "summer-rings-venice": [
    { suffix: "hero", aspect: "16:9", width: 1920, height: 1080, crop: "classes hero crop — include palm trees backdrop, subject center" },
    { suffix: "card", aspect: "4:5", width: 1080, height: 1350, crop: "vertical crop emphasizing subject + rings + sky" },
  ],
  "summer-splits-venice": [
    { suffix: "feature", aspect: "16:9", width: 1920, height: 1080, crop: "cinematic landscape, keep both arms in frame, full body, palm trees visible" },
    { suffix: "portrait", aspect: "4:5", width: 1080, height: 1350, crop: "vertical portrait, focus on posture and architecture behind" },
  ],
  "summer-mat-portrait": [
    { suffix: "about", aspect: "4:5", width: 1080, height: 1350, crop: "portrait with extra padding on top for editorial layout" },
    { suffix: "square", aspect: "1:1", width: 1080, height: 1080, crop: "tight editorial square" },
  ],
  "summer-partner-train": [
    { suffix: "landscape", aspect: "16:9", width: 1920, height: 1080, crop: "landscape, both subjects in frame with environment" },
    { suffix: "portrait", aspect: "4:5", width: 1080, height: 1350, crop: "vertical, both subjects in frame, composed symmetry" },
  ],
  "summer-hero-bw-2": [
    { suffix: "desktop", aspect: "16:9", width: 1920, height: 1080, crop: "cinematic landscape hero, subject framed slightly right of center, full body, architectural training space visible" },
  ],
  "summer-fitness-campaign": [
    { suffix: "hero", aspect: "16:9", width: 1920, height: 1080, crop: "full-bleed classes hero, subject mid-action, emphasize form and control, generous breathing room around the figure" },
    { suffix: "mobile", aspect: "9:16", width: 1080, height: 1920, crop: "vertical mobile crop, subject mid-action centered, preserve background context" },
  ],
  "summer-contact": [
    { suffix: "portrait", aspect: "4:5", width: 1080, height: 1350, crop: "vertical 4:5 portrait, subject seated in a calm interior with strong natural light, full upper body in frame, shoulders down" },
  ],
  "summer-private-setting": [
    { suffix: "portrait", aspect: "4:5", width: 1350, height: 1688, crop: "vertical 4:5 about-page portrait, subject seated in a calm interior with strong natural light, generous breathing room above and around the head" },
  ],
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function envValue(name, fallback) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

async function callNanoBanana({ imageBytes, mimeType, prompt }) {
  const apiKey = envValue("GEMINI_API_KEY", "");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const model = envValue("NANO_BANANA_MODEL", "gemini-3.1-flash-image-preview");
  const base = envValue("GEMINI_API_BASE", "https://generativelanguage.googleapis.com/v1beta");
  const url = `${base}/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: imageBytes.toString("base64") } },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
      temperature: 0.15,
    },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    if (p?.inlineData?.data) {
      return {
        data: Buffer.from(p.inlineData.data, "base64"),
        mimeType: p.inlineData.mimeType || "image/png",
      };
    }
  }
  throw new Error("Gemini returned no image part");
}

async function processOne(slug, file) {
  const srcPath = path.join(IMPORT_DIR, file);
  const bytes = await fs.readFile(srcPath);
  const targets = TARGETS[slug] || [];
  if (!targets.length) {
    console.log(`  · no targets defined for ${slug} — skipping`);
    return;
  }

  for (const t of targets) {
    const outName = `${slug}-${t.suffix}.png`;
    const outPath = path.join(REFINE_DIR, outName);
    const prompt =
      `${BASE_PROMPT}\n\nTarget aspect ratio: ${t.aspect} (render at approximately ${t.width}x${t.height}). ` +
      `Crop guidance: ${t.crop}. Do not add borders or letterboxing — recompose through a natural crop.`;
    process.stdout.write(`  · ${outName} ... `);
    try {
      const out = await callNanoBanana({ imageBytes: bytes, mimeType: "image/png", prompt });
      await fs.writeFile(outPath, out.data);
      process.stdout.write("refined via Nano Banana 2\n");
    } catch (err) {
      // Fallback: copy the source through so downstream code still has a file.
      await fs.writeFile(outPath, bytes);
      process.stdout.write(`fallback copy (reason: ${err.message.slice(0, 80)})\n`);
    }
  }
}

async function main() {
  await loadEnvLocal();
  await ensureDir(REFINE_DIR);

  const files = (await fs.readdir(IMPORT_DIR).catch(() => [])).filter((f) => /\.(png|jpe?g)$/i.test(f));
  if (!files.length) {
    console.log("nothing to reframe — drop PNG/JPG files into public/images/summer/imported/");
    return;
  }
  console.log(`reframing ${files.length} image(s) via Nano Banana 2 (model=${envValue("NANO_BANANA_MODEL", "gemini-3.1-flash-image-preview")})`);

  for (const f of files) {
    const slug = path.parse(f).name;
    console.log(`> ${slug}`);
    await processOne(slug, f);
  }
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
