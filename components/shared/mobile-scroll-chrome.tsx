"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { PlannerMobileTopBarTabs } from "@/components/planner/planner-mobile-top-bar-tabs";
import { useMobileScrollChromeSnapshot } from "@/components/shared/mobile-scroll-chrome-provider";
import {
  MOBILE_COMPACT_TITLE,
  MOBILE_SCROLL_TOP_BLUR,
  MOBILE_TOP_BAR_INBOX_BUTTON,
  MOBILE_TOP_BAR_ROOT,
  MOBILE_TOP_BAR_ROW,
  shouldShowMobileInboxButton,
} from "@/config/mobile-chrome";
import { PAYPLAN_ROUTE } from "@/config/navigation";
import { PAYPLAN_TOP_BAR_ACTIONS } from "@/config/payplan-mobile";
import { MobileNavInboxIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function MobileScrollChrome() {
  const pathname = usePathname();
  const snapshot = useMobileScrollChromeSnapshot();
  const showInbox = shouldShowMobileInboxButton(pathname);
  const showPayplanTabs = pathname === PAYPLAN_ROUTE || pathname.startsWith(`${PAYPLAN_ROUTE}/`);

  if (!snapshot && !showInbox && !showPayplanTabs) {
    return null;
  }

  const showBlur = snapshot?.showBlur ?? false;
  const showCompactTitle = snapshot?.showCompactTitle ?? false;

  return (
    <>
      <div
        aria-hidden
        className={cn(MOBILE_SCROLL_TOP_BLUR, showBlur && "opacity-100")}
      />
      <header className={MOBILE_TOP_BAR_ROOT}>
        <div className={MOBILE_TOP_BAR_ROW}>
          {snapshot?.title ? (
            <p
              aria-hidden={!showCompactTitle}
              className={cn(
                MOBILE_COMPACT_TITLE,
                showCompactTitle ? "opacity-100" : "opacity-0",
              )}
            >
              {snapshot.title}
            </p>
          ) : null}
          {showPayplanTabs || showInbox ? (
            <div className={PAYPLAN_TOP_BAR_ACTIONS}>
              {showPayplanTabs ? (
                <Suspense fallback={null}>
                  <PlannerMobileTopBarTabs />
                </Suspense>
              ) : null}
              {showInbox ? (
                <Link
                  aria-label="Buka Inbox"
                  className={MOBILE_TOP_BAR_INBOX_BUTTON}
                  href="/"
                >
                  <MobileNavInboxIcon aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>
    </>
  );
}
