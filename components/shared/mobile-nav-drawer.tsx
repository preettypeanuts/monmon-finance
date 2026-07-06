"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactElement, useState } from "react";

import { SettingsSheet } from "@/components/shared/settings-sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import {
  MOBILE_DRAWER_ROW,
  MOBILE_DRAWER_SURFACE,
  MOBILE_DRAWER_TILE,
  isNavItemActive,
  mobileDrawerNavItems,
} from "@/config/mobile-nav";
import { SIDEBAR_APP_ICON_GRADIENTS } from "@/config/sidebar";
import { useDrawerScrollLock } from "@/hooks/use-drawer-scroll-lock";
import { CaretRightIcon, GearSixIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface MobileNavDrawerProps {
  trigger: ReactElement;
}

export function MobileNavDrawer({ trigger }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useDrawerScrollLock(open || settingsOpen);

  function openSettings() {
    setOpen(false);
    setSettingsOpen(true);
  }

  return (
    <>
      <Drawer onOpenChange={setOpen} open={open} showSwipeHandle>
        <DrawerTrigger render={trigger} />
        <DrawerContent className={MOBILE_DRAWER_SURFACE}>
          <DrawerHeader className="shrink-0 px-0 pt-2 pb-3">
            <DrawerTitle className="sr-only">Menu navigasi</DrawerTitle>
            <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[0.85rem] bg-linear-to-b from-[#7C8CFF] via-[#5B6CFF] to-[#3B4FE0] text-sm font-semibold text-white shadow-sm">
                W
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold">{APP_NAME}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {APP_TAGLINE}
                </p>
              </div>
            </div>
          </DrawerHeader>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain">
            {mobileDrawerNavItems.length > 0
              ? mobileDrawerNavItems.map((item) => {
                  const active = isNavItemActive(pathname, item.href);

                  return (
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        MOBILE_DRAWER_ROW,
                        active && "bg-primary/20",
                      )}
                      href={item.href}
                      key={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className={cn(MOBILE_DRAWER_TILE, item.drawerTileClass)}
                      >
                        <item.icon aria-hidden="true" />
                      </span>
                      <span className="flex-1">{item.title}</span>
                      <CaretRightIcon
                        aria-hidden="true"
                        className="size-4 text-muted-foreground"
                      />
                    </Link>
                  );
                })
              : null}
          </div>

          <div
            className={cn(
              "shrink-0 border-t border-border/60 pt-2",
              mobileDrawerNavItems.length === 0 && "mt-0 border-t-0 pt-0",
            )}
          >
            <button
              type="button"
              className={cn(MOBILE_DRAWER_ROW, "w-full")}
              onClick={openSettings}
            >
              <span
                className={cn(
                  MOBILE_DRAWER_TILE,
                  SIDEBAR_APP_ICON_GRADIENTS.settings,
                )}
              >
                <GearSixIcon aria-hidden="true" />
              </span>
              <span className="flex-1 text-left">Pengaturan</span>
              <CaretRightIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
