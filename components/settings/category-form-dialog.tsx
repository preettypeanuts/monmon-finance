"use client";

import { useEffect, useState, useTransition } from "react";

import { CategoryColorPicker } from "@/components/settings/category-color-picker";
import { CategoryIconPicker } from "@/components/settings/category-icon-picker";
import { FormDialogField } from "@/components/shared/form-dialog-field";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FORM_DIALOG_BODY_SCROLL,
  FORM_FIELD_INPUT,
  FORM_GROUP,
} from "@/config/form-dialog";
import {
  SETTINGS_CATEGORIES_FORM_DESC,
  SETTINGS_CATEGORIES_FORM_NAME,
  SETTINGS_CATEGORIES_FORM_SAVE,
  SETTINGS_CATEGORIES_FORM_SAVING,
  SETTINGS_CATEGORIES_FORM_TITLE_CUSTOM,
  SETTINGS_CATEGORIES_FORM_TITLE_EDIT,
  SETTINGS_CATEGORIES_FORM_TYPE,
  SETTINGS_CATEGORIES_FORM_COLOR,
  SETTINGS_CATEGORIES_TYPE_EXPENSE,
  SETTINGS_CATEGORIES_TYPE_INCOME,
  UI_LABEL_CANCEL,
} from "@/config/settings-labels";
import { SEPARATED_CONTROL } from "@/config/shape";
import { resolveCategoryIconId } from "@/config/category-icons";
import {
  DEFAULT_CATEGORY_ICON_ACCENT,
  type CategoryIconAccent,
} from "@/config/category-icon-style";
import { useUserCategoryCatalog } from "@/components/providers/user-category-catalog-provider";
import type { CategoryIconId } from "@/config/category-icons";
import type { ResolvedCategory } from "@/types/user-category";
import type { TransactionType } from "@/types/transaction";
import { cn } from "@/lib/utils";

export type CategoryFormMode =
  | { kind: "custom-new" }
  | { kind: "custom-edit"; recordId: string; entry: ResolvedCategory }
  | { kind: "builtin-edit"; slug: string; entry: ResolvedCategory };

interface CategoryFormDialogProps {
  open: boolean;
  mode: CategoryFormMode | null;
  onOpenChange: (open: boolean) => void;
}

export function CategoryFormDialog({
  open,
  mode,
  onOpenChange,
}: CategoryFormDialogProps) {
  const { createCategory, updateCategory } = useUserCategoryCatalog();
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState<CategoryIconId>("dots-three");
  const [accent, setAccent] = useState<CategoryIconAccent>(
    DEFAULT_CATEGORY_ICON_ACCENT,
  );
  const [type, setType] = useState<TransactionType>("expense");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !mode) {
      return;
    }

    if (mode.kind === "custom-new") {
      setLabel("");
      setIcon("dots-three");
      setAccent(DEFAULT_CATEGORY_ICON_ACCENT);
      setType("expense");
      setError(null);
      return;
    }

    setLabel(mode.entry.label);
    setIcon(resolveCategoryIconId(mode.entry.icon));
    setAccent(mode.entry.accent);
    setType(mode.entry.type);
    setError(null);
  }, [mode, open]);

  const title =
    mode?.kind === "custom-new"
      ? SETTINGS_CATEGORIES_FORM_TITLE_CUSTOM
      : SETTINGS_CATEGORIES_FORM_TITLE_EDIT;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mode) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result =
        mode.kind === "custom-new"
          ? await createCategory(formData)
          : await updateCategory(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      onOpenChange(false);
    });
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={title}>
      <ResponsiveDialogHeader>
        <DialogTitle className="text-lg font-semibold tracking-tight">
          {title}
        </DialogTitle>
        <DialogDescription className="text-[13px] leading-snug">
          {SETTINGS_CATEGORIES_FORM_DESC}
        </DialogDescription>
      </ResponsiveDialogHeader>

      <form
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <ResponsiveDialogBody className={FORM_DIALOG_BODY_SCROLL}>
          {mode?.kind === "custom-edit" ? (
            <input type="hidden" name="id" value={mode.recordId} />
          ) : null}
          {mode?.kind === "builtin-edit" ? (
            <>
              <input type="hidden" name="mode" value="override" />
              <input type="hidden" name="slug" value={mode.slug} />
              <input type="hidden" name="type" value={mode.entry.type} />
            </>
          ) : null}
          {mode?.kind === "custom-new" || mode?.kind === "custom-edit" ? (
            <input type="hidden" name="type" value={type} />
          ) : null}
          <input type="hidden" name="icon" value={icon} />
          <input type="hidden" name="accentLight" value={accent.light} />
          <input type="hidden" name="accentDark" value={accent.dark} />
          <input type="hidden" name="label" value={label} />

          <div className={FORM_GROUP}>
            <FormDialogField
              label={SETTINGS_CATEGORIES_FORM_NAME}
              htmlFor="category-label"
            >
              <Input
                id="category-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Coffee, Pets, Side hustle..."
                className={FORM_FIELD_INPUT}
                required
                minLength={2}
                maxLength={48}
              />
            </FormDialogField>

            {mode?.kind === "custom-new" ? (
              <FormDialogField label={SETTINGS_CATEGORIES_FORM_TYPE}>
                <div
                  className="grid grid-cols-2 gap-2"
                  role="tablist"
                  aria-label={SETTINGS_CATEGORIES_FORM_TYPE}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={type === "expense"}
                    onClick={() => setType("expense")}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                      type === "expense"
                        ? "border-primary/40 bg-primary/8 text-foreground"
                        : "border-black/6 text-muted-foreground dark:border-white/8",
                    )}
                  >
                    {SETTINGS_CATEGORIES_TYPE_EXPENSE}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={type === "income"}
                    onClick={() => setType("income")}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                      type === "income"
                        ? "border-primary/40 bg-primary/8 text-foreground"
                        : "border-black/6 text-muted-foreground dark:border-white/8",
                    )}
                  >
                    {SETTINGS_CATEGORIES_TYPE_INCOME}
                  </button>
                </div>
              </FormDialogField>
            ) : null}

            <FormDialogField label="Icon">
              <CategoryIconPicker
                value={icon}
                onChange={setIcon}
                type={type}
                accent={accent}
              />
            </FormDialogField>

            <FormDialogField label={SETTINGS_CATEGORIES_FORM_COLOR}>
              <CategoryColorPicker value={accent} onChange={setAccent} />
            </FormDialogField>
          </div>

          {error ? (
            <p className="px-1 text-sm text-destructive">{error}</p>
          ) : null}
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className={cn(SEPARATED_CONTROL, "flex-1")}
            onClick={() => onOpenChange(false)}
          >
            {UI_LABEL_CANCEL}
          </Button>
          <Button
            type="submit"
            disabled={isPending || label.trim().length < 2}
            className={cn(SEPARATED_CONTROL, "flex-1")}
          >
            {isPending
              ? SETTINGS_CATEGORIES_FORM_SAVING
              : SETTINGS_CATEGORIES_FORM_SAVE}
          </Button>
        </ResponsiveDialogFooter>
      </form>
    </ResponsiveDialog>
  );
}
