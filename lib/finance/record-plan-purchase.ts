import { createTransaction } from "@/lib/db/transactions";
import { prisma } from "@/lib/db/prisma";
import type { TransactionCategoryId } from "@/config/categories";
import type { PlanRecord } from "@/types/plan";

function planPurchaseMarker(planId: string): string {
  return `[wish:${planId}]`;
}

export function buildPlanPurchaseRawInput(plan: PlanRecord): string {
  return `Beli ${plan.name} ${planPurchaseMarker(plan.id)}`;
}

export async function hasPlanPurchaseTransaction(
  planId: string,
): Promise<boolean> {
  const marker = planPurchaseMarker(planId);
  const count = await prisma.transaction.count({
    where: { rawInput: { contains: marker } },
  });

  return count > 0;
}

/** Records wish purchase as journal expense — skips if already recorded. */
export async function recordPlanPurchase(plan: PlanRecord): Promise<boolean> {
  if (await hasPlanPurchaseTransaction(plan.id)) {
    return false;
  }

  await createTransaction({
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
