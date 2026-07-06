"use client";

import { PlansInsightBadgeIcon } from "@/components/shared/ai-summary-badge-icon";
import { BalanceVisibilityToggle } from "@/components/shared/balance-visibility-toggle";
import { PlanIcon } from "@/components/plans/plan-icon";
import {
  PLANS_AI_SUMMARY_SHELL,
  getPlansInsightToneStyle,
} from "@/config/plans";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import { cn } from "@/lib/utils";
import type { PlansOverview } from "@/types/plan";

interface PlansAiSummaryProps {
  overview: PlansOverview;
}

export function PlansAiSummary({ overview }: PlansAiSummaryProps) {
  const { formatAmount } = useProtectedCurrency();
  const { insightMeta } = overview;
  const style = getPlansInsightToneStyle(insightMeta.tone);

  return (
    <div className={cn(PLANS_AI_SUMMARY_SHELL, style.surface)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-6 -top-18 size-32 rounded-full blur-2xl opacity-60 animate-pulse",
          style.glowOrb,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -bottom-10 -left-6 size-24 rounded-full blur-2xl opacity-70",
          style.secondaryOrb,
        )}
      />

      <div className="relative flex h-full flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-lg",
                style.iconSurface,
              )}
            >
              <PlanIcon
                name="sparkle"
                className={cn("size-3.5", style.textColor)}
              />
            </div>
            <p
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.14em]",
                style.labelColor,
              )}
            >
              AI summary
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                style.badgeSurface,
                style.subtitleColor,
              )}
            >
              <PlansInsightBadgeIcon tone={insightMeta.tone} />
              {insightMeta.label}
            </span>
            <BalanceVisibilityToggle />
          </div>
        </div>

        <p
          className={cn(
            "mt-3 text-[13px] leading-[1.6] tracking-[-0.01em]",
            style.textColor,
          )}
        >
          {overview.insight}
        </p>

        {overview.estimatedCost > 0 ? (
          <p className={cn("mt-2.5 text-xs", style.subtitleColor)}>
            Spend{" "}
            <span className={cn("font-semibold", style.metricSpend)}>
              {formatAmount(overview.estimatedCost)}
            </span>
            {" · saldo "}
            <span className={cn("font-semibold", style.metricBalance)}>
              {formatAmount(overview.availableBalance)}
            </span>
            {" · sisa "}
            <span className={cn("font-semibold", style.metricRemaining)}>
              {formatAmount(overview.remainingBalance)}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
