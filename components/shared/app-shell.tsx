"use client";

import { AppearanceProvider } from "@/components/shared/appearance-provider";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { PersistentSidebarProvider } from "@/components/shared/persistent-sidebar-provider";
import { WallpaperBackground } from "@/components/shared/wallpaper-background";
import { WallpaperProvider } from "@/components/shared/wallpaper-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { SEPARATED_SIDEBAR_ICON_WIDTH } from "@/config/sidebar";
import type { ServerAppearance } from "@/lib/appearance/cookies";

interface AppShellProps {
  children: React.ReactNode;
  initialAppearance: ServerAppearance;
  initialSidebarOpen: boolean;
}

export function AppShell({
  children,
  initialAppearance,
  initialSidebarOpen,
}: AppShellProps) {
  return (
    <AppearanceProvider
      initialThemeMode={initialAppearance.themeMode}
      initialAccentId={initialAppearance.accentId}
      initialResolvedDark={initialAppearance.resolvedDark}
    >
      <WallpaperProvider>
        <WallpaperBackground />
        <PersistentSidebarProvider
          initialOpen={initialSidebarOpen}
          className="relative z-10 h-svh max-h-svh overflow-hidden bg-transparent"
          style={
            {
              "--sidebar-width-icon": SEPARATED_SIDEBAR_ICON_WIDTH,
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset className="min-h-0 overflow-hidden bg-transparent">
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              {children}
            </div>
          </SidebarInset>
        </PersistentSidebarProvider>
      </WallpaperProvider>
    </AppearanceProvider>
  );
}
