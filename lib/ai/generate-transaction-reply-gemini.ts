import { getCategoryLabel } from "@/config/categories";
import {
  GEMINI_INBOX_REPLY_MAX_OUTPUT_TOKENS,
  GEMINI_MODEL,
} from "@/config/gemini";
import {
  GEMINI_INBOX_ASSISTANT_PERSONALITY,
  GEMINI_WANG_APP_CONTEXT,
} from "@/config/gemini-locale";
import { getGeminiClient } from "@/lib/ai/gemini-client";
import { buildBudgetReplyContext } from "@/lib/finance/build-budget-reply";
import { formatIdr } from "@/lib/finance/format-currency";
import type { BudgetStatus } from "@/types/budget";
import type { ParsedTransaction } from "@/types/transaction";

const SYSTEM_INSTRUCTION = [
  GEMINI_WANG_APP_CONTEXT,
  "",
  GEMINI_INBOX_ASSISTANT_PERSONALITY,
].join("\n");

function buildUserPrompt(
  rawInput: string,
  transaction: ParsedTransaction,
  budgetStatus: BudgetStatus | null,
): string {
  const typeLabel = transaction.type === "income" ? "pemasukan" : "pengeluaran";
  const categoryLabel = getCategoryLabel(transaction.category);
  const lines = [
    "User mengetik di inbox:",
    rawInput.trim(),
    "",
    "Transaksi yang sudah berhasil dicatat:",
    `- Jenis: ${typeLabel}`,
    `- Nominal: ${formatIdr(transaction.amount)}`,
    `- Kategori: ${categoryLabel} (${transaction.category})`,
    `- Deskripsi: ${transaction.description}`,
  ];

  if (budgetStatus) {
    lines.push(
      "",
      "Info budget terkait:",
      buildBudgetReplyContext(budgetStatus),
    );
  }

  lines.push(
    "",
    "Tulis balasan chat sebagai asisten Wang — konfirmasi pencatatan + info penting (termasuk budget jika ada).",
  );

  return lines.join("\n");
}

function normalizeReply(text: string): string {
  return text
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\n{3,}/g, "\n\n");
}

export async function generateTransactionReplyWithGemini(
  rawInput: string,
  transaction: ParsedTransaction,
  budgetStatus: BudgetStatus | null,
): Promise<string> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildUserPrompt(rawInput, transaction, budgetStatus),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      maxOutputTokens: GEMINI_INBOX_REPLY_MAX_OUTPUT_TOKENS,
      temperature: 0.75,
    },
  });

  const raw = response.text?.trim();

  if (!raw) {
    throw new Error("Gemini tidak memberi balasan.");
  }

  return normalizeReply(raw);
}
