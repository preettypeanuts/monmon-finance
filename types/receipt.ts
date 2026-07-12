import type { FlowTransactionType } from "@/types/transaction";

export interface ReceiptDraft {
  type: FlowTransactionType;
  amount: number;
  category: string;
  description: string;
  merchant: string;
  occurredAt: string;
  rawInput: string;
}

export type ParseReceiptResult =
  | { ok: true; draft: ReceiptDraft }
  | { ok: false; error: string };

export interface ConfirmedReceiptTransaction {
  type: FlowTransactionType;
  amount: number;
  category: string;
  description: string;
  merchant: string;
  occurredAt: string;
  rawInput: string;
}
