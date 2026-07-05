import { normalizeCategory } from "@/config/categories";
import type { Prisma } from "@/generated/prisma/client";
import {
  toBudgetWriteData,
  toNextMonthBudgetInput,
} from "@/lib/db/budget-repeat";
import { prisma } from "@/lib/db/prisma";
import { buildBudgetStatus } from "@/lib/finance/compute-budget-status";
import {
  getMonthRange,
  parseMonthKey,
  shiftMonthKey,
} from "@/lib/planner/calendar";
import type {
  BudgetStatus,
  CategoryBudgetFormInput,
  CategoryBudgetRecord,
} from "@/types/budget";

const BUDGET_SELECT = {
  id: true,
  category: true,
  periodMonth: true,
  limitMode: true,
  dailyAmount: true,
  fixedLimit: true,
  dayCount: true,
  note: true,
  repeatNextMonth: true,
} as const;

function mapBudget(record: {
  id: string;
  category: string;
  periodMonth: string;
  limitMode: "daily" | "fixed";
  dailyAmount: number | null;
  fixedLimit: number | null;
  dayCount: number | null;
  note: string | null;
  repeatNextMonth: boolean;
}): CategoryBudgetRecord {
  return {
    id: record.id,
    category: record.category,
    periodMonth: record.periodMonth,
    limitMode: record.limitMode,
    dailyAmount: record.dailyAmount,
    fixedLimit: record.fixedLimit,
    dayCount: record.dayCount,
    note: record.note,
    repeatNextMonth: record.repeatNextMonth,
  };
}

/** Only manual Inbox chat expenses reduce budget spent. */
function buildInboxManualExpenseWhere(
  start: Date,
  end: Date,
): Prisma.TransactionWhereInput {
  return {
    type: "expense",
    occurredAt: {
      gte: start,
      lte: end,
    },
    inboxMessage: {
      kind: "chat",
    },
  };
}

async function getCategorySpentMap(
  periodMonth: string,
): Promise<Map<string, number>> {
  const parsed = parseMonthKey(periodMonth);
  if (!parsed) {
    return new Map();
  }

  const { start, end } = getMonthRange(parsed.year, parsed.month);
  const rows = await prisma.transaction.groupBy({
    by: ["category"],
    where: buildInboxManualExpenseWhere(start, end),
    _sum: {
      amount: true,
    },
  });

  const spentMap = new Map<string, number>();
  for (const row of rows) {
    const key = normalizeCategory(row.category);
    spentMap.set(key, (spentMap.get(key) ?? 0) + (row._sum.amount ?? 0));
  }

  return spentMap;
}

async function provisionRepeatingBudgetsFromPreviousMonth(
  periodMonth: string,
): Promise<void> {
  const previousMonth = shiftMonthKey(periodMonth, -1);
  const repeating = await prisma.categoryBudget.findMany({
    where: {
      periodMonth: previousMonth,
      repeatNextMonth: true,
    },
    select: BUDGET_SELECT,
  });

  if (repeating.length === 0) {
    return;
  }

  for (const source of repeating) {
    await prisma.categoryBudget.upsert({
      where: {
        category_periodMonth: {
          category: source.category,
          periodMonth,
        },
      },
      create: {
        category: source.category,
        periodMonth,
        limitMode: source.limitMode,
        dailyAmount: source.dailyAmount,
        fixedLimit: source.fixedLimit,
        dayCount: source.dayCount,
        note: source.note,
        repeatNextMonth: true,
      },
      update: {},
    });
  }
}

async function syncNextMonthBudget(
  input: CategoryBudgetFormInput,
): Promise<void> {
  const nextPeriodMonth = shiftMonthKey(input.periodMonth, 1);

  if (input.repeatNextMonth) {
    const nextInput = toNextMonthBudgetInput(input, nextPeriodMonth);
    await prisma.categoryBudget.upsert({
      where: {
        category_periodMonth: {
          category: input.category,
          periodMonth: nextPeriodMonth,
        },
      },
      create: toBudgetWriteData(nextInput),
      update: toBudgetWriteData(nextInput),
    });
    return;
  }

  await prisma.categoryBudget.updateMany({
    where: {
      category: input.category,
      periodMonth: nextPeriodMonth,
    },
    data: {
      repeatNextMonth: false,
    },
  });
}

export async function listBudgetsForMonth(
  periodMonth: string,
): Promise<BudgetStatus[]> {
  await provisionRepeatingBudgetsFromPreviousMonth(periodMonth);

  const [budgets, spentMap] = await Promise.all([
    prisma.categoryBudget.findMany({
      where: { periodMonth },
      select: BUDGET_SELECT,
      orderBy: { category: "asc" },
    }),
    getCategorySpentMap(periodMonth),
  ]);

  return budgets.map((budget) =>
    buildBudgetStatus(mapBudget(budget), spentMap.get(budget.category) ?? 0),
  );
}

export async function getBudgetForCategory(
  category: string,
  periodMonth: string,
  additionalSpent = 0,
): Promise<{ budget: CategoryBudgetRecord; status: BudgetStatus } | null> {
  const budget = await prisma.categoryBudget.findUnique({
    where: {
      category_periodMonth: {
        category,
        periodMonth,
      },
    },
    select: BUDGET_SELECT,
  });

  if (!budget) {
    return null;
  }

  const parsed = parseMonthKey(periodMonth);
  if (!parsed) {
    return null;
  }

  const { start, end } = getMonthRange(parsed.year, parsed.month);
  const rows = await prisma.transaction.groupBy({
    by: ["category"],
    where: buildInboxManualExpenseWhere(start, end),
    _sum: {
      amount: true,
    },
  });

  const normalizedCategory = normalizeCategory(category);
  let spentTotal = additionalSpent;
  for (const row of rows) {
    if (normalizeCategory(row.category) === normalizedCategory) {
      spentTotal += row._sum.amount ?? 0;
    }
  }

  const record = mapBudget(budget);
  return {
    budget: record,
    status: buildBudgetStatus(record, spentTotal),
  };
}

export async function createCategoryBudget(
  input: CategoryBudgetFormInput,
): Promise<CategoryBudgetRecord> {
  const created = await prisma.categoryBudget.create({
    data: toBudgetWriteData(input),
    select: BUDGET_SELECT,
  });

  await syncNextMonthBudget(input);

  return mapBudget(created);
}

export async function updateCategoryBudget(
  id: string,
  input: CategoryBudgetFormInput,
): Promise<CategoryBudgetRecord> {
  const updated = await prisma.categoryBudget.update({
    where: { id },
    data: toBudgetWriteData(input),
    select: BUDGET_SELECT,
  });

  await syncNextMonthBudget(input);

  return mapBudget(updated);
}

export async function deleteCategoryBudget(id: string): Promise<void> {
  await prisma.categoryBudget.delete({
    where: { id },
  });
}
