"use client";

import Link from "next/link";

import {
  MOBILE_BOTTOM_NAV_GLYPH_TRANSITION,
  MOBILE_BOTTOM_NAV_LABEL_TRANSITION,
} from "@/config/mobile-bottom-nav-motion";
import {
  MOBILE_BOTTOM_NAV_ITEM,
  MOBILE_BOTTOM_NAV_ITEM_ACTIVE,
  MOBILE_BOTTOM_NAV_ITEM_IDLE,
  MOBILE_BOTTOM_NAV_LABEL_ACTIVE,
} from "@/config/mobile-nav";
import type { MobileBottomNavItem } from "@/config/mobile-nav";
import { prefetchInboxBootstrap } from "@/lib/inbox/fetch-inbox-bootstrap";
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
      prefetch
      scroll={false}
      onTouchStart={() => {
        if (item.href === "/") {
          prefetchInboxBootstrap();
        }
      }}
    >
      <IconComponent
        aria-hidden
        className={cn(
          MOBILE_BOTTOM_NAV_GLYPH_TRANSITION,
          active && "scale-[1.04] text-primary",
        )}
      />
      <span
        className={cn(
          MOBILE_BOTTOM_NAV_LABEL_TRANSITION,
          active && MOBILE_BOTTOM_NAV_LABEL_ACTIVE,
        )}
      >
        {item.title}
      </span>
    </Link>
  );
}
