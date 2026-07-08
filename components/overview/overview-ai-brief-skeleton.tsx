import { Skeleton } from "@/components/ui/skeleton";
import {
  OVERVIEW_CARD,
  OVERVIEW_CARD_PADDING,
  OVERVIEW_SECTION_LABEL,
} from "@/config/overview";
import { cn } from "@/lib/utils";

interface OverviewAiBriefSkeletonProps {
  className?: string;
}

export function OverviewAiBriefSkeleton({
  className,
}: OverviewAiBriefSkeletonProps) {
  return (
    <section
      aria-busy="true"
      aria-label="Memuat AI Brief"
      className={cn(OVERVIEW_CARD, OVERVIEW_CARD_PADDING, className)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-xl" />
          <p className={OVERVIEW_SECTION_LABEL}>AI Brief</p>
        </div>
        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </div>

      <Skeleton className="mt-3 h-4 w-full max-w-md" />
    </section>
  );
}
