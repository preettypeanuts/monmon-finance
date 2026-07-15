"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type ReactElement, useState } from "react";

import { MobileNavDrawerLogoutButton } from "@/components/shared/mobile-nav-drawer-logout-button";
import { MobileNavDrawerProfileLink } from "@/components/shared/mobile-nav-drawer-profile-link";
import { MobileNavDrawerPushToggleRow } from "@/components/shared/mobile-nav-drawer-push-toggle-row";
import { MobileNavDrawerSettingsRow } from "@/components/shared/mobile-nav-drawer-settings-row";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  isDrawerMenuItemActive,
  MOBILE_DRAWER_FOOTER,
  MOBILE_DRAWER_ROW,
  MOBILE_DRAWER_SCROLL,
  MOBILE_DRAWER_SURFACE,
  MOBILE_DRAWER_TILE,
  mobileDrawerMenuItems,
} from "@/config/mobile-nav";
import { NOTIFICATIONS_ROUTE } from "@/config/navigation";
import { useDrawerScrollLock } from "@/hooks/use-drawer-scroll-lock";
import { CaretRightIcon } from "@/lib/icons";
import { prefetchNotificationsFeed } from "@/lib/notifications/fetch-notifications-feed";
import { cn } from "@/lib/utils";

interface MobileNavDrawerProps {
  trigger: ReactElement;
}

export function MobileNavDrawer({ trigger }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [open, setOpen] = useState(false);

  useDrawerScrollLock(open);

  return (
    <Drawer onOpenChange={setOpen} open={open} showSwipeHandle>
      <DrawerTrigger render={trigger} />
      <DrawerContent className={MOBILE_DRAWER_SURFACE}>
        <DrawerHeader className="shrink-0 px-0 pt-1 pb-3">
          <DrawerTitle className="sr-only">Menu navigasi</DrawerTitle>
          <MobileNavDrawerProfileLink onNavigate={() => setOpen(false)} />
        </DrawerHeader>

        <div className={MOBILE_DRAWER_SCROLL}>
          {mobileDrawerMenuItems.map((item) => {
            const active = isDrawerMenuItemActive(pathname, tab, item);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(MOBILE_DRAWER_ROW, active && "bg-primary/20")}
                href={item.href}
                key={item.id}
                onClick={() => setOpen(false)}
                onPointerDown={() => {
                  if (item.href === NOTIFICATIONS_ROUTE) {
                    prefetchNotificationsFeed();
                  }
                }}
              >
                <span className={cn(MOBILE_DRAWER_TILE, item.drawerTileClass)}>
                  <item.icon aria-hidden="true" />
                </span>
                <span className="flex-1">{item.title}</span>
                <CaretRightIcon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </Link>
            );
          })}
          <MobileNavDrawerPushToggleRow />
        </div>

        <div className={MOBILE_DRAWER_FOOTER}>
          <MobileNavDrawerSettingsRow />

          <MobileNavDrawerLogoutButton onSignedOut={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
