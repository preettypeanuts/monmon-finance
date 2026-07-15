"use client";

import { DrawerClose } from "@/components/ui/drawer";
import { SETTINGS_IOS_BACK_BUTTON } from "@/config/settings-ios";
import { SETTINGS_TITLE } from "@/config/settings-labels";
import { CaretLeftIcon } from "@/lib/icons";

interface SettingsNestedDrawerBackProps {
  label?: string;
}

export function SettingsNestedDrawerBack({
  label = SETTINGS_TITLE,
}: SettingsNestedDrawerBackProps) {
  return (
    <DrawerClose
      render={
        <button type="button" className={SETTINGS_IOS_BACK_BUTTON}>
          <CaretLeftIcon aria-hidden className="size-5" />
          {label}
        </button>
      }
    />
  );
}
