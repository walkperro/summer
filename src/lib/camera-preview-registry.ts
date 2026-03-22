import type { CameraDirectionPresetId } from "@/lib/camera-direction";

export type CameraPreviewRegistryEntry = {
  preset_id: CameraDirectionPresetId;
  preset_type: "angle" | "lens";
  title: string;
  description: string;
  preview_image_url: string;
  preview_generation_notes: string;
  prompt_focus: string;
  aspect_ratio: "4:5";
  safe_margin_guidance: string;
  approval_checklist: {
    face_framing_safe: boolean;
    preset_effect_clear: boolean;
    distinct_from_other_previews: boolean;
    intentionally_composed: boolean;
  };
  gallery_approved: boolean;
};

const PREVIEW_BASE_PATH = "/references/camera_direction_previews";

export const CAMERA_PREVIEW_REGISTRY: CameraPreviewRegistryEntry[] = [
  {
    preset_id: "keep_original_angle",
    preset_type: "angle",
    title: "Keep Original Angle",
    description: "Neutral baseline frame with Summer clearly composed for the card.",
    preview_image_url: `${PREVIEW_BASE_PATH}/keep_original_angle.jpg`,
    preview_generation_notes: "Calm neutral baseline portrait, centered framing, clean safe margins, no dramatic camera treatment.",
    prompt_focus: "neutral baseline angle preview",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep full face and upper body comfortably inside frame with clean headroom.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "eye_level",
    preset_type: "angle",
    title: "Eye Level",
    description: "Natural straight-on editorial perspective with clear balanced framing.",
    preview_image_url: `${PREVIEW_BASE_PATH}/eye_level.jpg`,
    preview_generation_notes: "Compose Summer straight-on at eye level with natural confidence and generous safe margins.",
    prompt_focus: "natural straight-on eye-level perspective",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep the full head intact and avoid tight chin or forehead clipping.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "low_angle_heroic",
    preset_type: "angle",
    title: "Low Angle Heroic",
    description: "Lower camera position that makes Summer feel stronger and taller.",
    preview_image_url: `${PREVIEW_BASE_PATH}/low_angle_heroic.jpg`,
    preview_generation_notes: "Use a low camera position and deliberate upward read while still keeping Summer fully composed in frame.",
    prompt_focus: "low-angle heroic campaign perspective",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Leave space around the head and shoulders so the heroic effect does not create awkward cutoff.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "high_angle",
    preset_type: "angle",
    title: "High Angle",
    description: "Camera looking down for a softer top-led perspective.",
    preview_image_url: `${PREVIEW_BASE_PATH}/high_angle.jpg`,
    preview_generation_notes: "Show a noticeable but tasteful downward angle with Summer still centered and elegant inside the card.",
    prompt_focus: "soft high-angle perspective",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep the face fully visible and avoid pushing Summer too low in the frame.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "three_quarter_portrait",
    preset_type: "angle",
    title: "Three-Quarter Portrait",
    description: "Elegant face/body turn that clearly reads as a three-quarter portrait.",
    preview_image_url: `${PREVIEW_BASE_PATH}/three_quarter_portrait.jpg`,
    preview_generation_notes: "Turn Summer into a graceful three-quarter pose with clear cheekbone, shoulder, and torso geometry.",
    prompt_focus: "elegant three-quarter portrait turn",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep the top of head, jawline, and shoulder line fully readable.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "side_profile",
    preset_type: "angle",
    title: "Side Profile",
    description: "Clear profile view with sculptural silhouette and facial edge.",
    preview_image_url: `${PREVIEW_BASE_PATH}/side_profile.jpg`,
    preview_generation_notes: "Compose a true readable side profile of Summer, not a partial turn, with clean silhouette separation.",
    prompt_focus: "clear side-profile view",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Leave breathing room in front of the face direction and avoid clipping the nose or back of head.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "floor_level",
    preset_type: "angle",
    title: "Floor Level",
    description: "Camera near the ground with strong grounded athletic drama.",
    preview_image_url: `${PREVIEW_BASE_PATH}/floor_level.jpg`,
    preview_generation_notes: "Place the camera very low near the ground but keep Summer readable and composed for the card shape.",
    prompt_focus: "camera-near-ground floor-level perspective",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Protect the head and lower body from edge clipping even with the low-ground perspective.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "overhead",
    preset_type: "angle",
    title: "Overhead",
    description: "Top-down graphic camera angle with clear overhead read.",
    preview_image_url: `${PREVIEW_BASE_PATH}/overhead.jpg`,
    preview_generation_notes: "Create a top-down shot of Summer that unmistakably reads as overhead and still fits the 4:5 card intentionally.",
    prompt_focus: "top-down overhead perspective",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Center the body elegantly and avoid cropping key facial structure in the top-down frame.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "dutch_tilt",
    preset_type: "angle",
    title: "Dutch Tilt",
    description: "Purposeful tilted horizon for dynamic editorial tension.",
    preview_image_url: `${PREVIEW_BASE_PATH}/dutch_tilt.jpg`,
    preview_generation_notes: "Use a clearly tilted horizon and dynamic diagonal energy while keeping Summer clean, premium, and readable.",
    prompt_focus: "dynamic dutch-tilt framing",
    aspect_ratio: "4:5",
    safe_margin_guidance: "The tilt should feel intentional, not like accidental clipping or falling out of frame.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "close_crop_beauty",
    preset_type: "angle",
    title: "Close Crop Beauty",
    description: "Intentional beauty framing with tight face-led composition.",
    preview_image_url: `${PREVIEW_BASE_PATH}/close_crop_beauty.jpg`,
    preview_generation_notes: "Compose a deliberate close beauty crop of Summer with premium face detail and safe facial margins.",
    prompt_focus: "intentional close beauty crop",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Tight is okay, but do not cut off mouth, eyes, chin, or crown awkwardly.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "wide_environmental",
    preset_type: "angle",
    title: "Wide Environmental",
    description: "Summer smaller in frame so the environment matters more.",
    preview_image_url: `${PREVIEW_BASE_PATH}/wide_environmental.jpg`,
    preview_generation_notes: "Compose Summer smaller in a premium neutral environment so the wider environmental read is immediately clear.",
    prompt_focus: "wide environmental framing with Summer smaller in frame",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep the full body or most of the body comfortably inside frame with visible environment context.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "keep_original_lens_feel",
    preset_type: "lens",
    title: "Keep Original Lens Feel",
    description: "Neutral lens baseline with balanced editorial rendering.",
    preview_image_url: `${PREVIEW_BASE_PATH}/keep_original_lens_feel.jpg`,
    preview_generation_notes: "Create a clean neutral lens baseline with no strong optical exaggeration and intentional 4:5 composition.",
    prompt_focus: "neutral lens baseline",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep Summer comfortably framed with no edge stress or awkward optical exaggeration.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "24mm_wide_editorial",
    preset_type: "lens",
    title: "24mm Wide Editorial",
    description: "Wider environment, more spatial drama, subtle perspective exaggeration.",
    preview_image_url: `${PREVIEW_BASE_PATH}/24mm_wide_editorial.jpg`,
    preview_generation_notes: "Use a true wide editorial read with more environment and subtle perspective exaggeration while keeping Summer clear and elegant.",
    prompt_focus: "24mm wide editorial lens behavior",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep Summer fully readable and avoid stretching facial features unnaturally near the frame edge.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "35mm_cinematic",
    preset_type: "lens",
    title: "35mm Cinematic",
    description: "Cinematic environmental portrait with subject and scene in balance.",
    preview_image_url: `${PREVIEW_BASE_PATH}/35mm_cinematic.jpg`,
    preview_generation_notes: "Compose a cinematic environmental portrait with balanced scene context and graceful depth.",
    prompt_focus: "35mm cinematic environmental portrait",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Protect the full head and keep the frame feeling designed rather than cropped from a larger scene.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "50mm_natural",
    preset_type: "lens",
    title: "50mm Natural",
    description: "Balanced natural look with restrained premium realism.",
    preview_image_url: `${PREVIEW_BASE_PATH}/50mm_natural.jpg`,
    preview_generation_notes: "Use a natural balanced portrait that clearly feels less wide than 35mm and less compressed than 85mm.",
    prompt_focus: "balanced 50mm natural lens feel",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep Summer centered and elegantly framed with comfortable headroom and shoulder space.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "85mm_portrait",
    preset_type: "lens",
    title: "85mm Portrait",
    description: "Flattering portrait compression with premium face-led hierarchy.",
    preview_image_url: `${PREVIEW_BASE_PATH}/85mm_portrait.jpg`,
    preview_generation_notes: "Create an elegant portrait with flattering compression and clear face priority, distinct from 50mm and 135mm.",
    prompt_focus: "85mm flattering portrait compression",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep head and shoulders comfortably inside frame with a luxurious portrait read.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "135mm_compressed_portrait",
    preset_type: "lens",
    title: "135mm Compressed Portrait",
    description: "Tighter elegant compression with flatter perspective and refined separation.",
    preview_image_url: `${PREVIEW_BASE_PATH}/135mm_compressed_portrait.jpg`,
    preview_generation_notes: "Make the compression clearly tighter and more flattened than the 85mm preview while staying premium and graceful.",
    prompt_focus: "135mm elegant compressed portrait",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Compose tightly but intentionally with no awkward chin or crown clipping.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "macro_close_detail",
    preset_type: "lens",
    title: "Macro Close Detail",
    description: "Extreme close detail on skin/material/eye/jewelry while still intentional.",
    preview_image_url: `${PREVIEW_BASE_PATH}/macro_close_detail.jpg`,
    preview_generation_notes: "Create a macro detail composition that intentionally highlights eye, skin, fabric, or jewelry detail without reading like a broken crop.",
    prompt_focus: "intentional macro close detail",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Tight detail is intentional, but at least one key identity cue must remain elegantly readable.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
  {
    preset_id: "fisheye",
    preset_type: "lens",
    title: "Fisheye",
    description: "Tasteful stylized distortion that is clearly experimental but readable.",
    preview_image_url: `${PREVIEW_BASE_PATH}/fisheye.jpg`,
    preview_generation_notes: "Show obvious fisheye distortion while keeping Summer recognizable, premium, and fully composed for the preview frame.",
    prompt_focus: "tasteful readable fisheye distortion",
    aspect_ratio: "4:5",
    safe_margin_guidance: "Keep the face out of extreme edge clipping so distortion stays tasteful rather than broken.",
    approval_checklist: { face_framing_safe: true, preset_effect_clear: true, distinct_from_other_previews: true, intentionally_composed: true },
    gallery_approved: true,
  },
];

export function getCameraPreviewRegistryEntry(presetId: CameraDirectionPresetId) {
  return CAMERA_PREVIEW_REGISTRY.find((entry) => entry.preset_id === presetId);
}

export function isCameraPreviewApproved(entry: CameraPreviewRegistryEntry) {
  return (
    entry.gallery_approved &&
    entry.approval_checklist.face_framing_safe &&
    entry.approval_checklist.preset_effect_clear &&
    entry.approval_checklist.distinct_from_other_previews &&
    entry.approval_checklist.intentionally_composed
  );
}

export function getApprovedCameraPreviewRegistry() {
  return CAMERA_PREVIEW_REGISTRY.filter(isCameraPreviewApproved);
}
