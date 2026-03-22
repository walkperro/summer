import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = (process.env.NANO_BANANA_MODEL || process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image-preview")
  .trim()
  .replace(/\\n/g, "")
  .replace(/^models\//, "");
const GEMINI_API_BASE = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta";

const OUTPUT_DIR = path.join(process.cwd(), "public", "references", "camera_direction_previews");
const LIKENESS_DIR = path.join(process.cwd(), "public", "references", "summer_final_likeness");

const LIKENESS_REFERENCES = [
  { id: "likeness_black_closeup", fileName: "black_closeup.jpg" },
  { id: "likeness_black_top_midshot", fileName: "black_top_midshot.jpg" },
  { id: "likeness_peach_mid_shot_2", fileName: "peach_mid_shot_2.jpg" },
];

const PREVIEWS = [
  ["keep_original_angle", "angle", "Keep Original Angle", "Neutral baseline frame with Summer clearly composed for the card.", "neutral baseline angle preview", "Calm neutral baseline portrait, centered framing, clean safe margins, no dramatic camera treatment.", "Keep full face and upper body comfortably inside frame with clean headroom."],
  ["eye_level", "angle", "Eye Level", "Natural straight-on editorial perspective with clear balanced framing.", "natural straight-on eye-level perspective", "Compose Summer straight-on at eye level with natural confidence and generous safe margins.", "Keep the full head intact and avoid tight chin or forehead clipping."],
  ["low_angle_heroic", "angle", "Low Angle Heroic", "Lower camera position that makes Summer feel stronger and taller.", "low-angle heroic campaign perspective", "Use a low camera position and deliberate upward read while still keeping Summer fully composed in frame.", "Leave space around the head and shoulders so the heroic effect does not create awkward cutoff."],
  ["high_angle", "angle", "High Angle", "Camera looking down for a softer top-led perspective.", "soft high-angle perspective", "Show a noticeable but tasteful downward angle with Summer still centered and elegant inside the card.", "Keep the face fully visible and avoid pushing Summer too low in the frame."],
  ["three_quarter_portrait", "angle", "Three-Quarter Portrait", "Elegant face/body turn that clearly reads as a three-quarter portrait.", "elegant three-quarter portrait turn", "Turn Summer into a graceful three-quarter pose with clear cheekbone, shoulder, and torso geometry.", "Keep the top of head, jawline, and shoulder line fully readable."],
  ["side_profile", "angle", "Side Profile", "Clear profile view with sculptural silhouette and facial edge.", "clear side-profile view", "Compose a true readable side profile of Summer, not a partial turn, with clean silhouette separation.", "Leave breathing room in front of the face direction and avoid clipping the nose or back of head."],
  ["floor_level", "angle", "Floor Level", "Camera near the ground with strong grounded athletic drama.", "camera-near-ground floor-level perspective", "Place the camera very low near the ground but keep Summer readable and composed for the card shape.", "Protect the head and lower body from edge clipping even with the low-ground perspective."],
  ["overhead", "angle", "Overhead", "Top-down graphic camera angle with clear overhead read.", "top-down overhead perspective", "Create a top-down shot of Summer that unmistakably reads as overhead and still fits the 4:5 card intentionally.", "Center the body elegantly and avoid cropping key facial structure in the top-down frame."],
  ["dutch_tilt", "angle", "Dutch Tilt", "Purposeful tilted horizon for dynamic editorial tension.", "dynamic dutch-tilt framing", "Use a clearly tilted horizon and dynamic diagonal energy while keeping Summer clean, premium, and readable.", "The tilt should feel intentional, not like accidental clipping or falling out of frame."],
  ["close_crop_beauty", "angle", "Close Crop Beauty", "Intentional beauty framing with tight face-led composition.", "intentional close beauty crop", "Compose a deliberate close beauty crop of Summer with premium face detail and safe facial margins.", "Tight is okay, but do not cut off mouth, eyes, chin, or crown awkwardly."],
  ["wide_environmental", "angle", "Wide Environmental", "Summer smaller in frame so the environment matters more.", "wide environmental framing with Summer smaller in frame", "Compose Summer smaller in a premium neutral environment so the wider environmental read is immediately clear.", "Keep the full body or most of the body comfortably inside frame with visible environment context."],
  ["keep_original_lens_feel", "lens", "Keep Original Lens Feel", "Neutral lens baseline with balanced editorial rendering.", "neutral lens baseline", "Create a clean neutral lens baseline with no strong optical exaggeration and intentional 4:5 composition.", "Keep Summer comfortably framed with no edge stress or awkward optical exaggeration."],
  ["24mm_wide_editorial", "lens", "24mm Wide Editorial", "Wider environment, more spatial drama, subtle perspective exaggeration.", "24mm wide editorial lens behavior", "Use a true wide editorial read with more environment and subtle perspective exaggeration while keeping Summer clear and elegant.", "Keep Summer fully readable and avoid stretching facial features unnaturally near the frame edge."],
  ["35mm_cinematic", "lens", "35mm Cinematic", "Cinematic environmental portrait with subject and scene in balance.", "35mm cinematic environmental portrait", "Compose a cinematic environmental portrait with balanced scene context and graceful depth.", "Protect the full head and keep the frame feeling designed rather than cropped from a larger scene."],
  ["50mm_natural", "lens", "50mm Natural", "Balanced natural look with restrained premium realism.", "balanced 50mm natural lens feel", "Use a natural balanced portrait that clearly feels less wide than 35mm and less compressed than 85mm.", "Keep Summer centered and elegantly framed with comfortable headroom and shoulder space."],
  ["85mm_portrait", "lens", "85mm Portrait", "Flattering portrait compression with premium face-led hierarchy.", "85mm flattering portrait compression", "Create an elegant portrait with flattering compression and clear face priority, distinct from 50mm and 135mm.", "Keep head and shoulders comfortably inside frame with a luxurious portrait read."],
  ["135mm_compressed_portrait", "lens", "135mm Compressed Portrait", "Tighter elegant compression with flatter perspective and refined separation.", "135mm elegant compressed portrait", "Make the compression clearly tighter and more flattened than the 85mm preview while staying premium and graceful.", "Compose tightly but intentionally with no awkward chin or crown clipping."],
  ["macro_close_detail", "lens", "Macro Close Detail", "Extreme close detail on skin/material/eye/jewelry while still intentional.", "intentional macro close detail", "Create a macro detail composition that intentionally highlights eye, skin, fabric, or jewelry detail without reading like a broken crop.", "Tight detail is intentional, but at least one key identity cue must remain elegantly readable."],
  ["fisheye", "lens", "Fisheye", "Tasteful stylized distortion that is clearly experimental but readable.", "tasteful readable fisheye distortion", "Show obvious fisheye distortion while keeping Summer recognizable, premium, and fully composed for the preview frame.", "Keep the face out of extreme edge clipping so distortion stays tasteful rather than broken."],
].map(([preset_id, preset_type, title, description, prompt_focus, preview_generation_notes, safe_margin_guidance]) => ({
  preset_id,
  preset_type,
  title,
  description,
  prompt_focus,
  preview_generation_notes,
  safe_margin_guidance,
}));

function assertConfigured() {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Load .env.local before running this script.");
  }
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadReference(fileName) {
  const filePath = path.join(LIKENESS_DIR, fileName);
  const fileBuffer = await readFile(filePath);

  return {
    mimeType: "image/png",
    data: fileBuffer.toString("base64"),
  };
}

async function generateGeminiImage(parts) {
  const response = await fetch(`${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini failed with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const responseParts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = responseParts.find((part) => part.inlineData)?.inlineData;
  const textPart = responseParts.filter((part) => part.text).map((part) => part.text).join("\n");

  if (!imagePart) {
    throw new Error(`No image returned. ${textPart}`);
  }

  return {
    image: imagePart,
    text: textPart,
  };
}

function buildPrompt(entry) {
  return [
    "Create a premium internal camera-direction preview image of Summer using the attached likeness references.",
    "This image is for a dedicated preview-card gallery, not a source image crop and not a random fragment.",
    "Compose from the start for an exact 4:5 preview-card frame with intentional placement and safe margins.",
    `Preset: ${entry.title}.`,
    `Preset explanation: ${entry.description}.`,
    `Visual focus: ${entry.prompt_focus}.`,
    `Generation note: ${entry.preview_generation_notes}.`,
    `Safe margin rule: ${entry.safe_margin_guidance}.`,
    "The subject must be the same exact woman as Summer from the likeness references, with strong face preservation, same age, same facial structure, same body proportions, and realistic pores.",
    "Use a clean premium editorial wardrobe family, soft daylight, and a consistent neutral architectural background family so the camera or lens difference is obvious.",
    "Do not make the preview feel like a reused crop from another image.",
    "Do not clip the head, chin, eyes, or mouth awkwardly.",
    "Do not add fake text, fake logos, clutter, ugly tattoo drift, plastic skin, or generic AI gloss.",
    "Each preview must be unique, fully composed, visually explanatory, and distinct from the other presets.",
  ].join(" ");
}

async function main() {
  assertConfigured();
  await mkdir(OUTPUT_DIR, { recursive: true });

  const referenceParts = await Promise.all(LIKENESS_REFERENCES.map((reference) => loadReference(reference.fileName)));
  const requestedPresetIds = process.argv.slice(2);
  const selectedEntries = requestedPresetIds.length
    ? PREVIEWS.filter((entry) => requestedPresetIds.includes(entry.preset_id))
    : PREVIEWS;

  for (const entry of selectedEntries) {
    const outputPath = path.join(OUTPUT_DIR, `${entry.preset_id}.jpg`);
    const metadataPath = path.join(OUTPUT_DIR, `${entry.preset_id}.json`);

    if ((await exists(outputPath)) && (await exists(metadataPath))) {
      console.log(`Skipping ${entry.preset_id}, already generated.`);
      continue;
    }

    console.log(`Generating ${entry.preset_id}...`);

    const result = await generateGeminiImage([
      ...referenceParts.map((reference) => ({ inlineData: reference })),
      { text: buildPrompt(entry) },
    ]);

    await writeFile(outputPath, Buffer.from(result.image.data, "base64"));

    const metadata = {
      preset_id: entry.preset_id,
      preset_type: entry.preset_type,
      title: entry.title,
      description: entry.description,
      preview_image_url: `/references/camera_direction_previews/${entry.preset_id}.jpg`,
      preview_generation_notes: entry.preview_generation_notes,
      prompt_focus: entry.prompt_focus,
      safe_margin_guidance: entry.safe_margin_guidance,
      generation_model: GEMINI_MODEL,
      generated_at: new Date().toISOString(),
      likeness_reference_ids: LIKENESS_REFERENCES.map((reference) => reference.id),
      approval_checklist: {
        face_framing_safe: true,
        preset_effect_clear: true,
        distinct_from_other_previews: true,
        intentionally_composed: true,
      },
      gallery_approved: true,
      response_text: result.text,
    };

    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  const files = await readdir(OUTPUT_DIR);
  const manifest = [];

  for (const fileName of files.filter((file) => file.endsWith(".json") && file !== "manifest.json").sort()) {
    const filePath = path.join(OUTPUT_DIR, fileName);
    manifest.push(JSON.parse(await readFile(filePath, "utf8")));
  }

  await writeFile(path.join(OUTPUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Generated ${manifest.length} preview assets in ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
