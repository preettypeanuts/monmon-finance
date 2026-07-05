import Link from "next/link";

import { TrayIcon } from "@/lib/icons";

import { OVERVIEW_INBOX_FAB } from "@/config/overview";

export function OverviewInboxFab() {
  return (
    <Link href="/" aria-label="Buka Inbox" className={OVERVIEW_INBOX_FAB}>
      <TrayIcon />
    </Link>
  );
}
