"use client";

import Link from "next/link";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { APP_NAME, APP_NAME_INITIAL, APP_TAGLINE } from "@/config/app";
import { SEPARATED_CONTROL } from "@/config/shape";
import {
  SEPARATED_MENU_ITEM,
  SIDEBAR_APP_ICON_GRADIENTS,
  SIDEBAR_APP_ICON_SHELL,
} from "@/config/sidebar";
import { cn } from "@/lib/utils";

interface SidebarBrandButtonProps {
  className?: string;
}

export function SidebarBrandButton({ className }: SidebarBrandButtonProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuButton
      size="lg"
      className={cn(
        SEPARATED_MENU_ITEM,
        "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-[0.7rem]! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:hover:bg-transparent!",
        className,
      )}
      render={<Link href="/" />}
    >
      <div
        className={cn(
          "flex aspect-square size-8 shrink-0 items-center justify-center",
          isCollapsed
            ? cn(
                SIDEBAR_APP_ICON_SHELL,
                "bg-linear-to-b",
                SIDEBAR_APP_ICON_GRADIENTS.brand,
              )
            : cn("bg-primary text-primary-foreground", SEPARATED_CONTROL),
        )}
      >
        <span
          className={cn(
            "text-sm font-semibold",
            isCollapsed && "text-white drop-shadow-sm",
          )}
        >
          {APP_NAME_INITIAL}
        </span>
      </div>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-semibold">{APP_NAME}</span>
        <span className="truncate text-xs text-muted-foreground">
          {APP_TAGLINE}
        </span>
      </div>
    </SidebarMenuButton>
  );
}
