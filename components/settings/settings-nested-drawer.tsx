"use client";

import type { ReactElement, ReactNode } from "react";
import { SettingsNestedDrawerBack } from "@/components/settings/settings-nested-drawer-back";
import { NestedDrawer } from "@/components/shared/nested-drawer";
import {
  SETTINGS_IOS_DRAWER_SURFACE,
  SETTINGS_IOS_SUB_HEADER,
  SETTINGS_IOS_SUB_TITLE,
} from "@/config/settings-ios";

interface SettingsNestedDrawerProps {
  trigger: ReactElement;
  title: string;
  children: ReactNode;
}

export function SettingsNestedDrawer({
  trigger,
  title,
  children,
}: SettingsNestedDrawerProps) {
  return (
    <NestedDrawer
      trigger={trigger}
      title={title}
      className={SETTINGS_IOS_DRAWER_SURFACE}
    >
      <header className={SETTINGS_IOS_SUB_HEADER}>
        <div className="absolute left-3">
          <SettingsNestedDrawerBack />
        </div>
        <h2 className={SETTINGS_IOS_SUB_TITLE}>{title}</h2>
      </header>
      {children}
    </NestedDrawer>
  );
}
