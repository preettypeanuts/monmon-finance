"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  SparkleIcon,
  WalletIcon,
} from "@/lib/icons";

import { JournalStatTile } from "@/components/journal/journal-stat-tile";
import { BalanceVisibilityToggle } from "@/components/shared/balance-visibility-toggle";
import { JOURNAL_WIDGET_TILE_STYLES } from "@/config/journal-widget";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import { cn } from "@/lib/utils";
import type { JournalDaySummary } from "@/types/journal";

interface JournalSummaryWidgetProps {
  summary: JournalDaySummary;
  className?: string;
}

export function JournalSummaryWidget({
  summary,
  className,
}: JournalSummaryWidgetProps) {
  const { formatAmount, formatSignedDelta } = useProtectedCurrency();
  const expense = JOURNAL_WIDGET_TILE_STYLES.expense;
  const income = JOURNAL_WIDGET_TILE_STYLES.income;
  const balance = JOURNAL_WIDGET_TILE_STYLES.balance;
  const condition = JOURNAL_WIDGET_TILE_STYLES.condition;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-end px-1">
        <BalanceVisibilityToggle />
      </div>
      <div className="flex gap-4 overflow-x-auto">
        <JournalStatTile
          icon={ArrowUpIcon}
          label="Keluar"
          value={formatAmount(summary.totalExpense)}
          delta={formatSignedDelta(summary.expenseDelta)}
          surfaceClassName={expense.surface}
          iconClassName={expense.iconColor}
          labelClassName={expense.labelColor}
          valueClassName={expense.valueColor}
          deltaClassName={expense.subtitleColor}
        />
        <JournalStatTile
          icon={ArrowDownIcon}
          label="Masuk"
          value={formatAmount(summary.totalIncome)}
          delta={formatSignedDelta(summary.incomeDelta)}
          surfaceClassName={income.surface}
          iconClassName={income.iconColor}
          labelClassName={income.labelColor}
          valueClassName={income.valueColor}
          deltaClassName={income.subtitleColor}
        />
        <JournalStatTile
          icon={WalletIcon}
          label="Saldo"
          value={formatAmount(summary.cumulativeBalance)}
          delta={formatSignedDelta(summary.balanceDelta)}
          surfaceClassName={balance.surface}
          iconClassName={balance.iconColor}
          labelClassName={balance.labelColor}
          valueClassName={balance.valueColor}
          deltaClassName={balance.subtitleColor}
        />
        <JournalStatTile
          icon={SparkleIcon}
          label="Kondisi"
          subtitle="Gemini analytics"
          value={summary.condition.label}
          surfaceClassName={condition.surface}
          iconClassName={condition.iconColor}
          labelClassName={condition.labelColor}
          subtitleClassName={condition.subtitleColor}
          valueClassName={condition.valueColor}
        />
      </div>
    </div>
  );
}
