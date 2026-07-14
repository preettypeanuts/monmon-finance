import { InboxChatInputSkeleton } from "@/components/inbox/inbox-chat-input-skeleton";
import { InboxChatSkeleton } from "@/components/inbox/inbox-chat-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  INBOX_CHAT_COLUMN,
  INBOX_CHAT_VIEW_ROOT,
  INBOX_DESKTOP_INPUT_DOCK_PB,
  INBOX_PAGE_ROW,
  INBOX_SUMMARY_ASIDE,
} from "@/config/inbox-desktop";
import { INBOX_CHAT_INPUT_DOCK } from "@/config/inbox-mobile";
import {
  INBOX_MOBILE_TOP_BAR_ACTIONS,
  INBOX_MOBILE_TOP_BAR_ROW,
  INBOX_MOBILE_TOP_BAR_TITLE,
} from "@/config/inbox-mobile";
import { GLASS_SURFACE } from "@/config/glass";
import { GRID_GAP, SHELL_PADDING, STACK_GAP } from "@/config/spacing";
import { SEPARATED_SHELL, SEPARATED_SURFACE } from "@/config/shape";
import { cn } from "@/lib/utils";

function SummaryTileSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Skeleton
      className={cn(
        "w-full",
        SEPARATED_SURFACE,
        compact
          ? "col-span-2 min-h-10"
          : "aspect-5/4 min-h-22",
      )}
    />
  );
}

function DailySummaryStatsSkeleton() {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-full rounded-2xl" />
      ))}
    </div>
  );
}

function InboxSummaryAsideSkeleton() {
  return (
    <aside className={INBOX_SUMMARY_ASIDE}>
      <div
        aria-hidden
        className={cn(
          "flex h-full min-h-0 flex-col overflow-hidden",
          SEPARATED_SHELL,
          GLASS_SURFACE,
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-y-auto",
            SHELL_PADDING,
            STACK_GAP,
          )}
        >
          <div>
            <Skeleton className="h-3 w-12" />
            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="size-6 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28 shrink-0" />
            </div>
          </div>

          <section className={cn("grid grid-cols-2", GRID_GAP)}>
            <SummaryTileSkeleton />
            <SummaryTileSkeleton />
            <SummaryTileSkeleton compact />
          </section>

          <Skeleton className="h-24 w-full rounded-2xl" />

          <section>
            <Skeleton className="mb-3 h-4 w-24" />
            <div className={cn("grid grid-cols-2", GRID_GAP)}>
              <SummaryTileSkeleton />
              <SummaryTileSkeleton />
            </div>
          </section>

          <section className="space-y-2.5">
            <Skeleton className="h-3 w-20" />
            <DailySummaryStatsSkeleton />
          </section>
        </div>
      </div>
    </aside>
  );
}

export function InboxPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat inbox"
      className={INBOX_PAGE_ROW}
    >
      <section className={INBOX_CHAT_COLUMN}>
        <div className={INBOX_CHAT_VIEW_ROOT}>
          <div className={cn("relative shrink-0 md:hidden", INBOX_MOBILE_TOP_BAR_ROW)}>
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className={cn("mx-auto h-5 w-16", INBOX_MOBILE_TOP_BAR_TITLE)} />
            <div className={INBOX_MOBILE_TOP_BAR_ACTIONS}>
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>

          <InboxChatSkeleton className="min-h-0 flex-1" />

          <div className={cn(INBOX_CHAT_INPUT_DOCK, INBOX_DESKTOP_INPUT_DOCK_PB)}>
            <InboxChatInputSkeleton />
          </div>
        </div>
      </section>

      <InboxSummaryAsideSkeleton />
    </div>
  );
}
