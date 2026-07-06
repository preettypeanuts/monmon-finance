"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  PlannedItemsFilterFields,
  usePlannedItemsFilterDraft,
} from "@/components/planner/planned-items-filter-fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PLANNED_ITEMS_DEFAULT_FILTERS } from "@/config/planner-manage-filters";
import {
  FORM_DIALOG_BODY_SCROLL,
  FORM_DIALOG_CONTENT,
  FORM_DIALOG_HEADER,
} from "@/config/form-dialog";
import { buildPlannedItemsManageParams } from "@/lib/validations/planned-items-manage";
import type { PlannedItemsFilters, PlannerManageLayout } from "@/types/planner";

interface PlannedItemsFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PlannedItemsFilters;
  layout: PlannerManageLayout;
}

export function PlannedItemsFilterDialog({
  open,
  onOpenChange,
  filters,
  layout,
}: PlannedItemsFilterDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draft, setDraft] = usePlannedItemsFilterDraft(filters, open);

  function applyFilters() {
    const params = buildPlannedItemsManageParams(
      { ...draft, q: filters.q },
      layout,
      new URLSearchParams(searchParams.toString()),
    );

    router.push(`${pathname}?${params.toString()}`);
    onOpenChange(false);
  }

  function resetFilters() {
    const params = buildPlannedItemsManageParams(
      { ...PLANNED_ITEMS_DEFAULT_FILTERS, q: filters.q },
      layout,
      new URLSearchParams(searchParams.toString()),
    );

    router.push(`${pathname}?${params.toString()}`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={FORM_DIALOG_CONTENT}>
        <DialogHeader className={FORM_DIALOG_HEADER}>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Filter
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-snug">
            Saring tagihan, langganan, dan cicilan.
          </DialogDescription>
        </DialogHeader>

        <div className={FORM_DIALOG_BODY_SCROLL}>
          <PlannedItemsFilterFields
            draft={draft}
            onDraftChange={setDraft}
            onApply={applyFilters}
            onReset={resetFilters}
            layout="stack"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
