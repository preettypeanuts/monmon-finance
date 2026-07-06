import {
  RECEIPT_ACCEPTED_MIME_TYPES,
  type ReceiptMimeType,
} from "@/config/receipt";

export function isReceiptMimeType(
  mimeType: string,
): mimeType is ReceiptMimeType {
  return RECEIPT_ACCEPTED_MIME_TYPES.includes(mimeType as ReceiptMimeType);
}

export function isReceiptImageFile(file: File): boolean {
  return isReceiptMimeType(file.type);
}

export function hasReceiptImageInDataTransfer(
  dataTransfer: DataTransfer,
): boolean {
  if (dataTransfer.types.includes("Files")) {
    return Array.from(dataTransfer.items).some(
      (item) => item.kind === "file" && isReceiptMimeType(item.type),
    );
  }

  return false;
}

export function getReceiptImageFromDataTransfer(
  dataTransfer: DataTransfer,
): File | null {
  const file = dataTransfer.files.item(0);
  if (!file || !isReceiptImageFile(file)) {
    return null;
  }

  return file;
}
