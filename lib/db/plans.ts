import { prisma } from "@/lib/db/prisma";
import { recordPlanPurchase } from "@/lib/finance/record-plan-purchase";
import type { PlanFormInput, PlanRecord, PlanStatus } from "@/types/plan";
import type { Plan, PlanStatus as PrismaPlanStatus } from "@/generated/prisma/client";

function mapPlan(record: Plan): PlanRecord {
  return {
    id: record.id,
    name: record.name,
    amount: record.amount,
    category: record.category,
    status: record.status as PlanStatus,
    note: record.note,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function listPlans(): Promise<PlanRecord[]> {
  const records = await prisma.plan.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  return records.map(mapPlan);
}

export async function listActivePlans(): Promise<PlanRecord[]> {
  const records = await prisma.plan.findMany({
    where: { status: "active" },
    orderBy: { updatedAt: "desc" },
  });

  return records.map(mapPlan);
}

export async function createPlan(input: PlanFormInput): Promise<PlanRecord> {
  const record = await prisma.plan.create({
    data: {
      name: input.name,
      amount: input.amount,
      category: input.category,
      status: input.status as PrismaPlanStatus,
      note: input.note?.trim() || null,
    },
  });

  const plan = mapPlan(record);

  if (input.status === "done") {
    await recordPlanPurchase(plan);
  }

  return plan;
}

export async function updatePlan(
  id: string,
  input: PlanFormInput,
): Promise<PlanRecord> {
  const existing = await prisma.plan.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Wish tidak ditemukan.");
  }

  const record = await prisma.plan.update({
    where: { id },
    data: {
      name: input.name,
      amount: input.amount,
      category: input.category,
      status: input.status as PrismaPlanStatus,
      note: input.note?.trim() || null,
    },
  });

  const plan = mapPlan(record);

  if (existing.status === "active" && input.status === "done") {
    await recordPlanPurchase(plan);
  }

  return plan;
}

export async function deletePlan(id: string): Promise<void> {
  await prisma.plan.delete({ where: { id } });
}

export async function markPlanDone(id: string): Promise<PlanRecord> {
  const existing = await prisma.plan.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Wish tidak ditemukan.");
  }

  if (existing.status === "done") {
    return mapPlan(existing);
  }

  const record = await prisma.plan.update({
    where: { id },
    data: { status: "done" },
  });

  const plan = mapPlan(record);
  await recordPlanPurchase(plan);

  return plan;
}
