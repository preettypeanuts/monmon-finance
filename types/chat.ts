import type { ParsedTransaction } from "@/types/transaction";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  transaction?: ParsedTransaction;
}

export interface UnpaidPayPlanChatItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  statusLabel: string;
  installmentIndex: number;
}

export interface ActivePlanChatItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

export type ChatSlashEntry =
  | { kind: "payplan"; item: UnpaidPayPlanChatItem }
  | { kind: "plan"; item: ActivePlanChatItem };
