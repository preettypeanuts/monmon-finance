"use client";

import type { ReactElement, ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FORM_DIALOG_SURFACE } from "@/config/form-dialog";
import {
  MOBILE_BOTTOM_DRAWER_POPUP,
  MOBILE_BOTTOM_DRAWER_POPUP_TALL,
} from "@/config/mobile-layout";
import { cn } from "@/lib/utils";

export const PICKER_NESTED_DRAWER_SURFACE = cn(
  FORM_DIALOG_SURFACE,
  MOBILE_BOTTOM_DRAWER_POPUP,
  MOBILE_BOTTOM_DRAWER_POPUP_TALL,
  "mt-0! flex flex-col gap-0 overflow-hidden border-0 p-0",
);

interface NestedDrawerProps {
  trigger: ReactElement;
  /** Accessible name — mirror visible title. */
  title: string;
  children: ReactNode;
  className?: string;
  swipeDirection?: "down" | "up" | "left" | "right";
  showSwipeHandle?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Nested mobile drawer — stack inside an open parent drawer (Base UI / shadcn). */
export function NestedDrawer({
  trigger,
  title,
  children,
  className,
  swipeDirection = "down",
  showSwipeHandle = true,
  open,
  onOpenChange,
}: NestedDrawerProps) {
  return (
    <Drawer
      onOpenChange={onOpenChange}
      open={open}
      showSwipeHandle={showSwipeHandle}
      swipeDirection={swipeDirection}
    >
      <DrawerTrigger render={trigger} />
      <DrawerContent className={cn(className)}>
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
