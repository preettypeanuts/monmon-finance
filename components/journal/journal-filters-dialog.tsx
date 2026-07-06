"use client";

import { JournalFilterFields } from "@/components/journal/journal-filter-fields";
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
} from "@/config/form-dialog";

import type { JournalFilters } from "@/types/journal";

interface JournalFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: JournalFilters["type"];
  category: JournalFilters["category"];
  onTypeChange: (value: JournalFilters["type"]) => void;
  onCategoryChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function JournalFiltersDialog({
  open,
  onOpenChange,
  type,
  category,
  onTypeChange,
  onCategoryChange,
  onApply,
  onReset,
}: JournalFiltersDialogProps) {
  function handleApply() {
    onApply();
    onOpenChange(false);
  }

  function handleReset() {
    onReset();
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
            Saring transaksi berdasarkan tipe dan kategori.
          </DialogDescription>
        </DialogHeader>

        <div className={FORM_DIALOG_BODY_SCROLL}>
          <JournalFilterFields
            type={type}
            category={category}
            onTypeChange={onTypeChange}
            onCategoryChange={onCategoryChange}
            onApply={handleApply}
            onReset={handleReset}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
