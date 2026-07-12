import { isFlowTransactionType } from "@/lib/db/transaction-flow-filter";

interface DailySummarySignatureTransaction {
  type: string;
  amount: number;
}

export function buildDailySummarySignature(
  transactions: DailySummarySignatureTransaction[],
): string {
  let totalExpense = 0;
  let totalIncome = 0;
  let counted = 0;

  for (const transaction of transactions) {
    if (!isFlowTransactionType(transaction.type)) {
      continue;
    }

    counted += 1;

    if (transaction.type === "income") {
      totalIncome += transaction.amount;
      continue;
    }

    totalExpense += transaction.amount;
  }

  return `${counted}:${totalExpense}:${totalIncome}`;
}
