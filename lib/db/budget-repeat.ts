import type { CategoryBudgetFormInput } from "@/types/budget";

export function toBudgetWriteData(input: CategoryBudgetFormInput) {
  return {
    category: input.category,
    periodMonth: input.periodMonth,
    limitMode: input.limitMode,
    dailyAmount: input.limitMode === "daily" ? input.dailyAmount : null,
    fixedLimit: input.limitMode === "fixed" ? input.fixedLimit : null,
    dayCount: input.limitMode === "daily" ? (input.dayCount ?? null) : null,
    note: input.note?.trim() || null,
    repeatNextMonth: input.repeatNextMonth ?? false,
  };
}

export function toNextMonthBudgetInput(
  input: CategoryBudgetFormInput,
  nextPeriodMonth: string,
): CategoryBudgetFormInput {
  return {
    ...input,
    periodMonth: nextPeriodMonth,
    repeatNextMonth: true,
  };
}
