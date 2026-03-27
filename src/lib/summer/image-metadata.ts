type ImageDimensions = {
  width: number | null;
  height: number | null;
};

function readUInt16(buffer: Uint8Array, offset: number) {
  return (buffer[offset] << 8) | buffer[offset + 1];
}

function readUInt32(buffer: Uint8Array, offset: number) {
  return (buffer[offset] << 24) | (buffer[offset + 1] << 16) | (buffer[offset + 2] << 8) | buffer[offset + 3];
}

function readJpegDimensions(buffer: Uint8Array): ImageDimensions {
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const size = readUInt16(buffer, offset + 2);
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        height: readUInt16(buffer, offset + 5),
        width: readUInt16(buffer, offset + 7),
      };
    }

    offset += 2 + size;
  }

  return { width: null, height: null };
}

function readPngDimensions(buffer: Uint8Array): ImageDimensions {
  return {
    width: readUInt32(buffer, 16),
    height: readUInt32(buffer, 20),
  };
}

export function getImageDimensions(bytes: Uint8Array, mimeType: string): ImageDimensions {
  if (mimeType === "image/png" && bytes.length >= 24) {
    return readPngDimensions(bytes);
  }

  if (mimeType === "image/jpeg" && bytes.length >= 4) {
    return readJpegDimensions(bytes);
  }

  return { width: null, height: null };
}

export function deriveAspectRatio(width: number | null, height: number | null) {
  if (!width || !height) {
    return null;
  }

  const ratio = width / height;
  const candidates = [
    ["16:9", 16 / 9],
    ["4:5", 4 / 5],
    ["3:4", 3 / 4],
    ["1:1", 1],
    ["3:2", 3 / 2],
    ["2:3", 2 / 3],
    ["9:16", 9 / 16],
  ] as const;

  const closest = candidates.reduce((best, current) => {
    return Math.abs(current[1] - ratio) < Math.abs(best[1] - ratio) ? current : best;
  });

  return closest[0];
}
