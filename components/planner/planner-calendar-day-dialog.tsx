"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/lib/icons";

import { savePlannedItemAction } from "@/app/actions/planner";
import { PlannedItemFormDialog } from "@/components/planner/planned-item-form-dialog";
import { PlannerCalendarDayItem } from "@/components/planner/planner-calendar-day-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FORM_DIALOG_BODY_SCROLL,
  FORM_DIALOG_CONTENT,
  FORM_DIALOG_HEADER,
  FORM_GROUP,
} from "@/config/form-dialog";
import { GRID_GAP } from "@/config/spacing";
import { formatDayMonth, formatWeekday } from "@/lib/finance/format-datetime";
import { formatIdr } from "@/lib/finance/format-currency";
import { toDateInputValue } from "@/lib/validations/planned-item";
import { cn } from "@/lib/utils";
import type { PlannedOccurrence } from "@/types/planner";

interface PlannerCalendarDayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  items: PlannedOccurrence[];
  totalAmount: number;
}

export function PlannerCalendarDayDialog({
  open,
  onOpenChange,
  date,
  items,
  totalAmount,
}: PlannerCalendarDayDialogProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasItems = items.length > 0;
  const defaultStartAt = toDateInputValue(date);

  function openCreateForm() {
    setError(null);
    onOpenChange(false);
    setFormOpen(true);
  }

  async function handleSubmit(formData: FormData): Promise<boolean> {
    const result = await savePlannedItemAction(formData);

    if (!result.ok) {
      setError(result.error);
      return false;
    }

    setError(null);
    router.refresh();
    return true;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={FORM_DIALOG_CONTENT}>
          <DialogHeader className={FORM_DIALOG_HEADER}>
            <div className="flex items-start justify-between gap-3 pr-0">
              <div className="min-w-0">
                <DialogTitle className="text-lg font-semibold capitalize tracking-tight">
                  {formatWeekday(date)}, {formatDayMonth(date)}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-snug">
                  {hasItems ? (
                    <>
                      {items.length} item
                      <span className="mx-1">·</span>
                      <span className="font-medium text-foreground/85">
                        {formatIdr(Math.abs(totalAmount))}
                        {totalAmount > 0
                          ? " keluar"
                          : totalAmount < 0
                            ? " masuk"
                            : ""}
                      </span>
                    </>
                  ) : (
                    "Tidak ada tagihan di tanggal ini."
                  )}
                </DialogDescription>
              </div>

              <Button
                type="button"
                size="sm"
                className="shrink-0"
                onClick={openCreateForm}
              >
                <PlusIcon />
                Tambah Pay Plan
              </Button>
            </div>
          </DialogHeader>

          <div className={FORM_DIALOG_BODY_SCROLL}>
            {error ? (
              <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            ) : null}

            {hasItems ? (
              <div className={cn("flex flex-col", GRID_GAP)}>
                {items.map((item) => (
                  <PlannerCalendarDayItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  FORM_GROUP,
                  "flex flex-col items-center justify-center px-3 py-8 text-center",
                )}
              >
                <p className="text-sm font-medium">Tidak ada tagihan</p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                  Belum ada transaksi terjadwal di tanggal ini.
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-4"
                  onClick={openCreateForm}
                >
                  <PlusIcon />
                  Tambah Pay Plan
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PlannedItemFormDialog
        open={formOpen}
        item={null}
        defaultStartAt={defaultStartAt}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
