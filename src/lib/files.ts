export const MAX_INLINE_DATA_BYTES = 300 * 1024;
export const MAX_IMAGE_DIMENSION = 800;

export interface PreparedUploadFile {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
  previewOmitted: boolean;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function estimateDataUrlBytes(dataUrl: string): number {
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return dataUrl.length;
  const base64Part = dataUrl.slice(commaIdx + 1);
  return Math.ceil((base64Part.length * 3) / 4);
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

function resizeImageToDataUrl(file: Blob, mimeType: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    img.onload = () => {
      try {
        const { naturalWidth, naturalHeight } = img;
        if (!naturalWidth || !naturalHeight) {
          cleanup();
          resolve(undefined);
          return;
        }

        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(naturalWidth, naturalHeight));
        const targetW = Math.max(1, Math.round(naturalWidth * scale));
        const targetH = Math.max(1, Math.round(naturalHeight * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(undefined);
          return;
        }

        ctx.drawImage(img, 0, 0, targetW, targetH);

        const preferredMime = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
        let encoded =
          preferredMime === 'image/png'
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.82);

        if (encoded.length > MAX_INLINE_DATA_BYTES) {
          encoded = canvas.toDataURL('image/jpeg', 0.72);
        }
        if (encoded.length > MAX_INLINE_DATA_BYTES) {
          encoded = canvas.toDataURL('image/jpeg', 0.55);
        }

        cleanup();
        resolve(encoded.length <= MAX_INLINE_DATA_BYTES ? encoded : undefined);
      } catch {
        cleanup();
        resolve(undefined);
      }
    };

    img.onerror = () => {
      cleanup();
      resolve(undefined);
    };

    img.src = objectUrl;
  });
}

/**
 * Prepares a user-selected File for localStorage persistence:
 * - Images are downscaled to at most 800px before checking the 300KB ceiling.
 * - Non-image files under 300KB keep their base64 data URL.
 * - Oversized files omit `dataUrl` and store metadata only with `previewOmitted: true`.
 */
export async function prepareUploadedFile(file: File): Promise<PreparedUploadFile> {
  const mime = file.type || 'application/octet-stream';
  const baseMeta = {
    name: file.name,
    type: mime,
    size: file.size,
  };

  if (mime.startsWith('image/') && typeof document !== 'undefined' && typeof Image !== 'undefined') {
    const resized = await resizeImageToDataUrl(file, mime);
    if (resized) {
      return {
        ...baseMeta,
        dataUrl: resized,
        previewOmitted: false,
      };
    }
    return {
      ...baseMeta,
      previewOmitted: true,
    };
  }

  if (file.size < MAX_INLINE_DATA_BYTES && typeof FileReader !== 'undefined') {
    try {
      const dataUrl = await readAsDataUrl(file);
      if (dataUrl.length <= MAX_INLINE_DATA_BYTES * 1.38) {
        return {
          ...baseMeta,
          dataUrl,
          previewOmitted: false,
        };
      }
    } catch {
      // Fall through to metadata-only
    }
  }

  return {
    ...baseMeta,
    previewOmitted: true,
  };
}

