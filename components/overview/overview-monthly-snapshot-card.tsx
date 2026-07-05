import { TableIcon } from "@/lib/icons";

import { OverviewIconShell } from "@/components/overview/overview-icon-shell";
import {
  OVERVIEW_CARD,
  OVERVIEW_CARD_PADDING,
  OVERVIEW_SECTION_LABEL,
  OVERVIEW_SECTION_TITLE,
  OVERVIEW_STAT_TILE,
} from "@/config/overview";
import { formatIdr } from "@/lib/finance/format-currency";
import { cn } from "@/lib/utils";
import type { OverviewMonthlySnapshot } from "@/types/overview";

interface OverviewMonthlySnapshotCardProps {
  snapshot: OverviewMonthlySnapshot;
  className?: string;
}

export function OverviewMonthlySnapshotCard({
  snapshot,
  className,
}: OverviewMonthlySnapshotCardProps) {
  return (
    <section className={cn(OVERVIEW_CARD, OVERVIEW_CARD_PADDING, className)}>
      <div className="flex items-start gap-2.5">
        <OverviewIconShell variant="indigo">
          <TableIcon />
        </OverviewIconShell>
        <div className="min-w-0">
          <p className={OVERVIEW_SECTION_LABEL}>Monthly Snapshot</p>
          <h2 className={cn("mt-0.5 capitalize", OVERVIEW_SECTION_TITLE)}>
            {snapshot.monthLabel}
          </h2>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className={OVERVIEW_STAT_TILE}>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Masuk
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-[#34C759]">
            {formatIdr(snapshot.totalIncome)}
          </p>
        </div>
        <div className={OVERVIEW_STAT_TILE}>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Keluar
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-foreground/90">
            {formatIdr(snapshot.totalExpense)}
          </p>
        </div>
        <div className={OVERVIEW_STAT_TILE}>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Net flow
          </p>
          <p
            className={cn(
              "mt-1 text-sm font-semibold tabular-nums",
              snapshot.netFlow >= 0 ? "text-[#34C759]" : "text-[#FF3B30]",
            )}
          >
            {snapshot.netFlow >= 0 ? "+" : "−"}
            {formatIdr(Math.abs(snapshot.netFlow))}
          </p>
        </div>
        <div className={OVERVIEW_STAT_TILE}>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Transaksi
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums">
            {snapshot.transactionCount}
          </p>
        </div>
      </div>
    </section>
  );
}
