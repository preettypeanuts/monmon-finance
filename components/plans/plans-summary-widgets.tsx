import { PlanIcon } from "@/components/plans/plan-icon";
import {
  PLAN_WIDGET_STYLES,
  PLANS_WIDGET_GRID,
  PLANS_WIDGET_TILE,
  type PlanWidgetId,
} from "@/config/plans";
import { formatIdr } from "@/lib/finance/format-currency";
import { cn } from "@/lib/utils";
import type { PlansOverview } from "@/types/plan";

interface PlansSummaryWidgetsProps {
  overview: PlansOverview;
}

const WIDGETS: Array<{
  id: PlanWidgetId;
  label: string;
  getValue: (overview: PlansOverview) => string;
}> = [
  {
    id: "active",
    label: "Active plans",
    getValue: (overview) => String(overview.activeCount),
  },
  {
    id: "estimated",
    label: "Estimated cost",
    getValue: (overview) => formatIdr(overview.estimatedCost),
  },
  {
    id: "balance",
    label: "Available balance",
    getValue: (overview) => formatIdr(overview.availableBalance),
  },
];

export function PlansSummaryWidgets({ overview }: PlansSummaryWidgetsProps) {
  return (
    <div className={PLANS_WIDGET_GRID}>
      {WIDGETS.map((widget) => {
        const style = PLAN_WIDGET_STYLES[widget.id];

        return (
          <div key={widget.id} className={PLANS_WIDGET_TILE}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {widget.label}
              </p>
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-xl",
                  style.iconSurface,
                )}
              >
                <PlanIcon
                  name={style.icon}
                  className={cn("size-4", style.iconColor)}
                />
              </div>
            </div>
            <p
              className={cn(
                "mt-2 text-lg font-bold tabular-nums tracking-tight sm:text-xl",
                style.valueColor,
              )}
            >
              {widget.getValue(overview)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
