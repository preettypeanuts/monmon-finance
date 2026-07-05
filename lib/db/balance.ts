import { endOfDay } from "@/lib/finance/day-range";
import { prisma } from "@/lib/db/prisma";

/** Cumulative balance from all transactions up to now. */
export async function getAvailableBalance(asOf = new Date()): Promise<number> {
  const end = endOfDay(asOf);

  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        occurredAt: { lte: end },
        type: "income",
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        occurredAt: { lte: end },
        type: "expense",
      },
      _sum: { amount: true },
    }),
  ]);

  return (incomeAgg._sum.amount ?? 0) - (expenseAgg._sum.amount ?? 0);
}
