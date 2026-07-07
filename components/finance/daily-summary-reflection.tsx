import {
  FINANCE_REFLECTION_SHELL,
  getFinanceConditionWeatherStyle,
} from "@/config/finance-condition-weather";
import { FinanceConditionBadgeIcon } from "@/components/shared/ai-summary-badge-icon";
import { cn } from "@/lib/utils";
import type { FinanceCondition } from "@/types/summary";

interface DailySummaryReflectionProps {
  insight: string;
  condition: FinanceCondition;
}

export function DailySummaryReflection({
  insight,
  condition,
}: DailySummaryReflectionProps) {
  const style = getFinanceConditionWeatherStyle(condition);

  return (
    <div className={FINANCE_REFLECTION_SHELL}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
          style.surface,
        )}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <div
          className={cn(
            "absolute -right-4 -top-4 size-24 rounded-full blur-3xl",
            style.glowOrb,
          )}
        />
        <div
          className={cn(
            "absolute -bottom-4 -left-4 size-20 rounded-full blur-3xl",
            style.secondaryOrb,
          )}
        />
      </div>

      <div className="relative flex flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.14em]",
              style.labelColor,
            )}
          >
            Refleksi
          </p>

          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              style.badgeSurface,
              style.subtitleColor,
            )}
          >
            <FinanceConditionBadgeIcon label={condition.label} />
            {condition.label}
          </span>
        </div>

        <p
          className={cn(
            "mt-3.5 min-w-0 text-[13px] leading-[1.6] tracking-[-0.01em]",
            style.textColor,
          )}
        >
          {insight}
        </p>
      </div>
    </div>
  );
}
