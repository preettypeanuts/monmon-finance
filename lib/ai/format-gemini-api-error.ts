interface GeminiApiErrorBody {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

function readGeminiErrorBody(message: string): GeminiApiErrorBody | null {
  try {
    return JSON.parse(message) as GeminiApiErrorBody;
  } catch {
    return null;
  }
}

function formatGeminiStatusCode(status: number): string | null {
  switch (status) {
    case 400:
      return "Permintaan ke Gemini tidak valid. Coba foto ulang dengan pencahayaan lebih baik.";
    case 403:
      return "API key Gemini tidak valid. Cek GEMINI_API_KEY di .env.local.";
    case 429:
      return "Kuota Gemini habis untuk saat ini. Coba lagi beberapa menit atau cek billing di Google AI Studio.";
    case 500:
    case 503:
      return "Layanan Gemini sedang bermasalah. Coba lagi sebentar.";
    default:
      return null;
  }
}

export function formatGeminiApiError(error: unknown): string | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const status =
    typeof (error as Error & { status?: number }).status === "number"
      ? (error as Error & { status: number }).status
      : readGeminiErrorBody(error.message)?.error?.code;

  if (typeof status === "number") {
    return formatGeminiStatusCode(status);
  }

  const nestedMessage = readGeminiErrorBody(error.message)?.error?.message?.trim();
  if (nestedMessage) {
    if (nestedMessage.includes("quota")) {
      return "Kuota Gemini habis untuk saat ini. Coba lagi beberapa menit atau cek billing di Google AI Studio.";
    }

    if (nestedMessage.length <= 160) {
      return nestedMessage;
    }
  }

  return null;
}

export function isGeminiQuotaErrorMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("kuota gemini habis") ||
    normalized.includes("quota") ||
    normalized.includes("rate limit") ||
    normalized.includes("resource exhausted")
  );
}

export function buildReceiptManualFallbackNotice(error: string): string {
  if (isGeminiQuotaErrorMessage(error)) {
    return "Kuota Gemini habis — baca struk sendiri lalu isi form di bawah. Transaksi tetap bisa dicatat.";
  }

  return "AI gagal membaca struk — isi data manual di bawah sambil lihat preview.";
}
