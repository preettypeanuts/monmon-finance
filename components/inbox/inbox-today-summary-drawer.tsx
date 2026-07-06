"use client";

import { TodaySummaryPanel } from "@/components/finance/today-summary-panel";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { INBOX_SUMMARY_DRAWER_SURFACE } from "@/config/inbox-mobile";
import { useDrawerScrollLock } from "@/hooks/use-drawer-scroll-lock";
import type { DailySummarySnapshot, TodaySummary } from "@/types/summary";

interface InboxTodaySummaryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: TodaySummary;
  dailySummary: DailySummarySnapshot | null;
}

export function InboxTodaySummaryDrawer({
  open,
  onOpenChange,
  summary,
  dailySummary,
}: InboxTodaySummaryDrawerProps) {
  useDrawerScrollLock(open);

  return (
    <Drawer onOpenChange={onOpenChange} open={open} showSwipeHandle swipeDirection="right">
      <DrawerContent className={INBOX_SUMMARY_DRAWER_SURFACE}>
        <DrawerTitle className="sr-only">Ringkasan hari ini</DrawerTitle>
        <TodaySummaryPanel
          dailySummary={dailySummary}
          embedded
          summary={summary}
        />
      </DrawerContent>
    </Drawer>
  );
}
