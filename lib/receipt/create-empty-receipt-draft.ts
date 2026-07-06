import type { ReceiptDraft } from "@/types/receipt";

export function createEmptyReceiptDraft(): ReceiptDraft {
  return {
    type: "expense",
    amount: 0,
    category: "food",
    description: "",
    merchant: "",
    occurredAt: new Date().toISOString(),
    rawInput: "",
  };
}
