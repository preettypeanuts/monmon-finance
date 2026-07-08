import type { AiInsightCacheType } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { toDayKey } from "@/lib/finance/day-range";

export type AiInsightType = AiInsightCacheType;

export function todayDateKey(): string {
  return toDayKey(new Date());
}

export async function getCachedAiInsight<T>(
  userId: string,
  type: AiInsightType,
  dateKey: string,
): Promise<T | null> {
  const row = await prisma.aiInsightCache.findUnique({
    where: {
      userId_type_dateKey: {
        userId,
        type,
        dateKey,
      },
    },
    select: { payload: true },
  });

  if (!row) {
    return null;
  }

  return row.payload as T;
}

export async function setCachedAiInsight(
  userId: string,
  type: AiInsightType,
  dateKey: string,
  payload: unknown,
): Promise<void> {
  await prisma.aiInsightCache.upsert({
    where: {
      userId_type_dateKey: {
        userId,
        type,
        dateKey,
      },
    },
    create: {
      userId,
      type,
      dateKey,
      payload: payload as object,
    },
    update: {
      payload: payload as object,
      createdAt: new Date(),
    },
  });
}

function collectTransactionInvalidationDateKeys(occurredAt?: Date): string[] {
  const dateKeys = new Set([todayDateKey()]);

  if (occurredAt) {
    dateKeys.add(toDayKey(occurredAt));
  }

  return [...dateKeys];
}

/** Drop cached AI insights after a transaction create/update/delete. */
export async function invalidateAiInsightCacheOnTransactionMutation(
  userId: string,
  occurredAt?: Date,
): Promise<void> {
  const dateKeys = collectTransactionInvalidationDateKeys(occurredAt);

  await prisma.aiInsightCache.deleteMany({
    where: {
      userId,
      dateKey: { in: dateKeys },
    },
  });
}

/** Drop plans insight cache after wishlist mutations. */
export async function invalidatePlansInsightCache(userId: string): Promise<void> {
  await prisma.aiInsightCache.deleteMany({
    where: {
      userId,
      type: "plans_insight",
      dateKey: todayDateKey(),
    },
  });
}
