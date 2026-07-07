import { BudgetManage } from "@/components/planner/budget-manage";
import { PayplanMobileLayoutGuard } from "@/components/planner/payplan-mobile-layout-guard";
import { PayplanMobileSearchRow } from "@/components/planner/payplan-mobile-search-row";
import { PlannedItemsManage } from "@/components/planner/planned-items-manage";
import { PlannerCalendar } from "@/components/planner/planner-calendar";
import { PlannerCalendarTabBar } from "@/components/planner/planner-calendar-tab-bar";
import { PlannerShell } from "@/components/planner/planner-shell";
import { PlannerTabBar } from "@/components/planner/planner-tab-bar";
import { MobileScrollSurface } from "@/components/shared/mobile-scroll-surface";
import { PAYPLAN_MOBILE_COMBINED_LIST, PAYPLAN_MOBILE_PAGE_INSET_X } from "@/config/payplan-mobile";
import { STACK_GAP } from "@/config/spacing";
import { requireUserId } from "@/lib/auth/session";
import { listBudgetsForMonth } from "@/lib/db/budgets";
import { listPlannedItems } from "@/lib/db/planned-items";
import { getPlannerMonthData } from "@/lib/db/planner";
import { pickDefaultDayKey } from "@/lib/planner/calendar";
import { cn } from "@/lib/utils";
import { parsePlannerSearchParams } from "@/lib/validations/planner";
import { isPlannerManageLayout } from "@/types/planner";

export const dynamic = "force-dynamic";

interface PayPlanPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PayPlanPage({ searchParams }: PayPlanPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const { monthKey, tab, calendarLayout, filters } =
    parsePlannerSearchParams(params);
  const isCalendarTab = tab === "calendar";
  const isManage = isCalendarTab && isPlannerManageLayout(calendarLayout);
  const [data, plannedItems, budgets] = await Promise.all([
    isCalendarTab ? getPlannerMonthData(userId, monthKey) : null,
    isCalendarTab ? listPlannedItems(userId) : null,
    tab === "budget" ? listBudgetsForMonth(userId, monthKey) : null,
  ]);
  const initialDayKey = data
    ? pickDefaultDayKey(data.monthKey, data.marks)
    : null;
  const monthOccurrences =
    data?.items.map((item) => ({
      ...item,
      dueAt: item.dueAt.toISOString(),
    })) ?? [];
  const plannedItemRecords =
    plannedItems?.map((item) => ({
      ...item,
      startAt: item.startAt.toISOString(),
      endAt: item.endAt?.toISOString() ?? null,
    })) ?? [];

  const subtitle =
    tab === "budget"
      ? "Atur budget kategori — terhubung dengan Inbox."
      : "Tagihan, pemasukan terjadwal, dan budget.";
  const pageTitle = tab === "budget" ? "Budget" : "PayPlan";

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col")}>
      <PayplanMobileLayoutGuard layout={calendarLayout} monthKey={monthKey} />
      <PlannerShell className="min-h-0 flex-1">
        <MobileScrollSurface
          className={cn(
            "flex min-h-0 flex-1 flex-col md:p-3",
            STACK_GAP,
            "overflow-y-auto overscroll-y-contain",
            "md:pb-20",
            PAYPLAN_MOBILE_PAGE_INSET_X,
          )}
          title={pageTitle}
        >
          <header className="shrink-0 max-md:hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="mt-0.5 text-base font-semibold tracking-tight sm:text-lg">
                  {pageTitle}
                </h1>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  {subtitle}
                </p>
              </div>

              <PlannerTabBar
                tab={tab}
                monthKey={monthKey}
                className="mt-0.5 shrink-0"
              />
            </div>

            {isCalendarTab ? (
              <div className="mt-3">
                <PlannerCalendarTabBar
                  layout={calendarLayout}
                  monthKey={monthKey}
                />
              </div>
            ) : null}
          </header>

          <div className="shrink-0 space-y-3 md:hidden">
            <p className="text-[11px] text-muted-foreground max-md:-mt-1">
              {subtitle}
            </p>

            {isCalendarTab ? (
              <PayplanMobileSearchRow filters={filters} layout="table" />
            ) : null}
          </div>

          {tab === "budget" && budgets ? (
            <BudgetManage monthKey={monthKey} budgets={budgets} />
          ) : null}

          {isCalendarTab && data && initialDayKey ? (
            <div className={cn(isManage && "max-md:hidden")}>
              <PlannerCalendar
                monthKey={data.monthKey}
                year={data.year}
                month={data.month}
                initialDayKey={initialDayKey}
                items={monthOccurrences}
              />
            </div>
          ) : null}

          {isManage && plannedItems ? (
            <div className="hidden md:block">
              <PlannedItemsManage
                layout={calendarLayout}
                items={plannedItemRecords}
                filters={filters}
                monthOccurrences={monthOccurrences}
              />
            </div>
          ) : null}

          {isCalendarTab && plannedItems ? (
            <div className={PAYPLAN_MOBILE_COMBINED_LIST}>
              <PlannedItemsManage
                className="max-md:flex-none"
                hideMobileSearchRow
                layout="table"
                items={plannedItemRecords}
                filters={filters}
                monthOccurrences={monthOccurrences}
              />
            </div>
          ) : null}
        </MobileScrollSurface>
      </PlannerShell>
    </div>
  );
}
