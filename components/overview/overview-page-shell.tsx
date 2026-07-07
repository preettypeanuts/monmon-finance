import { OVERVIEW_PAGE_OUTER } from "@/config/overview-desktop";

interface OverviewPageShellProps {
  children: React.ReactNode;
}

/** Desktop-only outer gutter for overview; mobile passes through full-bleed. */
export function OverviewPageShell({ children }: OverviewPageShellProps) {
  return <div className={OVERVIEW_PAGE_OUTER}>{children}</div>;
}
