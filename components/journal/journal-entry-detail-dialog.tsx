"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  deleteJournalEntryAction,
  saveJournalEntryAction,
} from "@/app/actions/journal";
import { JournalCategoryIcon } from "@/components/journal/journal-category-icon";
import { JournalTypeBadge } from "@/components/journal/journal-type-badge";
import { AmountTextInput } from "@/components/shared/amount-text-input";
import { FormDatePicker } from "@/components/shared/form-date-picker";
import { FormDialogField } from "@/components/shared/form-dialog-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  isIncomeCategory,
  TRANSACTION_CATEGORIES,
  getCategoryLabel,
  type TransactionCategoryId,
} from "@/config/categories";
import {
  FORM_DIALOG_BODY_SCROLL,
  FORM_DIALOG_CONTENT_WIDE,
  FORM_DIALOG_FOOTER,
  FORM_DIALOG_HEADER,
  FORM_FIELD_DATE,
  FORM_FIELD_GRID_ROW,
  FORM_FIELD_INPUT,
  FORM_FIELD_SELECT,
  FORM_GROUP,
  FORM_NOTE,
  FORM_PREVIEW_COMPACT,
  FORM_PREVIEW_COMPACT_AMOUNT,
  FORM_SEGMENT,
  FORM_SEGMENT_ACTIVE,
  FORM_SEGMENT_INACTIVE,
  FORM_SEGMENTED,
} from "@/config/form-dialog";
import {
  PLANNER_SELECT_CONTENT,
  PLANNER_SELECT_ITEM,
  PLANNER_SELECT_TRIGGER,
} from "@/config/planner-manage";
import { SEPARATED_CONTROL } from "@/config/shape";
import { formatDateTime } from "@/lib/finance/format-datetime";
import { formatIdr } from "@/lib/finance/format-currency";
import { PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/lib/validations/planned-item";
import type { JournalEntry } from "@/types/journal";
import type { TransactionType } from "@/types/transaction";

type DialogMode = "view" | "edit";

interface JournalEntryDetailDialogProps {
  open: boolean;
  entry: JournalEntry | null;
  onOpenChange: (open: boolean) => void;
}

function getDefaultCategoryForType(
  type: TransactionType,
): TransactionCategoryId {
  const match = TRANSACTION_CATEGORIES.find((category) =>
    type === "income"
      ? isIncomeCategory(category.id as TransactionCategoryId)
      : !isIncomeCategory(category.id as TransactionCategoryId),
  );

  return (match?.id ?? "other") as TransactionCategoryId;
}

function resolveCategoryForEntry(
  type: TransactionType,
  category: string,
): TransactionCategoryId {
  const normalized = category as TransactionCategoryId;
  const isIncome = isIncomeCategory(normalized);

  if ((type === "income" && isIncome) || (type === "expense" && !isIncome)) {
    return normalized;
  }

  return getDefaultCategoryForType(type);
}

export function JournalEntryDetailDialog({
  open,
  entry,
  onOpenChange,
}: JournalEntryDetailDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<DialogMode>("view");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<TransactionCategoryId>("food");
  const [occurredAtText, setOccurredAtText] = useState("");

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open || !entry) {
      return;
    }

    setMode("view");
    setType(entry.type);
    setCategory(resolveCategoryForEntry(entry.type, entry.category));
    setOccurredAtText(toDateInputValue(entry.occurredAt));
  }, [open, entry]);

  const categoryOptions = useMemo(
    () =>
      TRANSACTION_CATEGORIES.filter((item) =>
        type === "income"
          ? isIncomeCategory(item.id as TransactionCategoryId)
          : !isIncomeCategory(item.id as TransactionCategoryId),
      ),
    [type],
  );

  if (!entry) {
    return null;
  }

  const currentEntry = entry;
  const isIncome = currentEntry.type === "income";
  const title = currentEntry.rawInput.trim() || currentEntry.description;
  const categoryLabel = getCategoryLabel(currentEntry.category);
  const showDescription =
    currentEntry.description.trim().length > 0 &&
    currentEntry.description.trim() !== currentEntry.rawInput.trim();
  const showRawInput = currentEntry.rawInput.trim().length > 0;
  const dialogTitle = isEdit ? "Edit transaksi" : title;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategory((current) => resolveCategoryForEntry(nextType, current));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("id", currentEntry.id);
    formData.set("type", type);
    formData.set("category", category);

    startTransition(async () => {
      const result = await saveJournalEntryAction(formData);

      if (!result.ok) {
        return;
      }

      onOpenChange(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteJournalEntryAction(currentEntry.id);

      if (!result.ok) {
        return;
      }

      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setMode("view");
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className={FORM_DIALOG_CONTENT_WIDE}>
        <DialogHeader className={FORM_DIALOG_HEADER}>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-snug">
            {isEdit
              ? "Perbarui detail transaksi yang tercatat dari inbox."
              : "Detail transaksi dan opsi kelola."}
          </DialogDescription>
        </DialogHeader>

        {isEdit ? (
          <form
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            onSubmit={handleSubmit}
          >
            <div className={FORM_DIALOG_BODY_SCROLL}>
              <div className={FORM_GROUP}>
                <fieldset className="border-0 px-4 py-3">
                  <legend className="sr-only">Jenis transaksi</legend>
                  <div className={FORM_SEGMENTED}>
                    <button
                      type="button"
                      aria-pressed={type === "expense"}
                      onClick={() => handleTypeChange("expense")}
                      className={cn(
                        FORM_SEGMENT,
                        type === "expense"
                          ? FORM_SEGMENT_ACTIVE
                          : FORM_SEGMENT_INACTIVE,
                      )}
                    >
                      Keluar
                    </button>
                    <button
                      type="button"
                      aria-pressed={type === "income"}
                      onClick={() => handleTypeChange("income")}
                      className={cn(
                        FORM_SEGMENT,
                        type === "income"
                          ? FORM_SEGMENT_ACTIVE
                          : FORM_SEGMENT_INACTIVE,
                      )}
                    >
                      Masuk
                    </button>
                  </div>
                </fieldset>

                <div className={FORM_FIELD_GRID_ROW}>
                  <FormDialogField
                    label="Nominal (Rp)"
                    htmlFor="journal-amount"
                    gridItem
                  >
                    <AmountTextInput
                      id="journal-amount"
                      name="amount"
                      required
                      defaultValue={String(currentEntry.amount)}
                      className={FORM_FIELD_INPUT}
                      placeholder="0"
                    />
                  </FormDialogField>

                  <FormDialogField
                    label="Tanggal"
                    htmlFor="journal-date"
                    gridItem
                  >
                    <FormDatePicker
                      id="journal-date"
                      name="occurredAt"
                      value={occurredAtText}
                      onChange={setOccurredAtText}
                      className={FORM_FIELD_DATE}
                    />
                  </FormDialogField>
                </div>

                <FormDialogField label="Deskripsi" htmlFor="journal-description">
                  <Input
                    id="journal-description"
                    name="description"
                    required
                    defaultValue={currentEntry.description}
                    className={FORM_FIELD_INPUT}
                    placeholder="Belanja harian, gaji, dll."
                  />
                </FormDialogField>

                <FormDialogField label="Kategori" htmlFor="journal-category">
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      if (value) {
                        setCategory(value as TransactionCategoryId);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="journal-category"
                      className={cn(FORM_FIELD_SELECT, PLANNER_SELECT_TRIGGER)}
                    >
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent className={PLANNER_SELECT_CONTENT}>
                      {categoryOptions.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          className={PLANNER_SELECT_ITEM}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormDialogField>
              </div>

              <div className={FORM_GROUP}>
                <FormDialogField label="Pesan inbox" htmlFor="journal-raw-input">
                  <Textarea
                    id="journal-raw-input"
                    name="rawInput"
                    rows={3}
                    defaultValue={currentEntry.rawInput}
                    placeholder="Pesan asli dari inbox"
                    className={FORM_NOTE}
                  />
                </FormDialogField>
              </div>
            </div>

            <div className={FORM_DIALOG_FOOTER}>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className={cn(SEPARATED_CONTROL, "flex-1")}
                onClick={() => setMode("view")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className={cn(SEPARATED_CONTROL, "flex-1")}
              >
                Simpan
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className={FORM_DIALOG_BODY_SCROLL}>
              <div className="flex items-center gap-3 px-1 pb-1">
                <JournalCategoryIcon
                  category={currentEntry.category}
                  type={currentEntry.type}
                />
                <JournalTypeBadge type={currentEntry.type} />
              </div>

              <div className={FORM_PREVIEW_COMPACT}>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    Jumlah
                  </p>
                  <p
                    className={cn(
                      "mt-0.5",
                      FORM_PREVIEW_COMPACT_AMOUNT,
                      isIncome
                        ? "text-[#2FAE52] dark:text-[#34C759]"
                        : "text-[#E85555] dark:text-[#FF6B6B]",
                    )}
                  >
                    {isIncome ? "+" : "−"}
                    {formatIdr(currentEntry.amount)}
                  </p>
                </div>
                <div className="shrink-0 text-right text-[11px] leading-snug text-muted-foreground">
                  <p>{categoryLabel}</p>
                  <p className="font-medium text-foreground">
                    {isIncome ? "Pemasukan" : "Pengeluaran"}
                  </p>
                </div>
              </div>

              <div className={FORM_GROUP}>
                <div className="px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Waktu
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                    {formatDateTime(currentEntry.occurredAt)}
                  </p>
                </div>
              </div>

              {showDescription ? (
                <div className={FORM_GROUP}>
                  <div className="px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Deskripsi
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                      {currentEntry.description}
                    </p>
                  </div>
                </div>
              ) : null}

              {showRawInput ? (
                <div className={FORM_GROUP}>
                  <div className="px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Pesan inbox
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                      {currentEntry.rawInput}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={FORM_DIALOG_FOOTER}>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                disabled={isPending}
                className={cn(SEPARATED_CONTROL, "shrink-0")}
                onClick={handleDelete}
                aria-label="Hapus"
              >
                <span className="sr-only">Hapus</span>
                <TrashIcon className="size-4" />
              </Button>
              <div className="flex min-w-0 flex-1 gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={isPending}
                  className={cn(SEPARATED_CONTROL, "shrink-0")}
                  onClick={() => setMode("edit")}
                  aria-label="Edit"
                >
                  <span className="sr-only">Edit</span>
                  <PencilSimpleIcon className="size-4" />
                </Button>

                <Button
                  type="button"
                  disabled={isPending}
                  className={cn(SEPARATED_CONTROL, "flex-1")}
                  onClick={() => onOpenChange(false)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
