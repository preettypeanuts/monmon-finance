"use client";

import { MobileTopBarBackButton } from "@/components/shared/mobile-top-bar-back-button";
import {
  INBOX_MOBILE_TOP_BAR_ROOT,
  INBOX_MOBILE_TOP_BAR_ROW,
} from "@/config/inbox-mobile";

export function ProfileMobileTopBar() {
  return (
    <header className={INBOX_MOBILE_TOP_BAR_ROOT}>
      <div className={INBOX_MOBILE_TOP_BAR_ROW}>
        <MobileTopBarBackButton />

        <span aria-hidden className="flex-1" />

        <span aria-hidden className="size-11 shrink-0" />
      </div>
    </header>
  );
}
