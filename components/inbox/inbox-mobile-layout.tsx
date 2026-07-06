"use client";

import { type ReactNode, useState } from "react";

import { InboxMobileEdgeBlur } from "@/components/inbox/inbox-mobile-edge-blur";
import { InboxMobileTopBar } from "@/components/inbox/inbox-mobile-top-bar";
import { InboxTodaySummaryDrawer } from "@/components/inbox/inbox-today-summary-drawer";
import { INBOX_MOBILE_PAGE } from "@/config/inbox-mobile";
import { cn } from "@/lib/utils";
import type { DailySummarySnapshot, TodaySummary } from "@/types/summary";

interface InboxMobileLayoutProps {
  children: ReactNode;
  summary: TodaySummary;
  dailySummary: DailySummarySnapshot | null;
}

export function InboxMobileLayout({
  children,
  summary,
  dailySummary,
}: InboxMobileLayoutProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:contents",
        INBOX_MOBILE_PAGE,
      )}
    >
      <div className="md:hidden">
        <InboxMobileEdgeBlur />
        <InboxMobileTopBar onOpenSummary={() => setSummaryOpen(true)} />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

      <InboxTodaySummaryDrawer
        dailySummary={dailySummary}
        onOpenChange={setSummaryOpen}
        open={summaryOpen}
        summary={summary}
      />
    </div>
  );
}
