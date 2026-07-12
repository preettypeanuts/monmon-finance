import type { TransactionType as PrismaTransactionType } from "@/generated/prisma/client";

/** Prisma-aligned — includes transfer for wallet moves. */
export type TransactionType = PrismaTransactionType;

/** Income/expense flows — excludes wallet transfers. */
export type FlowTransactionType = Extract<TransactionType, "income" | "expense">;

export interface ParsedTransaction {
  id?: string;
  type: FlowTransactionType;
  amount: number;
  category: string;
  description: string;
  occurredAt: string;
}
