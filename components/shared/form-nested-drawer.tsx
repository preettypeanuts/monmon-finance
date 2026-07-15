"use client";

import type { ReactNode } from "react";

import { SettingsNestedDrawerBack } from "@/components/settings/settings-nested-drawer-back";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FORM_DIALOG_SURFACE } from "@/config/form-dialog";
import {
  MOBILE_BOTTOM_DRAWER_POPUP,
  MOBILE_BOTTOM_DRAWER_POPUP_TALL,
} from "@/config/mobile-layout";
import {
  SETTINGS_IOS_SUB_HEADER,
  SETTINGS_IOS_SUB_TITLE,
} from "@/config/settings-ios";
import { cn } from "@/lib/utils";

const FORM_NESTED_DRAWER_SURFACE = cn(
  FORM_DIALOG_SURFACE,
  MOBILE_BOTTOM_DRAWER_POPUP,
  MOBILE_BOTTOM_DRAWER_POPUP_TALL,
  "mt-0! flex flex-col gap-0 overflow-hidden border-0 p-0",
);

interface FormNestedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  backLabel: string;
  children: ReactNode;
}

/** Controlled nested drawer for forms opened inside another mobile drawer. */
export function FormNestedDrawer({
  open,
  onOpenChange,
  title,
  backLabel,
  children,
}: FormNestedDrawerProps) {
  return (
    <Drawer
      onOpenChange={onOpenChange}
      open={open}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent className={FORM_NESTED_DRAWER_SURFACE}>
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <header className={SETTINGS_IOS_SUB_HEADER}>
          <div className="absolute left-3">
            <SettingsNestedDrawerBack label={backLabel} />
          </div>
          <h2 className={SETTINGS_IOS_SUB_TITLE}>{title}</h2>
        </header>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
