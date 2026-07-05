"use client";

import { useState, useTransition } from "react";
import {
  deleteCategoryBudgetAction,
  saveCategoryBudgetAction,
} from "@/app/actions/budget";
import { BudgetCard } from "@/components/planner/budget-card";
import { BudgetFormDialog } from "@/components/planner/budget-form-dialog";
import { BudgetMonthHeader } from "@/components/planner/budget-month-header";
import { Button } from "@/components/ui/button";
import { BUDGET_CARD_GRID } from "@/config/budget";
import { CONTROL_GAP, STACK_GAP } from "@/config/spacing";
import { PlusIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { BudgetStatus } from "@/types/budget";

interface BudgetManageProps {
  monthKey: string;
  budgets: BudgetStatus[];
}

export function BudgetManage({ monthKey, budgets }: BudgetManageProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<BudgetStatus | null>(null);
  const [isPending, startTransition] = useTransition();

  const usedCategories = budgets.map((entry) => entry.budget.category);

  function openCreate() {
    setEditingStatus(null);
    setSheetOpen(true);
  }

  function openEdit(status: BudgetStatus) {
    setEditingStatus(status);
    setSheetOpen(true);
  }

  function handleDelete(status: BudgetStatus) {
    const confirmed = window.confirm(
      `Hapus budget ${status.categoryLabel} untuk bulan ini?`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteCategoryBudgetAction(status.budget.id);
    });
  }

  async function handleSubmit(formData: FormData): Promise<boolean> {
    const result = await saveCategoryBudgetAction(formData);
    if (!result.ok) {
      window.alert(result.error);
      return false;
    }

    return true;
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", STACK_GAP)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-between gap-3",
          CONTROL_GAP,
        )}
      >
        <BudgetMonthHeader monthKey={monthKey} />
        <Button
          type="button"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={openCreate}
          disabled={isPending}
        >
          <PlusIcon className="size-4" />
          Tambah
        </Button>
      </div>

      {budgets.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 px-6 py-16 text-center dark:border-white/12">
          <p className="text-sm font-medium text-foreground/90">
            Belum ada budget kategori
          </p>
          <p className="mt-1 max-w-sm text-[11px] text-muted-foreground">
            Contoh: Makanan 50K/hari × 30 hari = Rp 1.500.000. Hanya pengeluaran
            yang dicatat manual di Inbox yang mengurangi sisa budget.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-4 gap-1.5"
            onClick={openCreate}
          >
            <PlusIcon className="size-4" />
            Buat budget pertama
          </Button>
        </div>
      ) : (
        <div className={BUDGET_CARD_GRID}>
          {budgets.map((status) => (
            <BudgetCard
              key={status.budget.id}
              status={status}
              disabled={isPending}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <BudgetFormDialog
        open={sheetOpen}
        status={editingStatus}
        periodMonth={monthKey}
        usedCategories={usedCategories}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
