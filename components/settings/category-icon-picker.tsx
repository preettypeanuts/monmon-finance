"use client";

import { JournalCategoryIcon } from "@/components/journal/journal-category-icon";
import { cn } from "@/lib/utils";
import type { CategoryIconId } from "@/config/category-icons";
import { CATEGORY_ICON_OPTIONS } from "@/config/category-icons";
import type { CategoryIconAccent } from "@/config/category-icon-style";

interface CategoryIconPickerProps {
  value: CategoryIconId;
  onChange: (value: CategoryIconId) => void;
  type: "income" | "expense";
  accent: CategoryIconAccent;
  className?: string;
}

export function CategoryIconPicker({
  value,
  onChange,
  type,
  accent,
  className,
}: CategoryIconPickerProps) {
  return (
    <div
      className={cn(
        "grid max-h-72 grid-cols-4 gap-1.5 overflow-y-auto overscroll-contain rounded-2xl border border-black/6 bg-background/40 p-2 sm:grid-cols-5 dark:border-white/8",
        className,
      )}
      role="radiogroup"
      aria-label="Category icon"
    >
      {CATEGORY_ICON_OPTIONS.map((option) => {
        const selected = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center transition-colors",
              selected
                ? "border-primary/40 bg-primary/8"
                : "border-transparent hover:bg-accent/50",
            )}
          >
            <JournalCategoryIcon
              category="other"
              type={type}
              iconOverride={option.id}
              accentOverride={accent}
              className="size-9"
            />
            <span className="w-full truncate text-[10px] font-medium text-muted-foreground">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
