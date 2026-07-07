"use client";

import { usePathname } from "next/navigation";

import { useWallpaper } from "@/components/shared/wallpaper-provider";
import { isWallpaperRoute } from "@/config/page-surface";
import { PWA_FULLSCREEN_BLEED, PWA_WALLPAPER_MASK } from "@/config/pwa";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { cn } from "@/lib/utils";
import { getWallpaperLayerStyle } from "@/lib/wallpaper/resolve-wallpaper";

export function WallpaperBackground() {
  const pathname = usePathname();
  const isMobile = useIsMobileViewport();
  const { wallpaper, maskOpacity, maskColor } = useWallpaper();

  if (isMobile && !isWallpaperRoute(pathname)) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none transition-[background-color,background-image] duration-500 ease-out",
          PWA_FULLSCREEN_BLEED,
        )}
        style={getWallpaperLayerStyle(wallpaper)}
      />
      {maskOpacity > 0 ? (
        <div
          aria-hidden
          className={cn(
            maskColor === "black" ? "bg-black" : "bg-white",
            PWA_WALLPAPER_MASK,
            "pointer-events-none transition-opacity duration-300",
          )}
          style={{ opacity: maskOpacity / 100 }}
        />
      ) : null}
    </>
  );
}
