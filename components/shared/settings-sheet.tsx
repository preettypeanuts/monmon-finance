"use client";

import { type ReactElement, useState } from "react";

import { SettingsPanelContent } from "@/components/shared/settings-panel-content";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GLASS_HOVER, GLASS_SURFACE } from "@/config/glass";
import {
  SETTINGS_IOS_DONE_BUTTON,
  SETTINGS_IOS_DRAWER_SURFACE,
  SETTINGS_IOS_NAV_HEADER,
  SETTINGS_IOS_SHEET,
} from "@/config/settings-ios";
import { SEPARATED_PILL } from "@/config/shape";
import { useDrawerScrollLock } from "@/hooks/use-drawer-scroll-lock";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import { GearSixIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SettingsSheetProps {
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SettingsChromeHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className={SETTINGS_IOS_NAV_HEADER}>
      <div className="min-w-[4.5rem]" />
      <p className="sr-only">Pengaturan</p>
      <Button
        type="button"
        variant="ghost"
        className={SETTINGS_IOS_DONE_BUTTON}
        onClick={onClose}
      >
        Selesai
      </Button>
    </header>
  );
}

function SettingsSheetBody({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SettingsChromeHeader onClose={onClose} />
      <SettingsPanelContent open={open} />
    </div>
  );
}

export function SettingsSheet({
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SettingsSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const isMobile = useIsMobileViewport();

  useDrawerScrollLock(isMobile && open);

  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Pengaturan"
      className={cn(GLASS_SURFACE, GLASS_HOVER, "size-9 p-0", SEPARATED_PILL)}
    >
      <GearSixIcon className="size-4" />
    </Button>
  );

  function setOpen(nextOpen: boolean) {
    if (isControlled) {
      onOpenChange?.(nextOpen);
      return;
    }

    setInternalOpen(nextOpen);
  }

  function handleClose() {
    setOpen(false);
  }

  if (isMobile) {
    return (
      <Drawer onOpenChange={setOpen} open={open} showSwipeHandle>
        {trigger ? <DrawerTrigger render={trigger} /> : null}
        <DrawerContent className={SETTINGS_IOS_DRAWER_SURFACE}>
          <DrawerTitle className="sr-only">Pengaturan</DrawerTitle>
          <SettingsSheetBody open={open} onClose={handleClose} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      {trigger ? <SheetTrigger render={trigger} /> : null}
      <SheetContent
        side="left"
        showCloseButton={false}
        className={SETTINGS_IOS_SHEET}
      >
        <SettingsSheetBody open={open} onClose={handleClose} />
        <SheetClose className="sr-only">Tutup pengaturan</SheetClose>
      </SheetContent>
    </Sheet>
  );
}
