export const RECEIPT_MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
export const RECEIPT_MAX_EDGE_PX = 1280;
export const RECEIPT_OUTPUT_QUALITY = 0.85;

export const RECEIPT_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ReceiptMimeType = (typeof RECEIPT_ACCEPTED_MIME_TYPES)[number];

export const RECEIPT_ACCEPT_ATTRIBUTE = RECEIPT_ACCEPTED_MIME_TYPES.join(",");
