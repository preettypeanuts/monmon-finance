import { JournalCategoryIcon } from "@/components/journal/journal-category-icon";
import { JOURNAL_CATEGORY_BREAKDOWN_TRACK } from "@/config/journal-mobile";
import { getCategoryProgressFill } from "@/lib/finance/category-progress-color";
import { cn } from "@/lib/utils";
import type { JournalCategoryExpenseShare } from "@/types/journal";

interface JournalCategoryBreakdownRowProps {
  item: JournalCategoryExpenseShare;
  formatAmount: (amount: number) => string;
}

export function JournalCategoryBreakdownRow({
  item,
  formatAmount,
}: JournalCategoryBreakdownRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2.5">
        <JournalCategoryIcon category={item.category} type="expense" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{item.label}</p>
            <p className="shrink-0 text-sm font-semibold tabular-nums">
              {item.percent}%
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground tabular-nums">
            {formatAmount(item.amount)}
          </p>
        </div>
      </div>

      <div className={JOURNAL_CATEGORY_BREAKDOWN_TRACK}>
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            getCategoryProgressFill(item.category),
          )}
          style={{ width: `${item.percent}%` }}
        />
      </div>
    </div>
  );
}
