"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/shared/app-sidebar";

export function DesktopAppSidebar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return <AppSidebar />;
}
