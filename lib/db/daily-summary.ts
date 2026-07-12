import { generateDailySummaryInsight } from "@/lib/ai/generate-daily-summary-insight";
import { prisma } from "@/lib/db/prisma";
import { flowTransactionTypesWhere, toFlowTransactionRows } from "@/lib/db/transaction-flow-filter";
import { scopedByUser } from "@/lib/db/user-scope";
import { buildFallbackDailySummaryCondition } from "@/lib/finance/build-daily-summary-insight";
import {
  buildDailySummaryMessage,
  buildDailySummarySnapshot,
} from "@/lib/finance/build-daily-summary-message";
import { buildDailySummaryReflectionContext } from "@/lib/finance/build-daily-summary-reflection-context";
import { buildDailySummarySignature } from "@/lib/finance/build-daily-summary-signature";
import {
  endOfDay,
  getDayRange,
  getYesterday,
  parseDayKey,
  startOfDay,
  toDayKey,
} from "@/lib/finance/day-range";
import {
  parseStoredDailySummaryInsight,
  serializeDailySummaryInsight,
} from "@/lib/finance/stored-daily-summary-insight";
import type { DailySummarySnapshot } from "@/types/summary";

async function getTransactionsForDay(userId: string, date: Date) {
  const { start, end } = getDayRange(date);

  return toFlowTransactionRows(
    await prisma.transaction.findMany({
      where: scopedByUser(userId, {
        occurredAt: {
          gte: start,
          lte: end,
        },
        ...flowTransactionTypesWhere(),
      }),
      select: {
        type: true,
        amount: true,
        category: true,
        description: true,
      },
      orderBy: {
        occurredAt: "asc",
      },
    }),
  );
}

async function getCumulativeBalance(
  userId: string,
  date: Date,
): Promise<number> {
  const end = endOfDay(date);

  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: scopedByUser(userId, {
        occurredAt: { lte: end },
        type: "income",
      }),
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: scopedByUser(userId, {
        occurredAt: { lte: end },
        type: "expense",
      }),
      _sum: { amount: true },
    }),
  ]);

  return (incomeAgg._sum?.amount ?? 0) - (expenseAgg._sum?.amount ?? 0);
}

async function createDailySummaryForDay(
  userId: string,
  date: Date,
): Promise<void> {
  const summaryDate = startOfDay(date);
  const transactions = await getTransactionsForDay(userId, date);
  const cumulativeBalance = await getCumulativeBalance(userId, date);
  const reflectionContext = await buildDailySummaryReflectionContext(
    userId,
    date,
    transactions,
    cumulativeBalance,
  );
  const bundle = await generateDailySummaryInsight(
    date,
    transactions,
    reflectionContext,
  );
  const content = buildDailySummaryMessage(date, transactions, bundle.insight);
  const storedInsight = serializeDailySummaryInsight(
    bundle.insight,
    bundle.condition,
  );
  const insightSignature = buildDailySummarySignature(transactions);

  await prisma.inboxMessage.upsert({
    where: {
      userId_summaryDate_kind: {
        userId,
        summaryDate,
        kind: "daily_summary",
      },
    },
    create: {
      userId,
      role: "assistant",
      kind: "daily_summary",
      content,
      insight: storedInsight,
      insightSignature,
      summaryDate,
      createdAt: endOfDay(date),
    },
    update: {
      content,
      insight: storedInsight,
      insightSignature,
    },
  });
}

async function backfillMissingDailySummaryInsights(
  userId: string,
): Promise<void> {
  const messages = await prisma.inboxMessage.findMany({
    where: {
      userId,
      kind: "daily_summary",
      insight: null,
      summaryDate: {
        not: null,
      },
    },
    select: {
      id: true,
      summaryDate: true,
    },
  });

  for (const message of messages) {
    const date = message.summaryDate!;
    const transactions = await getTransactionsForDay(userId, date);
    const cumulativeBalance = await getCumulativeBalance(userId, date);
    const reflectionContext = await buildDailySummaryReflectionContext(
      userId,
      date,
      transactions,
      cumulativeBalance,
    );
    const bundle = await generateDailySummaryInsight(
      date,
      transactions,
      reflectionContext,
    );
    const content = buildDailySummaryMessage(
      date,
      transactions,
      bundle.insight,
    );
    const storedInsight = serializeDailySummaryInsight(
      bundle.insight,
      bundle.condition,
    );
    const insightSignature = buildDailySummarySignature(transactions);

    await prisma.inboxMessage.update({
      where: { id: message.id },
      data: {
        insight: storedInsight,
        content,
        insightSignature,
      },
    });
  }
}

async function backfillLegacyDailySummaryInsights(
  userId: string,
): Promise<void> {
  const messages = await prisma.inboxMessage.findMany({
    where: {
      userId,
      kind: "daily_summary",
      insight: {
        not: null,
      },
      summaryDate: {
        not: null,
      },
    },
    select: {
      id: true,
      insight: true,
      summaryDate: true,
    },
  });

  for (const message of messages) {
    const parsed = parseStoredDailySummaryInsight(message.insight);

    if (parsed.condition || !parsed.insight || !message.summaryDate) {
      continue;
    }

    const transactions = await getTransactionsForDay(
      userId,
      message.summaryDate,
    );
    const cumulativeBalance = await getCumulativeBalance(
      userId,
      message.summaryDate,
    );
    const reflectionContext = await buildDailySummaryReflectionContext(
      userId,
      message.summaryDate,
      transactions,
      cumulativeBalance,
    );
    const condition = buildFallbackDailySummaryCondition(
      transactions,
      cumulativeBalance,
      reflectionContext,
    );
    const storedInsight = serializeDailySummaryInsight(
      parsed.insight,
      condition,
    );

    await prisma.inboxMessage.update({
      where: { id: message.id },
      data: {
        insight: storedInsight,
      },
    });
  }
}

const ensurePendingDailySummariesByUser = new Map<string, Promise<void>>();

export async function ensureDailySummaryForDay(
  userId: string,
  date: Date,
): Promise<void> {
  const summaryDate = startOfDay(date);
  const transactions = await getTransactionsForDay(userId, date);
  const currentSignature = buildDailySummarySignature(transactions);

  const existing = await prisma.inboxMessage.findFirst({
    where: {
      userId,
      kind: "daily_summary",
      summaryDate,
    },
    select: { id: true, insightSignature: true },
  });

  if (existing) {
    if (existing.insightSignature === currentSignature) {
      return;
    }

    await createDailySummaryForDay(userId, date);
    return;
  }

  await createDailySummaryForDay(userId, date);
}

export async function ensurePendingDailySummaries(
  userId: string,
): Promise<void> {
  const existing = ensurePendingDailySummariesByUser.get(userId);
  if (existing) {
    return existing;
  }

  const promise = runEnsurePendingDailySummaries(userId).finally(() => {
    ensurePendingDailySummariesByUser.delete(userId);
  });

  ensurePendingDailySummariesByUser.set(userId, promise);
  return promise;
}

async function runEnsurePendingDailySummaries(userId: string): Promise<void> {
  const todayStart = startOfDay(new Date());

  const transactions = await prisma.transaction.findMany({
    where: scopedByUser(userId, {
      occurredAt: {
        lt: todayStart,
      },
    }),
    select: {
      occurredAt: true,
    },
  });

  if (transactions.length > 0) {
    const dayKeys = new Set<string>();
    for (const transaction of transactions) {
      dayKeys.add(toDayKey(transaction.occurredAt));
    }

    for (const dayKey of dayKeys) {
      await ensureDailySummaryForDay(userId, parseDayKey(dayKey));
    }
  }

  await backfillMissingDailySummaryInsights(userId);
  await backfillLegacyDailySummaryInsights(userId);
}

function resolveDailySummarySnapshot(
  date: Date,
  transactions: Awaited<ReturnType<typeof getTransactionsForDay>>,
  content: string,
  rawInsight: string | null,
  cumulativeBalance: number,
): DailySummarySnapshot {
  const parsed = parseStoredDailySummaryInsight(rawInsight);
  const condition =
    parsed.condition ??
    (parsed.insight
      ? buildFallbackDailySummaryCondition(transactions, cumulativeBalance)
      : null);

  return buildDailySummarySnapshot(
    date,
    transactions,
    content,
    parsed.insight,
    condition,
  );
}

export async function getYesterdayDailySummary(
  userId: string,
): Promise<DailySummarySnapshot | null> {
  await ensurePendingDailySummaries(userId);

  const yesterday = getYesterday();
  const summaryDate = startOfDay(yesterday);

  const message = await prisma.inboxMessage.findFirst({
    where: {
      userId,
      kind: "daily_summary",
      summaryDate,
    },
    select: {
      content: true,
      insight: true,
    },
  });

  if (!message) {
    return null;
  }

  const [transactions, cumulativeBalance] = await Promise.all([
    getTransactionsForDay(userId, yesterday),
    getCumulativeBalance(userId, yesterday),
  ]);

  return resolveDailySummarySnapshot(
    yesterday,
    transactions,
    message.content,
    message.insight,
    cumulativeBalance,
  );
}

export async function getDailySummaryForDay(
  userId: string,
  date: Date,
): Promise<DailySummarySnapshot | null> {
  await ensureDailySummaryForDay(userId, date);

  const summaryDate = startOfDay(date);

  const message = await prisma.inboxMessage.findFirst({
    where: {
      userId,
      kind: "daily_summary",
      summaryDate,
    },
    select: {
      content: true,
      insight: true,
    },
  });

  if (!message) {
    return null;
  }

  const [transactions, cumulativeBalance] = await Promise.all([
    getTransactionsForDay(userId, date),
    getCumulativeBalance(userId, date),
  ]);

  return resolveDailySummarySnapshot(
    date,
    transactions,
    message.content,
    message.insight,
    cumulativeBalance,
  );
}
