import { MobileScrollSurface } from "@/components/shared/mobile-scroll-surface";
import {
  OVERVIEW_PAGE_ROOT,
  OVERVIEW_PAGE_SCROLL,
  OVERVIEW_PAGE_SCROLL_INNER,
} from "@/config/overview";
import { STACK_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface OverviewScrollShellProps {
  children: React.ReactNode;
}

export function OverviewScrollShell({ children }: OverviewScrollShellProps) {
  return (
    <div className={OVERVIEW_PAGE_ROOT}>
      <MobileScrollSurface className={OVERVIEW_PAGE_SCROLL} title="Overview">
        <div className={cn("flex flex-col", STACK_GAP, OVERVIEW_PAGE_SCROLL_INNER)}>
          {children}
        </div>
      </MobileScrollSurface>
    </div>
  );
}
