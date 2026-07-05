import { getCategoryLabel } from "@/config/categories";
import { getDaysInMonth, parseMonthKey } from "@/lib/planner/calendar";
import type { BudgetStatus, CategoryBudgetRecord } from "@/types/budget";

export function getBudgetDayCount(
  budget: Pick<CategoryBudgetRecord, "dayCount">,
  periodMonth: string,
): number {
  if (budget.dayCount && budget.dayCount > 0) {
    return budget.dayCount;
  }

  const parsed = parseMonthKey(periodMonth);
  if (!parsed) {
    return 30;
  }

  return getDaysInMonth(parsed.year, parsed.month);
}

export function computeBudgetTotalLimit(
  budget: Pick<
    CategoryBudgetRecord,
    "limitMode" | "dailyAmount" | "fixedLimit" | "dayCount"
  >,
  periodMonth: string,
): number {
  if (budget.limitMode === "fixed") {
    return budget.fixedLimit ?? 0;
  }

  const dailyAmount = budget.dailyAmount ?? 0;
  const days = getBudgetDayCount(budget, periodMonth);
  return dailyAmount * days;
}

export function buildBudgetStatus(
  budget: CategoryBudgetRecord,
  spent: number,
): BudgetStatus {
  const totalLimit = computeBudgetTotalLimit(budget, budget.periodMonth);
  const remaining = totalLimit - spent;
  const usedPercent =
    totalLimit > 0 ? Math.min(100, Math.round((spent / totalLimit) * 100)) : 0;
  const remainingPercent = Math.max(0, 100 - usedPercent);

  return {
    budget,
    categoryLabel: getCategoryLabel(budget.category),
    periodMonth: budget.periodMonth,
    dayCount: getBudgetDayCount(budget, budget.periodMonth),
    totalLimit,
    spent,
    remaining,
    usedPercent,
    remainingPercent,
  };
}
