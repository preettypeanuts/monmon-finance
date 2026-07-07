"use client";

import { SidebarProfileDropdown } from "@/components/shared/sidebar-profile-dropdown";
import { SEPARATED_CONTROL } from "@/config/shape";
import { DotsThreeVerticalIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function SidebarProfileMenu() {
  return (
    <SidebarProfileDropdown
      trigger={
        <button
          type="button"
          aria-label="Menu akun"
          className={cn(
            SEPARATED_CONTROL,
            "flex size-7 shrink-0 items-center justify-center text-muted-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          )}
        >
          <DotsThreeVerticalIcon className="size-4" />
        </button>
      }
    />
  );
}
