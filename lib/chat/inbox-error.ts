import { formatGeminiApiError } from "@/lib/ai/format-gemini-api-error";
import { isTransactionParseError } from "@/lib/ai/transaction-parse-error";
import type { ChatMessage } from "@/types/chat";

const GENERIC_INBOX_ERROR =
  "Ups, ada yang error nih. Coba kirim ulang pesannya ya~";

export function formatInboxProcessingError(error: unknown): string {
  if (isTransactionParseError(error)) {
    return error.message;
  }

  const geminiError = formatGeminiApiError(error);
  if (geminiError) {
    return geminiError;
  }

  if (error instanceof Error) {
    if (error.message.includes("API key")) {
      return "Gemini belum dikonfigurasi. Tambahkan GEMINI_API_KEY di .env.local.";
    }

    if (error.message.includes("DATABASE_URL")) {
      return "Database belum dikonfigurasi. Cek DATABASE_URL di .env.";
    }

    if (
      /body exceeded|payload too large|request entity too large/i.test(
        error.message,
      )
    ) {
      return "Gambar struk terlalu besar. Coba foto lebih dekat atau resolusi lebih kecil.";
    }

    if (error.message.length > 0 && error.message.length <= 160) {
      return error.message;
    }
  }

  return GENERIC_INBOX_ERROR;
}

export function isRetryableInboxFailure(content: string): boolean {
  if (content.includes("ditandai sudah dibayar")) {
    return false;
  }

  if (content.includes("ditandai sudah dibeli")) {
    return false;
  }

  if (content.startsWith("Ringkasan harian")) {
    return false;
  }

  return true;
}

export function getInboxRetryContext(
  messages: ChatMessage[],
  index: number,
): { userContent: string; assistantMessageId: string } | null {
  const message = messages[index];

  if (message.role !== "assistant" || message.transaction) {
    return null;
  }

  const previous = messages[index - 1];

  if (!previous || previous.role !== "user") {
    return null;
  }

  if (previous.content.startsWith("Bayar ")) {
    return null;
  }

  if (!isRetryableInboxFailure(message.content)) {
    return null;
  }

  return {
    userContent: previous.content,
    assistantMessageId: message.id,
  };
}
