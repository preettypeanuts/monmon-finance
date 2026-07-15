"use client";

import { useEffect, useState } from "react";

import { FormOptionPicker } from "@/components/shared/form-option-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PAYPLAN_FILTER_LABEL_END,
  PAYPLAN_FILTER_LABEL_FLOW,
  PAYPLAN_FILTER_LABEL_KIND,
  PAYPLAN_FILTER_LABEL_PAYMENT_STATUS,
  PAYPLAN_FILTER_LABEL_REPEAT,
  PAYPLAN_LABEL_FILTER_SCHEDULE,
  PAYPLAN_LABEL_FILTER_SCHEDULE_DESC,
  UI_LABEL_APPLY,
  UI_LABEL_FILTER,
  UI_LABEL_RESET,
} from "@/config/payplan-labels";
import {
  PLANNED_ITEMS_END_MODE_OPTIONS,
  PLANNED_ITEMS_FLOW_OPTIONS,
  PLANNED_ITEMS_KIND_OPTIONS,
  PLANNED_ITEMS_PAYMENT_OPTIONS,
  PLANNED_ITEMS_REPEAT_OPTIONS,
} from "@/config/planner-manage-filters";
import { SEPARATED_CONTROL } from "@/config/shape";
import { CONTROL_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";
import type { PlannedItemsFilters } from "@/types/planner";

type PlannedItemsFilterDraft = Omit<PlannedItemsFilters, "q">;

interface PlannedItemsFilterFieldsProps {
  draft: PlannedItemsFilterDraft;
  onDraftChange: (draft: PlannedItemsFilterDraft) => void;
  onApply: () => void;
  onReset: () => void;
  layout?: "stack" | "inline";
  className?: string;
  nestedInDrawer?: boolean;
}

export function PlannedItemsFilterFields({
  draft,
  onDraftChange,
  onApply,
  onReset,
  layout = "stack",
  className,
  nestedInDrawer = false,
}: PlannedItemsFilterFieldsProps) {
  const isStack = layout === "stack";
  const pickerClassName = isStack ? "h-10" : undefined;

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      {isStack ? (
        <div>
          <p className="text-sm font-semibold">
            {PAYPLAN_LABEL_FILTER_SCHEDULE}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {PAYPLAN_LABEL_FILTER_SCHEDULE_DESC}
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          "grid gap-3",
          !isStack ? "sm:grid-cols-2" : "sm:grid-cols-2",
        )}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="planned-filter-kind">
            {PAYPLAN_FILTER_LABEL_KIND}
          </Label>
          <FormOptionPicker
            backLabel={UI_LABEL_FILTER}
            className={pickerClassName}
            id="planned-filter-kind"
            nestedInDrawer={nestedInDrawer}
            onChange={(value) =>
              onDraftChange({
                ...draft,
                kind: value as PlannedItemsFilters["kind"],
              })
            }
            options={PLANNED_ITEMS_KIND_OPTIONS}
            title={PAYPLAN_FILTER_LABEL_KIND}
            value={draft.kind}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="planned-filter-repeat">
            {PAYPLAN_FILTER_LABEL_REPEAT}
          </Label>
          <FormOptionPicker
            backLabel={UI_LABEL_FILTER}
            className={pickerClassName}
            id="planned-filter-repeat"
            nestedInDrawer={nestedInDrawer}
            onChange={(value) =>
              onDraftChange({
                ...draft,
                repeat: value as PlannedItemsFilters["repeat"],
              })
            }
            options={PLANNED_ITEMS_REPEAT_OPTIONS}
            title={PAYPLAN_FILTER_LABEL_REPEAT}
            value={draft.repeat}
          />
        </div>
      </div>

      <div
        className={cn(
          "grid gap-3",
          !isStack ? "sm:grid-cols-2" : "sm:grid-cols-2",
        )}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="planned-filter-flow">
            {PAYPLAN_FILTER_LABEL_FLOW}
          </Label>
          <FormOptionPicker
            backLabel={UI_LABEL_FILTER}
            className={pickerClassName}
            id="planned-filter-flow"
            nestedInDrawer={nestedInDrawer}
            onChange={(value) =>
              onDraftChange({
                ...draft,
                flowType: value as PlannedItemsFilters["flowType"],
              })
            }
            options={PLANNED_ITEMS_FLOW_OPTIONS}
            title={PAYPLAN_FILTER_LABEL_FLOW}
            value={draft.flowType}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="planned-filter-end">{PAYPLAN_FILTER_LABEL_END}</Label>
          <FormOptionPicker
            backLabel={UI_LABEL_FILTER}
            className={pickerClassName}
            id="planned-filter-end"
            nestedInDrawer={nestedInDrawer}
            onChange={(value) =>
              onDraftChange({
                ...draft,
                endMode: value as PlannedItemsFilters["endMode"],
              })
            }
            options={PLANNED_ITEMS_END_MODE_OPTIONS}
            title={PAYPLAN_FILTER_LABEL_END}
            value={draft.endMode}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="planned-filter-payment">
          {PAYPLAN_FILTER_LABEL_PAYMENT_STATUS}
        </Label>
        <FormOptionPicker
          backLabel={UI_LABEL_FILTER}
          className={pickerClassName}
          id="planned-filter-payment"
          nestedInDrawer={nestedInDrawer}
          onChange={(value) =>
            onDraftChange({
              ...draft,
              paymentStatus: value as PlannedItemsFilters["paymentStatus"],
            })
          }
          options={PLANNED_ITEMS_PAYMENT_OPTIONS}
          title={PAYPLAN_FILTER_LABEL_PAYMENT_STATUS}
          value={draft.paymentStatus}
        />
      </div>

      <div
        className={cn("flex w-full", !isStack && "justify-end", CONTROL_GAP)}
      >
        <Button
          type="button"
          variant="ghost"
          size={isStack ? "default" : "sm"}
          className={cn(SEPARATED_CONTROL, isStack && "flex-1")}
          onClick={onReset}
        >
          {UI_LABEL_RESET}
        </Button>
        <Button
          type="submit"
          size={isStack ? "default" : "sm"}
          className={cn(SEPARATED_CONTROL, isStack && "flex-1")}
        >
          {UI_LABEL_APPLY}
        </Button>
      </div>
    </form>
  );
}

export type { PlannedItemsFilterDraft };

export function usePlannedItemsFilterDraft(
  filters: PlannedItemsFilters,
  open: boolean,
): [PlannedItemsFilterDraft, (draft: PlannedItemsFilterDraft) => void] {
  const [draft, setDraft] = useState<PlannedItemsFilterDraft>(() => {
    const { q: _, ...rest } = filters;
    return rest;
  });

  useEffect(() => {
    if (open) {
      const { q: _, ...rest } = filters;
      setDraft(rest);
    }
  }, [filters, open]);

  return [draft, setDraft];
}
