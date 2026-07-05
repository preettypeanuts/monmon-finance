export type BudgetLimitMode = "daily" | "fixed";

export interface CategoryBudgetRecord {
  id: string;
  category: string;
  periodMonth: string;
  limitMode: BudgetLimitMode;
  dailyAmount: number | null;
  fixedLimit: number | null;
  dayCount: number | null;
  note: string | null;
  repeatNextMonth: boolean;
}

export interface BudgetStatus {
  budget: CategoryBudgetRecord;
  categoryLabel: string;
  periodMonth: string;
  dayCount: number;
  totalLimit: number;
  spent: number;
  remaining: number;
  usedPercent: number;
  remainingPercent: number;
}

export interface CategoryBudgetFormInput {
  category: string;
  periodMonth: string;
  limitMode: BudgetLimitMode;
  dailyAmount?: number;
  fixedLimit?: number;
  dayCount?: number;
  note?: string;
  repeatNextMonth?: boolean;
}
