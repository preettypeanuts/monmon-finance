"use client";

import { CheckIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface AppleCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function AppleCheckbox({
  checked,
  onCheckedChange,
  id,
  className,
  disabled = false,
}: AppleCheckboxProps) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
        checked
          ? "border-[#007AFF] bg-[#007AFF] text-white dark:border-[#0A84FF] dark:bg-[#0A84FF]"
          : "border-black/25 bg-transparent dark:border-white/35",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {checked ? <CheckIcon className="size-3 stroke-[2.5]" /> : null}
    </button>
  );
}
