import type { TransactionCategoryId } from "@/config/categories";
import type { TransactionType } from "@/types/transaction";

export interface ReceiptDraft {
  type: TransactionType;
  amount: number;
  category: TransactionCategoryId;
  description: string;
  merchant: string;
  occurredAt: string;
  rawInput: string;
}

export type ParseReceiptResult =
  | { ok: true; draft: ReceiptDraft }
  | { ok: false; error: string };

export interface ConfirmedReceiptTransaction {
  type: TransactionType;
  amount: number;
  category: TransactionCategoryId;
  description: string;
  merchant: string;
  occurredAt: string;
  rawInput: string;
}
