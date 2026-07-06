"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FunnelIcon } from "@/lib/icons";

import {
  PlannedItemsFilterFields,
  usePlannedItemsFilterDraft,
} from "@/components/planner/planned-items-filter-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PLANNED_ITEMS_DEFAULT_FILTERS } from "@/config/planner-manage-filters";
import { GLASS_SURFACE } from "@/config/glass";
import { SEPARATED_CONTROL } from "@/config/shape";
import { countActivePlannedItemFilters } from "@/lib/planner/filter-planned-items";
import { buildPlannedItemsManageParams } from "@/lib/validations/planned-items-manage";
import { cn } from "@/lib/utils";
import type { PlannedItemsFilters, PlannerManageLayout } from "@/types/planner";

interface PlannedItemsFilterMenuProps {
  filters: PlannedItemsFilters;
  layout: PlannerManageLayout;
  className?: string;
}

export function PlannedItemsFilterMenu({
  filters,
  layout,
  className,
}: PlannedItemsFilterMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = usePlannedItemsFilterDraft(filters, open);
  const activeCount = countActivePlannedItemFilters(filters);

  function applyFilters() {
    const params = buildPlannedItemsManageParams(
      { ...draft, q: filters.q },
      layout,
      new URLSearchParams(searchParams.toString()),
    );

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  function resetFilters() {
    const params = buildPlannedItemsManageParams(
      { ...PLANNED_ITEMS_DEFAULT_FILTERS, q: filters.q },
      layout,
      new URLSearchParams(searchParams.toString()),
    );

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(SEPARATED_CONTROL, "relative gap-1.5", className)}
          />
        }
      >
        <FunnelIcon />
        Filter
        {activeCount > 0 ? (
          <Badge
            variant="secondary"
            className="ml-0.5 h-4 min-w-4 rounded-full px-1 text-[10px]"
          >
            {activeCount}
          </Badge>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className={cn(
          GLASS_SURFACE,
          "w-[min(100vw-2rem,22rem)] rounded-2xl p-4",
        )}
      >
        <PlannedItemsFilterFields
          draft={draft}
          onDraftChange={setDraft}
          onApply={applyFilters}
          onReset={resetFilters}
          layout="inline"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
