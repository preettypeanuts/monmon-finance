"use client";

import { MOBILE_ADD_FAB_ICON } from "@/config/mobile-nav";
import { PLANS_ADD_FAB } from "@/config/plans";
import { PlusIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PlansAddFabProps {
  onClick: () => void;
  className?: string;
}

export function PlansAddFab({ onClick, className }: PlansAddFabProps) {
  return (
    <button
      type="button"
      aria-label="Tambah wish"
      onClick={onClick}
      className={cn(PLANS_ADD_FAB, className)}
    >
      <PlusIcon aria-hidden className={MOBILE_ADD_FAB_ICON} />
    </button>
  );
}
