import {
  RECEIPT_MAX_EDGE_PX,
  RECEIPT_MAX_FILE_SIZE_BYTES,
  RECEIPT_OUTPUT_QUALITY,
  type ReceiptMimeType,
} from "@/config/receipt";
import { isReceiptImageFile } from "@/lib/receipt/image-file";

export class ReceiptImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReceiptImageError";
  }
}

export interface ProcessedReceiptImage {
  base64: string;
  mimeType: ReceiptMimeType;
  previewUrl: string;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new ReceiptImageError("Gagal membaca gambar struk."));
    image.src = objectUrl;
  }).finally(() => {
    URL.revokeObjectURL(objectUrl);
  });
}

function scaleDimensions(
  width: number,
  height: number,
  maxEdge: number,
): { width: number; height: number } {
  const largestEdge = Math.max(width, height);

  if (largestEdge <= maxEdge) {
    return { width, height };
  }

  const scale = maxEdge / largestEdge;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function encodeReceiptImage(image: HTMLImageElement): {
  base64: string;
  previewUrl: string;
} {
  const { width, height } = scaleDimensions(
    image.naturalWidth,
    image.naturalHeight,
    RECEIPT_MAX_EDGE_PX,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new ReceiptImageError("Browser tidak mendukung pemrosesan gambar.");
  }

  context.drawImage(image, 0, 0, width, height);
  const previewUrl = canvas.toDataURL("image/jpeg", RECEIPT_OUTPUT_QUALITY);
  const base64 = previewUrl.split(",")[1];

  if (!base64) {
    throw new ReceiptImageError("Gagal memproses gambar struk.");
  }

  return { base64, previewUrl };
}

export async function processReceiptImageFile(
  file: File,
): Promise<ProcessedReceiptImage> {
  if (!isReceiptImageFile(file)) {
    throw new ReceiptImageError("Format struk harus JPG, PNG, atau WebP.");
  }

  if (file.size > RECEIPT_MAX_FILE_SIZE_BYTES) {
    throw new ReceiptImageError("Ukuran struk maksimal 8 MB.");
  }

  const image = await loadImageFromFile(file);
  const { base64, previewUrl } = encodeReceiptImage(image);

  return {
    base64,
    mimeType: "image/jpeg",
    previewUrl,
  };
}
