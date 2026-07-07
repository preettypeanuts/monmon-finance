import type { TransactionType } from "@/types/transaction";

export interface JournalFilters {
  q: string;
  type: TransactionType | "all";
  category: string;
  page: number;
}

export interface JournalEntry {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  rawInput: string;
  occurredAt: Date;
}

export interface JournalEntryFormInput {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  rawInput: string;
  occurredAt: Date;
}

export interface JournalListResult {
  items: JournalEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JournalCondition {
  label: string;
}

export interface JournalDaySummary {
  /** First day of the active month shown in the widget. */
  date: Date;
  /** Month-to-date totals for the active month. */
  totalExpense: number;
  totalIncome: number;
  cumulativeBalance: number;
  /** Delta vs the previous full calendar month. */
  expenseDelta: number;
  incomeDelta: number;
  /** Delta vs cumulative balance at end of previous month. */
  balanceDelta: number;
  condition: JournalCondition;
}

export interface JournalCategoryExpenseShare {
  category: string;
  label: string;
  amount: number;
  percent: number;
}

export interface JournalCategoryExpenseBreakdown {
  totalExpense: number;
  categories: JournalCategoryExpenseShare[];
}
