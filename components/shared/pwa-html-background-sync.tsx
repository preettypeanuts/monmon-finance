"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useWallpaper } from "@/components/shared/wallpaper-provider";
import {
  applySolidBackground,
  applyWallpaperBackground,
  clearRootBackground,
} from "@/lib/pwa/root-background";
import { resolveUseWallpaperRoot } from "@/lib/pwa/safari-browser-chrome";
import { getWallpaperLayerStyle } from "@/lib/wallpaper/resolve-wallpaper";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";

/**
 * iOS standalone samples html/body for the status bar band.
 * Desktop: always wallpaper. Mobile PWA: wallpaper on Inbox/Overview only.
 * Mobile Safari browser: wallpaper on all routes (seamless chrome; no PWA change).
 */
export function PwaHtmlBackgroundSync() {
  const pathname = usePathname();
  const isMobile = useIsMobileViewport();
  const { wallpaper } = useWallpaper();
  const useWallpaperRoot = resolveUseWallpaperRoot(isMobile, pathname);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (useWallpaperRoot) {
      const style = getWallpaperLayerStyle(wallpaper);
      applyWallpaperBackground(html, style);
      applyWallpaperBackground(body, style);
    } else {
      applySolidBackground(html);
      applySolidBackground(body);
    }

    return () => {
      clearRootBackground(html);
      clearRootBackground(body);
    };
  }, [useWallpaperRoot, wallpaper]);

  return null;
}
