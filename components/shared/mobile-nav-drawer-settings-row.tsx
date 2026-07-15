"use client";

import { SettingsRootNestedDrawer } from "@/components/settings/settings-root-nested-drawer";
import { MOBILE_DRAWER_ROW, MOBILE_DRAWER_TILE } from "@/config/mobile-nav";
import { SETTINGS_TITLE } from "@/config/settings-labels";
import { SIDEBAR_APP_ICON_GRADIENTS } from "@/config/sidebar";
import { CaretRightIcon, GearSixIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function MobileNavDrawerSettingsRow() {
  return (
    <SettingsRootNestedDrawer
      trigger={
        <button type="button" className={cn(MOBILE_DRAWER_ROW, "w-full")}>
          <span
            className={cn(
              MOBILE_DRAWER_TILE,
              SIDEBAR_APP_ICON_GRADIENTS.settings,
            )}
          >
            <GearSixIcon aria-hidden="true" />
          </span>
          <span className="flex-1 text-left">{SETTINGS_TITLE}</span>
          <CaretRightIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground"
          />
        </button>
      }
    />
  );
}
