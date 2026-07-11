"use client";

import { DailySummaryReflection } from "@/components/finance/daily-summary-reflection";
import { DailySummaryStats } from "@/components/finance/daily-summary-stats";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import type { DailySummarySnapshot } from "@/types/summary";

interface DailySummarySectionProps {
  dailySummary: DailySummarySnapshot;
  showReflection?: boolean;
}

export function DailySummarySection({
  dailySummary,
  showReflection = true,
}: DailySummarySectionProps) {
  const { formatAmount } = useProtectedCurrency();
  const { summary } = dailySummary;
  const topCategories = summary.categories.slice(0, 2);

  return (
    <section className="space-y-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {dailySummary.title}
      </p>

      <DailySummaryStats
        totalExpense={summary.totalExpense}
        totalIncome={summary.totalIncome}
        balance={summary.balance}
      />

      {topCategories.length > 0 ? (
        <p className="truncate text-xs text-muted-foreground">
          {topCategories
            .map(
              (category) =>
                `${category.label} ${formatAmount(category.total)}`,
            )
            .join(" · ")}
        </p>
      ) : null}

      {showReflection && dailySummary.insight && dailySummary.condition ? (
        <DailySummaryReflection
          insight={dailySummary.insight}
          condition={dailySummary.condition}
        />
      ) : null}
    </section>
  );
}
