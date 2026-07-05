"use client";

import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PLANNER_SELECT_ITEM } from "@/config/planner-manage";
import type { BudgetStatus } from "@/types/budget";

interface BudgetCardMenuProps {
  status: BudgetStatus;
  disabled?: boolean;
  onEdit: (status: BudgetStatus) => void;
  onDelete: (status: BudgetStatus) => void;
}

export function BudgetCardMenu({
  status,
  disabled = false,
  onEdit,
  onDelete,
}: BudgetCardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Opsi budget ${status.categoryLabel}`}
            disabled={disabled}
          />
        }
      >
        <DotsThreeIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="min-w-36">
        <DropdownMenuItem
          className={PLANNER_SELECT_ITEM}
          onClick={() => onEdit(status)}
        >
          <PencilSimpleIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className={PLANNER_SELECT_ITEM}
          onClick={() => onDelete(status)}
        >
          <TrashIcon />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
