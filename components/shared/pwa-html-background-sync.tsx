"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { isWallpaperRoute } from "@/config/page-surface";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { getWallpaperLayerStyle } from "@/lib/wallpaper/resolve-wallpaper";

function applyWallpaperBackground(
  element: HTMLElement,
  style: ReturnType<typeof getWallpaperLayerStyle>,
) {
  element.style.background = "";
  element.style.backgroundColor = style.backgroundColor
    ? String(style.backgroundColor)
    : "";
  element.style.backgroundImage = style.backgroundImage
    ? String(style.backgroundImage)
    : "";
  element.style.backgroundSize = style.backgroundSize
    ? String(style.backgroundSize)
    : "";
  element.style.backgroundPosition = style.backgroundPosition
    ? String(style.backgroundPosition)
    : "";
  element.style.backgroundRepeat = style.backgroundRepeat
    ? String(style.backgroundRepeat)
    : "";
}

function applySolidBackground(element: HTMLElement) {
  element.style.background = "";
  element.style.backgroundColor = "var(--background)";
  element.style.backgroundImage = "";
  element.style.backgroundSize = "";
  element.style.backgroundPosition = "";
  element.style.backgroundRepeat = "";
}

function clearRootBackground(element: HTMLElement) {
  element.style.background = "";
  element.style.backgroundColor = "";
  element.style.backgroundImage = "";
  element.style.backgroundSize = "";
  element.style.backgroundPosition = "";
  element.style.backgroundRepeat = "";
}

/**
 * iOS standalone samples html/body for the status bar band.
 * Desktop: always wallpaper. Mobile: wallpaper on Inbox/Overview only.
 */
export function PwaHtmlBackgroundSync() {
  const pathname = usePathname();
  const isMobile = useIsMobileViewport();
  const { wallpaper } = useWallpaper();
  const useWallpaperRoot = !isMobile || isWallpaperRoute(pathname);

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
