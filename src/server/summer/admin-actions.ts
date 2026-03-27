"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { uploadBinaryAsset } from "@/lib/blob-storage";
import { clearSummerAdminSession, loginSummerAdmin, requireSummerAdminSession } from "@/lib/summer/admin-auth";
import { deriveAspectRatio, getImageDimensions } from "@/lib/summer/image-metadata";
import { deleteSummerRows, insertSummerRows, selectSummerSingle, updateSummerRows, upsertSummerRows } from "@/lib/summer/supabase";
import type { SummerImageOutput, SummerInquiry, SummerMediaAsset } from "@/lib/summer/types";

function booleanFromFormData(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(typeof value === "string" ? value : "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function redirectWithResult(path: string, result: string): never {
  redirect(`${path}?result=${encodeURIComponent(result)}`);
}

export async function adminLoginAction(formData: FormData) {
  const email = stringValue(formData.get("email")).toLowerCase();
  const password = stringValue(formData.get("password"));

  if (!email || !password) {
    redirect("/admin/login?error=Missing%20email%20or%20password");
  }

  try {
    await loginSummerAdmin(email, password);
    redirect("/admin");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    redirect(`/admin/login?error=${encodeURIComponent(message)}`);
  }
}

export async function adminLogoutAction() {
  await clearSummerAdminSession();
  redirect("/admin/login");
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireSummerAdminSession();

  const existing = await selectSummerSingle<{ id: string }>("site_settings", { order: "updated_at.desc" });
  const payload = {
    site_title: stringValue(formData.get("site_title")) || null,
    hero_heading: stringValue(formData.get("hero_heading")) || null,
    hero_subheading: stringValue(formData.get("hero_subheading")) || null,
    primary_cta_label: stringValue(formData.get("primary_cta_label")) || null,
    primary_cta_href: stringValue(formData.get("primary_cta_href")) || null,
    secondary_cta_label: stringValue(formData.get("secondary_cta_label")) || null,
    secondary_cta_href: stringValue(formData.get("secondary_cta_href")) || null,
    contact_email: stringValue(formData.get("contact_email")) || null,
    instagram_url: stringValue(formData.get("instagram_url")) || null,
    training_cta_text: stringValue(formData.get("training_cta_text")) || null,
    booking_cta_text: stringValue(formData.get("booking_cta_text")) || null,
  };

  if (existing?.id) {
    await updateSummerRows("site_settings", { id: `eq.${existing.id}` }, payload);
  } else {
    await insertSummerRows("site_settings", [payload]);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirectWithResult("/admin/settings", "settings-saved");
}

export async function saveSectionContentAction(formData: FormData) {
  await requireSummerAdminSession();

  const id = stringValue(formData.get("id"));
  const sectionKey = stringValue(formData.get("section_key"));
  const payload = {
    section_key: sectionKey,
    eyebrow: stringValue(formData.get("eyebrow")) || null,
    heading: stringValue(formData.get("heading")) || null,
    subheading: stringValue(formData.get("subheading")) || null,
    body: {
      paragraphs: linesToArray(stringValue(formData.get("paragraphs"))),
      points: linesToArray(stringValue(formData.get("points"))),
      pillars: linesToArray(stringValue(formData.get("pillars"))),
      lead_card: stringValue(formData.get("lead_card")) || null,
      availability_note: stringValue(formData.get("availability_note")) || stringValue(formData.get("lead_card")) || null,
    },
    is_visible: booleanFromFormData(formData.get("is_visible")),
    sort_order: numberValue(formData.get("sort_order"), 0),
  };

  if (id) {
    await updateSummerRows("section_content", { id: `eq.${id}` }, payload);
  } else {
    await insertSummerRows("section_content", [payload]);
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  redirectWithResult("/admin/content", `${sectionKey}-saved`);
}

export async function saveOfferAction(formData: FormData) {
  await requireSummerAdminSession();

  const id = stringValue(formData.get("id"));
  const payload = {
    slug: stringValue(formData.get("slug")),
    title: stringValue(formData.get("title")),
    subtitle: stringValue(formData.get("subtitle")) || null,
    description: stringValue(formData.get("description")) || null,
    bullets: linesToArray(stringValue(formData.get("bullets"))),
    cta_label: stringValue(formData.get("cta_label")) || null,
    cta_href: stringValue(formData.get("cta_href")) || null,
    badge: stringValue(formData.get("badge")) || null,
    is_featured: booleanFromFormData(formData.get("is_featured")),
    is_visible: booleanFromFormData(formData.get("is_visible")),
    sort_order: numberValue(formData.get("sort_order"), 0),
  };

  if (id) {
    await updateSummerRows("offers", { id: `eq.${id}` }, payload);
  } else {
    await insertSummerRows("offers", [payload]);
  }

  revalidatePath("/");
  revalidatePath("/admin/offers");
  redirectWithResult("/admin/offers", "offer-saved");
}

export async function deleteOfferAction(formData: FormData) {
  await requireSummerAdminSession();
  const id = stringValue(formData.get("id"));

  if (id) {
    await deleteSummerRows("offers", { id: `eq.${id}` });
  }

  revalidatePath("/");
  revalidatePath("/admin/offers");
  redirectWithResult("/admin/offers", "offer-deleted");
}

export async function uploadMediaAssetAction(formData: FormData) {
  await requireSummerAdminSession();

  const fileEntry = formData.get("file");

  if (!(fileEntry instanceof File) || !fileEntry.size) {
    redirectWithResult("/admin/media", "missing-file");
  }

  const file = fileEntry;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const title = stringValue(formData.get("title")) || file.name;
  const slug = stringValue(formData.get("slug")) || title.toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
  const pathname = `summer-admin/${slug}-${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
  const uploaded = await uploadBinaryAsset(pathname, bytes, file.type || "application/octet-stream");
  const dimensions = getImageDimensions(bytes, file.type || "application/octet-stream");

  await insertSummerRows("media_assets", [
    {
      title,
      slug,
      category: stringValue(formData.get("category")) || null,
      section_key: stringValue(formData.get("section_key")) || null,
      file_path: uploaded.pathname,
      public_url: uploaded.url,
      mime_type: file.type || null,
      width: dimensions.width,
      height: dimensions.height,
      aspect_ratio: deriveAspectRatio(dimensions.width, dimensions.height),
      source_type: "admin_upload",
      alt_text: stringValue(formData.get("alt_text")) || null,
      tags: linesToArray(stringValue(formData.get("tags"))),
      metadata: { downloadUrl: uploaded.downloadUrl || null },
      is_approved: booleanFromFormData(formData.get("is_approved")),
      is_visible: booleanFromFormData(formData.get("is_visible")) || true,
      sort_order: numberValue(formData.get("sort_order"), 0),
    },
  ]);

  revalidatePath("/admin/media");
  redirectWithResult("/admin/media", "media-uploaded");
}

export async function updateMediaAssetAction(formData: FormData) {
  await requireSummerAdminSession();
  const id = stringValue(formData.get("id"));

  if (!id) {
    redirectWithResult("/admin/media", "missing-id");
  }

  await updateSummerRows(
    "media_assets",
    { id: `eq.${id}` },
    {
      title: stringValue(formData.get("title")) || null,
      category: stringValue(formData.get("category")) || null,
      section_key: stringValue(formData.get("section_key")) || null,
      alt_text: stringValue(formData.get("alt_text")) || null,
      tags: linesToArray(stringValue(formData.get("tags"))),
      is_approved: booleanFromFormData(formData.get("is_approved")),
      is_visible: booleanFromFormData(formData.get("is_visible")),
      sort_order: numberValue(formData.get("sort_order"), 0),
    },
  );

  revalidatePath("/admin/media");
  revalidatePath("/");
  redirectWithResult("/admin/media", "media-saved");
}

export async function saveHeroItemAction(formData: FormData) {
  await requireSummerAdminSession();
  const id = stringValue(formData.get("id"));
  const payload = {
    title: stringValue(formData.get("title")) || null,
    desktop_media_asset_id: stringValue(formData.get("desktop_media_asset_id")) || null,
    mobile_media_asset_id: stringValue(formData.get("mobile_media_asset_id")) || null,
    is_visible: booleanFromFormData(formData.get("is_visible")),
    sort_order: numberValue(formData.get("sort_order"), 0),
  };

  if (id) {
    await updateSummerRows("hero_items", { id: `eq.${id}` }, payload);
  } else {
    await insertSummerRows("hero_items", [payload]);
  }

  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirectWithResult("/admin/hero", "hero-saved");
}

export async function saveGalleryItemAction(formData: FormData) {
  await requireSummerAdminSession();
  const id = stringValue(formData.get("id"));
  const payload = {
    media_asset_id: stringValue(formData.get("media_asset_id")) || null,
    title: stringValue(formData.get("title")) || null,
    category: stringValue(formData.get("category")) || null,
    layout_size: stringValue(formData.get("layout_size")) || "wide",
    is_visible: booleanFromFormData(formData.get("is_visible")),
    sort_order: numberValue(formData.get("sort_order"), 0),
  };

  if (id) {
    await updateSummerRows("gallery_items", { id: `eq.${id}` }, payload);
  } else {
    await insertSummerRows("gallery_items", [payload]);
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirectWithResult("/admin/gallery", "gallery-saved");
}

export async function updateInquiryStatusAction(formData: FormData) {
  const session = await requireSummerAdminSession();
  const inquiryId = stringValue(formData.get("inquiry_id"));
  const status = stringValue(formData.get("status")) || "new";

  await updateSummerRows<SummerInquiry>("inquiries", { id: `eq.${inquiryId}` }, { status });

  revalidatePath("/admin/inquiries");
  redirectWithResult(`/admin/inquiries/${inquiryId}`, `${session.adminUser.email}-status-updated`);
}

export async function addInquiryNoteAction(formData: FormData) {
  const session = await requireSummerAdminSession();
  const inquiryId = stringValue(formData.get("inquiry_id"));
  const body = stringValue(formData.get("body"));

  if (!body) {
    redirectWithResult(`/admin/inquiries/${inquiryId}`, "missing-note");
  }

  await insertSummerRows("inquiry_notes", [
    {
      inquiry_id: inquiryId,
      body,
      author_email: session.adminUser.email,
    },
  ]);

  const inquiry = await selectSummerSingle<SummerInquiry>("inquiries", { id: `eq.${inquiryId}` });
  await updateSummerRows("inquiries", { id: `eq.${inquiryId}` }, { notes_count: (inquiry?.notes_count || 0) + 1 });

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  redirectWithResult(`/admin/inquiries/${inquiryId}`, "note-added");
}

export async function approveImageOutputAction(formData: FormData) {
  await requireSummerAdminSession();
  const outputId = stringValue(formData.get("output_id"));
  await updateSummerRows<SummerImageOutput>("image_outputs", { id: `eq.${outputId}` }, { is_approved: true });
  revalidatePath("/admin/image-studio");
  redirectWithResult("/admin/image-studio", "output-approved");
}

export async function saveImageOutputToMediaAction(formData: FormData) {
  await requireSummerAdminSession();
  const outputId = stringValue(formData.get("output_id"));
  const output = await selectSummerSingle<SummerImageOutput>("image_outputs", { id: `eq.${outputId}` });

  if (!output) {
    redirectWithResult("/admin/image-studio", "missing-output");
  }

  const title = stringValue(formData.get("title")) || output.title || "Approved output";
  const slug = stringValue(formData.get("slug")) || title.toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
  const rows = await upsertSummerRows<SummerMediaAsset>(
    "media_assets",
    [
      {
        slug,
        title,
        category: stringValue(formData.get("category")) || null,
        section_key: stringValue(formData.get("section_key")) || null,
        file_path: output.output_path || output.public_url || slug,
        public_url: output.public_url || null,
        aspect_ratio: output.aspect_ratio || null,
        source_type: "image_output",
        alt_text: stringValue(formData.get("alt_text")) || title,
        tags: linesToArray(stringValue(formData.get("tags"))),
        metadata: output.metadata || {},
        is_approved: true,
        is_visible: true,
        sort_order: numberValue(formData.get("sort_order"), 0),
      },
    ],
    "slug",
  );

  const mediaAsset = rows?.[0];

  if (mediaAsset?.id) {
    await updateSummerRows("image_outputs", { id: `eq.${outputId}` }, { media_asset_id: mediaAsset.id, is_approved: true });
  }

  revalidatePath("/admin/image-studio");
  revalidatePath("/admin/media");
  revalidatePath("/");
  redirectWithResult("/admin/image-studio", "output-saved-to-media");
}
