"use client";

import { type ReactElement, useState } from "react";
import { SettingsNestedDrawerBack } from "@/components/settings/settings-nested-drawer-back";
import { NestedDrawer } from "@/components/shared/nested-drawer";
import { SettingsPanelContent } from "@/components/shared/settings-panel-content";
import { MOBILE_DRAWER_MENU_LABEL } from "@/config/mobile-nav";
import {
  SETTINGS_IOS_DRAWER_SURFACE,
  SETTINGS_IOS_SUB_HEADER,
  SETTINGS_IOS_SUB_TITLE,
} from "@/config/settings-ios";
import { SETTINGS_TITLE } from "@/config/settings-labels";

interface SettingsRootNestedDrawerProps {
  trigger: ReactElement;
}

/** Settings root as nested drawer — e.g. opened from mobile nav without closing parent. */
export function SettingsRootNestedDrawer({
  trigger,
}: SettingsRootNestedDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <NestedDrawer
      className={SETTINGS_IOS_DRAWER_SURFACE}
      onOpenChange={setOpen}
      title={SETTINGS_TITLE}
      trigger={trigger}
    >
      <header className={SETTINGS_IOS_SUB_HEADER}>
        <div className="absolute left-3">
          <SettingsNestedDrawerBack label={MOBILE_DRAWER_MENU_LABEL} />
        </div>
        <h2 className={SETTINGS_IOS_SUB_TITLE}>{SETTINGS_TITLE}</h2>
      </header>
      <SettingsPanelContent mobileDrawer nestedRoot open={open} />
    </NestedDrawer>
  );
}
