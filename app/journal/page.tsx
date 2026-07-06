import { JournalFiltersBar } from "@/components/journal/journal-filters-bar";
import { JournalPagination } from "@/components/journal/journal-pagination";
import { JournalShell } from "@/components/journal/journal-shell";
import { JournalSummaryWidget } from "@/components/journal/journal-summary-widget";
import { JournalTable } from "@/components/journal/journal-table";
import { MobileScrollSurface } from "@/components/shared/mobile-scroll-surface";
import { APP_GUTTER, STACK_GAP } from "@/config/spacing";
import { getJournalDaySummary } from "@/lib/db/journal-summary";
import { listJournalTransactions } from "@/lib/db/journal";
import { parseJournalSearchParams } from "@/lib/validations/journal";
import { formatJournalHeaderDate } from "@/lib/finance/format-datetime";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface JournalPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const params = await searchParams;
  const filters = parseJournalSearchParams(params);
  const [result, daySummary] = await Promise.all([
    listJournalTransactions(filters),
    getJournalDaySummary(),
  ]);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", APP_GUTTER, "max-md:p-0")}>
      <JournalShell className="min-h-0 flex-1">
        <MobileScrollSurface
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            STACK_GAP,
            "max-md:overflow-y-auto max-md:overscroll-y-contain",
            "md:overflow-hidden",
          )}
          title="Journal"
        >
          <header className="shrink-0 max-md:hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="mt-1 text-lg font-semibold tracking-tight">
                  Journal
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Semua transaksi tercatat dari inbox.
                </p>
              </div>
              <p className="shrink-0 text-right text-sm font-semibold capitalize text-foreground/90">
                {formatJournalHeaderDate(daySummary.date)}
              </p>
            </div>
          </header>

          <div className="flex items-center justify-between gap-3 max-md:-mt-1 md:hidden">
            <p className="text-[11px] text-muted-foreground">
              Semua transaksi tercatat dari inbox.
            </p>
            <p className="shrink-0 text-[11px] font-semibold capitalize text-foreground/90">
              {formatJournalHeaderDate(daySummary.date)}
            </p>
          </div>

          <JournalSummaryWidget summary={daySummary} className="shrink-0" />

          <div className="shrink-0">
            <JournalFiltersBar filters={filters} />
          </div>

          <JournalTable items={result.items} />

          <JournalPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            pageSize={result.pageSize}
            filters={filters}
          />
        </MobileScrollSurface>
      </JournalShell>
    </div>
  );
}
