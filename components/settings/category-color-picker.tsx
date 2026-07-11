"use client";

import {
  CATEGORY_ICON_BADGE,
  categoryIconAccentStyle,
  type CategoryIconAccent,
} from "@/config/category-icon-style";
import {
  accentsEqual,
  CATEGORY_COLOR_OPTIONS,
  resolveCategoryColorOptionId,
} from "@/config/category-colors";
import { cn } from "@/lib/utils";

interface CategoryColorPickerProps {
  value: CategoryIconAccent;
  onChange: (value: CategoryIconAccent) => void;
  className?: string;
}

export function CategoryColorPicker({
  value,
  onChange,
  className,
}: CategoryColorPickerProps) {
  const selectedId = resolveCategoryColorOptionId(value);

  return (
    <div
      className={cn(
        "grid max-h-40 grid-cols-6 gap-2 overflow-y-auto overscroll-contain p-0.5 sm:grid-cols-8",
        className,
      )}
      role="radiogroup"
      aria-label="Category color"
    >
      {CATEGORY_COLOR_OPTIONS.map((option) => {
        const selected =
          option.id === selectedId || accentsEqual(option.accent, value);

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.accent)}
            className={cn(
              CATEGORY_ICON_BADGE,
              "size-9 transition-transform active:scale-95",
              selected
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "hover:scale-105",
            )}
            style={categoryIconAccentStyle(option.accent)}
          />
        );
      })}
    </div>
  );
}
