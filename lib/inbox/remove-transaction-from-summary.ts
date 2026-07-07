import { getCategoryLabel } from "@/config/categories";
import type { TodaySummary } from "@/types/summary";
import type { ParsedTransaction } from "@/types/transaction";

/** Client-side today summary patch after a journal/inbox transaction is removed. */
export function removeTransactionFromSummary(
  summary: TodaySummary,
  transaction: ParsedTransaction,
): TodaySummary {
  if (transaction.type === "income") {
    return {
      ...summary,
      totalIncome: Math.max(0, summary.totalIncome - transaction.amount),
      balance: summary.balance - transaction.amount,
    };
  }

  const categories = summary.categories
    .map((item) => {
      if (item.category !== transaction.category) {
        return item;
      }

      return {
        ...item,
        total: item.total - transaction.amount,
        count: item.count - 1,
      };
    })
    .filter((item) => item.count > 0 && item.total > 0);

  return {
    totalIncome: summary.totalIncome,
    totalExpense: Math.max(0, summary.totalExpense - transaction.amount),
    balance: summary.balance + transaction.amount,
    categories,
  };
}
