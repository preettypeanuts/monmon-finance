import { Skeleton } from "@/components/ui/skeleton";
import { PLANS_AI_SUMMARY_SHELL } from "@/config/plans";
import { cn } from "@/lib/utils";

export function PlansAiInsightSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat AI summary"
      className={cn(PLANS_AI_SUMMARY_SHELL, "relative flex flex-col p-4 sm:p-5")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </div>

      <Skeleton className="mt-3 h-4 w-full max-w-lg" />
    </div>
  );
}
