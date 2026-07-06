"use client";

import { usePathname } from "next/navigation";

import { isWallpaperRoute, SOLID_PAGE_ROOT } from "@/config/page-surface";
import { cn } from "@/lib/utils";

interface AppContentSurfaceProps {
  children: React.ReactNode;
}

export function AppContentSurface({ children }: AppContentSurfaceProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden",
        !isWallpaperRoute(pathname) && SOLID_PAGE_ROOT,
      )}
    >
      {children}
    </div>
  );
}
