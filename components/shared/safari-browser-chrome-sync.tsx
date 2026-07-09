"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAppearance } from "@/components/shared/appearance-provider";
import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import {
  applySafariBrowserThemeColor,
  resolveSafariBrowserThemeColor,
  resolveUseWallpaperRoot,
  shouldSyncSafariBrowserChrome,
} from "@/lib/pwa/safari-browser-chrome";

/** Mobile Safari browser only — tints translucent tab chrome to match wallpaper. */
export function SafariBrowserChromeSync() {
  const pathname = usePathname();
  const isMobile = useIsMobileViewport();
  const { wallpaper, wallpaperId, maskOpacity, maskColor } = useWallpaper();
  const { resolvedDark } = useAppearance();
  const useWallpaperRoot = resolveUseWallpaperRoot(isMobile, pathname);

  useEffect(() => {
    if (!shouldSyncSafariBrowserChrome(isMobile)) {
      return;
    }

    const color = resolveSafariBrowserThemeColor({
      wallpaperId,
      wallpaper,
      resolvedDark,
      useWallpaperRoot,
      maskOpacity,
      maskColor,
    });

    applySafariBrowserThemeColor(color);
  }, [
    isMobile,
    maskColor,
    maskOpacity,
    pathname,
    resolvedDark,
    useWallpaperRoot,
    wallpaper,
    wallpaperId,
  ]);

  return null;
}
