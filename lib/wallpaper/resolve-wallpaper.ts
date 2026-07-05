import type { CSSProperties } from "react";
import { DEFAULT_WALLPAPER_ID, WALLPAPERS } from "@/config/wallpapers";
import {
  type CustomWallpaperSlots,
  customWallpaperIdForSlot,
  isCustomWallpaperId,
  LEGACY_CUSTOM_WALLPAPER_ID,
  normalizeStoredWallpaperId,
  slotForCustomWallpaperId,
} from "@/lib/wallpaper/custom-wallpaper";
import type { Wallpaper, WallpaperId } from "@/types/wallpaper";

export function resolveWallpaper(id: WallpaperId): Wallpaper {
  return WALLPAPERS.find((wallpaper) => wallpaper.id === id) ?? WALLPAPERS[0];
}

export function resolveCustomWallpaper(
  imageUrl: string,
  slot: number,
): Wallpaper {
  return {
    id: customWallpaperIdForSlot(slot),
    label: `Kustom ${slot + 1}`,
    preview: imageUrl,
    background: imageUrl,
    kind: "image",
  };
}

export function resolveActiveWallpaper(
  id: WallpaperId,
  customWallpaperSlots: CustomWallpaperSlots,
): Wallpaper {
  const normalizedId = normalizeStoredWallpaperId(id) as WallpaperId;
  const slot = slotForCustomWallpaperId(normalizedId);

  if (slot !== null) {
    const imageUrl = customWallpaperSlots[slot];
    if (imageUrl) {
      return resolveCustomWallpaper(imageUrl, slot);
    }

    return resolveWallpaper(DEFAULT_WALLPAPER_ID);
  }

  return resolveWallpaper(normalizedId);
}

export function isActiveCustomWallpaper(
  id: WallpaperId,
  customWallpaperSlots: CustomWallpaperSlots,
): boolean {
  const slot = slotForCustomWallpaperId(normalizeStoredWallpaperId(id));
  return slot !== null && customWallpaperSlots[slot] !== null;
}

export function getDefaultWallpaperId(): WallpaperId {
  return DEFAULT_WALLPAPER_ID;
}

export function getWallpaperBackgroundStyle(
  wallpaper: Wallpaper,
): CSSProperties {
  if (wallpaper.kind === "image") {
    return {
      backgroundColor: "var(--background)",
      backgroundImage: `url("${wallpaper.background}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return { background: wallpaper.background };
}

export function getWallpaperPreviewStyle(
  wallpaper: Pick<Wallpaper, "kind" | "preview">,
): CSSProperties {
  if (wallpaper.kind === "image") {
    return {
      backgroundImage: `url("${wallpaper.preview}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return { background: wallpaper.preview };
}

export { isCustomWallpaperId, LEGACY_CUSTOM_WALLPAPER_ID };
