import { PlanIcon } from "@/components/plans/plan-icon";
import {
  PLAN_WIDGET_STYLES,
  PLANS_WIDGET_GRID,
  PLANS_WIDGET_SURFACE,
  PLANS_WIDGET_TILE_LAYOUT,
  type PlanWidgetId,
} from "@/config/plans";
import { SEPARATED_SURFACE } from "@/config/shape";
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
    label: "Wish aktif",
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
        const accent = PLAN_WIDGET_STYLES[widget.id];
        const surface = PLANS_WIDGET_SURFACE[widget.id];

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
              {widget.getValue(overview)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
