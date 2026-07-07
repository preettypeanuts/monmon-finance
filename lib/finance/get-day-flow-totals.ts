import { prisma } from "@/lib/db/prisma";
import { scopedByUser } from "@/lib/db/user-scope";

export interface DayFlowTotals {
  totalIncome: number;
  totalExpense: number;
}

export async function getDayFlowTotals(
  userId: string,
  start: Date,
  end: Date,
): Promise<DayFlowTotals> {
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: scopedByUser(userId, {
        occurredAt: { gte: start, lte: end },
        type: "income",
      }),
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: scopedByUser(userId, {
        occurredAt: { gte: start, lte: end },
        type: "expense",
      }),
      _sum: { amount: true },
    }),
  ]);

  return {
    totalIncome: incomeAgg._sum?.amount ?? 0,
    totalExpense: expenseAgg._sum?.amount ?? 0,
  };
}
