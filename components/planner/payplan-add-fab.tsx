"use client";

import { PAYPLAN_ADD_FAB } from "@/config/payplan-mobile";
import { PlusIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PayplanAddFabProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export function PayplanAddFab({
  onClick,
  className,
  label = "Tambah Pay Plan",
}: PayplanAddFabProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(PAYPLAN_ADD_FAB, className)}
    >
      <PlusIcon aria-hidden className="size-6" />
    </button>
  );
}
