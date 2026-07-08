import { buildTodaySummary } from "@/lib/finance/build-summary";
import { getDayRange } from "@/lib/finance/day-range";
import { prisma } from "@/lib/db/prisma";
import { invalidateAiInsightCacheOnTransactionMutation } from "@/lib/db/ai-insight-cache";
import { scopedByUser } from "@/lib/db/user-scope";
import type { ParsedTransaction } from "@/types/transaction";
import type { TodaySummary } from "@/types/summary";

interface CreateTransactionInput {
  userId: string;
  rawInput: string;
  transaction: ParsedTransaction;
}

function getTodayRange() {
  return getDayRange(new Date());
}

export async function createTransaction({
  userId,
  rawInput,
  transaction,
}: CreateTransactionInput) {
  const saved = await prisma.transaction.create({
    data: {
      userId,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      occurredAt: new Date(transaction.occurredAt),
      rawInput,
    },
  });

  await invalidateAiInsightCacheOnTransactionMutation(
    userId,
    saved.occurredAt,
  );

  return saved;
}

export async function getTodaySummary(userId: string): Promise<TodaySummary> {
  const { start, end } = getTodayRange();

  const transactions = await prisma.transaction.findMany({
    where: scopedByUser(userId, {
      occurredAt: {
        gte: start,
        lte: end,
      },
    }),
    select: {
      type: true,
      amount: true,
      category: true,
    },
    orderBy: {
      occurredAt: "desc",
    },
  });

  return buildTodaySummary(transactions);
}
