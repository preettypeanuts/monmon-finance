"use client";

import { AppContentSurface } from "@/components/shared/app-content-surface";
import { DesktopAppSidebar } from "@/components/shared/desktop-app-sidebar";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { MobileScrollChrome } from "@/components/shared/mobile-scroll-chrome";
import { MobileScrollChromeProvider } from "@/components/shared/mobile-scroll-chrome-provider";
import { AppearanceProvider } from "@/components/shared/appearance-provider";
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
          <DesktopAppSidebar />
          <SidebarInset className="min-h-0 overflow-hidden bg-transparent">
            <MobileScrollChromeProvider>
              <MobileScrollChrome />
              <AppContentSurface>{children}</AppContentSurface>
            </MobileScrollChromeProvider>
          </SidebarInset>
          <MobileBottomNav />
        </PersistentSidebarProvider>
      </WallpaperProvider>
    </AppearanceProvider>
  );
}
