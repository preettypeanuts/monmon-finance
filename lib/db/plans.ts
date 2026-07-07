import { prisma } from "@/lib/db/prisma";
import { scopedId } from "@/lib/db/user-scope";
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

export async function listPlans(userId: string): Promise<PlanRecord[]> {
  const records = await prisma.plan.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  return records.map(mapPlan);
}

export async function listActivePlans(userId: string): Promise<PlanRecord[]> {
  const records = await prisma.plan.findMany({
    where: { userId, status: "active" },
    orderBy: { updatedAt: "desc" },
  });

  return records.map(mapPlan);
}

export async function createPlan(
  userId: string,
  input: PlanFormInput,
): Promise<PlanRecord> {
  const record = await prisma.plan.create({
    data: {
      userId,
      name: input.name,
      amount: input.amount,
      category: input.category,
      status: input.status as PrismaPlanStatus,
      note: input.note?.trim() || null,
    },
  });

  const plan = mapPlan(record);

  if (input.status === "done") {
    await recordPlanPurchase(userId, plan);
  }

  return plan;
}

export async function updatePlan(
  userId: string,
  id: string,
  input: PlanFormInput,
): Promise<PlanRecord> {
  const existing = await prisma.plan.findUnique({
    where: scopedId(userId, id),
  });

  if (!existing) {
    throw new Error("Wish tidak ditemukan.");
  }

  const record = await prisma.plan.update({
    where: scopedId(userId, id),
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
    await recordPlanPurchase(userId, plan);
  }

  return plan;
}

export async function deletePlan(userId: string, id: string): Promise<void> {
  await prisma.plan.delete({ where: scopedId(userId, id) });
}

export async function markPlanDone(
  userId: string,
  id: string,
): Promise<PlanRecord> {
  const existing = await prisma.plan.findUnique({
    where: scopedId(userId, id),
  });

  if (!existing) {
    throw new Error("Wish tidak ditemukan.");
  }

  if (existing.status === "done") {
    return mapPlan(existing);
  }

  const record = await prisma.plan.update({
    where: scopedId(userId, id),
    data: { status: "done" },
  });

  const plan = mapPlan(record);
  await recordPlanPurchase(userId, plan);

  return plan;
}
