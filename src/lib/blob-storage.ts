type BlobUploadResult = {
  url: string;
  downloadUrl?: string;
  pathname: string;
  contentType?: string;
  contentDisposition?: string;
};

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_API_BASE = process.env.BLOB_API_BASE || "https://blob.vercel-storage.com";

export function isBlobStorageConfigured() {
  return Boolean(BLOB_READ_WRITE_TOKEN);
}

async function uploadToBlob(pathname: string, body: BodyInit, contentType: string) {
  if (!BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN environment variable.");
  }

  const response = await fetch(`${BLOB_API_BASE}/${pathname}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`,
      "x-content-type": contentType,
      "x-add-random-suffix": "1",
      "access-control-allow-origin": "*",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Blob upload failed with status ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as BlobUploadResult;
}

export async function uploadBinaryAsset(pathname: string, bytes: Buffer | Uint8Array, contentType: string) {
  return uploadToBlob(pathname, new Blob([new Uint8Array(bytes)], { type: contentType }), contentType);
}

export async function uploadJsonAsset(pathname: string, value: unknown) {
  return uploadToBlob(pathname, JSON.stringify(value, null, 2), "application/json");
}
