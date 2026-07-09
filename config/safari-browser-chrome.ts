import type { WallpaperId } from "@/types/wallpaper";

/** Top-edge tint per wallpaper — Safari samples this for browser chrome. */
export const SAFARI_WALLPAPER_THEME_COLORS: Partial<
  Record<WallpaperId, { light: string; dark: string }>
> = {
  default: { light: "#ffffff", dark: "#1f1f1f" },
  aurora: { light: "#f0edf8", dark: "#1e1e24" },
  sunset: { light: "#fff8f4", dark: "#241e1c" },
  ocean: { light: "#f2f8ff", dark: "#1a1e24" },
  forest: { light: "#f4faf5", dark: "#1c211e" },
  midnight: { light: "#1a1a2e", dark: "#0f0f14" },
  rose: { light: "#fff5f8", dark: "#241c20" },
};

/** Fallback when custom image wallpaper is active in mobile Safari. */
export const SAFARI_CUSTOM_WALLPAPER_THEME = {
  light: "#f5f5f5",
  dark: "#1a1a1a",
} as const;
