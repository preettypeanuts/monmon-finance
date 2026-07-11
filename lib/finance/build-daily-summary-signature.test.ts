import { describe, expect, it } from "vitest";
import { buildDailySummarySignature } from "@/lib/finance/build-daily-summary-signature";
import { buildFallbackDailySummaryCondition } from "@/lib/finance/build-daily-summary-insight";
import { computeBudgetPace } from "@/lib/finance/compute-budget-pace";
import type { DailySummaryReflectionContext } from "@/lib/finance/format-daily-summary-reflection-context";
import type { BudgetStatus } from "@/types/budget";

function makeMonthlyStatus(
  overrides: Partial<BudgetStatus> & Pick<BudgetStatus, "budget">,
): BudgetStatus {
  const base = {
    categoryLabel: "Makanan & Minum",
    periodMonth: "2026-07",
    dayCount: 31,
    totalLimit: 2_170_000,
    spent: 500_000,
    remaining: 1_670_000,
    usedPercent: 23,
    remainingPercent: 77,
    ...overrides,
  };

  return {
    ...base,
    pace: overrides.pace ?? computeBudgetPace(base),
  };
}

describe("buildDailySummarySignature", () => {
  it("membentuk fingerprint dari jumlah transaksi dan total", () => {
    const signature = buildDailySummarySignature([
      { type: "expense", amount: 41_525 },
      { type: "expense", amount: 60_000 },
      { type: "income", amount: 375_000 },
    ]);

    expect(signature).toBe("3:101525:375000");
  });
});

describe("buildFallbackDailySummaryCondition", () => {
  it("tidak boleh Aman kalau ada budget harian over", () => {
    const context: DailySummaryReflectionContext = {
      cumulativeBalance: 100_000,
      categoryBudgets: [
        {
          category: "food",
          categoryLabel: "Makanan & Minum",
          daySpent: 150_899,
          dailyLimit: 70_000,
          dayDelta: 80_899,
          dayStatus: "over",
          monthlyStatus: makeMonthlyStatus({
            budget: {
              id: "1",
              category: "food",
              periodMonth: "2026-07",
              limitMode: "daily",
              dailyAmount: 70_000,
              fixedLimit: null,
              dayCount: 31,
              note: null,
              repeatNextMonth: true,
            },
          }),
        },
      ],
    };

    const condition = buildFallbackDailySummaryCondition(
      [
        { type: "expense", amount: 150_899, category: "food" },
        { type: "income", amount: 375_000, category: "salary" },
      ],
      100_000,
      context,
    );

    expect(condition.label).toBe("Waspada");
    expect(condition.label).not.toBe("Aman");
  });
});
