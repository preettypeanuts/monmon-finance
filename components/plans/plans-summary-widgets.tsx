"use client";

import { PlanIcon } from "@/components/plans/plan-icon";
import { BalanceVisibilityToggle } from "@/components/shared/balance-visibility-toggle";
import {
  PLAN_WIDGET_STYLES,
  PLANS_WIDGET_GRID,
  PLANS_WIDGET_SURFACE,
  PLANS_WIDGET_TILE_LAYOUT,
  type PlanWidgetId,
} from "@/config/plans";
import { SEPARATED_SURFACE } from "@/config/shape";
import { useProtectedCurrency } from "@/hooks/use-protected-currency";
import { cn } from "@/lib/utils";
import type { PlansOverview } from "@/types/plan";

interface PlansSummaryWidgetsProps {
  overview: PlansOverview;
}

const WIDGETS: Array<{
  id: PlanWidgetId;
  label: string;
  isMoney: boolean;
  getValue: (overview: PlansOverview) => number | string;
}> = [
  {
    id: "active",
    label: "Wish aktif",
    isMoney: false,
    getValue: (overview) => overview.activeCount,
  },
  {
    id: "estimated",
    label: "Estimated cost",
    isMoney: true,
    getValue: (overview) => overview.estimatedCost,
  },
  {
    id: "balance",
    label: "Available balance",
    isMoney: true,
    getValue: (overview) => overview.availableBalance,
  },
];

export function PlansSummaryWidgets({ overview }: PlansSummaryWidgetsProps) {
  const { formatAmount } = useProtectedCurrency();

  function formatWidgetValue(
    widget: (typeof WIDGETS)[number],
    value: number | string,
  ): string {
    if (!widget.isMoney) {
      return String(value);
    }

    return formatAmount(Number(value));
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <BalanceVisibilityToggle />
      </div>
      <div className={PLANS_WIDGET_GRID}>
        {WIDGETS.map((widget) => {
          const accent = PLAN_WIDGET_STYLES[widget.id];
          const surface = PLANS_WIDGET_SURFACE[widget.id];
          const rawValue = widget.getValue(overview);

          return (
            <div
              key={widget.id}
              className={cn(
                SEPARATED_SURFACE,
                PLANS_WIDGET_TILE_LAYOUT,
                surface.surface,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-wide sm:text-xs",
                    surface.labelColor,
                  )}
                >
                  {widget.label}
                </p>
                <PlanIcon
                  name={accent.icon}
                  className={cn("size-5 shrink-0 sm:size-6", surface.iconColor)}
                />
              </div>
              <p
                className={cn(
                  "text-lg font-bold tabular-nums tracking-tight sm:text-xl",
                  surface.valueColor,
                )}
              >
                {formatWidgetValue(widget, rawValue)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
