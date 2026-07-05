"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  TRANSACTION_CATEGORIES,
  getCategoryLabel,
} from "@/config/categories";
import { PLAN_STATUS_LABEL, PLANS_WIDGET_TILE } from "@/config/plans";
import {
  PLANNER_SELECT_CONTENT,
  PLANNER_SELECT_ITEM,
  PLANNER_SELECT_TRIGGER,
} from "@/config/planner-manage";
import { SEPARATED_CONTROL } from "@/config/shape";
import { formatIdr } from "@/lib/finance/format-currency";
import { cn } from "@/lib/utils";
import type { PlanRecord, PlanStatus } from "@/types/plan";

type DialogMode = "view" | "edit" | "create";

interface PlanDetailDialogProps {
  open: boolean;
  plan: PlanRecord | null;
  mode: DialogMode;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: DialogMode) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete: (plan: PlanRecord) => Promise<void>;
}

const EXPENSE_CATEGORIES = TRANSACTION_CATEGORIES.filter(
  (category) =>
    category.id !== "salary" &&
    category.id !== "side_income" &&
    category.id !== "other",
);

export function PlanDetailDialog({
  open,
  plan,
  mode,
  onOpenChange,
  onModeChange,
  onSubmit,
  onDelete,
}: PlanDetailDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("shopping");
  const [status, setStatus] = useState<PlanStatus>("active");
  const isForm = mode === "edit" || mode === "create";
  const title =
    mode === "create"
      ? "Plan baru"
      : mode === "edit"
        ? "Edit plan"
        : (plan?.name ?? "Detail plan");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (plan && mode !== "create") {
      setCategory(plan.category);
      setStatus(plan.status);
      return;
    }

    setCategory("shopping");
    setStatus("active");
  }, [open, plan, mode]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("category", category);
    formData.set("status", status);

    if (plan && mode === "edit") {
      formData.set("id", plan.id);
    }

    startTransition(async () => {
      await onSubmit(formData);
    });
  }

  function handleDelete() {
    if (!plan) {
      return;
    }

    startTransition(async () => {
      await onDelete(plan);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isForm
              ? "Wishlist belanja untuk menghitung estimasi sisa saldo."
              : "Detail plan dan opsi kelola."}
          </DialogDescription>
        </DialogHeader>

        {isForm ? (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {plan && mode === "edit" ? (
              <input type="hidden" name="id" value={plan.id} />
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor="plan-name">Nama</Label>
              <Input
                id="plan-name"
                name="name"
                required
                defaultValue={mode === "edit" ? (plan?.name ?? "") : ""}
                placeholder="Contoh: iPhone 16"
                className={SEPARATED_CONTROL}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="plan-amount">Estimasi harga</Label>
              <Input
                id="plan-amount"
                name="amount"
                required
                defaultValue={
                  mode === "edit" && plan ? String(plan.amount) : ""
                }
                placeholder="15jt atau 15000000"
                className={SEPARATED_CONTROL}
              />
            </div>

            <div className="grid gap-2">
              <Label>Kategori</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as string)}
              >
                <SelectTrigger className={cn(PLANNER_SELECT_TRIGGER, SEPARATED_CONTROL)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={PLANNER_SELECT_CONTENT}>
                  {EXPENSE_CATEGORIES.map((entry) => (
                    <SelectItem
                      key={entry.id}
                      value={entry.id}
                      className={PLANNER_SELECT_ITEM}
                    >
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as PlanStatus)}
              >
                <SelectTrigger className={cn(PLANNER_SELECT_TRIGGER, SEPARATED_CONTROL)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={PLANNER_SELECT_CONTENT}>
                  <SelectItem value="active" className={PLANNER_SELECT_ITEM}>
                    {PLAN_STATUS_LABEL.active}
                  </SelectItem>
                  <SelectItem value="done" className={PLANNER_SELECT_ITEM}>
                    {PLAN_STATUS_LABEL.done}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="plan-note">Catatan</Label>
              <Textarea
                id="plan-note"
                name="note"
                rows={3}
                defaultValue={mode === "edit" ? (plan?.note ?? "") : ""}
                placeholder="Opsional"
                className={SEPARATED_CONTROL}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className={SEPARATED_CONTROL}
                onClick={() => {
                  if (mode === "edit" && plan) {
                    onModeChange("view");
                    return;
                  }

                  onOpenChange(false);
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className={SEPARATED_CONTROL}
              >
                {mode === "create" ? "Tambah" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        ) : plan ? (
          <div className="grid gap-4">
            <div className={cn(PLANS_WIDGET_TILE, "grid gap-2")}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Estimasi</span>
                <span className="text-base font-semibold tabular-nums">
                  {formatIdr(plan.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Kategori</span>
                <span className="text-sm font-medium">
                  {getCategoryLabel(plan.category)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className="text-sm font-medium">
                  {PLAN_STATUS_LABEL[plan.status]}
                </span>
              </div>
              {plan.note ? (
                <div className="border-t border-border/60 pt-2">
                  <p className="text-xs text-muted-foreground">Catatan</p>
                  <p className="mt-1 text-sm text-foreground/90">{plan.note}</p>
                </div>
              ) : null}
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                disabled={isPending}
                className={SEPARATED_CONTROL}
                onClick={handleDelete}
              >
                Hapus
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className={SEPARATED_CONTROL}
                  onClick={() => onModeChange("edit")}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  className={SEPARATED_CONTROL}
                  onClick={() => onOpenChange(false)}
                >
                  Tutup
                </Button>
              </div>
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
