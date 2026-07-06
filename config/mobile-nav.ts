import type { Icon } from "@/lib/icons";
import {
  MobileNavJournalIcon,
  MobileNavOverviewIcon,
  MobileNavPayPlanIcon,
  MobileNavWishIcon,
} from "@/lib/icons";

import {
  mainNavItems,
  type NavItem,
  PAYPLAN_ROUTE,
  PLANS_ROUTE,
  OVERVIEW_ROUTE,
} from "@/config/navigation";
import { GRID_GAP } from "@/config/spacing";

/** Safe-area bottom inset — shared by nav bar & drawer anchor. */
export const MOBILE_BOTTOM_NAV_SAFE_BOTTOM =
  "var(--mobile-bottom-nav-safe-bottom)";

/** Nav cluster height (`min-h-15` / `size-15`). */
export const MOBILE_NAV_BAR_HEIGHT = "var(--mobile-nav-bar-height)";

/** Drawer bottom edge — same baseline as bottom navigation bar. */
export const MOBILE_DRAWER_BOTTOM = "var(--mobile-drawer-bottom)";

/** Content / floating controls clear this on mobile. */
export const MOBILE_BOTTOM_NAV_OFFSET = "var(--mobile-bottom-nav-offset)";

/** iOS 26 liquid glass — frosted pill + menu orb. */
export const MOBILE_LIQUID_GLASS_SURFACE =
  "border border-white/28 bg-white/14 shadow-[0_8px_32px_rgba(0,0,0,0.16),inset_0_1px_0_0_rgba(255,255,255,0.48)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/12 dark:bg-black/14 dark:shadow-[0_8px_32px_rgba(0,0,0,0.38),inset_0_1px_0_0_rgba(255,255,255,0.1)]";

/** Horizontal inset — sync with APP_GUTTER (`px-3`). */
export const MOBILE_BOTTOM_NAV_INSET_X = "px-3";

/** Gap between primary pill and drawer orb — sync with GRID_GAP. */
export const MOBILE_BOTTOM_NAV_CLUSTER_GAP = GRID_GAP;

export const MOBILE_BOTTOM_NAV_ROOT = `pointer-events-none fixed inset-x-0 bottom-0 z-40 flex w-full items-center ${MOBILE_BOTTOM_NAV_CLUSTER_GAP} ${MOBILE_BOTTOM_NAV_INSET_X} pb-[var(--mobile-bottom-nav-safe-bottom)] md:hidden`;

export const MOBILE_BOTTOM_NAV_PILL =
  "pointer-events-auto flex min-h-15 min-w-0 flex-1 items-stretch rounded-full p-1";

export const MOBILE_BOTTOM_NAV_ITEM =
  "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full py-1.5 text-[10px] font-medium leading-none transition-colors";

export const MOBILE_BOTTOM_NAV_ITEM_WRAPPER = "flex min-w-0 flex-1";

export const MOBILE_BOTTOM_NAV_GLYPH = "relative z-[1] size-6";

export const MOBILE_BOTTOM_NAV_GLYPH_ACTIVE = "relative z-[1] size-6 text-primary";

export const MOBILE_BOTTOM_NAV_LABEL =
  "relative z-[1] max-w-full truncate px-0.5";

export const MOBILE_BOTTOM_NAV_LABEL_ACTIVE = "text-primary";

export const MOBILE_BOTTOM_NAV_ITEM_ACTIVE =
  "text-foreground dark:text-white";

export const MOBILE_BOTTOM_NAV_ITEM_IDLE =
  "text-foreground/75 hover:text-foreground/95 dark:text-white/72 dark:hover:text-white/90";

export const MOBILE_BOTTOM_NAV_ACTIVE_ORB =
  "absolute inset-0 rounded-full bg-neutral-400/20 dark:bg-white/18";

/** Perfect circle — height matches pill (`min-h-15`). */
export const MOBILE_BOTTOM_NAV_MENU_BUTTON =
  "pointer-events-auto relative flex size-15 shrink-0 items-center justify-center rounded-full p-0 text-foreground/80 transition-colors hover:text-foreground dark:text-white/80 dark:hover:text-white";

export const MOBILE_DRAWER_ROW =
  "flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-2.5 text-sm font-medium text-foreground transition-colors active:bg-muted";

export const MOBILE_DRAWER_TILE =
  "flex size-8 shrink-0 items-center justify-center rounded-[0.6rem] bg-linear-to-b text-white [&_svg]:size-[18px]";

/** Sync with `.mobile-nav-drawer-popup` in globals.css — layout only, keeps drawer slide animation. */
export const MOBILE_DRAWER_POPUP = "mobile-nav-drawer-popup";

export const MOBILE_DRAWER_SURFACE = [
  MOBILE_DRAWER_POPUP,
  "max-h-[min(82dvh,calc(100dvh-var(--mobile-drawer-bottom)-var(--mobile-nav-bar-height)))]",
  "gap-0 overflow-hidden rounded-[2rem] border border-black/12 bg-popover/40 px-4 pt-0 pb-5 glass-backdrop dark:border-white/12",
].join(" ");

const MOBILE_PRIMARY_HREFS = [
  OVERVIEW_ROUTE,
  PLANS_ROUTE,
  "/journal",
  PAYPLAN_ROUTE,
] as const;

export interface MobileBottomNavItem {
  title: string;
  href: string;
  icon: Icon;
}

export interface MobileDrawerNavItem extends NavItem {
  drawerTileClass: string;
}

const MOBILE_BOTTOM_NAV_ICON_BY_HREF: Record<string, Icon> = {
  [OVERVIEW_ROUTE]: MobileNavOverviewIcon,
  [PLANS_ROUTE]: MobileNavWishIcon,
  "/journal": MobileNavJournalIcon,
  [PAYPLAN_ROUTE]: MobileNavPayPlanIcon,
};

function findNavItem(href: string): NavItem {
  const item = mainNavItems.find((entry) => entry.href === href);
  if (!item) {
    throw new Error(`Missing nav item for href: ${href}`);
  }

  return item;
}

export const mobileBottomNavItems: MobileBottomNavItem[] =
  MOBILE_PRIMARY_HREFS.map((href) => {
    const item = findNavItem(href);
    const icon = MOBILE_BOTTOM_NAV_ICON_BY_HREF[href];

    if (!icon) {
      throw new Error(`Missing mobile nav icon for href: ${href}`);
    }

    return {
      title: item.title,
      href: item.href,
      icon,
    };
  });

export const mobileDrawerNavItems: MobileDrawerNavItem[] = [];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
