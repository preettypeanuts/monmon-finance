"use client";

import Link from "next/link";

import {
  MOBILE_BOTTOM_NAV_ACTIVE_ORB,
  MOBILE_BOTTOM_NAV_GLYPH,
  MOBILE_BOTTOM_NAV_GLYPH_ACTIVE,
  MOBILE_BOTTOM_NAV_ITEM,
  MOBILE_BOTTOM_NAV_ITEM_ACTIVE,
  MOBILE_BOTTOM_NAV_ITEM_IDLE,
  MOBILE_BOTTOM_NAV_LABEL,
  MOBILE_BOTTOM_NAV_LABEL_ACTIVE,
} from "@/config/mobile-nav";
import type { MobileBottomNavItem } from "@/config/mobile-nav";
import { cn } from "@/lib/utils";

interface MobileBottomNavLinkProps {
  item: MobileBottomNavItem;
  active: boolean;
}

export function MobileBottomNavLink({ item, active }: MobileBottomNavLinkProps) {
  const IconComponent = item.icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        MOBILE_BOTTOM_NAV_ITEM,
        "w-full",
        active ? MOBILE_BOTTOM_NAV_ITEM_ACTIVE : MOBILE_BOTTOM_NAV_ITEM_IDLE,
      )}
      href={item.href}
    >
      {active ? (
        <span aria-hidden className={MOBILE_BOTTOM_NAV_ACTIVE_ORB} />
      ) : null}
      <IconComponent aria-hidden className={active ? MOBILE_BOTTOM_NAV_GLYPH_ACTIVE : MOBILE_BOTTOM_NAV_GLYPH} />
      <span className={active ? MOBILE_BOTTOM_NAV_LABEL_ACTIVE : MOBILE_BOTTOM_NAV_LABEL}>{item.title}</span>
    </Link>
  );
}
