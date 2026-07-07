import { createTransaction } from "@/lib/db/transactions";
import { prisma } from "@/lib/db/prisma";
import { scopedByUser } from "@/lib/db/user-scope";
import type { TransactionCategoryId } from "@/config/categories";
import type { PlanRecord } from "@/types/plan";

function planPurchaseMarker(planId: string): string {
  return `[wish:${planId}]`;
}

export function buildPlanPurchaseRawInput(plan: PlanRecord): string {
  return `Beli ${plan.name} ${planPurchaseMarker(plan.id)}`;
}

export async function hasPlanPurchaseTransaction(
  userId: string,
  planId: string,
): Promise<boolean> {
  const marker = planPurchaseMarker(planId);
  const count = await prisma.transaction.count({
    where: scopedByUser(userId, {
      rawInput: { contains: marker },
    }),
  });

  return count > 0;
}

/** Records wish purchase as journal expense — skips if already recorded. */
export async function recordPlanPurchase(
  userId: string,
  plan: PlanRecord,
): Promise<boolean> {
  if (await hasPlanPurchaseTransaction(userId, plan.id)) {
    return false;
  }

  await createTransaction({
    userId,
    rawInput: buildPlanPurchaseRawInput(plan),
    transaction: {
      type: "expense",
      amount: plan.amount,
      category: plan.category as TransactionCategoryId,
      description: plan.name,
      occurredAt: new Date().toISOString(),
    },
  });

  return true;
}
