"use client";

import { useRouter } from "next/navigation";

import {
  INBOX_MOBILE_TOP_BAR_ORB,
  INBOX_MOBILE_TOP_BAR_ROOT,
  INBOX_MOBILE_TOP_BAR_ROW,
  INBOX_MOBILE_TOP_BAR_TITLE,
} from "@/config/inbox-mobile";
import { OVERVIEW_ROUTE } from "@/config/navigation";
import { CaretLeftIcon, ChartBarIcon } from "@/lib/icons";

interface InboxMobileTopBarProps {
  onOpenSummary: () => void;
}

export function InboxMobileTopBar({ onOpenSummary }: InboxMobileTopBarProps) {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(OVERVIEW_ROUTE);
  }

  return (
    <header className={INBOX_MOBILE_TOP_BAR_ROOT}>
      <div className={INBOX_MOBILE_TOP_BAR_ROW}>
        <button
          type="button"
          aria-label="Kembali"
          className={INBOX_MOBILE_TOP_BAR_ORB}
          onClick={handleBack}
        >
          <CaretLeftIcon aria-hidden="true" />
        </button>

        <p className={INBOX_MOBILE_TOP_BAR_TITLE}>Inbox</p>

        <button
          type="button"
          aria-label="Ringkasan hari ini"
          className={INBOX_MOBILE_TOP_BAR_ORB}
          onClick={onOpenSummary}
        >
          <ChartBarIcon aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
