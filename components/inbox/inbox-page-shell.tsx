import { INBOX_PAGE_OUTER } from "@/config/inbox-desktop";

interface InboxPageShellProps {
  children: React.ReactNode;
}

/** Desktop-only outer gutter for inbox; mobile passes through full-bleed. */
export function InboxPageShell({ children }: InboxPageShellProps) {
  return <div className={INBOX_PAGE_OUTER}>{children}</div>;
}
