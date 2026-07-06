"use client";

import { usePathname } from "next/navigation";

import { MobileBottomNavLink } from "@/components/shared/mobile-bottom-nav-link";
import { MobileNavDrawer } from "@/components/shared/mobile-nav-drawer";
import {
  MOBILE_BOTTOM_NAV_ITEM_WRAPPER,
  MOBILE_BOTTOM_NAV_MENU_BUTTON,
  MOBILE_BOTTOM_NAV_PILL,
  MOBILE_BOTTOM_NAV_ROOT,
  MOBILE_LIQUID_GLASS_SURFACE,
  isNavItemActive,
  mobileBottomNavItems,
} from "@/config/mobile-nav";
import { shouldHideMobileBottomNav } from "@/config/inbox-mobile";
import { MobileNavMenuIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  if (shouldHideMobileBottomNav(pathname)) {
    return null;
  }

  return (
    <nav aria-label="Navigasi utama" className={MOBILE_BOTTOM_NAV_ROOT}>
      <ul className={cn(MOBILE_BOTTOM_NAV_PILL, MOBILE_LIQUID_GLASS_SURFACE)}>
        {mobileBottomNavItems.map((item) => (
          <li className={MOBILE_BOTTOM_NAV_ITEM_WRAPPER} key={item.href}>
            <MobileBottomNavLink
              item={item}
              active={isNavItemActive(pathname, item.href)}
            />
          </li>
        ))}
      </ul>

      <MobileNavDrawer
        trigger={
          <button
            aria-label="Buka menu"
            className={cn(
              MOBILE_BOTTOM_NAV_MENU_BUTTON,
              MOBILE_LIQUID_GLASS_SURFACE,
            )}
            type="button"
          >
            <MobileNavMenuIcon aria-hidden className="size-6" />
          </button>
        }
      />
    </nav>
  );
}
