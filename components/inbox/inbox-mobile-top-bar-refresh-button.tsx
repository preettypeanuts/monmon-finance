"use client";

import { INBOX_MOBILE_TOP_BAR_ORB } from "@/config/inbox-mobile";
import { ArrowClockwiseIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface InboxMobileTopBarRefreshButtonProps {
  disabled?: boolean;
  refreshing?: boolean;
  onRefresh: () => void;
}

export function InboxMobileTopBarRefreshButton({
  disabled = false,
  refreshing = false,
  onRefresh,
}: InboxMobileTopBarRefreshButtonProps) {
  return (
    <button
      type="button"
      aria-label="Muat ulang inbox"
      aria-busy={refreshing}
      className={INBOX_MOBILE_TOP_BAR_ORB}
      disabled={disabled || refreshing}
      onClick={onRefresh}
    >
      <ArrowClockwiseIcon
        aria-hidden="true"
        className={cn(refreshing && "animate-spin")}
      />
    </button>
  );
}
