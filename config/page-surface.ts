import { OVERVIEW_ROUTE } from "@/config/navigation";

/** Routes with wallpaper visible on mobile (Inbox + Overview). */
const WALLPAPER_ROUTES = ["/", OVERVIEW_ROUTE] as const;

export function isWallpaperRoute(pathname: string): boolean {
  return WALLPAPER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/** Solid theme background on mobile only — Journal, PayPlan, Wish, etc. */
export const SOLID_PAGE_ROOT = "max-md:bg-background";
