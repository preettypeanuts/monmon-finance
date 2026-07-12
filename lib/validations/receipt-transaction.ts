import {
  isTransactionCategory,
  normalizeCategory,
  resolveCategoryForType,
} from "@/config/categories";
import { parseAmount } from "@/lib/finance/parse-amount";
import type { ConfirmedReceiptTransaction } from "@/types/receipt";
import type { FlowTransactionType } from "@/types/transaction";

const VALID_TYPES = new Set<FlowTransactionType>(["income", "expense"]);

function buildReceiptRawInput(
  merchant: string,
  description: string,
  amount: number,
): string {
  const merchantLabel = merchant.trim() || "Struk";
  const descriptionLabel = description.trim() || merchantLabel;
  return `[Struk] ${merchantLabel} — ${descriptionLabel} (${amount})`;
}

function parseOccurredAt(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return new Date().toISOString();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function parsePositiveInteger(value: string): number | null {
  const amount = parseAmount(value.trim());
  if (amount === null || !Number.isInteger(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

export function parseConfirmedReceiptTransaction(input: {
  type: string;
  amount: string;
  category: string;
  description: string;
  merchant: string;
  occurredAt: string;
}):
  | { ok: true; data: ConfirmedReceiptTransaction }
  | { ok: false; error: string } {
  const type = input.type.trim() as FlowTransactionType;

  if (!VALID_TYPES.has(type)) {
    return { ok: false, error: "Jenis transaksi tidak valid." };
  }

  const amount = parsePositiveInteger(input.amount);
  if (amount === null) {
    return {
      ok: false,
      error: "Nominal struk harus angka bulat lebih dari 0.",
    };
  }

  const description = input.description.trim();
  if (!description) {
    return { ok: false, error: "Deskripsi transaksi wajib diisi." };
  }

  const merchant = input.merchant.trim();
  const category = resolveCategoryForType(
    normalizeCategory(input.category),
    type,
  );

  if (!isTransactionCategory(category)) {
    return { ok: false, error: "Kategori tidak valid." };
  }

  const occurredAt = parseOccurredAt(input.occurredAt);
  if (!occurredAt) {
    return { ok: false, error: "Tanggal transaksi tidak valid." };
  }

  return {
    ok: true,
    data: {
      type,
      amount,
      category,
      description,
      merchant,
      occurredAt,
      rawInput: buildReceiptRawInput(merchant, description, amount),
    },
  };
}

export function buildReceiptUserMessageContent(
  merchant: string,
  description: string,
): string {
  const merchantLabel = merchant.trim() || "Struk";
  const descriptionLabel = description.trim();
  const detail = descriptionLabel ? ` · ${descriptionLabel}` : "";
  return `📄 Struk ${merchantLabel}${detail}`;
}
