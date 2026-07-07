import { OVERVIEW_ROUTE } from "@/config/navigation";

export function isOverviewRoute(pathname: string): boolean {
  return (
    pathname === OVERVIEW_ROUTE || pathname.startsWith(`${OVERVIEW_ROUTE}/`)
  );
}

/**
 * Overview outer shell (desktop) — no vertical padding; right gutter on SidebarInset.
 * Mobile: full-bleed via MobileScrollSurface.
 */
export const OVERVIEW_PAGE_OUTER = [
  "flex h-full min-h-0 flex-1 flex-col overflow-hidden",
  "md:py-0",
].join(" ");

/** Desktop — top/bottom gap for scrollable bento content. */
export const OVERVIEW_DESKTOP_SCROLL_INNER = "md:pt-3 md:pb-3";
