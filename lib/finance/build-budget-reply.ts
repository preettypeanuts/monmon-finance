import type { TransactionCategoryId } from "@/config/categories";
import {
  getCategoryLabel,
  isIncomeCategory,
  normalizeCategory,
} from "@/config/categories";
import { getBudgetForCategory } from "@/lib/db/budgets";
import { formatIdr } from "@/lib/finance/format-currency";
import type { BudgetStatus } from "@/types/budget";

function toPeriodMonth(occurredAt: string | Date): string {
  const date =
    typeof occurredAt === "string" ? new Date(occurredAt) : occurredAt;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function getBudgetStatusForExpense(
  userId: string,
  category: string,
  occurredAt: string | Date = new Date(),
  additionalSpent = 0,
): Promise<BudgetStatus | null> {
  const normalized = normalizeCategory(category);
  if (isIncomeCategory(normalized as TransactionCategoryId)) {
    return null;
  }

  const periodMonth = toPeriodMonth(occurredAt);
  const result = await getBudgetForCategory(
    userId,
    normalized,
    periodMonth,
    additionalSpent,
  );
  return result?.status ?? null;
}

export function buildBudgetReplyContext(status: BudgetStatus): string {
  const categoryLabel = getCategoryLabel(status.budget.category);
  const remainingLabel = formatIdr(Math.max(0, status.remaining));
  const spentLabel = formatIdr(status.spent);
  const limitLabel = formatIdr(status.totalLimit);

  if (status.remaining < 0) {
    return [
      `Budget ${categoryLabel} bulan ini sudah over ${formatIdr(Math.abs(status.remaining))}.`,
      `Terpakai ${spentLabel} dari limit ${limitLabel}.`,
    ].join(" ");
  }

  if (status.remainingPercent <= 20) {
    return [
      `Budget ${categoryLabel} hampir habis — sisa ${remainingLabel} (${status.remainingPercent}% dari limit).`,
      `Sudah terpakai ${spentLabel} dari ${limitLabel}.`,
    ].join(" ");
  }

  if (status.budget.limitMode === "daily") {
    const daily = formatIdr(status.budget.dailyAmount ?? 0);
    return [
      `Budget ${categoryLabel} masih aman — sisa ${remainingLabel} (${status.remainingPercent}%).`,
      `Limit ${limitLabel} (${daily}/hari × ${status.dayCount} hari), terpakai ${spentLabel}.`,
    ].join(" ");
  }

  return [
    `Budget ${categoryLabel} masih aman — sisa ${remainingLabel} (${status.remainingPercent}%).`,
    `Limit ${limitLabel}, terpakai ${spentLabel}.`,
  ].join(" ");
}

export function formatBudgetReplySnippet(status: BudgetStatus): string {
  const categoryLabel = getCategoryLabel(status.budget.category);
  const remainingLabel = formatIdr(Math.max(0, status.remaining));
  const tone =
    status.remaining < 0
      ? "melebihi budget"
      : status.remainingPercent <= 20
        ? "hampir habis"
        : "masih aman";

  if (status.budget.limitMode === "daily") {
    const daily = formatIdr(status.budget.dailyAmount ?? 0);
    return `Budget ${categoryLabel}: sisa ${remainingLabel} (${status.remainingPercent}%) · ${daily}/hari × ${status.dayCount} hari`;
  }

  return `Budget ${categoryLabel}: sisa ${remainingLabel} (${status.remainingPercent}%) · ${tone}`;
}

export async function buildBudgetReplySnippet(
  userId: string,
  category: string,
  occurredAt: string | Date,
  amount = 0,
): Promise<string | null> {
  const status = await getBudgetStatusForExpense(
    userId,
    category,
    occurredAt,
    amount,
  );
  if (!status) {
    return null;
  }

  return formatBudgetReplySnippet(status);
}
