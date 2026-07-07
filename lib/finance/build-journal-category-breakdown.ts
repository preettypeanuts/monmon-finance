import { getCategoryLabel } from "@/config/categories";
import type { JournalCategoryExpenseBreakdown } from "@/types/journal";

interface CategoryExpenseRow {
  category: string;
  amount: number;
}

export function buildJournalCategoryExpenseBreakdown(
  rows: CategoryExpenseRow[],
): JournalCategoryExpenseBreakdown {
  const totalExpense = rows.reduce((sum, row) => sum + row.amount, 0);

  if (totalExpense <= 0) {
    return { totalExpense: 0, categories: [] };
  }

  const categories = rows
    .filter((row) => row.amount > 0)
    .map((row) => ({
      category: row.category,
      label: getCategoryLabel(row.category),
      amount: row.amount,
      percent: Math.round((row.amount / totalExpense) * 100),
    }))
    .sort((left, right) => right.amount - left.amount);

  return { totalExpense, categories };
}
